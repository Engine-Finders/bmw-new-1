import Image from "next/image";

// Close crop of a car's kidney grille and headlights, faded into the section on the left and
// bottom (section headers in the reference: black car on dark, white car on light).
export default function GrilleImage({ src, className, innerClassName = "inset-0", position = "object-cover object-[50%_62%]", fadeStart = "55%" }) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute overflow-hidden [mask-composite:intersect] ${className}`}
      style={{
        maskImage: `linear-gradient(90deg,transparent 0%,black 30%),linear-gradient(180deg,black ${fadeStart},transparent 100%)`,
        WebkitMaskImage: `linear-gradient(90deg,transparent 0%,black 30%),linear-gradient(180deg,black ${fadeStart},transparent 100%)`,
        WebkitMaskComposite: "source-in",
      }}
    >
      <div className={`absolute ${innerClassName}`}>
        <Image src={src} alt="" fill sizes="60vw" className={position} />
      </div>
    </div>
  );
}
