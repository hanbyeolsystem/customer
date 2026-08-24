"use client";

// 커뮤니티 게시판 - Supabase(asms-pacai) community_posts 테이블 사용.
// 회원가입 없이 닉네임으로 질문/답변. anon 키는 공개용 키(RLS로 보호됨).

import { useCallback, useEffect, useState } from "react";

const SB_URL = "https://jrzesjgyrvgvwazfajec.supabase.co";
const SB_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpyemVzamd5cnZndndhemZhamVjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc3MjgwMTksImV4cCI6MjA5MzMwNDAxOX0.6FAb0CUMuYVqsvWmUR8Bbvmph4MJjlQqSDi_Mkza1c0";

const HEADERS = {
  apikey: SB_KEY,
  Authorization: `Bearer ${SB_KEY}`,
  "Content-Type": "application/json",
};

type Post = {
  id: number;
  parent_id: number | null;
  nick: string;
  title: string | null;
  content: string;
  category: string;
  created_at: string;
};

const CATS: Record<string, string> = {
  nas: "NAS·백업",
  printer: "복사기·프린터",
  pc: "컴퓨터",
  etc: "기타",
};

function fmtDate(s: string) {
  const d = new Date(s);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")} ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

export function CommunityBoard() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [replyTo, setReplyTo] = useState<number | null>(null);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    try {
      const r = await fetch(
        `${SB_URL}/rest/v1/community_posts?select=id,parent_id,nick,title,content,category,created_at&order=created_at.desc&limit=300`,
        { headers: HEADERS }
      );
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      setPosts(await r.json());
      setError("");
    } catch {
      setError("글을 불러오지 못했습니다. 잠시 후 새로고침해 주세요.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function submit(body: Partial<Post> & { website?: string }) {
    if (body.website) return true; // honeypot - 봇이면 조용히 무시
    const last = Number(localStorage.getItem("hb_comm_last") || 0);
    if (Date.now() - last < 30_000) {
      alert("잠시 후 다시 작성해 주세요. (30초 간격)");
      return false;
    }
    setBusy(true);
    try {
      const r = await fetch(`${SB_URL}/rest/v1/community_posts`, {
        method: "POST",
        headers: { ...HEADERS, Prefer: "return=minimal" },
        body: JSON.stringify(body),
      });
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      localStorage.setItem("hb_comm_last", String(Date.now()));
      await load();
      return true;
    } catch {
      alert("등록에 실패했습니다. 내용 길이(2자 이상)를 확인하거나 잠시 후 다시 시도해 주세요.");
      return false;
    } finally {
      setBusy(false);
    }
  }

  const questions = posts.filter((p) => p.parent_id === null);
  const repliesOf = (id: number) =>
    posts.filter((p) => p.parent_id === id).sort((a, b) => a.created_at.localeCompare(b.created_at));

  return (
    <section className="py-10 lg:py-14 bg-[var(--bg)]">
      <div className="max-w-3xl mx-auto px-4 lg:px-6">
        <div className="flex items-center justify-between mb-5 gap-3 flex-wrap">
          <p className="text-sm text-[var(--mute)]">
            총 <b className="text-[var(--ink)]">{questions.length}</b>개의 질문
          </p>
          <button
            onClick={() => setShowForm((v) => !v)}
            className="bg-hb-blue text-white font-extrabold px-5 py-2.5 rounded-xl"
          >
            {showForm ? "닫기" : "✏️ 질문 남기기"}
          </button>
        </div>

        {showForm && (
          <QuestionForm
            busy={busy}
            onSubmit={async (v) => {
              const ok = await submit(v);
              if (ok) setShowForm(false);
              return ok;
            }}
          />
        )}

        {loading && <p className="text-sm text-[var(--mute)] py-8 text-center">불러오는 중...</p>}
        {error && <p className="text-sm text-red-500 py-4 text-center">{error}</p>}
        {!loading && !error && questions.length === 0 && (
          <div className="bg-[var(--panel)] border border-[var(--line)] rounded-2xl p-8 text-center text-sm text-[var(--mute)]">
            아직 질문이 없습니다. 첫 질문의 주인공이 되어 주세요!
          </div>
        )}

        <div className="space-y-4">
          {questions.map((q) => {
            const replies = repliesOf(q.id);
            return (
              <div key={q.id} className="bg-[var(--panel)] border border-[var(--line)] rounded-2xl p-5">
                <div className="flex items-center gap-2 text-[11px] text-[var(--mute)] mb-2">
                  <span className="bg-[var(--bg)] border border-[var(--line)] rounded-full px-2.5 py-0.5 font-bold">
                    {CATS[q.category] ?? "기타"}
                  </span>
                  <b className="text-[var(--ink)]/80">{q.nick}</b>
                  <span>{fmtDate(q.created_at)}</span>
                </div>
                {q.title && <h3 className="font-extrabold text-[var(--ink)] mb-1">{q.title}</h3>}
                <p className="text-sm text-[var(--ink)]/85 leading-relaxed whitespace-pre-wrap">{q.content}</p>

                {replies.length > 0 && (
                  <div className="mt-4 space-y-2.5 border-t border-dashed border-[var(--line)] pt-3.5">
                    {replies.map((r) => (
                      <div key={r.id} className="bg-[var(--bg)] rounded-xl px-4 py-3">
                        <div className="text-[11px] text-[var(--mute)] mb-1">
                          <b className={r.nick === "한별시스템" ? "text-hb-blue" : "text-[var(--ink)]/80"}>
                            {r.nick === "한별시스템" ? "✓ 한별시스템" : r.nick}
                          </b>{" "}
                          {fmtDate(r.created_at)}
                        </div>
                        <p className="text-sm text-[var(--ink)]/85 leading-relaxed whitespace-pre-wrap">{r.content}</p>
                      </div>
                    ))}
                  </div>
                )}

                {replyTo === q.id ? (
                  <ReplyForm
                    busy={busy}
                    onCancel={() => setReplyTo(null)}
                    onSubmit={async (nick, content) => {
                      const ok = await submit({ parent_id: q.id, nick, content, category: q.category });
                      if (ok) setReplyTo(null);
                      return ok;
                    }}
                  />
                ) : (
                  <button onClick={() => setReplyTo(q.id)} className="mt-3 text-xs font-bold text-hb-blue">
                    💬 답변 달기
                  </button>
                )}
              </div>
            );
          })}
        </div>

        <p className="mt-8 text-[11px] text-[var(--mute)] leading-relaxed">
          · 광고·비방·개인정보가 담긴 글은 예고 없이 숨김 처리될 수 있습니다. 급한 장애 문의는 전화(053-588-7119)가 가장 빠릅니다.
        </p>
      </div>
    </section>
  );
}

function QuestionForm({
  busy,
  onSubmit,
}: {
  busy: boolean;
  onSubmit: (v: { nick: string; title: string; content: string; category: string; website?: string }) => Promise<boolean>;
}) {
  const [nick, setNick] = useState("");
  const [category, setCategory] = useState("nas");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [website, setWebsite] = useState(""); // honeypot

  return (
    <div className="bg-[var(--panel)] border border-hb-blue/40 rounded-2xl p-5 mb-6">
      <div className="grid sm:grid-cols-2 gap-3 mb-3">
        <input value={nick} onChange={(e) => setNick(e.target.value)} maxLength={20} placeholder="닉네임"
          className="bg-[var(--bg)] border border-[var(--line)] rounded-xl px-4 py-2.5 text-sm text-[var(--ink)]" />
        <select value={category} onChange={(e) => setCategory(e.target.value)}
          className="bg-[var(--bg)] border border-[var(--line)] rounded-xl px-4 py-2.5 text-sm text-[var(--ink)]">
          <option value="nas">NAS·백업</option>
          <option value="printer">복사기·프린터</option>
          <option value="pc">컴퓨터</option>
          <option value="etc">기타</option>
        </select>
      </div>
      <input value={title} onChange={(e) => setTitle(e.target.value)} maxLength={100} placeholder="제목"
        className="w-full bg-[var(--bg)] border border-[var(--line)] rounded-xl px-4 py-2.5 text-sm text-[var(--ink)] mb-3" />
      <textarea value={content} onChange={(e) => setContent(e.target.value)} maxLength={2000} rows={5}
        placeholder="궁금한 내용을 자유롭게 적어 주세요. (예: 직원 5명 사무실인데 NAS 용량을 얼마나 잡아야 할까요?)"
        className="w-full bg-[var(--bg)] border border-[var(--line)] rounded-xl px-4 py-2.5 text-sm text-[var(--ink)] mb-3" />
      <input value={website} onChange={(e) => setWebsite(e.target.value)} tabIndex={-1} autoComplete="off"
        style={{ position: "absolute", left: "-9999px" }} aria-hidden="true" placeholder="website" />
      <button
        disabled={busy || !nick.trim() || content.trim().length < 2}
        onClick={() => onSubmit({ nick: nick.trim(), title: title.trim(), content: content.trim(), category, website })}
        className="bg-hb-blue disabled:opacity-40 text-white font-extrabold px-6 py-2.5 rounded-xl"
      >
        {busy ? "등록 중..." : "질문 등록"}
      </button>
    </div>
  );
}

function ReplyForm({
  busy,
  onCancel,
  onSubmit,
}: {
  busy: boolean;
  onCancel: () => void;
  onSubmit: (nick: string, content: string) => Promise<boolean>;
}) {
  const [nick, setNick] = useState("");
  const [content, setContent] = useState("");
  return (
    <div className="mt-3 bg-[var(--bg)] rounded-xl p-3.5">
      <input value={nick} onChange={(e) => setNick(e.target.value)} maxLength={20} placeholder="닉네임"
        className="w-full bg-[var(--panel)] border border-[var(--line)] rounded-lg px-3 py-2 text-sm text-[var(--ink)] mb-2" />
      <textarea value={content} onChange={(e) => setContent(e.target.value)} maxLength={2000} rows={3} placeholder="답변 내용"
        className="w-full bg-[var(--panel)] border border-[var(--line)] rounded-lg px-3 py-2 text-sm text-[var(--ink)] mb-2" />
      <div className="flex gap-2">
        <button disabled={busy || !nick.trim() || content.trim().length < 2}
          onClick={() => onSubmit(nick.trim(), content.trim())}
          className="bg-hb-blue disabled:opacity-40 text-white text-xs font-extrabold px-4 py-2 rounded-lg">
          등록
        </button>
        <button onClick={onCancel} className="text-xs font-bold text-[var(--mute)] px-3">취소</button>
      </div>
    </div>
  );
}
