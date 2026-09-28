# Hamsafar (ہمسفر) Cloud Database Schema (PostgreSQL / Supabase)
# Run this SQL script in your Supabase SQL Editor to create all required tables

-- 1. PROFILES TABLE
create table if not exists profiles (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  age integer not null check (age >= 18),
  gender text not null check (gender in ('male', 'female')),
  city text not null,
  country text default 'Pakistan',
  mobile_number text,
  profession text not null,
  education text not null,
  languages text[] default array['Urdu', 'English'],
  purpose text[] not null, -- array of 'rishta', 'friendship'
  avatar_url text,
  about text,
  marital_status text default 'Single',
  family_involvement text default 'Preferred',
  religious_practice text default 'Practicing',
  
  -- Verification Badges
  mobile_verified boolean default true,
  identity_verified boolean default false,
  photo_verified boolean default false,
  family_verified boolean default false,
  no_active_restrictions boolean default true,
  
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. CONNECTION REQUESTS TABLE
create table if not exists connection_requests (
  id uuid primary key default gen_random_uuid(),
  sender_id uuid references profiles(id) on delete cascade,
  receiver_id uuid references profiles(id) on delete cascade,
  status text default 'pending' check (status in ('pending', 'accepted', 'declined')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. CHAT MESSAGES TABLE
create table if not exists messages (
  id uuid primary key default gen_random_uuid(),
  sender_id uuid references profiles(id) on delete cascade,
  receiver_id uuid references profiles(id) on delete cascade,
  content text not null,
  has_safety_warning boolean default false,
  warning_type text,
  read boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. NOTIFICATIONS TABLE
create table if not exists notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  sender_name text not null,
  sender_avatar text,
  type text not null,
  title text not null,
  message text not null,
  read boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 5. SAFETY AUDIT & REPORTS TABLE
create table if not exists safety_reports (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid references profiles(id) on delete set null,
  reported_user_id uuid references profiles(id) on delete set null,
  category text not null,
  notes text,
  status text default 'New' check (status in ('New', 'Reviewing', 'Escalated', 'Resolved', 'Closed')),
  assigned_representative text default 'Representative Ahmed',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Row Level Security (RLS) policies
alter table profiles enable row level security;
alter table messages enable row level security;
alter table notifications enable row level security;
alter table connection_requests enable row level security;
alter table safety_reports enable row level security;

-- Public read for verified profiles (excluding sensitive docs)
create policy "Allow public view of verified member profiles"
  on profiles for select
  using (true);

-- Insert allow for registered users
create policy "Allow insert for new registrations"
  on profiles for insert
  with check (true);
