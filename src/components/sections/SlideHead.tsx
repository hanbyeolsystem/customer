/* 홈 슬라이드 공통 머리. 홈은 7장짜리 한 벌이라 장 번호가 정보다(SlideNav 와 같은 순서). */
export function SlideHead({
  no,
  kicker,
  title,
  lead,
  dark = false,
  className = "",
}: {
  no: string;
  kicker: string;
  title: React.ReactNode;
  lead?: React.ReactNode;
  dark?: boolean;
  className?: string;
}) {
  const mute = dark ? "text-white/60" : "text-[var(--mute)]";
  return (
    <header className={`mb-8 lg:mb-12 ${className}`}>
      <p className={`text-[12px] lg:text-[13px] font-semibold tracking-[.12em] mb-4 lg:mb-5 ${mute}`}>
        <span className="font-display tracking-normal mr-2">{no}</span>{kicker}
      </p>
      <h2 className={`text-[30px] sm:text-[38px] lg:text-[52px] leading-[1.15] tracking-[-0.01em] max-w-3xl ${dark ? "text-white" : "text-[var(--ink)]"}`}>
        {title}
      </h2>
      {lead && (
        <p className={`mt-4 lg:mt-5 text-[15px] lg:text-[17px] leading-relaxed max-w-2xl ${dark ? "text-white/75" : "text-[var(--mute)]"}`}>
          {lead}
        </p>
      )}
    </header>
  );
}
