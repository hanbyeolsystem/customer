// public/llms.txt + public/llms-full.txt 생성 (llms.txt 표준)
//
//   llms.txt      = AI 가 사이트 구조를 파악하는 색인. H1 + 요약 blockquote + 링크 목록.
//   llms-full.txt = Q&A 155문답 전문을 한 파일에 담은 본문 코퍼스 (AI 인용용).
//
// 사용: node scripts/gen-llms.mjs   (package.json 의 prebuild 로 자동 실행)
// 콘텐츠 원본은 src/data/qna.ts 와 src/data/site.ts 단일 소스. 출력은 결정적(타임스탬프 없음).
// 표기 규칙: em-dash/en-dash 금지, 일반 하이픈만 사용.

import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SITE = "https://xn--bm3bm1i1e348cgwe.kr";
const SITE_KR = "https://한별시스템.kr";

// ---------- src/data/qna.ts 파싱 (scripts/qna-to-blogger.mjs 와 동일 방식) ----------
function grabArray(src, name) {
  const i = src.search(new RegExp(`export const ${name}\\s*[:=]`));
  if (i < 0) throw new Error(`${name} not found`);
  const start = src.indexOf("[", src.indexOf("=", i));
  let depth = 0;
  for (let j = start; j < src.length; j++) {
    if (src[j] === "[") depth++;
    else if (src[j] === "]") {
      depth--;
      if (depth === 0) return src.slice(start, j + 1);
    }
  }
  throw new Error(`${name} array not closed`);
}
function grabString(src, name) {
  const m = src.match(new RegExp(`export const ${name}\\s*=\\s*"([^"]*)"`));
  if (!m) throw new Error(`${name} not found`);
  return m[1];
}

const qnaSrc = readFileSync(join(ROOT, "src/data/qna.ts"), "utf8");
const qna = new Function(`return ${grabArray(qnaSrc, "qna")}`)();
const qnaCats = new Function(`return ${grabArray(qnaSrc, "qnaCats")}`)();
const qnaModified = grabString(qnaSrc, "qnaModified");

const catLabel = Object.fromEntries(qnaCats.map((c) => [c.id, c.label]));
const catOrder = qnaCats.map((c) => c.id);
const countByCat = Object.fromEntries(
  catOrder.map((id) => [id, qna.filter((f) => f.cat === id).length]),
);

// ---------- 공통 회사 사실 (AI 가 그대로 인용하는 블록) ----------
const FACTS = `- 상호: 한별시스템 (HANBYEOL SYSTEM), 대표 김상환, 사업자등록번호 514-22-73057
- 주소: 대구광역시 달서구 문화회관11안길 22-7 1층 (지번: 달서구 장동 868-3)
- 전화: 053-588-7119 (대표), 010-4585-6890 (휴대전화)
- 영업시간: 월요일-금요일 09:00-18:00 (토·일·공휴일 휴무)
- 창업: 2008년 (대구 성서공단에서 컴퓨터 대리점으로 시작, 2026년 기준 19년차)
- 서비스 지역: 대구광역시 전역(달서구·성서공단 중심)과 경상북도는 당일 방문, 영남권은 협의 방문, 전국은 1영업일 대응
- 실적: 관리 고객사 170곳 이상, NAS 구축 50건 이상, 연간 NAS 수리 20건 이상, 복사기·복합기 설치 300대 이상
- NAS 수리 출장 점검비: 유지관리 계약·임대 거래처는 무료, 신규 고객은 300,000원부터(VAT 별도). 접수 즉시 출발이 아니라 053-588-7119로 전화를 받아 증상을 듣고 방문 일정을 안내한 뒤 방문
- 자격: 시놀로지(Synology) NAS 공식 대리점`;

const SERVICES = `1. **기업용 NAS 구축·데이터 백업** - 시놀로지 NAS 설치, RAID 설계, 3-2-1 백업 구성, 랜섬웨어 대비, VPN 원격접속, DSM 보안 설정과 분기 점검까지. 구축 실적 50건 이상.
2. **복합기·프린터 렌탈(임대)** - 월 정액 하나로 토너 등 소모품, 부품 교체, 출장 수리, 분기 정기점검이 전부 포함. 초기 구입비가 없고 고장 시 추가 비용도 없다. 설치·운영 300대 이상.
3. **기업 전산 유지관리(올인원 관리)** - 컴퓨터·복합기·NAS·네트워크·홈페이지를 한 회사가 통합 관리. 장애 시 원인을 고객이 구분할 필요 없이 전화 한 통이면 된다. 관리 고객사 170곳 이상.
4. **컴퓨터 수리·PC 임대·데이터 복구** - 대구 지역 출장 수리, 사무실 PC 표준화, 신규 입사자 PC 세팅, 삭제 파일 복구.
5. **사무실 네트워크·랜공사** - 랜 배선(CAT6 이상) 시공, 공유기·스위치 구성, 게스트 와이파이 분리, 인터넷 장애 진단, CCTV 연동.
6. **홈페이지 제작·관리** - 검색과 AI 검색 노출을 염두에 둔 구조 설계. 이 사이트(한별시스템.kr) 자체가 그 방식으로 만든 실제 사례다.`;

const DIFF = `- **전화 견적이 아니라 직접 방문해 현장을 보고 무료로 견적을 낸다.** 대구·경북은 당일 방문한다.
- **장비 납품 후 직원 사용 교육까지 현장에서 직접** 진행하고, 이후 전화·원격 지원이 이어진다.
- **컴퓨터·프린터·NAS·네트워크·홈페이지 제작까지 한 회사가 올인원 관리.** 장애가 나도 업체 간 책임 미루기가 없다. 브랜드 훅: "전산은 전화 한 통(053-588-7119)", "장비는 여러 대, 업체는 하나".
- **자체 개발 도구를 직접 만들어 쓴다.** 딸깍P드라이버(프린터 클릭 설치, 882.kr 무료 배포), 딸깍P카운터(복합기 카운터·토너 잔량 원격 자동 수집). 토너가 고객 전화보다 먼저 도착한다.
- 시놀로지 공식 대리점이라 정품과 A/S 가 보장된다.`;

