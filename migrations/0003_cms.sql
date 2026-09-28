-- Homepage CMS: one JSON document plus uploaded photos.

create table if not exists page_content (
  id text primary key,
  body text not null,
  updated_at timestamptz not null default now()
);

create table if not exists page_media (
  id text primary key,
  source text not null,
  url text,
  mime text,
  bytes bytea,
  created_at timestamptz not null default now()
);
