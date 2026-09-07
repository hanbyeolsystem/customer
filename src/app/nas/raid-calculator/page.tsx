import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { AnswerBlock } from "@/components/AnswerBlock";
import { FaqSection } from "@/components/FaqSection";
import { RaidCalculator } from "@/components/RaidCalculator";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbLd, webPageLd } from "@/lib/schema";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: "RAID 계산기 - 시놀로지 NAS SHR·RAID 5·RAID 6 실제 사용 용량 계산",
  description:
    "디스크 개수와 용량을 넣으면 SHR, SHR-2, RAID 0/1/5/6/10, JBOD 별 실제 사용 가능 용량을 바로 계산합니다. 용량이 다른 디스크를 섞을 때 얼마나 버려지는지도 함께 표시. 대구 한별시스템.",
  alternates: { canonical: "/nas/raid-calculator/" },
};

const notes = [
  ["시스템 예약 용량", "디스크마다 약 10GB 를 운영체제와 스왑 파티션이 씁니다. 계산기는 표기 용량(1TB = 1,000GB) 그대로 계산하므로 실제 볼륨은 그만큼 적습니다."],
  ["파일시스템 예약", "Btrfs 볼륨은 메타데이터로 약 4%, ext4 는 약 2% 를 더 씁니다. 스냅샷을 켜면 스냅샷이 차지하는 공간도 별도입니다."],
  ["가장 작은 디스크 기준", "RAID 0/1/5/6/10 은 가장 작은 디스크 용량에 맞춰 묶입니다. 큰 디스크의 남는 부분은 쓰지 못합니다. 용량이 다른 디스크를 섞을 계획이면 SHR 이나 SHR-2 를 쓰세요."],
  ["모델별 지원 차이", "SHR 은 시놀로지 대부분의 모델이 지원하지만 일부 상위 기종은 지원하지 않습니다. 단일 볼륨 최대 용량도 모델마다 다르니 구매 전에 확인해 드립니다."],
  ["고장 허용 개수", "SHR·RAID 1·RAID 5 는 디스크 1개, SHR-2·RAID 6 은 2개까지 고장 나도 자료가 남습니다. RAID 0·JBOD·Basic 은 보호가 없어 백업 없이 쓰면 안 됩니다."],
];

const faqs = [
  { q: "SHR 이 뭔가요? RAID 5 와 뭐가 다른가요?", a: "SHR(Synology Hybrid RAID)은 시놀로지가 만든 방식으로, 용량이 다른 디스크를 섞어도 남는 공간을 층으로 나눠 최대한 씁니다. 디스크 1개 고장을 허용하는 점은 RAID 5 와 같지만, RAID 5 는 가장 작은 디스크 기준으로만 묶여 큰 디스크의 남는 부분을 버립니다. 같은 용량 디스크만 쓰면 둘의 결과는 같습니다." },
  { q: "4TB 디스크 4개면 실제로 얼마나 쓸 수 있나요?", a: "SHR 이나 RAID 5 로 묶으면 12TB, SHR-2 나 RAID 6 으로 묶으면 8TB, RAID 10 은 8TB 입니다. 여기서 시스템 예약(디스크당 약 10GB)과 파일시스템 메타데이터(Btrfs 약 4%)를 빼면 실제 볼륨은 조금 더 작게 표시됩니다." },
  { q: "디스크를 나중에 큰 것으로 바꾸면 용량이 늘어나나요?", a: "SHR 은 디스크를 하나씩 큰 것으로 교체해 가며 용량을 늘릴 수 있습니다. 다만 늘어난 용량은 같은 크기의 디스크가 2개 이상 될 때부터 쓸 수 있습니다. 예를 들어 4TB 4개에서 1개만 8TB 로 바꾸면 당장은 늘지 않고, 2개째부터 늘어납니다." },
  { q: "RAID 를 구성했는데 백업이 따로 필요한가요?", a: "필요합니다. RAID 는 디스크 고장을 견디는 장치이지 백업이 아닙니다. 랜섬웨어, 실수로 삭제, 화재나 도난에는 RAID 가 아무 도움이 되지 않습니다. 한별시스템은 NAS 를 구축할 때 스냅샷과 외장 또는 클라우드 이중 백업(3-2-1 백업)까지 같이 설계합니다." },
];

export default function RaidCalculatorPage() {
  return (
    <>
      <JsonLd data={breadcrumbLd([{ name: "NAS 솔루션", path: "/nas/" }, { name: "RAID 계산기", path: "/nas/raid-calculator/" }])} />
      <JsonLd data={webPageLd({ path: "/nas/raid-calculator/", name: String(metadata.title), description: metadata.description ?? undefined })} />
      <PageHeader
        back="/nas"
        backLabel="NAS 솔루션"
        title="RAID 계산기"
        description="디스크 개수와 용량을 넣으면 RAID 종류별로 실제 쓸 수 있는 용량이 바로 나옵니다. 어떤 구성이 맞을지 고민되면 전화 주세요. 현장을 보고 같이 정합니다."
      />

      <section className="py-10 lg:py-14 bg-[var(--bg)]">
        <div className="max-w-[1100px] mx-auto px-5 lg:px-6">
          <RaidCalculator />
        </div>
      </section>

      <AnswerBlock
        question="NAS 디스크는 몇 개, 어떤 RAID 로 묶는 게 좋나요?"
        answer="사무실 자료 보관용이면 디스크 4개에 SHR(1개 고장 허용)이 기본입니다. 디스크가 6개 이상이거나 자료를 잃으면 안 되는 곳은 SHR-2 나 RAID 6(2개 고장 허용)을 권합니다. 용량이 다른 디스크를 섞을 계획이면 RAID 5 대신 SHR 을 쓰는 것이 남는 공간을 덜 버립니다. RAID 는 백업이 아니므로 스냅샷과 외장·클라우드 백업을 같이 두어야 합니다."
        facts={[
          { label: "기본 권장", value: "디스크 4개 · SHR" },
          { label: "중요 자료", value: "SHR-2 또는 RAID 6" },
          { label: "용량 섞을 때", value: "SHR (RAID 5 보다 덜 버림)" },
          { label: "상담", value: site.phone.main },
        ]}
      />

      <section className="py-10 lg:py-14 bg-[var(--panel)]">
        <div className="max-w-[1100px] mx-auto px-5 lg:px-6">
          <h2 className="text-[22px] lg:text-[26px] mb-5">참고</h2>
          <ol className="space-y-3 text-[15px] leading-relaxed">
            {notes.map(([k, v], i) => (
              <li key={k} className="grid grid-cols-[1.5rem_1fr] gap-2">
                <span className="text-[var(--mute)]">{i + 1}.</span>
                <span><b className="font-semibold text-[var(--ink)]">{k}</b> <span className="text-[var(--mute)]">{v}</span></span>
              </li>
            ))}
          </ol>
          <p className="mt-6 text-[14px] text-[var(--mute)]">
            구성별 본체·디스크 견적은{" "}
            <Link href="/nas/price" className="text-hb-blue font-medium hover:underline underline-offset-4">NAS 구축 비용</Link>
            {" "}페이지에서 모델별로 확인할 수 있습니다.
          </p>
        </div>
      </section>

      <FaqSection items={faqs} />
    </>
  );
}
