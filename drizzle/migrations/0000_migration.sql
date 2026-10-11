
create type public.app_role as enum ('athlete','sports','lawyer','admin');
create type public.profile_status as enum ('draft','submitted','info_requested','approved','rejected','suspended');

-- core profile
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null default '' check (char_length(full_name) <= 120),
  primary_role public.app_role not null,
  region text check (char_length(region) <= 80),
  contact_open boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.app_role not null,
  unique (user_id, role)
);
grant select, update on public.profiles to authenticated;
grant all on public.profiles to service_role;
grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;
alter table public.profiles enable row level security;
alter table public.user_roles enable row level security;

create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role = _role)
$$;
create or replace function public.is_admin(_uid uuid) returns boolean
language sql stable security definer set search_path = public as $$ select public.has_role(_uid,'admin') $$;

create policy "profiles readable by signed-in" on public.profiles for select to authenticated using (true);
create policy "own profile update" on public.profiles for update to authenticated using (auth.uid() = id) with check (auth.uid() = id);
create policy "own roles" on public.user_roles for select to authenticated using (auth.uid() = user_id or public.is_admin(auth.uid()));

-- prevent changing primary_role from client
create or replace function public.protect_profile() returns trigger language plpgsql set search_path = public as $$
begin
  if new.primary_role <> old.primary_role then raise exception 'Role cannot be changed'; end if;
  new.updated_at := now();
  return new;
end $$;
create trigger trg_protect_profile before update on public.profiles for each row execute function public.protect_profile();

-- role-specific profiles
create table public.athlete_profiles (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  sport text not null default '', discipline text default '', level text default '',
  bio text default '' check (char_length(bio) <= 4000),
  goals text default '' check (char_length(goals) <= 2000),
  achievements text default '' check (char_length(achievements) <= 4000),
  statistics text default '' check (char_length(statistics) <= 4000),
  qualifications text default '' check (char_length(qualifications) <= 2000),
  is_minor boolean not null default false,
  guardian_name text, guardian_email text,
  guardian_consent_at timestamptz,
  visibility text not null default 'professionals' check (visibility in ('public','professionals','private')),
  status public.profile_status not null default 'draft',
  updated_at timestamptz not null default now()
);
create table public.sports_profiles (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  kind text not null default 'individual' check (kind in ('individual','organization')),
  subtype text not null default 'coach' check (subtype in ('coach','scout','trainer','other_professional','board','federation','club','academy','school','university','training_centre')),
  org_name text default '', title text default '',
  sports text default '', qualifications text default '' check (char_length(qualifications) <= 2000),
  bio text default '' check (char_length(bio) <= 4000), website text default '',
  status public.profile_status not null default 'draft',
  updated_at timestamptz not null default now()
);
create table public.lawyer_profiles (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  bar_enrollment text default '', jurisdiction text default '',
  expertise text default '', experience_years int default 0 check (experience_years between 0 and 70),
  languages text default '', available boolean not null default true,
  bio text default '' check (char_length(bio) <= 4000),
  status public.profile_status not null default 'draft',
  updated_at timestamptz not null default now()
);
grant select, insert, update on public.athlete_profiles, public.sports_profiles, public.lawyer_profiles to authenticated;
grant all on public.athlete_profiles, public.sports_profiles, public.lawyer_profiles to service_role;
alter table public.athlete_profiles enable row level security;
alter table public.sports_profiles enable row level security;
alter table public.lawyer_profiles enable row level security;

