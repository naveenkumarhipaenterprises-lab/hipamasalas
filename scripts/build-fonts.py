#!/usr/bin/env python3
"""
Builds the self-hosted web fonts for the HIPA Masala site.

Only the faces the site actually renders are shipped (measured across every public
route): Poppins 400/500/600/700, Playfair Display 700 and Dancing Script 500.
Each is subset to Google Fonts' "latin" unicode-range and saved as WOFF2 in
client/public/fonts/, and client/src/styles/fonts.css is (re)generated with:

  * @font-face rules (font-display: swap)
  * metric-matched *fallback* faces (size-adjust / ascent / descent / line-gap
    overrides on local Arial / Times New Roman) so text occupies the same space
    before and after the web font arrives — this removes the font-swap layout shift.

Sources are the official OFL files from https://github.com/google/fonts
(ofl/poppins, ofl/playfairdisplay, ofl/dancingscript). Usage:

    pip install fonttools brotli
    python3 scripts/build-fonts.py /path/to/google-fonts-checkout

Metric fallbacks are computed against Liberation Sans/Serif, which are
metrically identical to Arial / Times New Roman.
"""
import hashlib
import io
import os
import sys

from fontTools import subset
from fontTools.ttLib import TTFont
from fontTools.varLib import instancer

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
OUT_DIR = os.path.join(ROOT, "client/public/fonts")
CSS_OUT = os.path.join(ROOT, "client/src/styles/fonts.css")

# Google Fonts "latin" subset (kept identical so glyph coverage/rendering is unchanged).
LATIN = ("U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, "
         "U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD")

LIBERATION = "/usr/share/fonts/truetype/liberation"
FALLBACKS = {
    # name: (metrics source file, local() names to try on visitors' devices)
    "sans-regular": (f"{LIBERATION}/LiberationSans-Regular.ttf", ["Arial", "ArialMT", "Liberation Sans", "Helvetica", "Roboto"]),
    "sans-bold": (f"{LIBERATION}/LiberationSans-Bold.ttf", ["Arial Bold", "Arial-BoldMT", "Liberation Sans Bold", "Helvetica Bold", "Roboto Bold"]),
    "serif-bold": (f"{LIBERATION}/LiberationSerif-Bold.ttf", ["Times New Roman Bold", "TimesNewRomanPS-BoldMT", "Liberation Serif Bold", "Times Bold"]),
    "serif-regular": (f"{LIBERATION}/LiberationSerif-Regular.ttf", ["Times New Roman", "TimesNewRomanPSMT", "Liberation Serif", "Times"]),
}

# (css family, weight, source path inside google/fonts, variable-axis pin or None, fallback key, preload?)
FACES = [
    ("Poppins", 400, "ofl/poppins/Poppins-Regular.ttf", None, "sans-regular", True),
    ("Poppins", 500, "ofl/poppins/Poppins-Medium.ttf", None, "sans-regular", False),
    ("Poppins", 600, "ofl/poppins/Poppins-SemiBold.ttf", None, "sans-bold", False),
    ("Poppins", 700, "ofl/poppins/Poppins-Bold.ttf", None, "sans-bold", False),
    ("Playfair Display", 700, "ofl/playfairdisplay/PlayfairDisplay[wght].ttf", 700, "serif-bold", True),
    # .eyebrow requests weight 400; with only a 500 face the browser picks 500 — same as before.
    ("Dancing Script", 500, "ofl/dancingscript/DancingScript[wght].ttf", 500, "serif-regular", False),
]

# English letter frequencies (+ space) used to average advance widths, as in capsize/next-font.
FREQ = {" ": 18.0, "e": 10.2, "t": 7.5, "a": 6.5, "o": 6.2, "i": 5.7, "n": 5.7, "s": 5.3, "h": 4.9, "r": 4.9,
        "d": 3.4, "l": 3.3, "u": 2.3, "c": 2.2, "m": 2.0, "w": 1.9, "f": 1.8, "g": 1.6, "y": 1.6, "p": 1.5,
        "b": 1.2, "v": 0.8, "k": 0.6, "j": 0.1, "x": 0.1, "q": 0.1, "z": 0.1, "A": 0.5, "S": 0.5, "M": 0.4,
        "C": 0.4, "P": 0.4, "H": 0.4, "I": 0.3, "T": 0.3}


def unicodes(ranges):
    out = []
    for part in ranges.split(","):
        part = part.strip().replace("U+", "")
        if "-" in part:
            a, b = part.split("-")
            out.extend(range(int(a, 16), int(b, 16) + 1))
        else:
            out.append(int(part, 16))
    return out


