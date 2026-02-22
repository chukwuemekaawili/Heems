-- Create carer_verification table to store document URLs and statuses
create table if not exists public.carer_verification (
  id uuid references public.profiles(id) on delete cascade not null primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  
  -- Overall Status
  overall_status text default 'pending',
  
  -- DBS
  dbs_status text default 'pending',
  dbs_certificate_url text,
  
  -- ID
  id_status text default 'pending',
  id_document_url text, -- Front of ID or Passport
  identity_verified boolean default false,
  
  -- Right to Work
  rtw_status text default 'pending',
  rtw_document_url text,
  right_to_work_verified boolean default false,
  
  -- Address
  address_verified boolean default false,
  
  -- Insurance
  insurance_status text default 'pending'
);

-- RLS
alter table public.carer_verification enable row level security;

create policy "Users can view own verification"
  on public.carer_verification for select
  using ( auth.uid() = id );

create policy "Users can update own verification"
  on public.carer_verification for update
  using ( auth.uid() = id );

create policy "Users can insert own verification"
  on public.carer_verification for insert
  with check ( auth.uid() = id );

-- Admins can view all (assuming admin role check exists, but for now allow public read if needed or just rely on service role)
-- For compliance dashboard, organization needs to see it.
create policy "Organisations can view verification"
  on public.carer_verification for select
  using ( exists (select 1 from public.profiles where id = auth.uid() and role = 'organisation') );
