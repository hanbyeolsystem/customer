import Link from "next/link";
import { site } from "@/data/site";
import { embedHref } from "@/lib/embed";
import { Icon, type IconName } from "@/components/Icon";

type Channel = {
  label: string;
  href: string;
  desc: string;
  icon: IconName;
  color: string;
  embed?: boolean; // true: 한별 사이트 안 iframe, false: 새 탭
};

const channels: Channel[] = [
  {
    label: "네이버 블로그",
    href: site.social.blog,
    desc: "한별의 소식과 운영 노하우",
    icon: "pen",
    color: "from-emerald-500 to-emerald-600",
    embed: true,
  },
  {
    label: "인스타그램",
    href: site.social.instagram,
    desc: "한별의 일상과 현장",
    icon: "camera",
    color: "from-pink-500 via-rose-500 to-amber-500",
  },
  {
    label: "Threads",
    href: site.social.threads,
    desc: "한별의 단상과 짧은 메모",
    icon: "at",
    color: "from-slate-900 to-slate-700",
  },
];

export function OfficialChannels() {
  return (
    <section className="py-16 lg:py-20 bg-[var(--bg)]">
      <div className="max-w-7xl mx-auto px-4 lg:px-6">
        <div className="text-center mb-9 lg:mb-12">
          <div className="eyebrow justify-center mb-3">OFFICIAL CHANNELS</div>
          <h2 className="text-2xl lg:text-3xl font-extrabold text-[var(--ink)] tracking-tight">
            공식 채널 바로가기
          </h2>
        </div>
        <div className="grid sm:grid-cols-3 gap-4 lg:gap-6">
          {channels.map((c) => {
            const linkProps = c.embed
              ? { href: embedHref(c.href, c.label) }
              : { href: c.href, target: "_blank" as const, rel: "noopener" };
            const Tag = (c.embed ? Link : "a") as React.ElementType;
            return (
            <Tag
              key={c.label}
              {...linkProps}
              className="group relative overflow-hidden bg-[var(--bg)] border border-[var(--line)] rounded-3xl p-8 lg:p-10 text-center hover:shadow-2xl hover:-translate-y-1 transition block"
            >
              <div className={`absolute -top-20 -right-20 w-48 h-48 rounded-full bg-gradient-to-br ${c.color} opacity-10 group-hover:opacity-20 transition`} />
              <div className={`relative w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br ${c.color} text-white flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 transition`}>
                <Icon name={c.icon} className="w-9 h-9" strokeWidth={1.6} />
              </div>
              <h3 className="font-extrabold text-[var(--ink)] text-lg mb-1.5">{c.label}</h3>
              <p className="text-sm text-[var(--mute)]">{c.desc}</p>
              <div className="mt-5 inline-flex items-center gap-1 text-sm font-bold text-hb-blue group-hover:gap-2 transition">
                바로가기 {c.embed ? "→" : "↗"}
              </div>
            </Tag>
            );
          })}
        </div>
      </div>
    </section>
  );
}
