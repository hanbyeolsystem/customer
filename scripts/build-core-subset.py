"""사이트가 실제로 쓰는 글자만 담은 '핵심 조각'을 만들어 웹폰트 첫 방문 무게를 줄인다.
   python scripts/build-core-subset.py        (npm run build 를 먼저 돌려 out/ 이 있어야 한다)

왜
  구글이 주는 Noto Sans KR 조각은 CJK 빈도 기준이라 조각 하나(35~43KB)에 우리가 안 쓰는 글자가
  대부분이다. 홈 한 장을 열면 조각 10개가 따라온다(실측 375KB). 우리 705쪽에서 실제 쓰는 한글은
  1,166자뿐이라, 그 글자만 담은 조각 하나면 된다.

어떻게
  1. out/ 의 HTML 에서 화면에 보이는 글자를 모은다(본문 전체 / 제목 h1~h6 따로).
  2. Noto Sans KR 가변 원본과 잘난체 원본에서 그 글자만 잘라 핵심 조각 woff2 를 만든다.
  3. 기존 조각들의 unicode-range 에서 '핵심 조각이 실제로 담은 글자'를 뺀다. 폰트 파일은 그대로 둔다.
     (CSS 명세상 폰트가 담당하는 글자 = unicode-range ∩ 폰트 cmap 이라, 파일에 글리프가 남아 있어도
      범위 밖이면 쓰이지 않는다.)
  4. 뺀 결과 범위가 비는 조각은 @font-face 규칙째 지운다. 빈 unicode-range 를 두면 전체 범위로 읽힌다.
  5. 바꾸기 전후 '그릴 수 있는 글자 집합'이 폰트별로 같은지 확인한다. 하나라도 줄면 실패로 멈춘다.

그래서 새 글(네이버 블로그 자동 수집)에 없던 글자가 나와도 기존 조각이 그대로 덮는다.
다만 그 글자 하나 때문에 35~43KB 조각을 받는 것은 전과 같다.

주의
  webfonts.css 는 fetch-webfonts.mjs 가, jalnan.css 는 build-jalnan.py 가 만든다.
  그 둘을 다시 돌리면 핵심 조각 선언이 사라지므로 이 스크립트를 다시 돌릴 것.
"""
import io, re, sys, json, glob, pathlib, shutil, zipfile, urllib.request
from fontTools import subset
from fontTools.ttLib import TTFont
from fontTools.varLib import instancer

ROOT = pathlib.Path(__file__).resolve().parent.parent
OUT = ROOT / "out"
CORE_DIR = ROOT / "public/fonts/core"
CACHE = ROOT / ".font-src"          # 원본 폰트 내려받기 캐시(리포에 안 들어간다)
NOTO_VF = "https://raw.githubusercontent.com/google/fonts/main/ofl/notosanskr/NotoSansKR%5Bwght%5D.ttf"
INTER_VF = "https://raw.githubusercontent.com/google/fonts/main/ofl/inter/Inter%5Bopsz,wght%5D.ttf"
JALNAN_ZIP = "https://framerusercontent.com/assets/nDlVcfwW7fVXLTZeKX4WdTVY1Yk.zip"  # gccompany.co.kr/font
MARK = "/* 핵심 조각 - build-core-subset.py */"  # 글꼴마다 이 표시 뒤에 선언이 붙는다


def page_glyphs():
    """out/ 의 HTML 에서 화면 글자를 모은다. 태그·스크립트·스타일은 뺀다."""
    files = [f for f in glob.glob(str(OUT / "**/*.html"), recursive=True)]
    if not files:
        sys.exit("out/ 이 비었다. npm run build 를 먼저 돌릴 것")
    body, head = set(), set()
    for f in files:
        h = pathlib.Path(f).read_text("utf-8", errors="replace")
        b = h[h.find("<body"):]
        b = re.sub(r"<script[\s\S]*?</script>|<style[\s\S]*?</style>", "", b)
        body |= set(re.sub(r"<[^>]+>", " ", b))
        for m in re.findall(r"<h[1-6][^>]*>([\s\S]*?)</h[1-6]>", b):
            head |= set(re.sub(r"<[^>]+>", " ", m))
    clean = lambda s: {c for c in s if ord(c) > 32}
    return clean(body), clean(head), len(files)


def fetch(url, name):
    CACHE.mkdir(exist_ok=True)
    p = CACHE / name
    if not p.exists():
        print(f"  원본 내려받기 {name}")
        p.write_bytes(urllib.request.urlopen(url, timeout=180).read())
    return p


