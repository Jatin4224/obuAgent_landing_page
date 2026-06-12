import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function MaskRevealOnHover({
  originalContent,
  maskContent,
  maskSizeSmall = 24,
  maskSizeLarge = 220,
  maskBackground = "rgba(255,255,255,0.96)",
  className = "",
}) {
  const containerRef = useRef(null);
  const maskRef = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    const mask = maskRef.current;
    const content = contentRef.current;

    if (!container || !mask || !content) return undefined;

    gsap.set(mask, {
      "--mask-x": "-120px",
      "--mask-y": "-120px",
      "--mask-size": `${maskSizeSmall}px`,
    });

    const handlePointerMove = (event) => {
      const rect = container.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      gsap.to(mask, {
        "--mask-x": `${x}px`,
        "--mask-y": `${y}px`,
        duration: 0.45,
        ease: "power3.out",
      });
    };

    const handlePointerEnter = () => {
      gsap.to(mask, {
        "--mask-size": `${maskSizeLarge}px`,
        duration: 0.42,
        ease: "power3.out",
      });
    };

    const handlePointerLeave = () => {
      gsap.to(mask, {
        "--mask-size": `${maskSizeSmall}px`,
        duration: 0.28,
        ease: "power2.in",
      });
    };

    container.addEventListener("pointermove", handlePointerMove);
    content.addEventListener("pointerenter", handlePointerEnter);
    content.addEventListener("pointerleave", handlePointerLeave);

    return () => {
      container.removeEventListener("pointermove", handlePointerMove);
      content.removeEventListener("pointerenter", handlePointerEnter);
      content.removeEventListener("pointerleave", handlePointerLeave);
    };
  }, [maskSizeLarge, maskSizeSmall]);

  return (
    <div ref={containerRef} className={`relative overflow-hidden ${className}`}>
      <div ref={contentRef} className="relative z-0 h-full w-full">
        {originalContent}
      </div>
      <div
        ref={maskRef}
        className="pointer-events-none absolute inset-0 z-10 h-full w-full"
        style={{
          background: maskBackground,
          // INVERTED: transparent inside the circle (creates the hole), black outside (keeps the dark overlay)
          maskImage:
            "radial-gradient(circle var(--mask-size) at var(--mask-x) var(--mask-y), transparent 99%, black 100%)",
          WebkitMaskImage:
            "radial-gradient(circle var(--mask-size) at var(--mask-x) var(--mask-y), transparent 99%, black 100%)",
        }}
      >
        {maskContent}
      </div>
    </div>
  );
}
