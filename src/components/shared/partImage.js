// Failure / problem cards: the background-removed part photo (public/parts, from "Parts Images - Final")
// for the part a problem names. Rules run in order, so specific parts come before general ones.
const PART_RULES = [
  [/timing chain|chain stretch|chain tension|tensioner|chain slip|rear[- ]chain/, "timing-chain-kit"],
  [/timing belt|cam belt/, "timing-belt"],
  [/timing cover/, "timing-cover-gasket"],
  [/hpfp|high[- ]pressure fuel pump|high pressure pump/, "high-pressure-fuel-pump"],
  [/injection pump/, "fuel-injection-pump"],
  [/injector seal/, "fuel-injector-seal"],
  [/injector/, "fuel-injector"],
  [/valve stem seal/, "valve-stem-seal"],
  [/vanos/, "vanos-solenoid"],
  [/eccentric shaft|valvetronic/, "valvetronic-eccentric-shaft-sensor"],
  [/subframe/, "rear-subframe"],
  [/egr cooler/, "egr-cooler"],
  [/\begr\b/, "egr-valve"],
  [/\bdpf\b|particulate/, "diesel-particulate-filter"],
  [/adblue/, "adblue-tank-assembly"],
  [/\bnox\b/, "nox-sensor"],
  [/turbo/, "turbocharger"],
  [/supercharger/, "supercharger-coupler"],
  [/intercooler hose|boost hose/, "intercooler-hose"],
  [/intercooler/, "intercooler"],
  [/water pump|cooling system|coolant pump/, "water-pump"],
  [/thermostat/, "thermostat-housing"],
  [/expansion tank|coolant/, "coolant-expansion-tank"],
  [/radiator/, "radiator"],
  [/oil filter housing/, "oil-filter-housing"],
  [/oil cooler/, "oil-cooler-assembly"],
  [/oil pump/, "oil-pump-assembly"],
  [/valve cover|rocker cover|cam cover/, "valve-cover-gasket"],
  [/head gasket/, "head-gasket"],
  [/cylinder head/, "cylinder-head"],
  [/rod bearing|big[- ]end|crank bearing/, "connecting-rod-bearing"],
  [/crank hub/, "crank-hub"],
  [/crankshaft pulley|vibration damper/, "crankshaft-pulley"],
  [/crankshaft/, "crankshaft"],
  [/camshaft/, "camshaft"],
  [/\bpcv\b|crankcase vent/, "pcv-valve"],
  [/swirl flap|intake manifold|inlet manifold/, "intake-valve-inlet-manifold"],
  [/throttle/, "throttle-body"],
  [/ignition coil|coil pack/, "ignition-coil"],
  [/spark plug/, "spark-plug"],
  [/glow plug relay/, "glow-plug-relay"],
  [/glow plug/, "glow-plug"],
  [/fuel filter/, "fuel-filter"],
  [/mechatronic|gearbox|transmission/, "gearbox-mechatronic-unit"],
  [/torque converter/, "torque-converter"],
  [/transfer (box|case)/, "transfer-box"],
  [/differential/, "differential"],
  [/engine mount/, "engine-mount"],
  [/catalytic/, "catalytic-converter"],
  [/air suspension/, "air-suspension-bag"],
  [/48v/, "48v-battery"],
  [/high[- ]voltage|hv battery/, "high-voltage-battery-pack"],
];

/** "/parts/<part>.webp" for the part a problem's text names, or null when it names none. */
export function partImageFor(...texts) {
  const text = texts
    .filter(Boolean)
    .join(" ")
    .replace(/<[^>]*>/g, " ")
    .toLowerCase();
  const rule = PART_RULES.find(([pattern]) => pattern.test(text));
  return rule ? `/parts/${rule[1]}.webp` : null;
}
