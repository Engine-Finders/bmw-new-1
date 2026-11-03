// node scripts/build-uk-demand-map.cjs
// Builds src/data/shared/ukDemandMap.json: England regions (simplified from public/320d/uk-regions-topo.json)
// plus simplified outlines of Scotland, Wales and Northern Ireland, projected into one viewBox.
const path = require("path");
const fs = require("fs");
const ROOT = path.resolve(__dirname, "..");
const topo = require(path.join(ROOT, "public/320d/uk-regions-topo.json"));
const { feature } = require(path.join(ROOT, "node_modules/topojson-client"));
const d3 = require(path.join(ROOT, "node_modules/d3-geo"));

const W = 420, H = 560;
const poly = (name, rings) => ({ type: "Feature", properties: { name }, geometry: { type: "MultiPolygon", coordinates: rings.map((r) => [r.concat([r[0]])]) } });
// lon, lat; borders pushed a little into England so they sit under its regions (drawn on top).
const scotland = poly("Scotland", [
  [[-1.95,55.80],[-2.40,56.00],[-3.10,55.98],[-3.70,56.04],[-3.10,56.10],[-2.60,56.28],[-2.95,56.46],[-2.45,56.72],[-2.07,57.15],[-1.78,57.50],[-2.00,57.69],[-2.55,57.67],[-3.40,57.70],[-4.20,57.50],[-3.90,57.80],[-3.65,58.12],[-3.08,58.44],[-3.03,58.64],[-3.53,58.60],[-4.30,58.55],[-5.00,58.62],[-5.25,58.15],[-5.20,57.90],[-5.75,57.73],[-5.55,57.40],[-5.70,57.28],[-5.83,57.00],[-6.20,56.72],[-5.70,56.55],[-5.50,56.40],[-5.65,56.05],[-5.80,55.30],[-5.45,55.55],[-5.40,55.86],[-4.85,55.95],[-4.75,55.70],[-4.63,55.46],[-4.86,55.24],[-5.05,54.90],[-4.86,54.64],[-4.40,54.75],[-3.60,54.88],[-3.00,54.95],[-2.70,55.05],[-2.20,55.30],[-2.05,55.55]],
  [[-6.20,58.52],[-6.80,58.25],[-7.10,57.80],[-6.70,57.75],[-6.40,58.00]],
  [[-7.20,57.70],[-7.40,57.40],[-7.30,57.05],[-7.10,57.30]],
  [[-6.10,57.65],[-6.60,57.45],[-6.25,57.10],[-5.75,57.20],[-5.90,57.50]],
  [[-5.70,56.62],[-6.35,56.45],[-6.00,56.30],[-5.65,56.40]],
  [[-6.10,55.95],[-6.45,55.70],[-6.15,55.60]],
  [[-3.20,59.15],[-2.75,59.10],[-2.95,58.85],[-3.35,58.90]],
]);
const wales = poly("Wales", [
  [[-2.90,53.30],[-3.40,53.34],[-3.83,53.33],[-4.13,53.23],[-4.30,53.10],[-4.55,52.95],[-4.77,52.80],[-4.40,52.88],[-4.13,52.92],[-4.05,52.72],[-4.08,52.41],[-4.40,52.20],[-4.67,52.10],[-5.10,52.00],[-5.30,51.88],[-5.05,51.70],[-4.70,51.67],[-4.40,51.74],[-4.30,51.56],[-3.95,51.60],[-3.70,51.48],[-3.17,51.45],[-2.98,51.53],[-2.60,51.62],[-2.55,51.85],[-2.95,52.07],[-2.90,52.34],[-2.95,52.66],[-2.90,52.95],[-2.80,53.10]],
  [[-4.60,53.30],[-4.30,53.42],[-4.05,53.30],[-4.30,53.15],[-4.55,53.20]],
]);
const ni = poly("Northern Ireland", [
  [[-5.43,54.42],[-5.53,54.65],[-5.80,54.85],[-6.05,55.20],[-6.50,55.24],[-7.00,55.15],[-7.30,55.05],[-7.55,54.75],[-8.15,54.45],[-7.60,54.15],[-7.00,54.25],[-6.60,54.05],[-6.27,54.10],[-6.05,54.03],[-5.85,54.25],[-5.60,54.25]],
]);
const england = feature(topo, topo.objects.eer).features.map((f) => ({ ...f, properties: { name: f.properties.EER13NM } }));
// d3-geo wants exterior rings clockwise; a ring the other way round reads as "the rest of the globe".
function fixWinding(f) {
  const rings = f.geometry.coordinates.map((polyRings) => {
    const single = { type: "Polygon", coordinates: polyRings };
    return d3.geoArea(single) > 2 * Math.PI ? polyRings.map((r) => r.slice().reverse()) : polyRings;
  });
  return { ...f, geometry: { ...f.geometry, coordinates: rings } };
}
const all = { type: "FeatureCollection", features: [scotland, wales, ni].map(fixWinding).concat(england) };
const proj = d3.geoMercator().fitExtent([[60, 8], [W - 50, H - 8]], all);