def jalnan_source():
    p = CACHE / "JalnanGothicTTF.ttf"
    if not p.exists():
        CACHE.mkdir(exist_ok=True)
        print("  원본 내려받기 잘난체")
        z = zipfile.ZipFile(io.BytesIO(urllib.request.urlopen(JALNAN_ZIP, timeout=180).read()))
        n = next(x for x in z.namelist() if x.endswith("JalnanGothicTTF.ttf") and not x.startswith("__MACOSX"))
        p.write_bytes(z.read(n))
    return p


def make_core(src, text, out_path, axes=None):
    """원본에서 text 의 글자만 잘라 woff2 로 저장하고, 실제로 담긴 글자 집합을 돌려준다.
    axes 를 주면 가변 축을 먼저 좁히거나 고정한다(쓰지 않는 축은 빼야 파일이 작아진다)."""
    if axes:
        f = TTFont(str(src))
        f = instancer.instantiateVariableFont(f, axes, inplace=True, updateFontNames=False)
        CACHE.mkdir(exist_ok=True)
        src = CACHE / f"{out_path.stem}-inst.ttf"   # 캐시에 둔다(리포에 안 들어간다)
        f.save(str(src))
    o = subset.Options()
    o.flavor = "woff2"
    o.notdef_outline = False
    o.drop_tables += ["DSIG"]
    f = subset.load_font(str(src), o)
    s = subset.Subsetter(options=o)
    s.populate(text=text)
    s.subset(f)
    out_path.parent.mkdir(parents=True, exist_ok=True)
    subset.save_font(f, str(out_path), o)
    return set(TTFont(str(out_path), lazy=True).getBestCmap().keys())


def parse_ranges(s):
    cps = set()
    for part in s.split(","):
        part = part.strip().lower()
        m = re.match(r"^u\+([0-9a-f?]+)(?:-([0-9a-f]+))?$", part)
        if not m:
            continue
        a = m.group(1)
        if "?" in a:  # U+30?? 꼴
            lo, hi = int(a.replace("?", "0"), 16), int(a.replace("?", "f"), 16)
        else:
            lo = int(a, 16)
            hi = int(m.group(2), 16) if m.group(2) else lo
        cps |= set(range(lo, hi + 1))
    return cps


def fmt_ranges(cps):
    out, cps = [], sorted(cps)
    i = 0
    while i < len(cps):
        j = i
        while j + 1 < len(cps) and cps[j + 1] == cps[j] + 1:
            j += 1
        out.append(f"U+{cps[i]:x}" if i == j else f"U+{cps[i]:x}-{cps[j]:x}")
        i = j + 1
    return ", ".join(out)


def latin_basic_range(css_path):
    """Inter 조각 중 라틴 기본(U+0041 이 든) 조각의 범위를 그대로 돌려준다."""
    for blk in re.findall(r"@font-face\s*\{[^}]*\}", css_path.read_text("utf-8")):
        if "'Inter'" not in blk or "core" in blk:
            continue
        rng = re.search(r"unicode-range\s*:\s*([^;]+);", blk)
        cps = parse_ranges(rng.group(1)) if rng else set()
        if 0x41 in cps:
            return cps
    return set()


def face_css(family, href, weight, cps):
    return (
        "@font-face {\n"
        f"  font-family: '{family}';\n"
        "  font-style: normal;\n"
        f"  font-weight: {weight};\n"
        "  font-display: swap;\n"
        f"  src: url({href}) format('woff2');\n"
        f"  unicode-range: {fmt_ranges(cps)};\n"
        "}"
    )


