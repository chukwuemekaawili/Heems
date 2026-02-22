-- Create jobs table
create table if not exists public.jobs (
  id uuid default gen_random_uuid() primary key,
  client_id uuid references public.profiles(id) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  status text default 'open',
  
  care_type text,
  care_subtype text,
  live_in_confirmed boolean,
  start_timeline text,
  specific_start_date timestamp with time zone,
  recipient_relationship text,
  recipient_age_group text,
  funding_source text,
  preferred_rate numeric,
  driver_required text,
  non_smoker_required text,
  has_pets boolean,
  languages text[],
  gender_preference text,
  postcode text,
  address text,
  additional_info text,
  schedule jsonb
);

alter table public.jobs enable row level security;

create policy "Public jobs are viewable by everyone."
  on jobs for select
  using ( true );

create policy "Clients can insert their own jobs."
  on jobs for insert
  with check ( auth.uid() = client_id );
  
create policy "Clients can update their own jobs."
  on jobs for update
  using ( auth.uid() = client_id );

-- Create bookings table
create table if not exists public.bookings (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  client_id uuid references public.profiles(id) not null,
  carer_id uuid references public.profiles(id) not null,
  start_time timestamp with time zone not null,
  end_time timestamp with time zone not null,
  status text default 'pending',
  total_price numeric,
  rate_per_hour numeric,
  client_fee numeric,
  carer_fee numeric,
  recurrence_type text,
  recurrence_end_date timestamp with time zone
);

alter table public.bookings enable row level security;

create policy "Users can view their own bookings."
  on bookings for select
  using ( auth.uid() = client_id or auth.uid() = carer_id );

create policy "Clients can create bookings."
  on bookings for insert
  with check ( auth.uid() = client_id );

create policy "Users can update their own bookings."
  on bookings for update
  using ( auth.uid() = client_id or auth.uid() = carer_id );