create or replace function public.is_approved_sports(_uid uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select exists(select 1 from public.sports_profiles where user_id=_uid and status='approved') $$;

create policy "athlete own" on public.athlete_profiles for select to authenticated using (auth.uid()=user_id or public.is_admin(auth.uid()));
create policy "athlete discoverable" on public.athlete_profiles for select to authenticated using (
  status='approved' and visibility <> 'private' and (
    (visibility='public' and not is_minor) or public.is_approved_sports(auth.uid())
  ));
create policy "athlete insert own" on public.athlete_profiles for insert to authenticated with check (auth.uid()=user_id and public.has_role(auth.uid(),'athlete'));
create policy "athlete update own" on public.athlete_profiles for update to authenticated using (auth.uid()=user_id) with check (auth.uid()=user_id);

create policy "sports read" on public.sports_profiles for select to authenticated using (auth.uid()=user_id or status='approved' or public.is_admin(auth.uid()));
create policy "sports insert own" on public.sports_profiles for insert to authenticated with check (auth.uid()=user_id and public.has_role(auth.uid(),'sports'));
create policy "sports update own" on public.sports_profiles for update to authenticated using (auth.uid()=user_id) with check (auth.uid()=user_id);

create policy "lawyer read" on public.lawyer_profiles for select to authenticated using (auth.uid()=user_id or status='approved' or public.is_admin(auth.uid()));
create policy "lawyer insert own" on public.lawyer_profiles for insert to authenticated with check (auth.uid()=user_id and public.has_role(auth.uid(),'lawyer'));
create policy "lawyer update own" on public.lawyer_profiles for update to authenticated using (auth.uid()=user_id) with check (auth.uid()=user_id);

-- users may only move status draft/info_requested/rejected -> submitted; admin decisions go through RPC
create or replace function public.guard_profile_status() returns trigger language plpgsql set search_path = public as $$
begin
  if current_setting('app.admin_decision', true) = 'on' then new.updated_at := now(); return new; end if;
  if tg_op = 'INSERT' then
    if new.status not in ('draft','submitted') then new.status := 'draft'; end if;
  elsif new.status is distinct from old.status then
    if not (new.status = 'submitted' and old.status in ('draft','info_requested','rejected')) then
      raise exception 'Status can only be changed by an administrator';
    end if;
  end if;
  if tg_table_name = 'athlete_profiles' then
    if new.is_minor and (coalesce(new.guardian_name,'')='' or coalesce(new.guardian_email,'')='') and new.status='submitted' then
      raise exception 'Guardian details are required for athletes under 18';
    end if;
    if tg_op='UPDATE' and new.guardian_consent_at is distinct from old.guardian_consent_at then
      new.guardian_consent_at := old.guardian_consent_at;
    end if;
    if tg_op='INSERT' then new.guardian_consent_at := null; end if;
  end if;
  new.updated_at := now();
  return new;
end $$;
create trigger g1 before insert or update on public.athlete_profiles for each row execute function public.guard_profile_status();
create trigger g2 before insert or update on public.sports_profiles for each row execute function public.guard_profile_status();
create trigger g3 before insert or update on public.lawyer_profiles for each row execute function public.guard_profile_status();

-- signup: create profile + role from metadata, never admin
create or replace function public.handle_new_user() returns trigger language plpgsql security definer set search_path = public as $$
declare r public.app_role;
begin
  r := case coalesce(new.raw_user_meta_data->>'role','athlete')
         when 'sports' then 'sports'::public.app_role
         when 'lawyer' then 'lawyer'::public.app_role
         else 'athlete'::public.app_role end;
  insert into public.profiles(id, full_name, primary_role) values (new.id, left(coalesce(new.raw_user_meta_data->>'full_name',''),120), r);
  insert into public.user_roles(user_id, role) values (new.id, r);
  if r='athlete' then insert into public.athlete_profiles(user_id) values (new.id);
  elsif r='sports' then insert into public.sports_profiles(user_id, kind) values (new.id, case when new.raw_user_meta_data->>'kind'='organization' then 'organization' else 'individual' end);
  else insert into public.lawyer_profiles(user_id) values (new.id); end if;
  return new;
end $$;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();

-- audit + notifications
create table public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid, action text not null, target_id uuid, details jsonb default '{}'::jsonb,
  created_at timestamptz not null default now()
);
grant select on public.audit_logs to authenticated; grant all on public.audit_logs to service_role;
alter table public.audit_logs enable row level security;
create policy "admin read audit" on public.audit_logs for select to authenticated using (public.is_admin(auth.uid()));

create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  type text not null, title text not null, body text default '', link text,
  read_at timestamptz, created_at timestamptz not null default now()
);
create index on public.notifications(user_id, created_at desc);
grant select, update, delete on public.notifications to authenticated; grant all on public.notifications to service_role;
alter table public.notifications enable row level security;
create policy "own notifications" on public.notifications for select to authenticated using (auth.uid()=user_id);
create policy "own notifications update" on public.notifications for update to authenticated using (auth.uid()=user_id) with check (auth.uid()=user_id);
create policy "own notifications delete" on public.notifications for delete to authenticated using (auth.uid()=user_id);

