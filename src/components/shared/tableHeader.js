// One table-header style for the whole site (home, model, generation, variant and engine pages):
// BMW blue band with white uppercase labels, the same in light and dark themes.
// The static pages under /public use the same colour via --table-head in /assets/bmw/style.css.

export const TABLE_HEADER_BG = "#0b47a8";
export const TABLE_HEADER_TEXT = "#ffffff";

export function tableHeaderClass() {
  return "bg-[#0b47a8] text-white";
}