// Douglas-Peucker on projected rings.
function simplify(points, tol) {
  if (points.length < 4) return points;
  const keep = new Array(points.length).fill(false); keep[0] = keep[points.length - 1] = true;
  const stack = [[0, points.length - 1]];
  while (stack.length) {
    const [a, b] = stack.pop(); let max = 0, idx = -1;
    const [x1, y1] = points[a], [x2, y2] = points[b]; const dx = x2 - x1, dy = y2 - y1; const len = Math.hypot(dx, dy) || 1;
    for (let i = a + 1; i < b; i++) { const d = Math.abs(dy * points[i][0] - dx * points[i][1] + x2 * y1 - y2 * x1) / len; if (d > max) { max = d; idx = i; } }
    if (max > tol) { keep[idx] = true; stack.push([a, idx], [idx, b]); }
  }
  return points.filter((_, i) => keep[i]);
}
function ringsOf(geom) { return geom.type === "Polygon" ? geom.coordinates : geom.coordinates.flat(); }
function toPath(f) {
  let d = "";
  for (const ring of ringsOf(f.geometry)) {
    const raw = ring.map((c) => proj(c)).slice(0, -1);
    // Closed ring: split at the point farthest from the start, simplify both halves.
    let far = 0, best = -1;
    raw.forEach((p, i) => { const d = Math.hypot(p[0] - raw[0][0], p[1] - raw[0][1]); if (d > best) { best = d; far = i; } });
    const pts = far > 0 ? simplify(raw.slice(0, far + 1), 0.7).concat(simplify(raw.slice(far).concat([raw[0]]), 0.7).slice(1, -1)) : raw;
    if (pts.length < 3) continue;
    const area = Math.abs(pts.reduce((s, p, i) => { const q = pts[(i + 1) % pts.length]; return s + p[0] * q[1] - q[0] * p[1]; }, 0) / 2);
    if (area < 6) continue;
    d += "M" + pts.map((p) => p[0].toFixed(1) + " " + p[1].toFixed(1)).join("L") + "Z";
  }
  return d;
}
const regions = all.features.map((f) => {
  const [cx, cy] = proj(d3.geoCentroid(f));
  return { name: f.properties.name, country: ["Scotland", "Wales", "Northern Ireland"].includes(f.properties.name) ? f.properties.name : "England", cx: +cx.toFixed(1), cy: +cy.toFixed(1), d: toPath(f) };
});
const out = { _note: "Generated from public/320d/uk-regions-topo.json (England regions) plus simplified Scotland/Wales/Northern Ireland outlines. Mercator, viewBox 0 0 " + W + " " + H + ".", viewBox: [0, 0, W, H], regions };
fs.writeFileSync(path.join(ROOT, "src/data/shared/ukDemandMap.json"), JSON.stringify(out));
console.log(regions.map((r) => `${r.name}:${r.d.length}:${r.cx},${r.cy}`).join("\n"), "\nbytes", JSON.stringify(out).length);
