/* RAID 용량 계산 - 순수 함수. 화면은 components/RaidCalculator.tsx, 검증은 `node scripts/raid-check.mjs` */
export const DRIVE_SIZES = [24, 20, 18, 16, 14, 12, 10, 8, 6, 4, 3, 2, 1] as const;
export const MAX_BAYS = 12;

type Row = { key: string; name: string; note: string; usable: number; protect: number; unused: number; ok: boolean; why?: string };

/** 층 계산: 오름차순 용량 배열에서 (디스크수 - parity) x 층두께 합 */
function layered(sizes: number[], parity: number): { usable: number; unused: number } {
  const s = [...sizes].sort((a, b) => a - b);
  let usable = 0, unused = 0, prev = 0;
  for (let i = 0; i < s.length; i++) {
    const thick = s[i] - prev;
    const count = s.length - i;
    if (thick > 0) {
      if (count > parity) usable += (count - parity) * thick;
      else unused += count * thick; // 보호할 짝이 없는 층은 못 쓴다
    }
    prev = s[i];
  }
  return { usable, unused };
}

export function calcRaid(sizes: number[]): Row[] {
  const n = sizes.length;
  const total = sizes.reduce((a, b) => a + b, 0);
  const min = n ? Math.min(...sizes) : 0;
  const row = (key: string, name: string, note: string, usable: number, unused: number, ok: boolean, why?: string): Row => ({
    key, name, note, usable, unused, protect: Math.max(0, total - usable - unused), ok, why,
  });
  const shr = n >= 2 ? layered(sizes, 1) : { usable: total, unused: 0 };
  const shr2 = layered(sizes, 2);
  return [
    row("shr", "SHR", "디스크 1개 고장 허용 · 용량 달라도 최대 활용", shr.usable, shr.unused, n >= 1, n < 2 ? "디스크 1개면 보호 없이 Basic 과 같습니다" : undefined),
    row("shr2", "SHR-2", "디스크 2개 고장 허용", shr2.usable, shr2.unused, n >= 4, n < 4 ? "디스크 4개부터" : undefined),
    row("basic", "Basic", "디스크 하나씩 따로 · 보호 없음", total, 0, n >= 1),
    row("jbod", "JBOD", "전부 이어 붙임 · 보호 없음", total, 0, n >= 2, n < 2 ? "디스크 2개부터" : undefined),
    row("r0", "RAID 0", "속도 우선 · 보호 없음", n * min, total - n * min, n >= 2, n < 2 ? "디스크 2개부터" : undefined),
    row("r1", "RAID 1", "똑같이 복제 · 1개 고장 허용", min, total - min * n, n >= 2, n < 2 ? "디스크 2개부터" : undefined),
    row("r5", "RAID 5", "1개 고장 허용", (n - 1) * min, total - n * min, n >= 3, n < 3 ? "디스크 3개부터" : undefined),
    row("r6", "RAID 6", "2개 고장 허용", (n - 2) * min, total - n * min, n >= 4, n < 4 ? "디스크 4개부터" : undefined),
    row("r10", "RAID 10", "복제 + 스트라이프 · 각 쌍 1개 고장 허용", (n / 2) * min, total - n * min, n >= 4 && n % 2 === 0, n < 4 ? "디스크 4개부터(짝수)" : n % 2 ? "짝수 개여야 합니다" : undefined),
  ];
}