def rewrite_css(css_path, cores):
    """한 CSS 파일을 통째로 고친다. cores = {글꼴이름: (핵심 글자집합, 핵심 선언)}.
    기존 조각 선언의 unicode-range 에서 핵심 글자를 빼고, 파일 끝에 핵심 선언들을 붙인다.
    한 파일에 글꼴이 여럿(Inter·Noto)이라 반드시 한 번에 처리한다. 나눠 부르면 앞 선언이 지워진다."""
    text = css_path.read_text("utf-8").split(MARK)[0].rstrip() + "\n"  # 전에 붙인 핵심 선언은 걷어낸다
    before, after, dropped = {}, {}, {}
    pos, out = 0, []
    for m in re.finditer(r"@font-face\s*\{[^}]*\}", text):
        out.append(text[pos:m.start()])
        pos = m.end()
        block = m.group(0)
        fam = (re.search(r"font-family\s*:\s*['\"]?([^;'\"]+)", block) or [None, ""])[1].strip()
        rng = re.search(r"unicode-range\s*:\s*([^;]+);", block)
        if fam not in cores or not rng:
            out.append(block)
            continue
        cps = parse_ranges(rng.group(1))
        before[fam] = before.get(fam, set()) | cps
        left = cps - cores[fam][0]
        if not left:
            dropped[fam] = dropped.get(fam, 0) + 1
            continue                                     # 통째로 핵심 조각에 들어간 조각은 선언을 지운다
        out.append(block.replace(rng.group(0), f"unicode-range: {fmt_ranges(left)};"))
        after[fam] = after.get(fam, set()) | left
    out.append(text[pos:])
    body = re.sub(r"\n{3,}", "\n\n", "".join(out))
    body += "\n" + MARK + "\n" + "\n".join(c[1] for c in cores.values()) + "\n"
    css_path.write_text(body, "utf-8", newline="\n")
    return {f: (before.get(f, set()), after.get(f, set()) | cores[f][0], dropped.get(f, 0)) for f in cores}


def main():
    body, head, n = page_glyphs()
    print(f"out/ {n}쪽에서 글자 수집: 본문 {len(body)}자 · 제목 {len(head)}자")

    if CORE_DIR.exists():
        shutil.rmtree(CORE_DIR)

    text_body = "".join(sorted(body))
    text_head = "".join(sorted(head))

    # 본문 Noto Sans KR 가변(300~700)·라틴 Inter 가변(400~700)은 webfonts.css 한 파일에 같이 있다.
    noto_cps = make_core(fetch(NOTO_VF, "NotoSansKR-VF.ttf"), text_body, CORE_DIR / "notosanskr-core.woff2")
    # Inter 는 광학크기(opsz) 축을 14 로 고정하고 굵기만 남긴다. 화면에서 쓰는 건 굵기뿐이다.
    # 라틴은 우리 글자만 담으면 부족하다. 화면에 늦게 그려지는 글자(챗 위젯·메뉴 등 자바스크립트가
    # 만드는 문구)가 옛 조각 하나(47KB)를 통째로 부른다. 그래서 라틴 기본 조각 범위를 통으로 넣어
    # 그 조각을 없앤다(추가 비용 약 10KB).
    latin = latin_basic_range(ROOT / "src/app/webfonts.css")
    text_latin = text_body + "".join(chr(c) for c in sorted(latin))
    inter_cps = make_core(fetch(INTER_VF, "Inter-VF.ttf"), text_latin, CORE_DIR / "inter-core.woff2",
                          axes={"opsz": 14, "wght": (400, 700)})
    res = rewrite_css(ROOT / "src/app/webfonts.css", {
        "Noto Sans KR": (noto_cps, face_css("Noto Sans KR", "/fonts/core/notosanskr-core.woff2", "300 700", noto_cps)),
        "Inter": (inter_cps, face_css("Inter", "/fonts/core/inter-core.woff2", "400 700", inter_cps)),
    })
    # 제목 잘난체는 단일 굵기라 100 900 으로 선언한다(브라우저가 가짜 굵게를 덧씌우지 않게).
    jal_cps = make_core(jalnan_source(), text_head, CORE_DIR / "jalnan-core.woff2")
    res |= rewrite_css(ROOT / "src/app/jalnan.css", {
        "Jalnan Gothic": (jal_cps, face_css("Jalnan Gothic", "/fonts/core/jalnan-core.woff2", "100 900", jal_cps)),
    })

    # 검증 - 그릴 수 있는 글자가 하나라도 줄면 멈춘다
    for fam, (before, after, dropped) in res.items():
        lost = before - after
        if lost:
            sys.exit(f"[실패] {fam}: 담당 글자 {len(lost)}자가 사라졌다 {sorted(chr(c) for c in lost)[:20]}")
        print(f"  {fam}: 담당 글자 {len(before)}자 그대로(없어진 글자 0자), 빈 조각 선언 {dropped}개 제거")

    for p in sorted(CORE_DIR.glob("*.woff2")):
        print(f"  만든 조각 {p.name} {p.stat().st_size // 1024}KB")
    print("끝. npm run build 를 다시 돌려 배포할 것")


if __name__ == "__main__":
    main()
