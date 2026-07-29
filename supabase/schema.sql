create extension if not exists "pgcrypto";

create table if not exists categories (
  id text primary key,
  slug text not null unique,
  name text not null,
  description text not null,
  image_url text,
  created_at timestamptz not null default now()
);

create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  category_id text not null references categories(id) on delete restrict,
  name text not null,
  price integer not null check (price >= 0),
  description text,
  short_description text,
  image_urls text[] not null default '{}',
  tags text[] not null default '{}',
  is_featured boolean not null default false,
  is_published boolean not null default true,
  is_available boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists orders (
  id uuid primary key,
  order_code text not null unique,
  customer_name text not null,
  phone text not null,
  email text,
  address text,
  notes text,
  status text not null default 'new' check (status in ('new', 'contacted', 'confirmed', 'completed', 'cancelled')),
  total_amount integer not null check (total_amount >= 0),
  created_at timestamptz not null default now()
);

create table if not exists order_items (
  id bigint generated always as identity primary key,
  order_id uuid not null references orders(id) on delete cascade,
  product_id uuid references products(id) on delete set null,
  quantity integer not null check (quantity > 0),
  unit_price integer not null check (unit_price >= 0),
  line_total integer not null check (line_total >= 0)
);

alter table categories enable row level security;
alter table products enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;

drop policy if exists "Public can read categories" on categories;
create policy "Public can read categories"
on categories for select
using (true);

drop policy if exists "Public can read published products" on products;
create policy "Public can read published products"
on products for select
using (is_published = true);

drop policy if exists "Authenticated admins manage categories" on categories;
create policy "Authenticated admins manage categories"
on categories for all
using (auth.role() = 'authenticated')
with check (auth.role() = 'authenticated');

drop policy if exists "Authenticated admins manage products" on products;
create policy "Authenticated admins manage products"
on products for all
using (auth.role() = 'authenticated')
with check (auth.role() = 'authenticated');

drop policy if exists "Authenticated admins manage orders" on orders;
create policy "Authenticated admins manage orders"
on orders for all
using (auth.role() = 'authenticated')
with check (auth.role() = 'authenticated');

drop policy if exists "Authenticated admins manage order items" on order_items;
create policy "Authenticated admins manage order items"
on order_items for all
using (auth.role() = 'authenticated')
with check (auth.role() = 'authenticated');
