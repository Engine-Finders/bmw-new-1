# Variant page -> exact car photo in "bmw split" (45-degree front view preferred).
import json, os, re, sys

ROOT = '/Users/mac/Downloads/BMW'
SRC = '/Users/mac/Downloads/uk/bmw split'
pages = json.load(open(f'{ROOT}/src/data/registery/variants/pages.json'))
VIEWS = ['45-angle-front', 'front', 'flat-side']
RX = re.compile(r'^bmw-(?P<model>[^-]+)-(?P<gen>.+?)-(?P<trim>[^-]+)-(?P<body>.+?)-(?P<years>\d{4}(?:–\d{4}|–)?)-(?P<kind>new|special|group)-(?P<colour>[^-]+)-(?P<short>.+?)-(?P<view>45-angle-front|front|back|flat-side)-view\.webp$')

cars = []
for f in os.listdir(SRC):
    m = RX.match(f)
    if not m or m['view'] == 'back':
        continue
    d = m.groupdict()
    d['file'] = f
    d['start'] = int(d['years'][:4])
    d['genbase'] = d['gen'].replace(' lci', '').split(' ')[0]
    cars.append(d)

def strip(t):
    return re.sub(r'<[^>]+>', ' ', str(t or ''))

def model_of(parent):
    p = parent.replace('bmw-', '')
    m = re.match(r'(\d)-series', p)
    if m:
        return f'{m[1]} series'
    return p.split('-')[0]

def codes_of(page, data):
    pill = strip(data.get('hero', {}).get('tagPill')).split('•')[0]
    pill = re.sub(r'^\s*BMW\s+', '', pill)
    pill = re.sub(r'^(\d Series|X\d|Z\d|M\d|02 Series)\s+', '', pill, flags=re.I)
    toks = re.split(r'[\s/,]+', pill.lower())
    toks += re.split(r'[-]', page['slug'].lower())
    out = []
    for t in toks:
        t = t.strip()
        if not t or t in ('bmw', 'series', 'and', 'x1', 'x2', 'x3', 'x4', 'x5', 'x6', 'x7', 'z3', 'z4', 'e83', 'petrol', 'variants'):
            continue
        t = t.replace('.', '')
        out.append(t)
    return [t for t in dict.fromkeys(out) if re.search(r'\d|^m$|^m\d', t) or t in ('activehybrid',)]

def trim_tokens(trim):
    toks = []
    for t in re.split(r'[\s/]+', trim.lower()):
        t = t.replace('.', '')
        toks.append(t)
        toks.append(re.sub(r'^(xdrive|sdrive|edrive)', '', t))
    return set(toks)

def gens_of(data):
    rows = data.get('eraMap', {}).get('rows', [])
    gens = []
    for r in rows:
        gens += [g.lower() for g in re.findall(r'\b([EFGU]\d{2})\b', strip(r.get('generation')), re.I)]
    return gens

def score(car, codes, gens, model, years):
    if car['model'] != model and not (model == '2002' and car['model'] == '02'):
        return None
    tt = trim_tokens(car['trim'] + ' ' + car['short'])
    hit = any(c in tt or re.sub(r'^(xdrive|sdrive)', '', c) in tt for c in codes)
    s = 0
    if hit:
        s += 1000
    if gens and car['genbase'] in gens:
        # era rows run oldest -> newest; the newest generation is the car most owners have today
        s += 200 + 10 * max(i for i, g in enumerate(gens) if g == car['genbase'])
    s += car['start'] / 100.0
    s -= {'45-angle-front': 0, 'front': 500, 'flat-side': 600}[car['view']]
    y0, y1 = years
    if y0 and y0 - 1 <= car['start'] <= y1:
        s += 150
    if not hit:
        # no photo of this exact variant: an ordinary car of the right era, not an M car or an EV
        if re.match(r'^(m\d|i\d|ix|x\d m\b|z\d m\b|m\b)', car['trim']) or car['kind'] != 'new':
            s -= 120
    return s, hit

out = {}
for p in pages:
    data = json.load(open(f"{ROOT}/src/data/variants/{p['dataFile']}.json"))
    model = model_of(p['parent'])
    codes = codes_of(p, data)
    gens = gens_of(data)
    ym = re.findall(r'(\d{4})\s*[–-]\s*(\d{4}|present)', strip(data.get('hero', {}).get('tagPill')))
    years = (int(ym[0][0]), 2026 if ym[0][1] == 'present' else int(ym[0][1])) if ym else (0, 0)
    best = None
    for c in cars:
        r = score(c, codes, gens, model, years)
        if r and (best is None or r[0] > best[0]):
            best = (r[0], r[1], c)
    key = f"{p['parent']}/{p['slug']}"
    out[key] = {'file': best[2]['file'] if best else None, 'hit': best[1] if best else False, 'codes': codes, 'gens': gens}
    print(key, '|', codes, '|', 'HIT' if best and best[1] else 'miss', '|', best[2]['file'][:90] if best else None)
json.dump(out, open(sys.argv[1] if len(sys.argv) > 1 else 'matches.json', 'w'), indent=1, ensure_ascii=False)
