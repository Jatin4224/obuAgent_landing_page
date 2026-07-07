import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const MIN_DURATION_MS = 1700;
const MAX_WAIT_MS = 4200;

export default function Preloader({ onComplete }) {
  const rootRef = useRef(null);
  const contentRef = useRef(null);
  const numberRef = useRef(null);
  const barRef = useRef(null);
  const iconRef = useRef(null);
  const panelRef = useRef(null);

  useEffect(() => {
    document.body.style.overflow = "hidden";

    const counter = { value: 0 };
    let finished = false;
    let safetyId = 0;

    const renderCounter = () => {
      const rounded = Math.round(counter.value);
      if (numberRef.current) numberRef.current.textContent = String(rounded).padStart(3, "0");
      if (barRef.current) barRef.current.style.transform = `scaleX(${counter.value / 100})`;
    };

    const ctx = gsap.context(() => {
      gsap.to(iconRef.current, {
        scale: 1.08,
        duration: 0.9,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });

      // Crawl to 92 while assets load; the finish tween closes the gap.
      gsap.to(counter, {
        value: 92,
        duration: 1.6,
        ease: "power2.out",
        onUpdate: renderCounter,
      });
    }, rootRef);

    const finish = () => {
      if (finished) return;
      finished = true;
      window.clearTimeout(safetyId);

      gsap
        .timeline()
        .to(counter, {
          value: 100,
          duration: 0.35,
          ease: "power1.in",
          onUpdate: renderCounter,
        })
        .to(contentRef.current, {
          autoAlpha: 0,
          y: -20,
          duration: 0.4,
          ease: "power2.in",
        })
        .to(
          panelRef.current,
          { scaleY: 1, duration: 0.55, ease: "power4.inOut" },
          "<0.12",
        )
        .to(rootRef.current, {
          yPercent: -100,
          duration: 0.75,
          ease: "power4.inOut",
        })
        .add(() => {
          document.body.style.overflow = "";
          ScrollTrigger.refresh();
          onComplete?.();
        });
    };

    const minDelay = new Promise((resolve) => setTimeout(resolve, MIN_DURATION_MS));
    const pageLoad =
      document.readyState === "complete"
        ? Promise.resolve()
        : new Promise((resolve) => window.addEventListener("load", resolve, { once: true }));
    const fontsReady = document.fonts?.ready ?? Promise.resolve();

    Promise.all([minDelay, pageLoad, fontsReady]).then(finish);
    safetyId = window.setTimeout(finish, MAX_WAIT_MS);

    return () => {
      window.clearTimeout(safetyId);
      document.body.style.overflow = "";
      ctx.revert();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-[500] flex items-center justify-center bg-black"
      aria-hidden="true"
    >
      {/* orange sweep that covers just before the whole loader slides away */}
      <div
        ref={panelRef}
        className="absolute inset-0 origin-bottom scale-y-0 bg-[#FF6045]"
      />

      <div ref={contentRef} className="relative z-10 flex flex-col items-center gap-7">
        <img
          ref={iconRef}
          src="/assets/icon.png"
          alt=""
          className="h-20 w-20 object-contain drop-shadow-[0_0_34px_rgba(255,96,69,0.35)]"
          draggable="false"
        />
        <div className="h-px w-44 overflow-hidden bg-white/[0.12]">
          <div
            ref={barRef}
            className="h-full w-full origin-left scale-x-0 bg-[#FF6045] shadow-[0_0_14px_rgba(255,96,69,0.9)]"
          />
        </div>
        <p className="font-mono text-[0.6rem] font-bold uppercase tracking-[0.44em] text-white/40">
          Waking Obu
        </p>
      </div>

      <span
        ref={numberRef}
        className="absolute bottom-6 right-7 text-[clamp(3.5rem,8vw,7rem)] font-extralight leading-none tracking-tight text-white/25"
        style={{ fontFamily: '"Outfit", sans-serif', fontVariantNumeric: "tabular-nums" }}
      >
        000
      </span>
    </div>
  );
}
