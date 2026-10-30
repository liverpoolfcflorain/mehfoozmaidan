alter table public.suggestions add column legal_impact text check (char_length(legal_impact) <= 4000);
