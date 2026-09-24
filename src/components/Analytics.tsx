"use client";

import Script from "next/script";
import { useEffect } from "react";

// 구글 애널리틱스4 측정 ID. 비어 있으면 스크립트를 싣지 않고 이벤트도 보내지 않는다.
export const GA_ID = "G-C1KNYL5K5R";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

// 버튼이 화면 어디에 있었는지 (헤더·첫 화면·떠 있는 버튼·본문·푸터)
function areaOf(el: Element) {
  if (el.closest("header")) return "header";
  if (el.closest("footer")) return "footer";
  if (el.closest("#top")) return "hero";
  if (el.closest(".fixed")) return "floating";
  return "content";
}

// 전화·견적·원격지원·이메일 클릭, 상담창 열기, 문의 폼 제출을 이벤트로 남긴다.
// 버튼마다 코드를 달지 않고 문서 전체에서 한 번에 받는다.
export function Analytics() {
  useEffect(() => {
    if (!GA_ID) return;
    const send = (name: string, params: Record<string, string>) => window.gtag?.("event", name, params);

    const onClick = (e: MouseEvent) => {
      const target = e.target as Element | null;
      if (target?.closest?.('button[aria-label="상담창 열기"]')) {
        send("chat_open", { link_area: "floating" });
        return;
      }
      const a = target?.closest?.("a");
      if (!a) return;
      const href = a.getAttribute("href") || "";
      const name = href.startsWith("tel:")
        ? "phone_click"
        : href.includes("/support/quote")
          ? "quote_click"
          : href.includes("/support/remote")
            ? "remote_support_click"
            : href.startsWith("mailto:")
              ? "email_click"
              : "";
      if (name) send(name, { link_text: (a.textContent || "").trim().slice(0, 40), link_area: areaOf(a) });
    };

    // 견적·AS 접수·연락처 폼만 문의로 센다 (커뮤니티 글쓰기는 제외)
    const onSubmit = () => {
      if (/^\/(support|contact)\//.test(location.pathname)) send("generate_lead", { form_path: location.pathname });
    };

    document.addEventListener("click", onClick, true);
    document.addEventListener("submit", onSubmit, true);
    return () => {
      document.removeEventListener("click", onClick, true);
      document.removeEventListener("submit", onSubmit, true);
    };
  }, []);

  if (!GA_ID) return null;
  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
      <Script id="ga4-init" strategy="afterInteractive">
        {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA_ID}');`}
      </Script>
    </>
  );
}
