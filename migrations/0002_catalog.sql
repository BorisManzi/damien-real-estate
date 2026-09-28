-- Damien catalog: shared listings + staff contacts.
-- Public site reads listings where lifecycle = 'live'.
-- Staff mutate via authenticated server functions.

create table if not exists staff_profiles (
  user_id text primary key,
  name text not null,
  role text not null default 'staff',
  created_at timestamptz not null default now()
);

create table if not exists listings (
  id text primary key,
  slug text not null unique,
  title text not null,
  status text not null,
  transaction_type text not null,
  property_type text not null,
  price integer not null,
  price_period text,
  currency text not null default 'RWF',
  city text not null,
  district text not null default '',
  neighborhood text not null,
  bedrooms integer,
  bathrooms integer,
  size integer not null default 0,
  parking boolean not null default false,
  garden boolean not null default false,
  furnished text not null default 'no',
  description text not null default '',
  amenities text not null default '[]',
  featured boolean not null default false,
  lifecycle text not null default 'draft',
  created_by text,
  created_at timestamptz not null default now()
);

create index if not exists listings_lifecycle_idx on listings (lifecycle);
create index if not exists listings_slug_idx on listings (slug);

create table if not exists listing_media (
  id text primary key,
  listing_id text not null references listings(id) on delete cascade,
  sort_order integer not null default 0,
  is_cover boolean not null default false,
  source text not null,
  url text,
  mime text,
  bytes bytea,
  created_at timestamptz not null default now()
);

create index if not exists listing_media_listing_idx on listing_media (listing_id, sort_order);

create table if not exists clients (
  id text primary key,
  name text not null,
  phone text not null default '',
  email text not null default '',
  status text not null,
  listing_id text references listings(id) on delete set null,
  notes text not null default '',
  created_at timestamptz not null default now()
);

create index if not exists clients_created_idx on clients (created_at desc);
