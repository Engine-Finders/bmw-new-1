# Variant hero art: the variant's own car (from "bmw split") standing where the 320d stands in the
# reference hero, on the car-free light and dark plates, with a contact shadow and floor reflection.
import json, os, re, sys
import numpy as np
from PIL import Image, ImageFilter, ImageDraw, ImageEnhance

ROOT = '/Users/mac/Downloads/BMW'
SRC = '/Users/mac/Downloads/uk/bmw split'
HERE = os.path.dirname(os.path.abspath(__file__))
OUT = f'{ROOT}/public/variant-hero'
os.makedirs(OUT, exist_ok=True)
os.makedirs(f'{HERE}/cut', exist_ok=True)

matches = json.load(open(f'{HERE}/matches.json'))
OVERRIDES = json.load(open(f'{HERE}/overrides.json')) if os.path.exists(f'{HERE}/overrides.json') else {}
plates = {t: Image.open(f'{HERE}/plate_{t}.png').convert('RGBA') for t in ['light', 'dark']}
boxes = {t: np.load(f'{HERE}/box_{t}.npy') for t in ['light', 'dark']}

_session = None
def cutout(file):
    """Background-removed car: the site's own cut-out when there is one, else rembg on the photo."""
    cache = f"{HERE}/cut/{re.sub(r'[^a-z0-9]+', '-', file.lower())}.png"
    if os.path.exists(cache):
        return Image.open(cache).convert('RGBA')
    slug = file.replace('é', 'e').lower()
    slug = re.sub(r'-(45-angle-front|front|flat-side)-view\.webp$', lambda m: '-' + {'45-angle-front': '45', 'front': 'front', 'flat-side': 'side'}[m[1]], slug)
    slug = re.sub(r'[^a-z0-9]+', '-', slug).strip('-') + '.webp'
    slug = slug.replace('-webp.webp', '.webp')
    site = f'{ROOT}/public/cars/{slug}'
    if os.path.exists(site):
        im = Image.open(site).convert('RGBA')
    else:
        global _session
        from rembg import remove, new_session
        _session = _session or new_session('u2net')
        im = remove(Image.open(f'{SRC}/{file}').convert('RGB'), session=_session, alpha_matting=True)
    im.save(cache)
    return im

def body_box(im):
    a = np.asarray(im)[:, :, 3]
    rows = np.where((a > 200).sum(axis=1) > 3)[0]
    cols = np.where((a > 200).sum(axis=0) > 3)[0]
    return cols[0], rows[0], cols[-1], rows[-1]

def grade(car, theme):
    if theme == 'light':
        return car
    r, g, b, a = car.split()
    rgb = Image.merge('RGB', (r, g, b))
    rgb = ImageEnhance.Brightness(rgb).enhance(0.8)
    arr = np.asarray(rgb).astype(np.float32) * np.array([0.92, 0.96, 1.08])
    rgb = Image.fromarray(np.clip(arr, 0, 255).astype(np.uint8))
    return Image.merge('RGBA', (*rgb.split(), a))

def compose(file, theme):
    plate = plates[theme].copy()
    W, H = plate.size
    bx0, by0, bx1, by1 = boxes[theme]
    ow, oh = bx1 - bx0, by1 - by0
    car = cutout(file)
    # trim the 1px white fringe the studio background leaves on the cut-out edge
    car.putalpha(car.split()[3].filter(ImageFilter.MinFilter(3)).filter(ImageFilter.GaussianBlur(0.6)))
    x0, y0, x1, y1 = body_box(car)
    nw, nh = x1 - x0, y1 - y0
    # same roof height as the 320d, width kept within 15% of it (SUVs end up taller, coupes lower)
    s = oh / nh
    s = min(max(s, ow * 0.85 / nw), ow * 1.15 / nw)
    car = car.resize((round(car.width * s), round(car.height * s)), Image.LANCZOS)
    x0, y0, x1, y1 = [round(v * s) for v in (x0, y0, x1, y1)]
    cx = (bx0 + bx1) / 2
    px = round(cx - (x0 + x1) / 2)
    px = min(px, W - 24 - x1)
    py = round(by1 - y1)
    car = grade(car, theme)

    # contact shadow
    sh = Image.new('L', (W, H), 0)
    w = x1 - x0
    ImageDraw.Draw(sh).ellipse((px + x0 - w * 0.02, by1 - (y1 - y0) * 0.07, px + x1 + w * 0.02, by1 + (y1 - y0) * 0.05),
                               fill=150 if theme == 'light' else 200)
    sh = sh.filter(ImageFilter.GaussianBlur((y1 - y0) * 0.04))
    shade = Image.new('RGBA', (W, H), (25, 30, 40, 255) if theme == 'light' else (2, 4, 8, 255))
    plate = Image.composite(shade, plate, sh.point(lambda v: v * (0.55 if theme == 'light' else 0.85)))

    # floor reflection: the car mirrored under itself, fading out
    refl = car.transpose(Image.FLIP_TOP_BOTTOM)
    ra = np.asarray(refl.split()[3]).astype(np.float32)
    hh = refl.height
    top_in_refl = hh - y1          # reflected tyre line
    fade = np.clip(1 - (np.arange(hh) - top_in_refl) / ((y1 - y0) * 0.55), 0, 1)
    fade[: top_in_refl] = 0
    ra *= fade[:, None] * (0.22 if theme == 'light' else 0.3)
    refl.putalpha(Image.fromarray(ra.astype(np.uint8)))
    refl = refl.filter(ImageFilter.GaussianBlur(2.5))
    ry = py + y1 - top_in_refl + 2
    layer = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    layer.alpha_composite(refl, (px, max(0, ry)) if ry >= 0 else (px, 0))
    plate.alpha_composite(layer)

    plate.alpha_composite(car, (px, py))
    return plate.convert('RGB')

if __name__ == '__main__':
    keys = sys.argv[1:] or [k for k, v in matches.items() if v['file']]
    done = {}
    for key in keys:
        file = OVERRIDES.get(key) or matches[key]['file']
        if not file:
            continue
        name = key.replace('/', '-')
        for theme in ['light', 'dark']:
            compose(file, theme).save(f'{OUT}/{name}-{theme}.webp', 'WEBP', quality=84, method=6)
        done[key] = {'file': file, 'name': name}
        print(key, file[:80], flush=True)
    log = f'{HERE}/made.json'
    prev = json.load(open(log)) if os.path.exists(log) else {}
    prev.update(done)
    json.dump(prev, open(log, 'w'), indent=1, ensure_ascii=False)
