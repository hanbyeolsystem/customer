import { Suspense } from "react";
import { GoViewer } from "./GoViewer";

export const metadata = {
  title: "외부 사이트 보기",
  robots: { index: false, follow: false },
};

export default function GoPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center text-[var(--mute)]">불러오는 중...</div>}>
      <GoViewer />
    </Suspense>
  );
}
