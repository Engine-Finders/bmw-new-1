# Car-free plates of the 320d reference hero (light + dark), at the working width used for every
# variant. Where the car and its reflection stood: above the horizon each column continues straight
# down from just above the car (towers, sky and arch are vertical); the floor is mirrored from the
# clean floor to the left of the car.
import os
import cv2
import numpy as np
from PIL import Image

W = 1900
HERE = os.path.dirname(os.path.abspath(__file__))
HORIZON = {'light': 676, 'dark': 571}

for t in ['light', 'dark']:
    im = Image.open(f'/Users/mac/Downloads/BMW/public/320d/hero_{t}.webp').convert('RGB')
    H = round(im.height * W / im.width)
    a = np.asarray(im.resize((W, H), Image.LANCZOS)).astype(np.float32)
    m = np.asarray(Image.open(f'{HERE}/mask_{t}.png').resize((W, H))) > 60
    ys, xs = np.where(m)
    top, bottom = ys.min(), ys.max()
    depth = int((bottom - top) * 0.8)
    refl = np.zeros_like(m)
    for x in np.unique(xs):
        col = np.where(m[:, x])[0]
        refl[col.max(): min(H, col.max() + depth), x] = True
    mask = cv2.dilate((m | refl).astype(np.uint8), np.ones((31, 31), np.uint8)) > 0
    hz = HORIZON[t]
    out = a.copy()

    # above the horizon: continue each column down from just above the mask
    for x in range(W):
        rows = np.where(mask[:hz, x])[0]
        if not len(rows):
            continue
        c = rows.min()
        src = a[max(0, c - 8):max(1, c - 3), x].mean(axis=0)
        out[c:hz, x] = src
    # the waterfront/horizon band itself: the band just left of the mask, mirrored in
    for y in range(hz - 14, hz + 4):
        cols = np.where(mask[y])[0]
        if len(cols):
            L = cols.min()
            for x in cols:
                out[y, x] = a[y, max(0, 2 * L - x)]
    # floor: mirror the floor left of the mask, row by row
    for y in range(hz + 4, H):
        cols = np.where(mask[y])[0]
        if not len(cols):
            continue
        L = cols.min()
        for x in cols:
            sx = 2 * L - x
            while sx < 0:
                sx += L
            out[y, x] = a[y, sx]

    soft = cv2.GaussianBlur(mask.astype(np.float32), (0, 0), 5)[:, :, None]
    # soften the seam between the column fill and the mirrored floor
    blur = cv2.GaussianBlur(out, (0, 0), 1.2)
    out = a * (1 - soft) + blur * soft
    noise = np.random.default_rng(1).normal(0, 2.0, out.shape)
    out = np.clip(out + noise * soft, 0, 255).astype(np.uint8)
    Image.fromarray(out).save(f'{HERE}/plate_{t}.png')
    np.save(f'{HERE}/box_{t}.npy', np.array([xs.min(), top, xs.max(), bottom]))
    Image.fromarray(out).resize((1000, round(1000 * H / W))).save(f'{HERE}/pv_{t}.png')
    print(t, W, H, xs.min(), top, xs.max(), bottom)
