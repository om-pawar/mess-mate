-- ==============================================================================
-- MessMate — Clean Database Migration & Setup for Supabase
-- Paste and run this script in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/khfuhlizabsgdpptpofv/sql/
-- ==============================================================================

-- 1. Enable UUID extension
create extension if not exists "uuid-ossp";

-- 2. Clean up previous mismatched tables to prevent column conflicts
drop table if exists public.monthly_billing cascade;
drop table if exists public.meal_logs cascade;
drop table if exists public.menus cascade;
drop table if exists public.announcements cascade;
drop table if exists public.users cascade;

-- 3. Create Users Table
create table public.users (
  id uuid primary key default uuid_generate_v4(),
  username text unique,
  mobile text not null unique,
  pin text not null default '1234',
  role text not null check (role in ('student', 'owner')),
  name text not null,
  roll_no text,
  room text,
  hostel text default 'Hostel 4, Room 304',
  subscription text default 'Monthly Veg Subscription',
  status text default 'ACTIVE',
  avatar_url text,
  qr_code_id text default '#MM-8849',
  terminal text default 'MESS TERMINAL 02',
  created_at timestamptz default now()
);

-- 4. Create Menus Table
create table public.menus (
  id uuid primary key default uuid_generate_v4(),
  date date default current_date,
  hostel text default 'Hostel 4 • Veg Mess',
  meal_type text not null check (meal_type in ('lunch', 'dinner')),
  time_window text not null,
  cutoff_time text not null,
  is_pure_veg boolean default true,
  is_special boolean default false,
  items jsonb not null default '[]'::jsonb,
  sweet_item jsonb,
  created_at timestamptz default now()
);

-- 5. Create Meal Logs Table (Realtime Synced for Naga & Headcount)
create table public.meal_logs (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.users(id) on delete cascade,
  date date default current_date,
  meal_type text not null check (meal_type in ('lunch', 'dinner')),
  status text not null check (status in ('attending', 'naga', 'attended')),
  rebate_amount integer default 80,
  checked_in_at timestamptz,
  created_at timestamptz default now(),
  constraint unique_user_meal_per_day unique (user_id, date, meal_type)
);

-- 6. Create Announcements Table
create table public.announcements (
  id uuid primary key default uuid_generate_v4(),
  category text not null,
  priority text,
  status text default 'Active',
  timestamp_label text default 'Just now',
  subject text not null,
  content text not null,
  delivered integer default 0,
  total integer default 0,
  delivered_pct text default '0%',
  opened integer default 0,
  audience text default 'All Students',
  urgent_push boolean default false,
  created_at timestamptz default now()
);

-- 7. Create Monthly Billing Ledger Table
create table public.monthly_billing (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.users(id) on delete cascade,
  month text not null default 'Oct 2024',
  base_fee integer default 3600,
  naga_skips integer default 0,
  rebate_deducted integer default 0,
  net_payable integer default 3600,
  status text not null check (status in ('PAID', 'DUE', 'OVERDUE')),
  due_info text,
  due_amount integer default 0,
  meals_left integer default 60,
  created_at timestamptz default now(),
  constraint unique_user_billing_month unique (user_id, month)
);

-- ==============================================================================
-- 8. Seed Initial Accounts & Today's Menu
-- ==============================================================================

-- Seed Users
insert into public.users (id, username, mobile, pin, role, name, roll_no, room, hostel, subscription, status, avatar_url, qr_code_id)
values
  ('11111111-1111-1111-1111-111111111111', 'rohan', '9876543210', '1234', 'student', 'Rohan Verma', '2022CSB1042', 'Room 304 • H-4', 'Hostel 4, Room 304', 'Monthly Veg Subscription', 'ACTIVE', 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80', '#MM-8849'),
  ('22222222-2222-2222-2222-222222222222', 'warden', '9876500000', '1234', 'owner', 'Mess Warden / Staff', null, 'Mess Admin Office', 'Hostel 4 Mess Office', 'Kitchen Administration', 'ACTIVE', null, null);

-- Seed Menus (Today's Lunch & Dinner)
insert into public.menus (date, hostel, meal_type, time_window, cutoff_time, is_pure_veg, is_special, items, sweet_item)
values
  (
    current_date,
    'Hostel 4 • Veg Mess',
    'lunch',
    '12:30 – 2:30 PM',
    '10:00 AM',
    true,
    true,
    '[
      {"name": "Paneer Butter Masala", "tag": "Chef Special"},
      {"name": "Yellow Dal Tadka"},
      {"name": "Steamed Basmati Rice"},
      {"name": "4 Butter Phulkas"},
      {"name": "Green Salad & Mint Raita"}
    ]'::jsonb,
    '{"name": "Gulab Jamun (2 pcs)", "tag": "Sweet"}'::jsonb
  ),
  (
    current_date,
    'Hostel 4 • Veg Mess',
    'dinner',
    '8:00 – 10:00 PM',
    '5:00 PM',
    true,
    false,
    '[
      {"name": "Mix Veg Handi"},
      {"name": "Moong Dal Fry"},
      {"name": "Tawa Roti (Unlimited)"},
      {"name": "Jeera Rice"},
      {"name": "Fresh Curd & Pickle"}
    ]'::jsonb,
    null
  );

-- Seed Initial Billing Record for Rohan
insert into public.monthly_billing (user_id, month, base_fee, naga_skips, rebate_deducted, net_payable, status, due_info, due_amount, meals_left)
values
  ('11111111-1111-1111-1111-111111111111', 'Oct 2024', 3600, 0, 0, 3600, 'PAID', null, 0, 60);

-- ==============================================================================
-- 9. Enable Row Level Security (RLS) & Public Policies
-- ==============================================================================

alter table public.users enable row level security;
alter table public.menus enable row level security;
alter table public.meal_logs enable row level security;
alter table public.announcements enable row level security;
alter table public.monthly_billing enable row level security;

-- Open policies allowing full read & write access
create policy "Allow all read on users" on public.users for select using (true);
create policy "Allow all insert on users" on public.users for insert with check (true);
create policy "Allow all update on users" on public.users for update using (true);

create policy "Allow all read on menus" on public.menus for select using (true);
create policy "Allow all insert on menus" on public.menus for insert with check (true);
create policy "Allow all update on menus" on public.menus for update using (true);

create policy "Allow all read on meal_logs" on public.meal_logs for select using (true);
create policy "Allow all insert on meal_logs" on public.meal_logs for insert with check (true);
create policy "Allow all update on meal_logs" on public.meal_logs for update using (true);

create policy "Allow all read on announcements" on public.announcements for select using (true);
create policy "Allow all insert on announcements" on public.announcements for insert with check (true);
create policy "Allow all update on announcements" on public.announcements for update using (true);

create policy "Allow all read on monthly_billing" on public.monthly_billing for select using (true);
create policy "Allow all insert on monthly_billing" on public.monthly_billing for insert with check (true);
create policy "Allow all update on monthly_billing" on public.monthly_billing for update using (true);

-- ==============================================================================
-- 10. Enable Supabase Realtime
-- ==============================================================================

begin;
  alter publication supabase_realtime add table public.meal_logs;
  alter publication supabase_realtime add table public.announcements;
  alter publication supabase_realtime add table public.monthly_billing;
commit;