def avg_width(font):
    cmap = font.getBestCmap()
    hmtx = font["hmtx"]
    upm = font["head"].unitsPerEm
    total = weight = 0.0
    for ch, f in FREQ.items():
        g = cmap.get(ord(ch))
        if g:
            total += hmtx[g][0] * f
            weight += f
    return total / weight / upm


def vertical_metrics(font):
    upm = font["head"].unitsPerEm
    os2 = font["OS/2"]
    hhea = font["hhea"]
    if os2.fsSelection & (1 << 7):  # USE_TYPO_METRICS
        asc, desc, gap = os2.sTypoAscender, os2.sTypoDescender, os2.sTypoLineGap
    else:
        asc, desc, gap = hhea.ascent, hhea.descent, hhea.lineGap
    return asc / upm, abs(desc) / upm, gap / upm


def load_face(path, pin):
    font = TTFont(path, lazy=False)
    if pin is not None and "fvar" in font:
        font = instancer.instantiateVariableFont(font, {"wght": pin})
        buf = io.BytesIO()
        font.save(buf)
        buf.seek(0)
        font = TTFont(buf, lazy=False)
    return font


def main():
    if len(sys.argv) < 2:
        sys.exit(__doc__)
    gf = sys.argv[1]
    os.makedirs(OUT_DIR, exist_ok=True)
    os.makedirs(os.path.dirname(CSS_OUT), exist_ok=True)
    for f in os.listdir(OUT_DIR):
        if f.endswith(".woff2"):
            os.remove(os.path.join(OUT_DIR, f))

    faces_css, fallback_css, preloads = [], [], []
    fallback_fonts = {k: TTFont(v[0]) for k, v in FALLBACKS.items()}
    for family, weight, rel, pin, fb_key, preload in FACES:
        font = load_face(os.path.join(gf, rel), pin)
        metrics_font = load_face(os.path.join(gf, rel), pin)  # un-subset copy for metrics
        opts = subset.Options()
        opts.flavor = "woff2"
        opts.layout_features = ["*"]
        opts.name_IDs = [0, 1, 2, 3, 4, 5, 6]
        opts.notdef_outline = True
        sub = subset.Subsetter(opts)
        sub.populate(unicodes=unicodes(LATIN))
        sub.subset(font)
        buf = io.BytesIO()
        font.flavor = "woff2"
        font.save(buf)
        data = buf.getvalue()
        digest = hashlib.sha256(data).hexdigest()[:8]
        slug = family.lower().replace(" ", "-")
        name = f"{slug}-{weight}-latin.{digest}.woff2"
        with open(os.path.join(OUT_DIR, name), "wb") as fh:
            fh.write(data)
        url = f"/fonts/{name}"
        if preload:
            preloads.append(url)
        faces_css.append(
            f"@font-face {{\n  font-family: \"{family}\";\n  font-style: normal;\n  font-weight: {weight};\n"
            f"  font-display: swap;\n  src: url(\"{url}\") format(\"woff2\");\n  unicode-range: {LATIN};\n}}"
        )
        # metric-matched fallback face for this weight
        fb_font = fallback_fonts[fb_key]
        size_adjust = avg_width(metrics_font) / avg_width(fb_font)
        asc, desc, gap = vertical_metrics(metrics_font)
        locals_ = ", ".join(f'local("{n}")' for n in FALLBACKS[fb_key][1])
        fallback_css.append(
            f"@font-face {{\n  font-family: \"{family} Fallback\";\n  font-style: normal;\n  font-weight: {weight};\n"
            f"  src: {locals_};\n  size-adjust: {size_adjust * 100:.2f}%;\n"
            f"  ascent-override: {asc / size_adjust * 100:.2f}%;\n  descent-override: {desc / size_adjust * 100:.2f}%;\n"
            f"  line-gap-override: {gap / size_adjust * 100:.2f}%;\n}}"
        )
        print(f"{name:48s} {len(data):6d} B  size-adjust {size_adjust * 100:.1f}%")

    header = (
        "/* AUTO-GENERATED by scripts/build-fonts.py — self-hosted, latin-subset WOFF2 (SIL OFL 1.1).\n"
        "   Fallback faces are metric-matched to local Arial / Times New Roman so the swap to the\n"
        f"   web font does not move text. Preloaded in client/index.html: {', '.join(preloads)} */\n"
    )
    with open(CSS_OUT, "w") as fh:
        fh.write(header + "\n" + "\n".join(faces_css) + "\n\n" + "\n".join(fallback_css) + "\n")
    print("\npreload:", *preloads, sep="\n  ")


if __name__ == "__main__":
    main()
