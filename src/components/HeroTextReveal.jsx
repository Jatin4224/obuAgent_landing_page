import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function HeroTextReveal({ rootRef, className = "" }) {
  const root = useRef(null);
  const contentRef = useRef(null);
  const introRef = useRef(null);
  const wordRef = useRef(null);
  const sweepRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Initial States
      gsap.set(root.current, { autoAlpha: 1 });
      gsap.set(contentRef.current, { y: 0 });
      gsap.set(introRef.current, { autoAlpha: 0, y: 15, filter: "blur(10px)" });
      gsap.set(wordRef.current, {
        autoAlpha: 0,
        scale: 0.98,
        filter: "blur(15px)",
      });
      gsap.set(sweepRef.current, { xPercent: -140, opacity: 0 });

      // Scroll-driven Reveal Timeline
      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 1,
        },
      });

      const activationReady = 4.65;

      timeline
        // Reveal upper tracking line
        .to(
          introRef.current,
          {
            autoAlpha: 0.6,
            y: 0,
            filter: "blur(0px)",
            duration: 0.8,
            ease: "power3.out",
          },
          activationReady,
        )
        // Reveal main grouped text
        .to(
          wordRef.current,
          {
            autoAlpha: 1,
            scale: 1,
            filter: "blur(0px)",
            duration: 1.2,
            ease: "power3.out",
          },
          activationReady + 0.3,
        )
        // Elegant light shine sweep across the brand name
        .to(
          sweepRef.current,
          {
            xPercent: 140,
            opacity: 0.25,
            duration: 0.8,
            ease: "sine.inOut",
          },
          activationReady + 0.9,
        )
        .to(
          sweepRef.current,
          {
            opacity: 0,
            duration: 0.2,
            ease: "sine.out",
          },
          activationReady + 1.6,
        );
    }, root);

    return () => ctx.revert();
  }, [rootRef]);

  return (
    <div
      ref={root}
      className={`pointer-events-none absolute bottom-0 left-0 w-full z-30 flex flex-col items-center justify-end pb-8 sm:pb-14 opacity-0 ${className}`}
    >
      <div
        ref={contentRef}
        className="relative flex w-full flex-col items-center px-5 text-center"
      >
        {/* Upper Kicker Line Statement (Pushed downside via translate-y-2) */}
        <div
          ref={introRef}
          className="mb-1 translate-y-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-400 opacity-80 sm:text-xs"
        >
          THE AI EXECUTIVE ASSISTANT FOR WORKSPACES.
        </div>

        {/* Text Container Layout Bounds */}
        <div className="relative flex h-[50px] w-full max-w-[700px] items-center justify-center overflow-visible sm:h-[85px]">
          {/* Main One-Liner Typography Group */}
          <div
            ref={wordRef}
            className="relative text-4xl sm:text-6xl font-normal tracking-tight text-zinc-100 font-sans"
            style={{
              fontFamily:
                'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            }}
          >
            Introducing{" "}
            {/* Tilted dynamically outwards/rightwards using inline-block + custom skew */}
            <span
              className="font-serif italic inline-block -skew-x-6 bg-gradient-to-r from-indigo-200 via-zinc-100 to-amber-200 text-transparent bg-clip-text"
              style={{
                fontFamily: 'Georgia, Cambria, "Times New Roman", Times, serif',
              }}
            >
              OBU.
            </span>
            {/* Reflective light sheen element overlay (Skew enhanced to match new angle) */}
            <span
              ref={sweepRef}
              className="absolute inset-y-0 right-0 w-1/4 -skew-x-24 bg-white/20 blur-xl"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