create or replace function public.notify(_user uuid, _type text, _title text, _body text, _link text) returns void
language sql security definer set search_path = public as $$
  insert into public.notifications(user_id,type,title,body,link) values (_user,_type,_title,_body,_link) $$;
revoke execute on function public.notify(uuid,text,text,text,text) from public, anon, authenticated;

create table public.verification_decisions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  profile_type public.app_role not null, decision public.profile_status not null,
  reason text default '', reviewer_id uuid not null, created_at timestamptz not null default now()
);
grant select on public.verification_decisions to authenticated; grant all on public.verification_decisions to service_role;
alter table public.verification_decisions enable row level security;
create policy "own or admin decisions" on public.verification_decisions for select to authenticated using (auth.uid()=user_id or public.is_admin(auth.uid()));

create or replace function public.admin_decide(_user uuid, _decision public.profile_status, _reason text)
returns void language plpgsql security definer set search_path = public as $$
declare r public.app_role;
begin
  if not public.is_admin(auth.uid()) then raise exception 'Forbidden'; end if;
  if _decision not in ('approved','rejected','info_requested','suspended','submitted') then raise exception 'Invalid decision'; end if;
  select primary_role into r from public.profiles where id=_user;
  if r is null then raise exception 'User not found'; end if;
  perform set_config('app.admin_decision','on',true);
  if r='athlete' then update public.athlete_profiles set status=_decision where user_id=_user;
  elsif r='sports' then update public.sports_profiles set status=_decision where user_id=_user;
  elsif r='lawyer' then update public.lawyer_profiles set status=_decision where user_id=_user; end if;
  perform set_config('app.admin_decision','off',true);
  insert into public.verification_decisions(user_id,profile_type,decision,reason,reviewer_id) values (_user,r,_decision,left(coalesce(_reason,''),1000),auth.uid());
  insert into public.audit_logs(actor_id,action,target_id,details) values (auth.uid(),'verification.'||_decision,_user,jsonb_build_object('reason',_reason,'role',r));
  perform public.notify(_user,'verification','Verification update: '||replace(_decision::text,'_',' '),coalesce(_reason,''),null);
end $$;

create or replace function public.admin_record_guardian_consent(_user uuid) returns void
language plpgsql security definer set search_path = public as $$
begin
  if not public.is_admin(auth.uid()) then raise exception 'Forbidden'; end if;
  perform set_config('app.admin_decision','on',true);
  update public.athlete_profiles set guardian_consent_at = now() where user_id=_user and is_minor;
  perform set_config('app.admin_decision','off',true);
  insert into public.audit_logs(actor_id,action,target_id) values (auth.uid(),'guardian_consent.recorded',_user);
end $$;

-- opportunities & applications
create table public.opportunities (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  title text not null check (char_length(title) between 3 and 160),
  opp_type text not null default 'trial', sport text not null default '', region text default '',
  description text not null default '' check (char_length(description) <= 6000),
  deadline date, status text not null default 'draft' check (status in ('draft','published','closed')),
  created_at timestamptz not null default now()
);
grant select, insert, update, delete on public.opportunities to authenticated; grant select on public.opportunities to anon;
grant all on public.opportunities to service_role;
alter table public.opportunities enable row level security;
create policy "published public" on public.opportunities for select to anon, authenticated using (status='published');
create policy "owner read" on public.opportunities for select to authenticated using (auth.uid()=owner_id or public.is_admin(auth.uid()));
create policy "approved sports create" on public.opportunities for insert to authenticated with check (auth.uid()=owner_id and public.is_approved_sports(auth.uid()));
create policy "owner update" on public.opportunities for update to authenticated using (auth.uid()=owner_id) with check (auth.uid()=owner_id);
create policy "owner delete" on public.opportunities for delete to authenticated using (auth.uid()=owner_id);

