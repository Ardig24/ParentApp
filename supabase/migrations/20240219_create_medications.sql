-- Create medications table
create table if not exists public.medications (
  id uuid default gen_random_uuid() primary key,
  child_id uuid references public.children(id) on delete cascade not null,
  name text not null,
  dosage text not null,
  frequency text not null,
  start_date timestamp with time zone not null,
  end_date timestamp with time zone,
  notes text,
  reminders boolean default false,
  active boolean default true,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Add RLS policies
alter table public.medications enable row level security;

create policy "Users can view their own children's medications"
  on public.medications for select
  using (
    child_id in (
      select id from public.children
      where parent_id = auth.uid()
    )
  );

create policy "Users can insert medications for their children"
  on public.medications for insert
  with check (
    child_id in (
      select id from public.children
      where parent_id = auth.uid()
    )
  );

create policy "Users can update their own children's medications"
  on public.medications for update
  using (
    child_id in (
      select id from public.children
      where parent_id = auth.uid()
    )
  );

create policy "Users can delete their own children's medications"
  on public.medications for delete
  using (
    child_id in (
      select id from public.children
      where parent_id = auth.uid()
    )
  );
