create extension if not exists "pgcrypto";

create table public.visits (
  id                  uuid        primary key default gen_random_uuid(),
  company_name        text        not null,
  representative_name text        not null,
  visitor_count       integer     not null check (visitor_count >= 1),
  staff_name          text        not null,
  staff_user_id       uuid        references auth.users(id) on delete set null,
  scheduled_date      date        not null,
  entry_time          timestamptz,
  exit_time           timestamptz,
  notes               text,
  status              text        not null default 'scheduled'
                                  check (status in ('scheduled', 'checked_in', 'completed', 'cancelled')),
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger visits_updated_at
  before update on public.visits
  for each row execute function public.set_updated_at();

create index visits_scheduled_date_idx on public.visits (scheduled_date desc);
create index visits_status_idx         on public.visits (status);
create index visits_staff_user_id_idx  on public.visits (staff_user_id);