create table public.applications (
  id uuid primary key default gen_random_uuid(),
  opportunity_id uuid not null references public.opportunities(id) on delete cascade,
  athlete_id uuid not null references public.profiles(id) on delete cascade,
  message text default '' check (char_length(message) <= 2000),
  stage text not null default 'applied' check (stage in ('invited','applied','shortlisted','trial','offer','accepted','rejected','withdrawn')),
  notes text default '',
  created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
  unique(opportunity_id, athlete_id)
);
grant select, insert, update on public.applications to authenticated; grant all on public.applications to service_role;
alter table public.applications enable row level security;
create or replace function public.owns_opportunity(_opp uuid, _uid uuid) returns boolean
language sql stable security definer set search_path = public as $$ select exists(select 1 from public.opportunities where id=_opp and owner_id=_uid) $$;
create policy "app read" on public.applications for select to authenticated using (auth.uid()=athlete_id or public.owns_opportunity(opportunity_id, auth.uid()));
create policy "athlete apply" on public.applications for insert to authenticated with check (
  (auth.uid()=athlete_id and stage='applied' and public.has_role(auth.uid(),'athlete'))
  or (public.owns_opportunity(opportunity_id, auth.uid()) and stage='invited'));
create policy "app update" on public.applications for update to authenticated using (auth.uid()=athlete_id or public.owns_opportunity(opportunity_id, auth.uid()));

create or replace function public.guard_application() returns trigger language plpgsql security definer set search_path = public as $$
declare owner uuid; t text;
begin
  select owner_id, title into owner, t from public.opportunities where id=new.opportunity_id;
  if tg_op='INSERT' then
    if new.stage='applied' then perform public.notify(owner,'application','New application',t,'/sports/opportunities');
    else perform public.notify(new.athlete_id,'invitation','You have been invited',t,'/athlete/applications'); end if;
    return new;
  end if;
  if auth.uid()=new.athlete_id and auth.uid()<>owner then
    if new.notes is distinct from old.notes then new.notes := old.notes; end if;
    if new.stage is distinct from old.stage and not (new.stage='withdrawn' or (old.stage='invited' and new.stage='applied') or (old.stage='offer' and new.stage='accepted')) then
      raise exception 'Not allowed'; end if;
    if new.stage is distinct from old.stage then perform public.notify(owner,'application','Application update: '||new.stage,t,'/sports/opportunities'); end if;
  else
    if new.stage is distinct from old.stage then perform public.notify(new.athlete_id,'application','Application update: '||new.stage,t,'/athlete/applications'); end if;
  end if;
  new.updated_at := now();
  return new;
end $$;
create trigger trg_app before insert or update on public.applications for each row execute function public.guard_application();

-- connections, saved, reports
create table public.connections (
  id uuid primary key default gen_random_uuid(),
  requester_id uuid not null references public.profiles(id) on delete cascade,
  addressee_id uuid not null references public.profiles(id) on delete cascade,
  status text not null default 'pending' check (status in ('pending','accepted','declined','blocked')),
  created_at timestamptz not null default now(),
  check (requester_id <> addressee_id), unique(requester_id, addressee_id)
);
grant select, insert, update, delete on public.connections to authenticated; grant all on public.connections to service_role;
alter table public.connections enable row level security;
create policy "conn read" on public.connections for select to authenticated using (auth.uid() in (requester_id, addressee_id));
create policy "conn create" on public.connections for insert to authenticated with check (auth.uid()=requester_id and status='pending');
create policy "conn update" on public.connections for update to authenticated using (auth.uid() in (requester_id, addressee_id));
create policy "conn delete" on public.connections for delete to authenticated using (auth.uid() in (requester_id, addressee_id));
create or replace function public.conn_notify() returns trigger language plpgsql security definer set search_path = public as $$
begin
  if tg_op='INSERT' then perform public.notify(new.addressee_id,'connection','New connection request','',null);
  elsif new.status='accepted' and old.status<>'accepted' then
    if auth.uid()<>new.addressee_id then raise exception 'Only the recipient can accept'; end if;
    perform public.notify(new.requester_id,'connection','Connection accepted','',null);
  end if;
  return new;
end $$;
create trigger trg_conn after insert or update on public.connections for each row execute function public.conn_notify();

create table public.saved_profiles (
  user_id uuid not null references public.profiles(id) on delete cascade,
  saved_user_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(), primary key(user_id, saved_user_id)
);
grant select, insert, delete on public.saved_profiles to authenticated; grant all on public.saved_profiles to service_role;
alter table public.saved_profiles enable row level security;
create policy "own saved" on public.saved_profiles for all to authenticated using (auth.uid()=user_id) with check (auth.uid()=user_id);

