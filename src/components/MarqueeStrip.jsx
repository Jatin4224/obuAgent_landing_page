import { useEffect, useRef } from "react";
import gsap from "gsap";

const defaultItems = [
  "Draft replies",
  "Schedule meetings",
  "Approve once",
  "Follow up",
  "Remember everything",
];

/**
 * Kinetic type band. Loops forever; scroll velocity speeds it up and
 * skews it, so it feels physically attached to your scrolling.
 */
export default function MarqueeStrip({ items = defaultItems }) {
  const trackRef = useRef(null);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return undefined;

    const track = trackRef.current;
    const loop = gsap.to(track, {
      xPercent: -50,
      ease: "none",
      duration: 26,
      repeat: -1,
    });

    const setSkew = gsap.quickSetter(track, "skewX", "deg");
    let lastY = window.scrollY;
    let skew = 0;

    const onTick = (time, deltaTime) => {
      const dt = Math.max(deltaTime, 1) / 1000;
      const y = window.scrollY;
      const velocity = (y - lastY) / dt; // px per second
      lastY = y;

      const speed = 1 + Math.min(Math.abs(velocity) / 1100, 3.2);
      loop.timeScale(gsap.utils.interpolate(loop.timeScale(), speed, 0.1));

      const targetSkew = gsap.utils.clamp(-9, 9, velocity / 170);
      skew = gsap.utils.interpolate(skew, targetSkew, 0.12);
      setSkew(skew);
    };

    gsap.ticker.add(onTick);

    return () => {
      gsap.ticker.remove(onTick);
      loop.kill();
    };
  }, []);

  const row = (copyIndex) => (
    <div key={copyIndex} className="flex shrink-0 items-center" aria-hidden={copyIndex === 1}>
      {items.map((item, index) => (
        <span key={`${copyIndex}-${item}`} className="flex items-center">
          <span
            className="whitespace-nowrap px-6 uppercase md:px-9"
            style={{
              fontFamily: '"Outfit", sans-serif',
              fontSize: "clamp(2.4rem, 5vw, 5rem)",
              fontWeight: 200,
              lineHeight: 1.05,
              letterSpacing: "-0.03em",
              ...(index % 2 === 1
                ? {
                    color: "transparent",
                    WebkitTextStroke: "1px rgba(255,255,255,0.34)",
                  }
                : { color: "rgba(255,255,255,0.88)" }),
            }}
          >
            {item}
          </span>
          <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-[#FF6045] shadow-[0_0_14px_rgba(255,96,69,0.8)]" />
        </span>
      ))}
    </div>
  );

  return (
    <section
      className="relative overflow-hidden border-y border-white/[0.06] bg-black py-8 md:py-10"
      aria-label="Draft replies. Schedule meetings. Approve once. Follow up. Remember everything."
    >
      <div ref={trackRef} className="flex w-max will-change-transform">
        {row(0)}
        {row(1)}
      </div>
    </section>
  );
}
