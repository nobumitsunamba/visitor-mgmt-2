alter table public.visits enable row level security;

-- 認証済みスタッフは全件読取可
create policy "staff_read_all_visits"
  on public.visits for select
  to authenticated
  using (true);

-- スタッフは自分の担当来訪を登録可
create policy "staff_insert_visits"
  on public.visits for insert
  to authenticated
  with check (staff_user_id = auth.uid());

-- スタッフは自分が登録した来訪を更新可
create policy "staff_update_own_visits"
  on public.visits for update
  to authenticated
  using (staff_user_id = auth.uid());
