-- Analytics schema. visit_event is append-only — no UPDATE/DELETE code path,
-- no UPDATE/DELETE grants assumed. recruiter_link is small reference data
-- Roman seeds by hand (one row per outreach).

create table recruiter_link (
    label       text primary key,
    description  text,
    created_at   timestamptz not null default now()
);

create table visit_event (
    id          bigint generated always as identity primary key,
    link_label  text references recruiter_link (label),
    kind        text not null,
    city        text,
    referrer    text,
    user_agent  text,
    created_at  timestamptz not null default now()
);

create index visit_event_created_at_idx on visit_event (created_at);
create index visit_event_link_label_idx on visit_event (link_label);
