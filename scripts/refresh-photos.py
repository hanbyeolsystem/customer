# -*- coding: utf-8 -*-
"""
사이트 사진을 NAS 포토 라이브러리의 진짜 현장 사진으로 교체한다.

배경: 히어로 영상·포스터가 AI 생성본이었고, 구축사례 6장은 블로그 썸네일용
      색띠·로고가 합성된 이미지였다. 파일명은 그대로 두고 내용만 바꿔서
      코드 수정 없이 교체한다.

  py scripts/refresh-photos.py --preview   미리보기 시트만 만든다
  py scripts/refresh-photos.py             실제 파일을 덮어쓴다

원본: \\192.168.0.249\home\Photos\PhotoLibrary\2026\08
"""
import argparse, os, sys
from PIL import Image
import pillow_heif
pillow_heif.register_heif_opener()

NAS = "//192.168.0.249/home/Photos/PhotoLibrary/2026/08"
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PUB = os.path.join(ROOT, "public")

# 라이브러리 원본을 쓰는 것 (현장이 확실히 같은 사진만)
#   대상파일: (원본, 가로, 세로)
FROM_NAS = {
    "hero/server-rack.jpg":  ("20260417_131603.heic", 1536, 1024),  # 랙에 장착한 랙마운트 NAS
    "cases/rs2421.jpg":      ("20260417_104842.heic", 1200,  750),  # 대학교 랙마운트 + 모니터
    "cases/ds1825.jpg":      ("20260407_132922.heic", 1200,  750),  # 8베이 시놀로지
    "cases/lan.jpg":         ("20260110_142008.heic", 1200,  750),  # 사무실 랜공사
    "blog-assets/brand-store-01.jpg": ("20260407_095308.heic", 1200, 900),  # 한별시스템 매장
}

# 원본을 못 찾은 것은 기존 이미지에서 색띠·로고만 잘라낸다
#   대상파일: (좌, 상, 우, 하) 비율
CROP_SELF = {
    "cases/ds925.jpg":    (0.03, 0.14, 0.99, 0.65),
    "cases/kyocera.jpg":  (0.02, 0.13, 0.98, 0.60),
    "cases/changwon.jpg": (0.53, 0.15, 0.92, 0.70),
}
OUT_SIZE = (1000, 625)   # 잘라낸 것은 원본이 작아 과하게 키우지 않는다


def cover(im, w, h):
    """비율 유지하고 가운데를 기준으로 꽉 채워 자른다."""
    sw, sh = im.size
    scale = max(w / sw, h / sh)
    im = im.resize((max(1, int(sw * scale)), max(1, int(sh * scale))), Image.LANCZOS)
    x = (im.width - w) // 2
    y = (im.height - h) // 2
    return im.crop((x, y, x + w, y + h))


def build(preview):
    made = []
    for dst, (src, w, h) in FROM_NAS.items():
        im = Image.open(os.path.join(NAS, src)).convert("RGB")
        made.append((dst, cover(im, w, h)))
    for dst, (l, t, r, b) in CROP_SELF.items():
        src_file = os.path.join(PUB, dst.replace(".jpg", ".png"))
        im = Image.open(src_file).convert("RGB")
        W, H = im.size
        im = im.crop((int(W * l), int(H * t), int(W * r), int(H * b)))
        made.append((dst, cover(im, *OUT_SIZE)))

    if preview:
        cols, tw, th = 3, 420, 300
        rows = (len(made) + cols - 1) // cols
        sheet = Image.new("RGB", (cols * tw, rows * (th + 18)), "white")
        from PIL import ImageDraw
        d = ImageDraw.Draw(sheet)
        for i, (dst, im) in enumerate(made):
            t = im.copy(); t.thumbnail((tw - 8, th))
            x, y = (i % cols) * tw, (i // cols) * (th + 18)
            sheet.paste(t, (x + 4, y)); d.text((x + 4, y + th + 3), dst, fill="black")
        out = os.path.join(ROOT, "..", "시안", "photo-preview.png")
        sheet.save(out)
        print("미리보기:", os.path.abspath(out))
        return

    for dst, im in made:
        path = os.path.join(PUB, dst)
        if dst.endswith(".png"):
            im.save(path, "PNG", optimize=True)
        else:
            im.save(path, "JPEG", quality=82, optimize=True, progressive=True)
        print("교체:", dst, im.size, round(os.path.getsize(path) / 1024), "KB")


if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("--preview", action="store_true")
    build(ap.parse_args().preview)
