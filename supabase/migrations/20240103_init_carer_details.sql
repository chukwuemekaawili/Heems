-- Create carer_details table (extension of profiles for carers)
create table if not exists public.carer_details (
  id uuid references public.profiles(id) on delete cascade not null primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  
  bio text,
  hourly_rate numeric,
  
  -- Verification Flags
  verification_status text default 'pending',
  has_dbs boolean default false,
  has_right_to_work boolean default false,
  has_insurance boolean default false,
  
  -- Additional fields that might be useful
  years_experience integer,
  postcode_radius integer
);

-- RLS
alter table public.carer_details enable row level security;

create policy "Public can view carer details"
  on public.carer_details for select
  using ( true );

create policy "Carers can update their own details"
  on public.carer_details for update
  using ( auth.uid() = id );

create policy "Carers can insert their own details"
  on public.carer_details for insert
  with check ( auth.uid() = id );

-- Trigger to create empty carer_details on profile creation?
-- Usually handled by app logic or `handle_new_user` in profiles (if we modify it).
-- But standard practice is to let user create it during onboarding.
-- Or modifying `handle_new_user` to insert into here if role='carer'.
-- Let's leave it to app/manual insertion for now to avoid complexity.
