create table public.suggestions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  role public.app_role not null,
  subject text not null check (char_length(subject) between 3 and 200),
  body text not null check (char_length(body) between 10 and 4000),
  status text not null default 'submitted' check (status in ('submitted','reviewing','planned','done','declined')),
  admin_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index suggestions_user_idx on public.suggestions (user_id, created_at desc);
create index suggestions_status_idx on public.suggestions (status, created_at desc);

comment on table public.suggestions is 'Platform improvement suggestions submitted by members; admins review and set status.';

grant select, insert on public.suggestions to authenticated;
grant all on public.suggestions to service_role;

alter table public.suggestions enable row level security;

create policy "members submit own suggestions"
  on public.suggestions for insert to authenticated
  with check (auth.uid() = user_id and role in ('athlete','sports','lawyer'));

create policy "own suggestions readable by member or admin"
  on public.suggestions for select to authenticated
  using (auth.uid() = user_id or public.is_admin(auth.uid()));

create policy "admins update suggestions"
  on public.suggestions for update to authenticated
  using (public.is_admin(auth.uid()))
  with check (public.is_admin(auth.uid()));

create or replace function public.touch_suggestion() returns trigger language plpgsql set search_path = public as $$
begin
  new.updated_at := now();
  return new;
end $$;

create trigger trg_touch_suggestion before update on public.suggestions
  for each row execute function public.touch_suggestion();