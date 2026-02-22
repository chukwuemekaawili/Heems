-- Drop review tables to ensure clean creation by subsequent migrations
drop table if exists public.review_requests cascade;
drop table if exists public.reviews cascade;
