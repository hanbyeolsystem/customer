# 원본: 클로드코드공부/글쓰기규칙/ai_tell_check.py (블로그→커뮤니티 루틴이 클라우드에서 쓰려고 복사. 원본을 고치면 여기도 같이)
# 사람글 규칙 점검기. 파일(ts/tsx/md/html/txt)에서 한글 문장을 뽑아 AI 티 지표를 센다.
# 사용:
#   python ai_tell_check.py <파일|폴더> [--top N] [--show] [--fail 밀도]
#       --fail 8 이면 밀도 8 을 넘는 파일이 있을 때 exit 1 (커밋 전 게이트)
#   python ai_tell_check.py --entries <데이터 ts 파일 | json 파일> [--all]
#       qna.ts / guides.ts / cases.ts / areas.ts / qna-deep*.ts 를 문항(entry) 단위로 나눠
#       위반이 있는 문항만 "slug | 시작줄-끝줄 | 위반" 으로 출력 (--all 이면 전부)
#       .json 이면 최상위 키를 문항으로 본다(줄 번호는 0).
import re, sys, glob, io, os, json

BANNED = ["혁신", "최첨단", "차별화", "극대화", "선도", "트랜스포메이션", "최적화된", "최적의", "완벽", "놀라운", "최고의", "최상의",
          "맞춤형", "솔루션", "신뢰할 수 있는", "지속적인", "가치를 제공", "경쟁력", "스마트한", "효율적으로", "전문성", "원스톱", "토탈",
          "다양한", "강력한", "간편하게", "안심", "걱정 없이", "함께하세요", "준비하세요", "시대", "시너지", "최선을 다",
          "든든", "책임집니다", "자랑", "노하우", "파트너", "선택하는 이유", "결론적으로", "정리하면", "요약하자면", "알아보겠습니다"]
EMO = re.compile('[\U0001F300-\U0001FAFF☀-➿⭐✅❌⚠✨\U0001F000-\U0001F2FF]')
STR = re.compile(r'"((?:[^"\\]|\\.)*)"|\'((?:[^\'\\]|\\.)*)\'|`((?:[^`\\]|\\.)*)`', re.S)
HANGUL = re.compile('[가-힣]')
LONG = 60          # 이 글자 수를 넘는 문장은 "긴 문장"
# 금지어 오탐 제외: 고유명사·확정 지위·지명. 세기 전에 본문에서 지운다.
ALLOW = ["교세라도큐먼트솔루션코리아", "교세라도큐먼트솔루션", "공식 파트너", "혁신도시", "늑대와여우"]
NIDA_RUN = 3       # 입니다/습니다 로 끝나는 문장이 이만큼 연달아 오면 위반

# 데이터 파일의 문항 경계 (줄 시작 기준)
ENTRY_PATTERNS = [
    (re.compile(r'^  \{ slug: "', re.M), "qna"),            # qna.ts
    (re.compile(r'^  \{\n    slug: "', re.M), "obj"),        # guides / cases / areas
    (re.compile(r'^  "[^"]+": \[', re.M), "deep"),           # qna-deep / qna-deep-2
]


def texts(path):
    t = io.open(path, encoding="utf-8", errors="ignore").read()
    if path.endswith((".ts", ".tsx", ".js", ".mjs")):
        return strings_of(t)
    if path.endswith(".json"):
        return flat(json.loads(t))
    return [re.sub(r'<[^>]+>', ' ', t)]


def flat(o):
    if isinstance(o, str):
        return [o] if HANGUL.search(o) else []
    if isinstance(o, list):
        return [x for i in o for x in flat(i)]
    if isinstance(o, dict):
        return [x for v in o.values() for x in flat(v)]
    return []


def strings_of(code):
    out = []
    for m in STR.finditer(code):
        s = m.group(1) or m.group(2) or m.group(3) or ""
        if HANGUL.search(s):
            out.append(s)
    for m in re.finditer(r'>\s*([^<>{}]*[가-힣][^<>{}]*)<', code):   # JSX 텍스트 노드
        out.append(m.group(1))
    return out


def sentences(s):
    return [x.strip() for x in re.split(r'(?<=[.!?다요죠])\s+|\n', s) if HANGUL.search(x)]


def metrics(sents):
    joined = " ".join(sents)
    plain = joined
    for a in ALLOW:
        plain = plain.replace(a, "")
    ban = {w: plain.count(w) for w in BANNED if w in plain}
    emo = len(EMO.findall(joined))
    excl = len(re.findall(r"!(?![.[=])", joined))   # TS non-null 연산자(x!.y) 제외
    long = [x for x in sents if len(x) > LONG]
    nida = sum(1 for i in range(len(sents) - NIDA_RUN + 1)
               if all(re.search(r'(입니다|습니다)[.!]?$', sents[i + k]) for k in range(NIDA_RUN)))
    dash = joined.count("—") + joined.count("–")
    chars = len(joined)
    dens = (sum(ban.values()) * 3 + emo * 2 + excl + len(long) * 0.5 + nida * 2 + dash) / max(chars, 1) * 1000
    return dict(chars=chars, sents=len(sents), ban=ban, emoji=emo, excl=excl, long=len(long), nida3=nida,
                dash=dash, dens=round(dens, 2), longs=long[:3])


