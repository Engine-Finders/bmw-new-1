import Image from "next/image";

/**
 * A scene picture (car already standing on its own floor) with a light and a dark version.
 * Both are rendered and the theme picks one with CSS, so it works in server components; a
 * picture that is the same in both themes is rendered once. `className` positions both.
 */
export default function SceneImage({ art, className = "", sizes, alt = "", priority = false, style }) {
  if (!art?.light?.src) return null;
  const { light } = art;
  const dark = art.dark?.src && art.dark.src !== light.src ? art.dark : null;
  return (
    <>
      <Image
        src={light.src}
        alt={alt}
        width={light.width}
        height={light.height}
        sizes={sizes}
        priority={priority}
        style={style}
        className={`${className} ${dark ? "[[data-theme=dark]_&]:hidden" : ""}`}
      />
      {dark ? (
        <Image
          src={dark.src}
          alt={alt}
          width={dark.width}
          height={dark.height}
          sizes={sizes}
          priority={priority}
          style={style}
          className={`hidden [[data-theme=dark]_&]:block ${className}`}
        />
      ) : null}
    </>
  );
}
