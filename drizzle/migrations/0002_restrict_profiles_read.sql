CREATE OR REPLACE FUNCTION public.can_view_profile(_target uuid, _uid uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT _uid IS NOT NULL AND (
    _target = _uid
    OR public.is_admin(_uid)
    OR EXISTS (SELECT 1 FROM connections c WHERE (c.requester_id=_uid AND c.addressee_id=_target) OR (c.addressee_id=_uid AND c.requester_id=_target))
    OR EXISTS (SELECT 1 FROM conversation_participants a JOIN conversation_participants b ON a.conversation_id=b.conversation_id WHERE a.user_id=_uid AND b.user_id=_target)
    OR EXISTS (SELECT 1 FROM lawyer_profiles l WHERE l.user_id=_target AND l.status='approved')
    OR EXISTS (SELECT 1 FROM sports_profiles s WHERE s.user_id=_target AND s.status='approved')
    OR EXISTS (SELECT 1 FROM athlete_profiles ap WHERE ap.user_id=_target AND ap.status='approved' AND ap.visibility<>'private'
               AND ((ap.visibility='public' AND NOT ap.is_minor) OR public.is_approved_sports(_uid)))
    OR EXISTS (SELECT 1 FROM applications ap JOIN opportunities o ON o.id=ap.opportunity_id WHERE (o.owner_id=_uid AND ap.athlete_id=_target) OR (ap.athlete_id=_uid AND o.owner_id=_target))
    OR EXISTS (SELECT 1 FROM legal_requests r WHERE (r.requester_id=_uid AND r.lawyer_id=_target) OR (r.lawyer_id=_uid AND r.requester_id=_target) OR (r.requester_id=_target AND public.is_approved_lawyer(_uid) AND r.status='open'))
  )
$$;
DROP POLICY IF EXISTS "profiles readable by signed-in" ON public.profiles;
CREATE POLICY "profiles readable when related" ON public.profiles FOR SELECT TO authenticated USING (public.can_view_profile(id, auth.uid()));