"""여기어때 잘난체 고딕(무료, 상업·웹 사용 허용)을 self-host 웹폰트로 만든다.
   python scripts/build-jalnan.py   (fonttools, brotli 필요: python -m pip install fonttools brotli)

- 원본은 공식 배포 zip(https://gccompany.co.kr/font)에서 받아 리포에 두지 않는다. 결과 조각만 커밋한다.
- Pretendard 와 같은 unicode-range 92조각으로 잘라(src/app/pretendard.css 에서 범위를 읽음)
  브라우저가 화면에 그리는 글자가 든 조각만 받게 한다. 글자가 하나도 없는 조각은 만들지 않는다.
- 단일 굵기 폰트라 @font-face 에 font-weight: 100 900 을 준다. font-bold/black 을 요청해도
  브라우저가 가짜 굵게(synthetic bold)를 덧씌우지 않고 이 얼굴 그대로 쓴다.
- 없는 글자(한자 등)는 스택 다음의 Pretendard 조각으로 내려간다.
"""
import io, re, sys, zipfile, urllib.request, pathlib, shutil
from fontTools import subset
from fontTools.ttLib import TTFont

ZIP_URL = "https://framerusercontent.com/assets/nDlVcfwW7fVXLTZeKX4WdTVY1Yk.zip"  # gccompany.co.kr/font 의 잘난체 고딕
ROOT = pathlib.Path(__file__).resolve().parent.parent
OUT_DIR = ROOT / "public/fonts/jalnan"
OUT_CSS = ROOT / "src/app/jalnan.css"
HREF = "/fonts/jalnan"
FAMILY = "Jalnan Gothic"

print("download", ZIP_URL)
z = zipfile.ZipFile(io.BytesIO(urllib.request.urlopen(ZIP_URL, timeout=60).read()))
ttf = next(n for n in z.namelist() if n.endswith("JalnanGothicTTF.ttf") and not n.startswith("__MACOSX"))
src = io.BytesIO(z.read(ttf))

ranges = re.findall(r"/\* \[(\d+)\] \*/.*?unicode-range: ([^;]+);", (ROOT / "src/app/pretendard.css").read_text("utf-8"), re.S)
assert len(ranges) >= 90, f"pretendard.css 조각 수 이상: {len(ranges)}"

if OUT_DIR.exists(): shutil.rmtree(OUT_DIR)
OUT_DIR.mkdir(parents=True)
css = [f"/* 이 파일은 scripts/build-jalnan.py 가 만든다. 손으로 고치지 말 것.\n * 여기어때 잘난체 고딕 dynamic subset, (주)여기어때컴퍼니 무료 배포(상업·웹 사용 허용, 판매·개작 재배포 금지)\n * https://gccompany.co.kr/font\n */"]
made = 0
for idx, rng in ranges:
    unicodes = subset.parse_unicodes(rng.replace("U+", "").replace(" ", ""))
    src.seek(0)
    font = TTFont(src)
    opts = subset.Options(flavor="woff2", layout_features=["*"], name_IDs=["*"], notdef_outline=True)
    s = subset.Subsetter(opts)
    s.populate(unicodes=unicodes)
    s.subset(font)
    if len([g for g in font.getGlyphOrder() if g != ".notdef"]) == 0:
        continue
    font.flavor = "woff2"
    name = f"JalnanGothic.subset.{idx}.woff2"
    font.save(OUT_DIR / name)
    made += 1
    css.append(f"/* [{idx}] */\n@font-face {{\n  font-family: '{FAMILY}';\n  font-style: normal;\n  font-display: swap;\n  font-weight: 100 900;\n  src: url('{HREF}/{name}') format('woff2');\n  unicode-range: {rng};\n}}")
OUT_CSS.write_text("\n".join(css) + "\n", "utf-8", newline="\n")
total = sum(p.stat().st_size for p in OUT_DIR.iterdir())
print(f"조각 {made}개, 합계 {total/1024:.0f}KB -> {OUT_DIR}, {OUT_CSS}")
