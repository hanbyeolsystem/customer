import { CpuArchitecture } from "@/components/ui/cpu-architecture";

const points = [
  "NAS·서버·복합기·PC·네트워크 통합 관리",
  "원격 모니터링으로 장애 전 사전 대응",
  "한 번의 연락으로 모든 장비 지원",
];

export function InfraConsole() {
  return (
    <section className="py-16 lg:py-24 bg-[var(--bg)]">
      <div className="max-w-7xl mx-auto px-4 lg:px-6">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">
          {/* 텍스트 */}
          <div>
            <div className="eyebrow mb-3">INTEGRATED MANAGEMENT</div>
            <h2 className="text-2xl lg:text-4xl font-extrabold text-[var(--ink)] tracking-tight leading-tight mb-4">
              흩어진 IT 장비,<br />
              <span className="text-hb-blue">한별이 중심에서</span> 관리합니다
            </h2>
            <p className="text-sm lg:text-base text-[var(--mute)] leading-relaxed mb-6 max-w-md">
              사방에 흩어진 장비를 따로따로 신경 쓰지 마세요. 한별시스템이
              한 곳에서 모니터링하고 유지관리합니다.
            </p>
            <ul className="space-y-2.5">
              {points.map((p) => (
                <li key={p} className="flex items-start gap-2.5 text-[15px] text-[var(--ink)]/90">
                  <span className="mt-1 w-1.5 h-1.5 rounded-full bg-hb-azure shrink-0" />
                  {p}
                </li>
              ))}
            </ul>
          </div>

          {/* CPU 다이어그램 */}
          <div className="rounded-3xl border border-[var(--line)] bg-hb-primary console-grid p-4 sm:p-8 flex items-center justify-center">
            <div className="w-full aspect-[2/1]">
              <CpuArchitecture text="HB" className="text-white/25" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
