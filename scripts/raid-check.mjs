// RAID 계산기 로직 검증. `node scripts/raid-check.mjs` (Node 22.6+ 의 타입 스트립으로 .ts 를 바로 읽는다)
// 기대값은 시놀로지 RAID Calculator 와 같은 규칙(표기 TB, 1TB=1000GB)으로 손으로 계산한 값.
import assert from "node:assert/strict";
import { calcRaid } from "../src/lib/raid.ts";

const pick = (sizes, key) => calcRaid(sizes).find((r) => r.key === key);

// 같은 용량 4개(4TB x4)
assert.equal(pick([4, 4, 4, 4], "shr").usable, 12);
assert.equal(pick([4, 4, 4, 4], "shr2").usable, 8);
assert.equal(pick([4, 4, 4, 4], "r5").usable, 12);
assert.equal(pick([4, 4, 4, 4], "r6").usable, 8);
assert.equal(pick([4, 4, 4, 4], "r10").usable, 8);
assert.equal(pick([4, 4, 4, 4], "r1").usable, 4);
assert.equal(pick([4, 4, 4, 4], "r0").usable, 16);
assert.equal(pick([4, 4, 4, 4], "jbod").usable, 16);

// 용량 섞임: 1,1,4 -> SHR 은 공통 1TB 층을 RAID5 처럼 써서 2TB, 4TB 의 남는 3TB 는 미사용
const mixed = pick([1, 1, 4], "shr");
assert.equal(mixed.usable, 2);
assert.equal(mixed.unused, 3);
assert.equal(mixed.protect, 1);
// 같은 조합 RAID5 는 최소 디스크 기준 2TB, 미사용 3TB
assert.equal(pick([1, 1, 4], "r5").usable, 2);
assert.equal(pick([1, 1, 4], "r5").unused, 3);

// 2,4,4,8 -> SHR: 층1(2TB x4 -> 3x2=6) + 층2(2TB x3 -> 2x2=4) + 층3(4TB x1 -> 미사용 4) = 10 사용, 4 미사용
assert.equal(pick([2, 4, 4, 8], "shr").usable, 10);
assert.equal(pick([2, 4, 4, 8], "shr").unused, 4);
// SHR-2: 층1(4개 -> 2x2=4) + 층2(3개 -> 1x2=2) + 층3(1개 -> 미사용 4) = 6
assert.equal(pick([2, 4, 4, 8], "shr2").usable, 6);

// 개수 조건
assert.equal(pick([4], "shr").usable, 4);          // 1개는 Basic 과 같음
assert.equal(pick([4, 4, 4], "shr2").ok, false);   // SHR-2 는 4개부터
assert.equal(pick([4, 4, 4], "r10").ok, false);
assert.equal(pick([4, 4, 4, 4, 4], "r10").ok, false); // 홀수
assert.equal(pick([4, 4], "r5").ok, false);

// 합계 보존: 사용 + 보호 + 미사용 = 총합
for (const sizes of [[4, 4, 4, 4], [1, 1, 4], [2, 4, 4, 8], [24, 1]]) {
  const total = sizes.reduce((a, b) => a + b, 0);
  for (const r of calcRaid(sizes)) if (r.ok) assert.ok(Math.abs(r.usable + r.protect + r.unused - total) < 1e-9, `${r.key} ${sizes}`);
}
console.log("raid-check OK");
