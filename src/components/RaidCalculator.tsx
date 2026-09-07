"use client";

import { useMemo, useState } from "react";

/* RAID 계산기 (2026-09-08, 시놀로지 RAID Calculator 를 참고해 만든 자체 구현).
   1단계 드라이브 선택(용량 칩 -> 베이 트레이) -> 2단계 RAID 종류별 사용 가능 용량 막대.

   계산 규칙(디스크 용량 = 표기 TB, 1TB = 1000GB 기준):
   - SHR   : 용량이 다른 디스크를 층(slab)으로 나눠 각 층을 RAID 5 처럼 쓴다. 층마다 (디스크 수 - 1) x 층 두께. 디스크 2개 이하면 RAID 1.
   - SHR-2 : 같은 방식으로 층마다 (디스크 수 - 2) x 층 두께. 디스크 4개부터.
   - Basic/JBOD : 전부 합산, 보호 없음.
   - RAID 0/1/5/6/10 : 가장 작은 디스크 기준(그보다 큰 부분은 낭비). 0 = n x s, 1 = s, 5 = (n-1) x s, 6 = (n-2) x s, 10 = n/2 x s(짝수).
   실제 포맷 후 용량은 시스템 예약(디스크당 약 10GB)·파일시스템 메타데이터 때문에 이보다 적다(아래 참고 문구). */

import { DRIVE_SIZES, MAX_BAYS, calcRaid } from "@/lib/raid";

const fmt = (tb: number) => (Number.isInteger(tb) ? `${tb}` : tb.toFixed(1)) + " TB";

export function RaidCalculator({ compact = false }: { compact?: boolean }) {
  const [drives, setDrives] = useState<number[]>([]);
  const rows = useMemo(() => calcRaid(drives), [drives]);
  const total = drives.reduce((a, b) => a + b, 0);
  const add = (tb: number) => setDrives((d) => (d.length >= MAX_BAYS ? d : [...d, tb]));
  const removeAt = (i: number) => setDrives((d) => d.filter((_, k) => k !== i));

  return (
    <div className="text-[var(--ink)]">
      {/* 1단계 */}
      <div className="flex items-center gap-3 mb-4">
        <span className="inline-flex items-center h-6 px-2 rounded-md bg-hb-primary text-white text-[12px] font-semibold">1단계</span>
        <h3 className="text-[20px] lg:text-[22px] font-bold">드라이브 선택</h3>
        <span className="ml-auto text-[13px] text-[var(--mute)]">최대 {MAX_BAYS}개 · 용량을 누르면 베이에 들어갑니다</span>
      </div>
      <div className="flex flex-wrap gap-2 mb-4">
        {DRIVE_SIZES.map((tb) => (
          <button
            key={tb}
            type="button"
            onClick={() => add(tb)}
            disabled={drives.length >= MAX_BAYS}
            className="h-10 min-w-[4.5rem] px-4 rounded-md bg-[var(--panel)] hover:bg-hb-blue-soft text-[14px] font-medium transition disabled:opacity-40 dark:hover:bg-hb-blue/30"
          >
            {tb} TB
          </button>
        ))}
      </div>

      {/* 베이 트레이 */}
      <div className="rounded-lg bg-[#2E3742] p-3 lg:p-4">
        <div className="grid grid-cols-6 lg:grid-cols-12 gap-2">
          {Array.from({ length: MAX_BAYS }, (_, i) => {
            const tb = drives[i];
            return tb ? (
              <button
                key={i}
                type="button"
                onClick={() => removeAt(i)}
                title="누르면 뺍니다"
                className="aspect-[3/5] rounded-md bg-hb-blue text-white flex flex-col items-center justify-center gap-1 hover:bg-hb-blue-dark transition"
              >
                <span className="text-[14px] lg:text-[16px] font-bold leading-none">{tb}</span>
                <span className="text-[10px] lg:text-[11px] text-white/80">TB</span>
              </button>
            ) : (
              <div key={i} className="aspect-[3/5] rounded-md border border-dashed border-white/25" />
            );
          })}
        </div>
      </div>
      <div className="flex items-center justify-between mt-2 text-[13px]">
        <span className="text-[var(--mute)]">총 드라이브 수: <b className="text-[var(--ink)]">{drives.length}</b>{drives.length > 0 && <> · 합계 {fmt(total)}</>}</span>
        <button type="button" onClick={() => setDrives([])} className="underline underline-offset-4 text-[var(--mute)] hover:text-hb-blue">재설정</button>
      </div>

      {/* 2단계 */}
      {drives.length > 0 && (
        <div className="mt-8 lg:mt-10">
          <div className="flex items-center gap-3 mb-4">
            <span className="inline-flex items-center h-6 px-2 rounded-md bg-hb-primary text-white text-[12px] font-semibold">2단계</span>
            <h3 className="text-[20px] lg:text-[22px] font-bold">RAID 종류별 사용 가능 용량</h3>
          </div>
          <div className="hidden sm:flex items-center gap-5 text-[12px] text-[var(--mute)] mb-3">
            <span className="inline-flex items-center gap-1.5"><i className="w-3 h-3 rounded-sm bg-hb-blue" />사용 가능</span>
            <span className="inline-flex items-center gap-1.5"><i className="w-3 h-3 rounded-sm bg-[#606A72]" />보호(패리티·복제)에 쓰임</span>
            <span className="inline-flex items-center gap-1.5"><i className="w-3 h-3 rounded-sm bg-[#C9D5E2]" />사용 안 됨</span>
          </div>
          <ul className="divide-y divide-[var(--line)] border-y border-[var(--line)]">
            {(compact ? rows.filter((r) => ["shr", "shr2", "r1", "r5", "r6", "r10"].includes(r.key)) : rows).map((r) => (
              <li key={r.key} className="py-3.5 grid grid-cols-[6rem_1fr] sm:grid-cols-[7rem_1fr_9.5rem] gap-x-4 gap-y-1 items-center">
                <div>
                  <div className="text-[15px] font-semibold">{r.name}</div>
                  <div className="hidden sm:block text-[12px] text-[var(--mute)] leading-snug">{r.note}</div>
                </div>
                {r.ok ? (
                  <div className="h-6 rounded-md overflow-hidden bg-[#C9D5E2] flex" aria-label={`${r.name} 사용 가능 ${fmt(r.usable)}`}>
                    <div className="bg-hb-blue h-full" style={{ width: `${(r.usable / total) * 100}%` }} />
                    <div className="bg-[#606A72] h-full" style={{ width: `${(r.protect / total) * 100}%` }} />
                  </div>
                ) : (
                  <div className="text-[13px] text-[var(--mute)]">{r.why}</div>
                )}
                <div className="col-start-2 sm:col-start-3 text-[15px] font-bold sm:text-right">
                  {r.ok ? fmt(r.usable) : "-"}
                  {r.ok && (r.protect > 0 || r.unused > 0) && (
                    <span className="block text-[11px] font-normal text-[var(--mute)]">
                      {r.protect > 0 && `보호 ${fmt(r.protect)}`}{r.protect > 0 && r.unused > 0 && " · "}{r.unused > 0 && `미사용 ${fmt(r.unused)}`}
                    </span>
                  )}
                </div>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-[12px] text-[var(--mute)] leading-relaxed">
            표기 용량(1TB = 1,000GB) 기준 계산이며 실제 포맷 후 용량은 시스템 예약(디스크당 약 10GB)과 파일시스템 메타데이터만큼 적습니다.
            용량이 다른 디스크를 섞을 때는 SHR 이 가장 적게 버립니다.
          </p>
        </div>
      )}
    </div>
  );
}
