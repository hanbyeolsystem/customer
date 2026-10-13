// 네이버 블로그 글 본문 추출 (naver-to-blogger.mjs · blogger-audit.mjs 공용)
//
// m.blog.naver.com 의 글 화면에서 본문 컨테이너를 찾아
// 문단(<p>)과 사진(<img>)만 문서 순서대로 골라 네이버 클래스 없는 깨끗한 HTML 로 재조립한다.

export const BLOG_ID_NAVER = "hanbyeolsystem";
export const SITE_ORIGIN = "https://xn--bm3bm1i1e348cgwe.kr"; // 한별시스템.kr
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) hanbyeol-crosspost/1.0";

// 네이버 사진 주소 정리: blogfiles.pstatic.net(움직이는 배너 GIF 등)은 외부(블로거)에서 불러오면 403 이 난다(2026-09-07 실측 50장).
// 같은 경로를 mblogthumb-phinf.pstatic.net + ?type=w966 으로 바꾸면 열린다(postfiles 는 GIF 에 403). 사이트 가져오기와 같은 호스트.
// 같은 파일을 가리키는 후보 주소들(살아있는 것을 골라 쓴다). 사이트 가져오기(naver-import)는 mblogthumb-phinf 호스트를 쓴다(1,500장 실측 정상).
export function pstaticCandidates(src) {
  const base = fixPstaticUrl(src);
  const out = [base];
  for (const host of ["mblogthumb-phinf.pstatic.net", "postfiles.pstatic.net"]) {
    const u = base.replace(/^https:\/\/[^/]+\//, `https://${host}/`);
    if (!out.includes(u)) out.push(u);
  }
  return out.filter((u) => u !== src.replace(/&amp;/g, "&"));
}

export function fixPstaticUrl(src) {
  let u = String(src || "").replace(/&amp;/g, "&");
  if (!/pstatic\.net/.test(u)) return u;
  u = u.replace(/^https?:\/\/blogfiles\.pstatic\.net\//i, "https://mblogthumb-phinf.pstatic.net/");
  u = u.replace(/^http:\/\//i, "https://");
  u = u.replace(/\?type=[^&"]+/, "?type=w966");
  if (!/\?type=/.test(u)) u += (u.includes("?") ? "&" : "?") + "type=w966";
  return u;
}

function balancedDiv(html, startIdx) {
  // startIdx = "<div" 시작 위치. 여는/닫는 div 를 세어 컨테이너 전체를 반환
  let depth = 0;
  const re = /<\/?div\b[^>]*>/g;
  re.lastIndex = startIdx;
  let m;
  while ((m = re.exec(html))) {
    depth += m[0].startsWith("</") ? -1 : 1;
    if (depth === 0) return html.slice(startIdx, m.index + m[0].length);
  }
  return html.slice(startIdx);
}

export function extractBody(pageHtml) {
  // SmartEditor ONE → SmartEditor 2(2017~18 글) → 구형 post_ct 순으로 본문 컨테이너를 찾는다
  let at = pageHtml.search(/<div[^>]*class="[^"]*se-main-container/);
  if (at < 0) at = pageHtml.search(/<div[^>]*class="[^"]*se_component_wrap/);
  if (at < 0) at = pageHtml.search(/<div[^>]*(?:id="post_ct"|class="[^"]*post_ct)/);
  if (at < 0) throw new Error("본문 컨테이너를 찾지 못함");
  const container = balancedDiv(pageHtml, at);

  const parts = [];
  const re = /<p[^>]*class="[^"]*(?:se-text-paragraph|se_textarea|se_paragraph)[^"]*"[^>]*>([\s\S]*?)<\/p>|<img\b[^>]*>/g;
  let m;
  while ((m = re.exec(container))) {
    if (m[0].startsWith("<p")) {
      const text = m[1]
        .replace(/<br\s*\/?>/gi, "\n")
        .replace(/<[^>]+>/g, "")
        .replace(/&nbsp;/g, " ")
        .trim();
      if (text) {
        parts.push(
          `<p>${text.split("\n").map((l) => l.trim()).filter(Boolean).join("<br />")}</p>`
        );
      } else {
        parts.push("<p><br /></p>"); // 빈 문단 = 줄 간격 유지
      }
    } else {
      if (!/se-image-resource/.test(m[0])) continue; // 스티커/아이콘 등 제외
      const src =
        (m[0].match(/data-lazy-src="([^"]+)"/) || m[0].match(/\bsrc="([^"]+)"/) || [])[1];
      if (!src || !/pstatic\.net/.test(src)) continue;
      const full = fixPstaticUrl(src); // 큰 사이즈로 + 외부에서 열리는 호스트로
      parts.push(
        `<div class="separator" style="clear:both;text-align:center;margin:14px 0;">` +
          `<img src="${full}" style="max-width:100%;height:auto;" loading="lazy" /></div>`
      );
    }
  }
  // 연속 빈 문단 정리
  const html = parts.join("\n").replace(/(?:<p><br \/><\/p>\n?){3,}/g, "<p><br /></p>\n");
  const imgCount = (html.match(/<img /g) || []).length;
  const textLen = html.replace(/<[^>]+>/g, "").length;
  if (textLen < 100) throw new Error(`extracted text too short (${textLen})`);
  return { html, imgCount, textLen };
}

export async function fetchPostBody(logNo) {
  const url = `https://m.blog.naver.com/PostView.naver?blogId=${BLOG_ID_NAVER}&logNo=${logNo}`;
  const res = await fetch(url, { headers: { "User-Agent": UA }, signal: AbortSignal.timeout(30000) });
  if (!res.ok) throw new Error(`post HTTP ${res.status}`);
  return extractBody(await res.text());
}

// 글 끝에 사이트의 같은 글(/blog/<logNo>/)로 가는 링크. 블로거 → 한별시스템.kr 유입·백링크(노출 지수 오프사이트 문항).
export function siteFooter(logNo) {
  return (
    `<p style="margin-top:18px;padding-top:10px;border-top:1px solid #e2e8f0;font-size:13px;color:#64748b;">` +
    `이 글은 한별시스템 홈페이지에도 있습니다: <a href="${SITE_ORIGIN}/blog/${logNo}/">한별시스템.kr/blog/${logNo}</a>` +
    ` · 대구광역시 달서구 한별시스템 053-588-7119 · <a href="${SITE_ORIGIN}/support/quote/">무료 방문 견적</a></p>`
  );
}

// 블로거 글 본문에서 원본 네이버 logNo 를 찾는다 (푸터 링크 기준). 없으면 null
export function footerLogNo(html) {
  const m = String(html || "").match(/\/blog\/(\d{9,})\/?["']/);
  return m ? m[1] : null;
}