create table public.reports (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid not null references public.profiles(id) on delete cascade,
  target_user_id uuid references public.profiles(id) on delete cascade,
  category text not null default 'other' check (category in ('safeguarding','harassment','fraud','impersonation','other')),
  reason text not null check (char_length(reason) between 3 and 2000),
  status text not null default 'open' check (status in ('open','reviewing','resolved','dismissed')),
  created_at timestamptz not null default now()
);
grant select, insert, update on public.reports to authenticated; grant all on public.reports to service_role;
alter table public.reports enable row level security;
create policy "report create" on public.reports for insert to authenticated with check (auth.uid()=reporter_id and status='open');
create policy "report read" on public.reports for select to authenticated using (auth.uid()=reporter_id or public.is_admin(auth.uid()));
create policy "report admin update" on public.reports for update to authenticated using (public.is_admin(auth.uid()));

-- messaging
create table public.conversations (
  id uuid primary key default gen_random_uuid(),
  kind text not null default 'general' check (kind in ('general','legal')),
  legal_request_id uuid,
  created_at timestamptz not null default now(), last_message_at timestamptz not null default now()
);
create table public.conversation_participants (
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  accepted boolean not null default true, last_read_at timestamptz default now(),
  primary key (conversation_id, user_id)
);
create table public.messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  sender_id uuid not null references public.profiles(id) on delete cascade,
  body text not null check (char_length(body) between 1 and 5000),
  created_at timestamptz not null default now()
);
create index on public.messages(conversation_id, created_at);
grant select on public.conversations to authenticated;
grant select, update on public.conversation_participants to authenticated;
grant select, insert on public.messages to authenticated;
grant all on public.conversations, public.conversation_participants, public.messages to service_role;
alter table public.conversations enable row level security;
alter table public.conversation_participants enable row level security;
alter table public.messages enable row level security;
create or replace function public.is_participant(_conv uuid, _uid uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select exists(select 1 from public.conversation_participants where conversation_id=_conv and user_id=_uid) $$;
create policy "conv read" on public.conversations for select to authenticated using (public.is_participant(id, auth.uid()));
create policy "cp read" on public.conversation_participants for select to authenticated using (public.is_participant(conversation_id, auth.uid()));
create policy "cp update own" on public.conversation_participants for update to authenticated using (auth.uid()=user_id) with check (auth.uid()=user_id);
create policy "msg read" on public.messages for select to authenticated using (public.is_participant(conversation_id, auth.uid()));
create policy "msg send" on public.messages for insert to authenticated with check (
  auth.uid()=sender_id and exists(select 1 from public.conversation_participants where conversation_id=messages.conversation_id and user_id=auth.uid() and accepted));
create or replace function public.msg_after() returns trigger language plpgsql security definer set search_path = public as $$
declare p record;
begin
  update public.conversations set last_message_at=now() where id=new.conversation_id;
  for p in select user_id from public.conversation_participants where conversation_id=new.conversation_id and user_id<>new.sender_id loop
    perform public.notify(p.user_id,'message','New message',left(new.body,80),null);
  end loop;
  return new;
end $$;
create trigger trg_msg after insert on public.messages for each row execute function public.msg_after();

create or replace function public.start_conversation(_other uuid) returns uuid
language plpgsql security definer set search_path = public as $$
declare c uuid; connected boolean; blocked boolean;
begin
  if auth.uid() is null or _other = auth.uid() then raise exception 'Invalid'; end if;
  select exists(select 1 from public.connections where status='blocked' and ((requester_id=auth.uid() and addressee_id=_other) or (requester_id=_other and addressee_id=auth.uid()))) into blocked;
  if blocked then raise exception 'Messaging is not available with this account'; end if;
  select cp1.conversation_id into c from public.conversation_participants cp1
    join public.conversation_participants cp2 on cp1.conversation_id=cp2.conversation_id
    join public.conversations cv on cv.id=cp1.conversation_id and cv.kind='general'
    where cp1.user_id=auth.uid() and cp2.user_id=_other limit 1;
  if c is not null then return c; end if;
  select exists(select 1 from public.connections where status='accepted' and ((requester_id=auth.uid() and addressee_id=_other) or (requester_id=_other and addressee_id=auth.uid()))) into connected;
  insert into public.conversations(kind) values ('general') returning id into c;
  insert into public.conversation_participants(conversation_id,user_id,accepted) values (c,auth.uid(),true),(c,_other,connected);
  if not connected then perform public.notify(_other,'message','New message request','',null); end if;
  return c;
end $$;

-- legal requests
create table public.legal_requests (
  id uuid primary key default gen_random_uuid(),
  requester_id uuid not null references public.profiles(id) on delete cascade,
  category text not null, jurisdiction text not null default 'Pakistan',
  deadline date, language text default 'English',
  summary text not null check (char_length(summary) between 5 and 200),
  description text not null check (char_length(description) <= 6000),
  status text not null default 'open' check (status in ('open','accepted','in_progress','closed','withdrawn')),
  lawyer_id uuid references public.profiles(id),
  created_at timestamptz not null default now()
);
create table public.legal_request_declines (request_id uuid references public.legal_requests(id) on delete cascade, lawyer_id uuid, primary key(request_id,lawyer_id));
grant select, insert, update on public.legal_requests to authenticated; grant all on public.legal_requests to service_role;
grant select, insert on public.legal_request_declines to authenticated; grant all on public.legal_request_declines to service_role;
alter table public.legal_requests enable row level security;
alter table public.legal_request_declines enable row level security;
create or replace function public.is_approved_lawyer(_uid uuid) returns boolean
language sql stable security definer set search_path = public as $$ select exists(select 1 from public.lawyer_profiles where user_id=_uid and status='approved') $$;
create policy "lr own" on public.legal_requests for select to authenticated using (auth.uid()=requester_id or auth.uid()=lawyer_id);
create policy "lr open to lawyers" on public.legal_requests for select to authenticated using (status='open' and public.is_approved_lawyer(auth.uid()));
create policy "lr create" on public.legal_requests for insert to authenticated with check (auth.uid()=requester_id and status='open' and lawyer_id is null and not public.has_role(auth.uid(),'lawyer'));
create policy "lr update" on public.legal_requests for update to authenticated using (auth.uid()=requester_id or auth.uid()=lawyer_id);
create policy "decl own" on public.legal_request_declines for all to authenticated using (auth.uid()=lawyer_id) with check (auth.uid()=lawyer_id);
create or replace function public.guard_legal() returns trigger language plpgsql set search_path = public as $$
begin
  if current_setting('app.legal_accept', true)='on' then return new; end if;
  if new.lawyer_id is distinct from old.lawyer_id then raise exception 'Use the accept workflow'; end if;
  if auth.uid()=old.requester_id and new.status is distinct from old.status and new.status not in ('withdrawn','closed') then raise exception 'Not allowed'; end if;
  if auth.uid()=old.lawyer_id and auth.uid()<>old.requester_id then
    if new.status not in ('accepted','in_progress','closed') then raise exception 'Not allowed'; end if;
    if new.description<>old.description or new.summary<>old.summary then raise exception 'Not allowed'; end if;
  end if;
  return new;
end $$;
create trigger trg_legal before update on public.legal_requests for each row execute function public.guard_legal();

create or replace function public.accept_legal_request(_id uuid) returns uuid
language plpgsql security definer set search_path = public as $$
declare req public.legal_requests; c uuid;
begin
  if not public.is_approved_lawyer(auth.uid()) then raise exception 'Only verified lawyers can accept requests'; end if;
  select * into req from public.legal_requests where id=_id for update;
  if req.id is null or req.status<>'open' then raise exception 'Request is no longer open'; end if;
  perform set_config('app.legal_accept','on',true);
  update public.legal_requests set status='accepted', lawyer_id=auth.uid() where id=_id;
  perform set_config('app.legal_accept','off',true);
  insert into public.conversations(kind, legal_request_id) values ('legal', _id) returning id into c;
  insert into public.conversation_participants(conversation_id,user_id) values (c,auth.uid()),(c,req.requester_id);
  perform public.notify(req.requester_id,'legal','A lawyer accepted your request',req.summary,null);
  insert into public.audit_logs(actor_id,action,target_id) values (auth.uid(),'legal.accepted',_id);
  return c;
end $$;

-- contracts
create table public.contracts (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  title text not null check (char_length(title) between 2 and 160),
  agreement_type text not null, parties jsonb not null default '{}'::jsonb, answers jsonb not null default '{}'::jsonb,
  concerns text default '',
  involves_minor boolean not null default false, guardian_consent_confirmed boolean not null default false,
  status text not null default 'draft' check (status in ('draft','review_requested','in_review','revisions_proposed','reviewed','finalized')),
  lawyer_id uuid references public.profiles(id),
  reminder_date date, reminder_note text,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.contract_versions (
  id uuid primary key default gen_random_uuid(),
  contract_id uuid not null references public.contracts(id) on delete cascade,
  version int not null, body text not null check (char_length(body) <= 60000),
  created_by uuid not null, ai_generated boolean not null default false, note text default '',
  created_at timestamptz not null default now(), unique(contract_id, version)
);
create table public.contract_comments (
  id uuid primary key default gen_random_uuid(),
  contract_id uuid not null references public.contracts(id) on delete cascade,
  author_id uuid not null references public.profiles(id) on delete cascade,
  body text not null check (char_length(body) between 1 and 4000),
  created_at timestamptz not null default now()
);
grant select, insert, update, delete on public.contracts to authenticated;
grant select, insert on public.contract_versions, public.contract_comments to authenticated;
grant all on public.contracts, public.contract_versions, public.contract_comments to service_role;
alter table public.contracts enable row level security;
alter table public.contract_versions enable row level security;
alter table public.contract_comments enable row level security;
create or replace function public.can_access_contract(_c uuid, _uid uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select exists(select 1 from public.contracts where id=_c and (owner_id=_uid or lawyer_id=_uid)) $$;
create policy "c read" on public.contracts for select to authenticated using (auth.uid()=owner_id or auth.uid()=lawyer_id);
create policy "c create" on public.contracts for insert to authenticated with check (auth.uid()=owner_id and lawyer_id is null and status='draft');
create policy "c update" on public.contracts for update to authenticated using (auth.uid()=owner_id or auth.uid()=lawyer_id);
create policy "c delete" on public.contracts for delete to authenticated using (auth.uid()=owner_id and status='draft');
create policy "cv read" on public.contract_versions for select to authenticated using (public.can_access_contract(contract_id, auth.uid()));
create policy "cv add" on public.contract_versions for insert to authenticated with check (auth.uid()=created_by and public.can_access_contract(contract_id, auth.uid()));
create policy "cc read" on public.contract_comments for select to authenticated using (public.can_access_contract(contract_id, auth.uid()));
create policy "cc add" on public.contract_comments for insert to authenticated with check (auth.uid()=author_id and public.can_access_contract(contract_id, auth.uid()));

create or replace function public.guard_contract() returns trigger language plpgsql security definer set search_path = public as $$
begin
  if new.owner_id<>old.owner_id then raise exception 'Not allowed'; end if;
  if new.lawyer_id is distinct from old.lawyer_id then
    if auth.uid()<>old.owner_id then raise exception 'Not allowed'; end if;
    if new.lawyer_id is not null and not public.is_approved_lawyer(new.lawyer_id) then raise exception 'Choose a verified lawyer'; end if;
    if new.involves_minor and not new.guardian_consent_confirmed then raise exception 'Guardian consent is required before sharing a contract involving a minor'; end if;
    if new.lawyer_id is not null then
      new.status := 'review_requested';
      perform public.notify(new.lawyer_id,'contract','Contract review requested',new.title,'/lawyer/contracts');
    end if;
  end if;
  if new.status is distinct from old.status then
    if auth.uid()=old.lawyer_id and auth.uid()<>old.owner_id then
      if new.status not in ('in_review','revisions_proposed','reviewed') then raise exception 'Not allowed'; end if;
      perform public.notify(old.owner_id,'contract','Contract status: '||replace(new.status,'_',' '),new.title,null);
    elsif auth.uid()=old.owner_id then
      if new.status not in ('draft','finalized','review_requested') then raise exception 'Not allowed'; end if;
      if new.status='finalized' and new.involves_minor and not new.guardian_consent_confirmed then raise exception 'Guardian consent required'; end if;
    end if;
  end if;
  if auth.uid()=old.lawyer_id and auth.uid()<>old.owner_id and (new.title<>old.title or new.answers<>old.answers or new.parties<>old.parties) then raise exception 'Not allowed'; end if;
  new.updated_at := now();
  return new;
end $$;
create trigger trg_contract before update on public.contracts for each row execute function public.guard_contract();
create or replace function public.comment_notify() returns trigger language plpgsql security definer set search_path = public as $$
declare c public.contracts;
begin
  select * into c from public.contracts where id=new.contract_id;
  if new.author_id=c.owner_id and c.lawyer_id is not null then perform public.notify(c.lawyer_id,'contract','New contract comment',c.title,'/lawyer/contracts');
  elsif new.author_id<>c.owner_id then perform public.notify(c.owner_id,'contract','Lawyer commented on your contract',c.title,null); end if;
  return new;
end $$;
create trigger trg_cc after insert on public.contract_comments for each row execute function public.comment_notify();

-- AI history
create table public.ai_conversations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  title text not null default 'New conversation', created_at timestamptz not null default now()
);
create table public.ai_messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.ai_conversations(id) on delete cascade,
  role text not null check (role in ('user','assistant')), content text not null,
  created_at timestamptz not null default now()
);
grant select, insert, update, delete on public.ai_conversations, public.ai_messages to authenticated;
grant all on public.ai_conversations, public.ai_messages to service_role;
alter table public.ai_conversations enable row level security;
alter table public.ai_messages enable row level security;
create policy "own ai conv" on public.ai_conversations for all to authenticated using (auth.uid()=user_id) with check (auth.uid()=user_id);
create policy "own ai msg" on public.ai_messages for all to authenticated
  using (exists(select 1 from public.ai_conversations c where c.id=conversation_id and c.user_id=auth.uid()))
  with check (exists(select 1 from public.ai_conversations c where c.id=conversation_id and c.user_id=auth.uid()));

-- content & media
create table public.site_content (
  id uuid primary key default gen_random_uuid(),
  section text not null check (section in ('mission','athlete_rights','research','story','legal_explainer','homepage')),
  slug text not null unique check (slug ~ '^[a-z0-9-]{2,80}$'),
  title text not null, summary text default '', body text not null default '',
  jurisdiction text, references_text text, reviewed_on date,
  status text not null default 'draft' check (status in ('draft','published','archived')),
  updated_by uuid, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.media_items (
  id uuid primary key default gen_random_uuid(),
  slot text not null unique,
  kind text not null default 'video' check (kind in ('video','image')),
  title text default '', url text not null, poster_url text, caption text, transcript text,
  published boolean not null default false, updated_at timestamptz not null default now()
);
grant select on public.site_content, public.media_items to anon, authenticated;
grant insert, update, delete on public.site_content, public.media_items to authenticated;
grant all on public.site_content, public.media_items to service_role;
alter table public.site_content enable row level security;
alter table public.media_items enable row level security;
create policy "published content" on public.site_content for select to anon, authenticated using (status='published' or public.is_admin(auth.uid()));
create policy "admin content write" on public.site_content for insert to authenticated with check (public.is_admin(auth.uid()));
create policy "admin content update" on public.site_content for update to authenticated using (public.is_admin(auth.uid()));
create policy "admin content delete" on public.site_content for delete to authenticated using (public.is_admin(auth.uid()));
create policy "published media" on public.media_items for select to anon, authenticated using (published or public.is_admin(auth.uid()));
create policy "admin media write" on public.media_items for insert to authenticated with check (public.is_admin(auth.uid()));
create policy "admin media update" on public.media_items for update to authenticated using (public.is_admin(auth.uid()));
create policy "admin media delete" on public.media_items for delete to authenticated using (public.is_admin(auth.uid()));

create or replace function public.admin_stats() returns jsonb language plpgsql stable security definer set search_path = public as $$
begin
  if not public.is_admin(auth.uid()) then raise exception 'Forbidden'; end if;
  return jsonb_build_object(
    'athletes',(select count(*) from public.athlete_profiles),
    'sports',(select count(*) from public.sports_profiles),
    'lawyers',(select count(*) from public.lawyer_profiles),
    'pending',(select count(*) from public.athlete_profiles where status='submitted')+(select count(*) from public.sports_profiles where status='submitted')+(select count(*) from public.lawyer_profiles where status='submitted'),
    'opportunities',(select count(*) from public.opportunities where status='published'),
    'applications',(select count(*) from public.applications),
    'legal_requests',(select count(*) from public.legal_requests),
    'contracts',(select count(*) from public.contracts),
    'open_reports',(select count(*) from public.reports where status='open'));
end $$;

alter publication supabase_realtime add table public.messages;
alter publication supabase_realtime add table public.notifications;
