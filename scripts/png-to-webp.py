"""
Convert PNG files to WebP without quality loss (lossless).

Usage:
  python scripts/png-to-webp.py
  python scripts/png-to-webp.py public/png
"""

from __future__ import annotations

import sys
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
DEFAULT_DIR = ROOT / "public" / "png"


def convert_one(src: Path) -> Path:
    out = src.with_suffix(".webp")
    with Image.open(src) as im:
        # Keep alpha when present; otherwise RGB.
        if im.mode in ("RGBA", "LA") or (im.mode == "P" and "transparency" in im.info):
            image = im.convert("RGBA")
        else:
            image = im.convert("RGB")
        image.save(out, "WEBP", lossless=True, method=6)
    print(f"OK  {src.relative_to(ROOT)} -> {out.relative_to(ROOT)}")
    return out


def main() -> int:
    target = Path(sys.argv[1]) if len(sys.argv) > 1 else DEFAULT_DIR
    if not target.is_absolute():
        target = ROOT / target
    if not target.exists():
        print(f"Not found: {target}")
        return 1

    files = sorted({*target.glob("*.png"), *target.glob("*.PNG")}) if target.is_dir() else [target]
    if not files:
        print(f"No PNG files in {target}")
        return 1

    for src in files:
        convert_one(src)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
