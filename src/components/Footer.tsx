import Link from "next/link";
import { site } from "@/data/site";
import { embedHref } from "@/lib/embed";
import { Icon } from "@/components/Icon";

export function Footer() {
  return (
    /* 시놀로지식 흰 푸터(2026-09-08): 4열 링크(제목 아래 밑줄), 하단에 소셜 아이콘·지도 등재·사업자 정보. 링크 목록은 전과 같다. */
    <footer className="bg-[var(--bg)] text-[var(--ink)] border-t border-[var(--line)] pt-14 pb-24 lg:pb-12">
      <div className="max-w-[1280px] mx-auto px-5 lg:px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-10 mb-12">
          <div>
            <h4 className="text-[16px] font-bold pb-2 mb-3 border-b border-[var(--ink)]/60">서비스</h4>
            <ul className="space-y-2 text-[14px] text-[var(--mute)]">
              <li><Link href="/ai" className="hover:text-hb-blue transition">사내 AI 구축</Link></li>
              <li><Link href="/nas" className="hover:text-hb-blue transition">NAS 솔루션</Link></li>
              <li><Link href="/rental" className="hover:text-hb-blue transition">복사기 임대</Link></li>
              <li><Link href="/network" className="hover:text-hb-blue transition">네트워크·랜공사</Link></li>
              <li><Link href="/shop" className="hover:text-hb-blue transition">임대 쇼핑몰</Link></li>
              <li><Link href="/cases" className="hover:text-hb-blue transition">구축 사례</Link></li>
              {/* 가격 페이지는 "얼마"로 검색해 들어오는 핵심 페이지라 전 페이지에서 링크를 준다 */}
              <li><Link href="/rental/price" className="hover:text-hb-blue transition">복합기 임대료</Link></li>
              <li><Link href="/nas/price" className="hover:text-hb-blue transition">NAS 구축 비용</Link></li>
              <li><Link href="/nas/buy" className="hover:text-hb-blue transition">NAS 판매·구매</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-[16px] font-bold pb-2 mb-3 border-b border-[var(--ink)]/60">고객 지원</h4>
            <ul className="space-y-2 text-[14px] text-[var(--mute)]">
              <li><Link href="/support/remote" className="hover:text-hb-blue transition">원격 지원</Link></li>
              <li><Link href="/support/drivers" className="hover:text-hb-blue transition">드라이버 다운로드</Link></li>
              <li><Link href="/support/as" className="hover:text-hb-blue transition">AS 접수</Link></li>
              <li><Link href="/support/quote" className="hover:text-hb-blue transition">견적 요청</Link></li>
              <li><Link href="/nas/repair" className="hover:text-hb-blue transition">NAS 수리·점검</Link></li>
              <li><Link href="/nas/raid-calculator" className="hover:text-hb-blue transition">RAID 계산기</Link></li>
              <li><Link href="/guide" className="hover:text-hb-blue transition">가이드·비교표</Link></li>
              <li><Link href="/qna" className="hover:text-hb-blue transition">Q&amp;A 전체 문답</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-[16px] font-bold pb-2 mb-3 border-b border-[var(--ink)]/60">회사</h4>
            <ul className="space-y-2 text-[14px] text-[var(--mute)]">
              <li><Link href="/about" className="hover:text-hb-blue transition">회사소개</Link></li>
              <li><Link href="/contact" className="hover:text-hb-blue transition">연락처·찾아오시는 길</Link></li>
              <li><Link href="/news" className="hover:text-hb-blue transition">새소식</Link></li>
              <li><Link href="/community" className="hover:text-hb-blue transition">커뮤니티</Link></li>
              <li><Link href={embedHref(site.social.blog, "한별 블로그")} className="hover:text-hb-blue transition">블로그</Link></li>
              <li><Link href="/privacy" className="hover:text-hb-blue transition">개인정보처리방침</Link></li>
              <li><Link href="/terms" className="hover:text-hb-blue transition">이용약관</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-[16px] font-bold pb-2 mb-3 border-b border-[var(--ink)]/60">연락처</h4>
            <ul className="space-y-2 text-[14px] text-[var(--mute)]">
              <li>
                <a href={site.phone.mainHref} className="inline-flex items-center gap-2 text-[var(--ink)] font-semibold hover:text-hb-blue transition">
                  <Icon name="phone" className="w-4 h-4 shrink-0" strokeWidth={2} />{site.phone.main}
                </a>
                <div className="text-[12px] pl-6 mt-0.5">{site.phone.hours}</div>
              </li>
              <li>
                <a href={site.phone.mobileHref} className="inline-flex items-center gap-2 hover:text-hb-blue transition">
                  <Icon name="smartphone" className="w-4 h-4 shrink-0" strokeWidth={2} />{site.phone.mobile}
                </a>
              </li>
              <li>
                <a href={`mailto:${site.email}`} className="inline-flex items-center gap-2 hover:text-hb-blue transition break-all">
                  <Icon name="mail" className="w-4 h-4 shrink-0" strokeWidth={2} />{site.email}
                </a>
              </li>
              <li className="pt-2 text-[13px] leading-relaxed">{site.address.street}</li>
            </ul>
            {/* 지도 등재. LocalBusiness.sameAs 와 같은 주소를 화면에도 두어야 검색·AI 가 "같은 회사"로 확인할 수 있다. */}
            <div className="mt-4 flex flex-wrap gap-x-3 gap-y-1.5 text-[12px] text-[var(--mute)]">
              <a href={site.listings.naverPlace} target="_blank" rel="noopener" className="hover:text-hb-blue transition">네이버 지도</a>
              <span>·</span>
              <a href={site.listings.kakaoPlace} target="_blank" rel="noopener" className="hover:text-hb-blue transition">카카오맵</a>
              <span>·</span>
              <a href={site.social.googleMaps} target="_blank" rel="noopener" className="hover:text-hb-blue transition">구글 지도</a>
              <span>·</span>
              <a href={site.listings.daangnProfile} target="_blank" rel="noopener" className="hover:text-hb-blue transition">당근 동네업체</a>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-[var(--line)] flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 text-[12px] leading-relaxed text-[var(--mute)]">
          <div>
            <strong className="text-[var(--ink)]">{site.name}</strong> · 대표 {site.address.ceo} · 사업자등록번호 {site.address.bizNo} · 통신판매업신고 {site.address.mailOrder}<br />
            © 2026 Hanbyeol System. All rights reserved.
          </div>
          <div className="flex items-center gap-2">
            <Link href={embedHref(site.social.blog, "한별 블로그")} aria-label="한별 블로그" className="w-9 h-9 rounded-full hover:bg-[var(--panel)] flex items-center justify-center transition"><Icon name="pen" className="w-[18px] h-[18px]" /></Link>
            <a href={site.social.instagram} target="_blank" rel="noopener" aria-label="인스타그램" className="w-9 h-9 rounded-full hover:bg-[var(--panel)] flex items-center justify-center transition"><Icon name="camera" className="w-[18px] h-[18px]" /></a>
            <a href={site.social.threads} target="_blank" rel="noopener" aria-label="Threads" className="w-9 h-9 rounded-full hover:bg-[var(--panel)] flex items-center justify-center transition"><Icon name="at" className="w-[18px] h-[18px]" /></a>
            <span className="ml-2 inline-flex items-center gap-1.5 text-[12px]"><svg aria-hidden width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c2.8 3 2.8 15 0 18M12 3c-2.8 3-2.8 15 0 18" /></svg>대한민국 - 한국어</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