def score(path):
    sents = [x for blk in texts(path) for x in sentences(blk)]
    if not sents:
        return None
    r = metrics(sents)
    r["path"] = path
    return r


def split_entries(code):
    """(slug, start_line, end_line, entry_code) 목록. 경계 패턴은 파일에서 가장 많이 맞는 것을 쓴다."""
    best = None
    for pat, kind in ENTRY_PATTERNS:
        idx = [m.start() for m in pat.finditer(code)]
        if len(idx) > (len(best[0]) if best else 0):
            best = (idx, kind)
    if not best or not best[0]:
        return []
    idx, kind = best
    tail = re.search(r'^\][;)]|^\};', code[idx[-1]:], re.M)
    end_all = idx[-1] + tail.start() if tail else len(code)
    idx.append(end_all)
    out = []
    for i in range(len(idx) - 1):
        body = code[idx[i]:idx[i + 1]]
        slug = re.search(r'slug: "([^"]+)"', body) or re.search(r'^  "([^"]+)": \[', body, re.M)
        out.append((slug.group(1) if slug else "?", code.count("\n", 0, idx[i]) + 1,
                    code.count("\n", 0, idx[i + 1]), body))
    return out


def entry_items(path):
    """(slug, start, end, [문자열...]) 목록. ts 는 경계 패턴, json 은 최상위 키."""
    if path.endswith(".json"):
        obj = json.load(io.open(path, encoding="utf-8"))
        return [(k, 0, 0, flat(v)) for k, v in obj.items()]
    code = io.open(path, encoding="utf-8").read()
    return [(slug, a, b, strings_of(body)) for slug, a, b, body in split_entries(code)]


def entry_report(path, show_all=False):
    rows = []
    for slug, a, b, strs in entry_items(path):
        sents = [x for s in strs for x in sentences(s)]
        if not sents:
            continue
        m = metrics(sents)
        flags = []
        if m["ban"]:
            flags.append("금지어:" + ",".join(f"{k}{v}" for k, v in m["ban"].items()))
        if m["nida3"]:
            flags.append(f"입니다x{NIDA_RUN}연속:{m['nida3']}")
        if m["long"]:
            flags.append(f"60자초과:{m['long']}")
        if m["emoji"]:
            flags.append(f"이모지:{m['emoji']}")
        if m["dash"]:
            flags.append(f"대시:{m['dash']}")
        if m["excl"] > 1:
            flags.append(f"느낌표:{m['excl']}")
        rows.append((slug, a, b, m["chars"], flags))
    flagged = [r for r in rows if r[4]]
    for slug, a, b, ch, flags in (rows if show_all else flagged):
        print(f"{slug} | {a}-{b} | {ch}자 | {' '.join(flags) or 'OK'}")
    print(f"ENTRIES {len(rows)} FLAGGED {len(flagged)} ({path})")
    return rows


def main():
    argv = sys.argv[1:]
    def opt(name, default=None, has_val=True):
        if name in argv:
            i = argv.index(name)
            v = argv[i + 1] if has_val else True
            del argv[i:i + (2 if has_val else 1)]
            return v
        return default
    entries = opt("--entries")
    show_all = opt("--all", False, False)
    top = int(opt("--top", 40))
    fail = opt("--fail")
    show = opt("--show", False, False)
    if entries:
        entry_report(entries, show_all)
        return
    files = []
    for a in argv:
        if os.path.isdir(a):
            for ext in ("ts", "tsx", "md", "html", "txt", "js"):
                files += glob.glob(os.path.join(a, "**", "*." + ext), recursive=True)
        else:
            files.append(a)
    rows = [r for r in (score(f) for f in files) if r]
    rows.sort(key=lambda r: -r["dens"])
    tb = {}
    for r in rows:
        for k, v in r["ban"].items():
            tb[k] = tb.get(k, 0) + v
    for r in rows[:top]:
        b = " ".join(f"{k}{v}" for k, v in sorted(r["ban"].items(), key=lambda x: -x[1])[:8])
        print(f"{r['dens']:6.2f} | {r['chars']:7d}자 {r['sents']:4d}문장 | 이모지{r['emoji']:3d} !{r['excl']:3d} 대시{r['dash']:3d} 긴문장{r['long']:4d} 입니다x3:{r['nida3']:3d} | {r['path']} | {b}")
        if show:
            for l in r["longs"]:
                print("      · " + l[:120])
    print("BANNED TOTAL:", sorted(tb.items(), key=lambda x: -x[1]))
    print("FILES:", len(rows), "TOTAL CHARS:", sum(r["chars"] for r in rows),
          "LONG:", sum(r["long"] for r in rows), "NIDA3:", sum(r["nida3"] for r in rows),
          "EMOJI:", sum(r["emoji"] for r in rows), "DASH:", sum(r["dash"] for r in rows))
    if fail is not None:
        bad = [r for r in rows if r["dens"] > float(fail)]
        if bad:
            print(f"FAIL: {len(bad)} file(s) over density {fail}: " + ", ".join(r["path"] for r in bad[:10]))
            sys.exit(1)


if __name__ == "__main__":
    main()
