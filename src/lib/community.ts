// 커뮤니티 게시판 공용 - Supabase(asms-pacai) community_posts 테이블.
// anon 키는 공개용(RLS 로 hidden=false 글만 읽힌다). 게시판 화면·글 상세·사이트맵이 같이 쓴다.

export const SB_URL = "https://jrzesjgyrvgvwazfajec.supabase.co";
export const SB_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpyemVzamd5cnZndndhemZhamVjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc3MjgwMTksImV4cCI6MjA5MzMwNDAxOX0.6FAb0CUMuYVqsvWmUR8Bbvmph4MJjlQqSDi_Mkza1c0";

export type Post = {
  id: number;
  parent_id: number | null;
  nick: string;
  title: string | null;
  content: string;
  category: string;
  created_at: string;
  source?: string | null; // 블로그 글을 다시 써 올린 글이면 "naver:<logNo>"
};

export const CATS: Record<string, string> = {
  nas: "NAS·백업",
  printer: "복사기·프린터",
  pc: "컴퓨터",
  etc: "기타",
};

// 한별시스템이 직접 올린 글(현장 글)인지. 자동답변 루틴도 같은 기준으로 이 글들을 건너뛴다.
export const OFFICIAL_NICK = "한별시스템";

// 분류별로 이어 볼 사이트 페이지(글 상세 하단). 고립된 페이지가 생기지 않게 분류 허브로 잇는다.
export const RELATED: Record<string, { href: string; label: string }[]> = {
  nas: [
    { href: "/nas/", label: "NAS 구축 안내" },
    { href: "/nas/price/", label: "NAS 가격" },
    { href: "/qna/cat/nas/", label: "NAS 자주 묻는 질문" },
  ],
  printer: [
    { href: "/rental/", label: "복합기 렌탈" },
    { href: "/rental/price/", label: "월 임대료 표" },
    { href: "/qna/cat/printer/", label: "복사기·프린터 질문" },
  ],
  pc: [
    { href: "/rental/pc/", label: "사무용 컴퓨터 렌탈" },
    { href: "/rental/price/", label: "월 임대료 표" },
    { href: "/qna/cat/pc/", label: "컴퓨터 질문" },
  ],
  etc: [
    { href: "/network/", label: "네트워크 공사" },
    { href: "/support/", label: "고객지원" },
    { href: "/qna/", label: "Q&A 전체" },
  ],
};

// 빌드 서버(UTC)와 브라우저(KST)가 같은 날짜를 찍도록 KST 로 고정
export const kstDate = (s: string) =>
  new Date(new Date(s).getTime() + 9 * 3600e3).toISOString().slice(0, 10).replace(/-/g, ".");

let cached: Promise<Post[]> | undefined;

// 빌드 시점에 한 번 받는다. 글 상세 페이지가 이 목록으로 만들어지므로 실패를 빈 배열로 삼키지 않는다
// (빈 채로 배포되면 색인된 글 주소가 전부 404). 실패하면 빌드가 멈추고 직전 배포가 그대로 남는다.
export function getCommunityPosts(): Promise<Post[]> {
  cached ??= (async () => {
    for (let i = 1; ; i++) {
      try {
        const r = await fetch(
          `${SB_URL}/rest/v1/community_posts?select=id,parent_id,nick,title,content,category,created_at,source&order=created_at.desc&limit=1000`,
          // no-store 는 정적 export 에서 "동적 페이지" 오류가 난다(예전 목록 페이지는 이 오류를 삼켜 늘 빈 목록이었다).
          // force-cache 는 빌드마다 새로 받는다(배포 워크플로가 .next/cache 를 보관하지 않음).
          // 로컬 빌드에서 옛 글이 보이면 .next/cache/fetch-cache 를 지운다.
          { headers: { apikey: SB_KEY, Authorization: `Bearer ${SB_KEY}` }, cache: "force-cache" },
        );
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return (await r.json()) as Post[];
      } catch (e) {
        if (i >= 3) throw new Error(`community_posts 를 받지 못했습니다: ${e}`);
        await new Promise((ok) => setTimeout(ok, 3000));
      }
    }
  })();
  return cached;
}
