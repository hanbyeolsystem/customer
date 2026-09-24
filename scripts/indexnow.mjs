// IndexNow: 사이트맵의 URL 전부를 Bing·네이버·Yandex 에 한 번에 알린다(계정 불필요, 키 파일만 사이트 루트에).
//   ChatGPT 검색은 Bing 색인을 쓰므로 Bing 에 빨리 잡히는 것이 곧 챗GPT 노출이다.
//   키 = public/<KEY>.txt (파일 내용 = 키). 키를 바꾸면 파일명·내용·아래 KEY 세 곳을 같이 바꿀 것.
// 사용: node scripts/indexnow.mjs            (배포 뒤 실행. deploy.yml 마지막 단계에서 자동 실행)
//       node scripts/indexnow.mjs /nas/ /qna/  (특정 경로만)
const HOST = "xn--bm3bm1i1e348cgwe.kr";
const KEY = "c82f2e46b054df2df9328f3075c50e91";
const SITE = `https://${HOST}`;
const args = process.argv.slice(2);
let urls;
if (args.length) urls = args.map((p) => SITE + p);
else {
  const xml = await (await fetch(`${SITE}/sitemap.xml`)).text();
  urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim());
}
console.log(`IndexNow: ${urls.length} URL`);
// api.indexnow.org 는 한 곳에 보내면 참여 엔진(Bing·Naver·Yandex·Seznam) 전부에 전달된다. 한 번에 최대 10,000개.
for (let i = 0; i < urls.length; i += 5000) {
  const body = { host: HOST, key: KEY, keyLocation: `${SITE}/${KEY}.txt`, urlList: urls.slice(i, i + 5000) };
  const r = await fetch("https://api.indexnow.org/indexnow", { method: "POST", headers: { "Content-Type": "application/json; charset=utf-8" }, body: JSON.stringify(body) });
  console.log(`  ${i}~${i + body.urlList.length}: HTTP ${r.status} ${r.status === 200 || r.status === 202 ? "접수" : await r.text()}`);
}