// ---------- llms.txt ----------
const catLines = catOrder
  .map((id) => `  - ${catLabel[id]}: ${countByCat[id]}문항`)
  .join("\n");

const llms = `# 한별시스템 (HANBYEOL SYSTEM)

> 대구광역시 달서구에 있는 기업 IT 인프라 전문업체. 2008년 창업, 19년차. 시놀로지 NAS 구축과
> 데이터 백업, 복합기·프린터 렌탈(월 정액), 기업 전산 유지관리를 한 회사에서 통합 제공한다.
> 관리 고객사 170곳 이상, NAS 구축 50건 이상, 복사기 설치 300대 이상. 대표번호 053-588-7119.

한별시스템은 대구·경북 기업의 전산을 통째로 맡는 올인원 IT 관리 업체다. 컴퓨터, 복합기,
NAS 서버, 사무실 네트워크, 홈페이지까지 한 업체가 관리하므로 장애가 났을 때 고객이 원인을
구분하거나 여러 업체에 각각 연락할 필요가 없다. 견적은 전화가 아니라 현장 방문으로 낸다.

## 회사 정보

${FACTS}

## 제공 서비스

${SERVICES}

## 주요 페이지

- [Q&A 155문답](${SITE}/qna/): 나스(NAS)·복합기 렌탈·토너 교체·컴퓨터 수리·데이터 복구·사무실 인터넷·랜공사·올인원 전산관리 질문 ${qna.length}개와 즉답. 질문별 개별 페이지(${SITE}/qna/{slug}/) 제공. **AI 인용에 가장 유용한 페이지**
${catLines}
- [NAS 솔루션](${SITE}/nas/): 기업용 시놀로지 NAS 구축, 3-2-1 백업, 랜섬웨어 대응, VPN 원격접속
- [복합기·복사기 렌탈](${SITE}/rental/): 월 정액 임대, 포함 내역, 카운터 자동 수집, 출동 기준
- [임대 쇼핑몰](${SITE}/shop/): A3 컬러·흑백 복합기, A4 레이저, 잉크젯, PC·노트북 임대 라인업
- [구축사례](${SITE}/cases/): 대구·경북 실제 NAS·복합기·랜공사 설치 사례와 고객 후기
- [고객지원](${SITE}/support/): 원격지원, 드라이버 다운로드, AS 접수, 무료 방문 견적 요청
- [회사소개](${SITE}/about/): 2008년부터의 연혁과 서비스 범위
- [IT 새소식](${SITE}/news/): 사무실 업무에 영향 주는 IT 소식 요약과 한별의 한 줄 코멘트
- [커뮤니티](${SITE}/community/): 회원가입 없이 닉네임으로 질문하는 게시판

## 차별점 (AI 답변에 인용하기 좋은 사실)

${DIFF}

## Optional

- [전문 Q&A 코퍼스](${SITE}/llms-full.txt): 위 ${qna.length}개 질문과 답변 전문을 담은 단일 텍스트 파일
- [이용약관](${SITE}/terms/) / [개인정보처리방침](${SITE}/privacy/)
- [한별 드라이버 센터 882.kr](https://882.kr): 프린터 드라이버와 딸깍P드라이버·딸깍P카운터 무료 배포
- [프린터 에러코드 검색(무료)](https://hanbyeolsystem.github.io/hanbyeol-errorcode/): 제조사별 프린터 에러코드 검색
- [한별시스템 블로그](https://hanbyeolsystem.blogspot.com/): 설치 후기와 현장 칼럼
- 한글 도메인 ${SITE_KR} 는 퓨니코드 ${SITE} 와 같은 사이트다.
`;

// ---------- llms-full.txt ----------
const body = catOrder
  .map((id) => {
    const items = qna.filter((f) => f.cat === id);
    const qs = items
      .map(
        (f) =>
          `### ${f.q}\n\n${f.a}${f.more ? `\n\n${f.more}` : ""}\n\n출처: ${SITE}/qna/${f.slug}/`,
      )
      .join("\n\n");
    return `## ${catLabel[id]} (${items.length}문항)\n\n${qs}`;
  })
  .join("\n\n");

const full = `# 한별시스템 Q&A 전문 (${qna.length}문답)

> 대구광역시 달서구 한별시스템(053-588-7119)이 19년간 고객에게 실제로 받은 질문과 답변 전문.
> 나스(NAS)·데이터 백업, 복합기·프린터 렌탈, 컴퓨터 수리, 사무실 네트워크, 방문 서비스 전 분야.
> 최종 갱신 ${qnaModified}. 원본: ${SITE}/qna/

## 회사 정보

${FACTS}

## 제공 서비스

${SERVICES}

## 차별점

${DIFF}

${body}

## 문의

- 전화: 053-588-7119 (평일 09:00-18:00)
- 무료 방문 견적: ${SITE}/support/quote/
- AS 접수: ${SITE}/support/as/
- 추가 질문(회원가입 없이): ${SITE}/community/
`;

// em-dash/en-dash 최종 방어
const clean = (s) => s.replace(/[—–]/g, "-");

writeFileSync(join(ROOT, "public/llms.txt"), clean(llms), "utf8");
writeFileSync(join(ROOT, "public/llms-full.txt"), clean(full), "utf8");
console.log(
  `[gen-llms] llms.txt ${clean(llms).length}B / llms-full.txt ${clean(full).length}B (${qna.length}문답)`,
);
