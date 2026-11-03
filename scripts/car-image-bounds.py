"""Measure where the car sits inside each transparent cut-out in public/cars.

The photos carry 2-22% empty margin (most of it under the tyres), so a page that bottom-aligns the file
leaves the car hovering above its shadow. Pages use these numbers to stand the tyres on the floor.
Writes src/data/shared/carImageBounds.json: {"/cars/x.webp": [width, height, top, bottom, left, right]},
the last four as fractions of the image. Re-run after adding or replacing car photos:

    python3 scripts/car-image-bounds.py
"""
import glob
import json
import os

from PIL import Image

out = {}
for path in sorted(glob.glob("public/cars/*.webp")):
    image = Image.open(path)
    if image.mode != "RGBA":
        image = image.convert("RGBA")
    box = image.split()[3].point(lambda v: 255 if v > 60 else 0).getbbox()
    if not box:
        continue
    w, h = image.size
    out["/" + os.path.relpath(path, "public")] = [
        w, h, round(box[1] / h, 3), round((h - box[3]) / h, 3), round(box[0] / w, 3), round((w - box[2]) / w, 3)
    ]

json.dump(out, open("src/data/shared/carImageBounds.json", "w"), separators=(",", ":"))
print(len(out), "photos measured")
