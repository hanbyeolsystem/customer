-- 한별시스템.kr 웹 푸시 (2026-09-29). project jrzesjgyrvgvwazfajec
-- RLS 켜고 정책 없음 = anon·일반 로그인 차단, web-push 함수(service_role)만 읽고 쓴다.
create table if not exists public.webpush_subscriptions (
  id           bigserial primary key,
  endpoint     text not null unique,          -- 기기(브라우저) 하나당 하나. 같은 기기가 다시 허용하면 덮어쓴다
  p256dh       text not null,
  auth         text not null,
  user_agent   text,
  created_at   timestamptz not null default now(),
  last_seen_at timestamptz not null default now()
);
alter table public.webpush_subscriptions enable row level security;

create table if not exists public.webpush_sends (
  id         bigserial primary key,
  title      text not null,
  body       text,
  url        text,
  total      int not null default 0,   -- 보낸 시점 구독 수
  sent       int not null default 0,   -- 푸시 서비스가 받음
  failed     int not null default 0,   -- 일시 오류(구독은 남김)
  removed    int not null default 0,   -- 404·410 으로 지운 구독
  sent_by    text,
  created_at timestamptz not null default now()
);
alter table public.webpush_sends enable row level security;
