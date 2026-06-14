import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";

export const metadata: Metadata = {
  title: "드라이버 다운로드",
  description: "EPSON / HP / Canon / Brother / FujiFilm / Kyocera 등 제조사별 프린터 드라이버 다운로드.",
};

const brands = [
  { name: "EPSON",      url: "https://www.epson.co.kr/support/" },
  { name: "HP",         url: "https://support.hp.com/kr-ko/drivers" },
  { name: "Canon",      url: "https://www.canon-ci.co.kr/support/download" },
  { name: "Brother",    url: "https://www.brother.co.kr/ko/support" },
  { name: "FujiFilm",   url: "https://www.fujifilm.com/fb/kr/support/download" },
  { name: "Kyocera",    url: "https://www.kyoceradocumentsolutions.co.kr/support/" },
  { name: "신도리코",   url: "https://www.sindoh.com/support/customer-support/download/" },
  { name: "삼성",       url: "https://www.samsung.com/sec/support/" },
];

export default function DriversPage() {
  return (
    <>
      <PageHeader
        badge="DRIVERS"
        title="드라이버 다운로드"
        description="제조사를 선택하면 해당 공식 지원 페이지로 이동합니다. 모델명으로 검색하시면 가장 빠릅니다."
      />
      <section className="py-12 lg:py-16 bg-[var(--bg)]">
        <div className="max-w-5xl mx-auto px-4 lg:px-6">
          <div className="bg-[var(--panel)] border border-[var(--line)] rounded-2xl p-4 mb-6 text-sm text-[var(--mute)] leading-relaxed">
            💡 모델명을 모르시면 프린터 본체 라벨이나 출력 테스트 페이지를 확인해 주세요. 모르시면 한별로 연락 주시면 함께 찾아드립니다.
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 lg:gap-4">
            {brands.map((b) => (
              <a
                key={b.name}
                href={b.url}
                target="_blank"
                rel="noopener"
                className="bg-[var(--bg)] border border-[var(--line)] rounded-2xl p-5 lg:p-6 text-center font-extrabold text-[var(--ink)] hover:border-hb-blue hover:text-hb-blue hover:-translate-y-0.5 transition"
              >
                <div className="text-2xl mb-2">🖨</div>
                {b.name}
                <div className="text-[11px] font-semibold text-[var(--mute)] mt-1">공식 사이트 →</div>
              </a>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
