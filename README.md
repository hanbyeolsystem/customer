# 한별고객센터 (Hanbyeol Customer Center)

> 한별시스템 고객을 위한 셀프 서비스 허브.
> 드라이버 다운로드 · 에러코드 검색 · 임대 안내 · 쇼핑몰(예정).

- **버전**: v0.1 (골격 + 외부 링크)
- **호스팅 예정**: https://hanbyeolsystem.github.io/customer/
- **로컬**: `C:\Users\UserK\Desktop\클로드코드공부\고객용사이트\customer\`
- **기획서**: `../planning/00_기획서.md`

---

## 페이지

| 경로 | 상태 | 비고 |
|---|---|---|
| `/` | ✅ v0.1 | 메인 4카드 + 검색바 + 연락처 |
| `/drivers/` | 🔶 placeholder | v0.5 에서 데이터 채움 |
| `/rental/` | ✅ v0.1 | hbsys.kr 안내 + 임대 FAQ |
| `/shop/` | 🔶 Coming Soon | 사전 알림 신청만 |
| `/error/` | ✅ v0.1 | 0.6초 후 errorcode 사이트로 redirect |
| `/faq/` | ✅ v0.1 | 10개 질문 |
| `/about/` | ✅ v0.1 | 회사 정보 |
| `/contact/` | ✅ v0.1 | 전화·이메일·지도 |
| `/404.html` | ✅ v0.1 | |

---

## 로컬 미리보기

가장 간단하게 — `index.html` 파일을 더블클릭해 브라우저에서 열기.

검색 폼은 `drivers/`로 GET 으로 가는 정적 동작이라 로컬 파일 시스템에서는 일부 링크가 안 잡힐 수 있음. 정확한 동작 확인은 간단한 로컬 서버:

```powershell
# PowerShell — 폴더에서 Python 미리보기
cd "C:\Users\UserK\Desktop\클로드코드공부\고객용사이트\customer"
py -3.14 -m http.server 5500
# 그 다음 http://localhost:5500 접속
```

---

## GitHub Pages 배포 (예정)

1. GitHub에 `hanbyeolsystem/customer` 리포 생성
2. 이 폴더 내용을 푸시
3. Settings → Pages → main 브랜치 / root
4. 약 1분 후 `https://hanbyeolsystem.github.io/customer/` 공개

---

## 디자인 토큰 (영업PPT v2 와 통일)

- 브랜드 컬러: `#1d4ed8` (브랜드 블루)
- 강조: `#f59e0b` (앰버)
- 폰트: Pretendard CDN
- 모바일 퍼스트 (360~414px 기준)

자세한 토큰은 `css/tokens.css` 참조.

---

## 외부 사이트 연결

| 연결처 | URL | 어디서 |
|---|---|---|
| 임대·판매 | https://hbsys.kr/ | 메인 카드, 푸터, 회사 소개 |
| 에러코드 | https://hanbyeolsystem.github.io/hanbyeol-errorcode/ | 메인 카드, FAQ, /error/ |

URL이 바뀌면 전 페이지 grep 으로 찾아 일괄 교체 (v0.5에서 `js/config.js` 로 추상화 예정).

---

## 다음 단계 (v0.5)

[기획서 8번 섹션 참조](../planning/00_기획서.md#8-단계적-로드맵)

1. 한별 임대 주력 5~10대 모델 추출 (임대관리 rental_items 에서)
2. `data/drivers.json` 작성 (기획서 4-5 스키마)
3. `drivers/` 검색·필터 UI
4. 모델 상세 페이지 5건 시범 작성
5. 드라이버 파일 하이브리드 호스팅 (한별 git-lfs + 제조사 링크)
