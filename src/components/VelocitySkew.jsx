import { useEffect, useRef } from "react";
import gsap from "gsap";

/**
 * Skews its children a fraction of a degree with scroll velocity — the
 * classic "content has inertia" feel. Keep the hero OUT of this wrapper:
 * a transform here would interfere with its position:sticky pinning.
 */
export default function VelocitySkew({ children }) {
  const wrapperRef = useRef(null);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return undefined;

    const setSkew = gsap.quickSetter(wrapperRef.current, "skewY", "deg");
    let lastY = window.scrollY;
    let skew = 0;
    let applied = -1;

    const onTick = (time, deltaTime) => {
      const dt = Math.max(deltaTime, 1) / 1000;
      const y = window.scrollY;
      const velocity = (y - lastY) / dt;
      lastY = y;

      const target = gsap.utils.clamp(-1.1, 1.1, velocity / 2600);
      skew = gsap.utils.interpolate(skew, target, 0.1);

      // Skip redundant style writes while idle.
      const rounded = Math.round(skew * 500) / 500;
      if (rounded !== applied) {
        applied = rounded;
        setSkew(rounded);
      }
    };

    gsap.ticker.add(onTick);

    return () => {
      gsap.ticker.remove(onTick);
      setSkew(0);
    };
  }, []);

  return (
    <div ref={wrapperRef} className="will-change-transform">
      {children}
    </div>
  );
}
