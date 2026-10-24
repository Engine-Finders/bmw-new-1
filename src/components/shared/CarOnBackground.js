import Image from "next/image";
import { heroBackground } from "@/components/shared/carImage";

/**
 * Jaguar's own background (no car) for the theme with a cut-out car photo standing on its floor.
 * `className` positions and sizes the box (relative by default); `carClassName` places the car
 * inside it; `overlayClassName` (e.g. a fade behind copy) sits between the background and the car.
 * With no `src` only the background shows (e.g. the I-Pace, which has no photo of its own).
 *
 * `fit` (from scripts/car-image-bounds.py) says where the car really is inside the photo. The files carry
 * 2–22% empty margin under the tyres, so with it the photo is shifted down by exactly that margin and the
 * tyres stand on the bottom of the car box, where the contact shadow and the floor reflection are drawn.
 */
export default function CarOnBackground({
  src,
  alt = "",
  isDark,
  fit = null,
  className = "relative",
  bgClassName = "object-cover object-[center_70%]",
  carClassName = "inset-x-[8%] bottom-[6%] top-[14%]",
  overlayClassName = "",
  sizes = "50vw",
  children,
}) {
  return (
    <div className={`overflow-hidden ${className}`}>
      <Image src={heroBackground(isDark)} alt="" fill className={bgClassName} sizes={sizes} />
      {overlayClassName ? <div className={`absolute inset-0 ${overlayClassName}`} /> : null}
      {src && fit ? (
        <GroundedCar src={src} alt={alt} fit={fit} isDark={isDark} carClassName={carClassName} sizes={sizes} />
      ) : src ? (
        // The car stands on the floor: a soft contact shadow under the tyres and a faint reflection,
        // matching the composed hero scenes.
        <div className={`absolute ${carClassName}`}>
          <div
            className={`absolute inset-x-[8%] bottom-[-3%] h-[9%] rounded-[50%] blur-md ${isDark ? "bg-black/70" : "bg-black/35"}`}
          />
          <div
            aria-hidden="true"
            className={`absolute inset-x-0 top-full h-full -scale-y-100 [mask-image:linear-gradient(to_top,rgba(0,0,0,0.9),transparent_32%)] ${
              isDark ? "opacity-30" : "opacity-25"
            }`}
          >
            <Image src={src} alt="" fill className="object-contain object-bottom blur-[1px]" sizes={sizes} />
          </div>
          <Image src={src} alt={alt} fill className="object-contain object-bottom" sizes={sizes} />
        </div>
      ) : null}
      {children}
    </div>
  );
}

// The photo spans the car box's width (capped in height), drawn contain + bottom, then moved down by its own
// empty bottom margin so the tyres sit on the box's bottom edge. The drawn photo always fills the image
// element's height, so a percent translation of the element is exactly that margin at any size.
function GroundedCar({ src, alt, fit, isDark, carClassName, sizes }) {
  const visible = 1 - fit.bottom - fit.top;
  // Let the visible car (not the padded file) use the full box height; the empty margins spill outside it.
  const maxHeight = `${(100 / Math.max(visible, 0.5)).toFixed(2)}%`;
  const car = {
    maxHeight,
    transform: `translateY(${(fit.bottom * 100).toFixed(2)}%)`,
  };
  // Mirror image under the floor line: flipped, so its empty margin is on top; move it up by that margin.
  const reflection = {
    maxHeight,
    transform: `translateY(-${(fit.bottom * 100).toFixed(2)}%) scaleY(-1)`,
  };
  // Shadows span the car's own width inside the box (side margins of the photo excluded).
  const sides = { left: `${(fit.left * 100 + 4).toFixed(1)}%`, right: `${(fit.right * 100 + 4).toFixed(1)}%` };

  return (
    <div className={`absolute ${carClassName}`}>
      {/* Floor reflection, fading out a third of the way down */}
      <div
        aria-hidden="true"
        className={`absolute inset-x-0 top-full flex h-full items-start justify-center [mask-image:linear-gradient(to_bottom,rgba(0,0,0,0.85)_0%,transparent_34%)] ${
          isDark ? "opacity-40" : "opacity-25"
        }`}
      >
        <Image src={src} alt="" width={fit.width} height={fit.height} sizes={sizes} className="h-auto w-full object-contain object-bottom blur-[0.5px]" style={reflection} />
      </div>
      {/* Ambient shadow pooled under the car, then the dark contact line where the tyres meet the floor */}
      <div
        aria-hidden="true"
        className={`absolute bottom-[-5%] h-[16%] rounded-[50%] blur-xl ${isDark ? "bg-black/75" : "bg-black/30"}`}
        style={sides}
      />
      <div
        aria-hidden="true"
        className={`absolute bottom-[-1.2%] h-[4%] rounded-[50%] blur-[3px] ${isDark ? "bg-black/90" : "bg-black/45"}`}
        style={{ left: `calc(${sides.left} + 3%)`, right: `calc(${sides.right} + 3%)` }}
      />
      <div className="absolute inset-0 flex items-end justify-center">
        <Image src={src} alt={alt} width={fit.width} height={fit.height} sizes={sizes} className="relative h-auto w-full object-contain object-bottom" style={car} />
      </div>
    </div>
  );
}
