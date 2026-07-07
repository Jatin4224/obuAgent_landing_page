import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function FinalCtaSection() {
  const sectionRef = useRef(null);
  const contentRef = useRef(null);
  const actionsRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        contentRef.current,
        { y: 80, opacity: 0, filter: "blur(18px)" },
        {
          y: 0,
          opacity: 1,
          filter: "blur(0px)",
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 72%",
            end: "top 34%",
            scrub: 1,
          },
        },
      );

      gsap.fromTo(
        actionsRef.current,
        { y: 34, opacity: 0, scale: 0.96 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: actionsRef.current,
            start: "top 82%",
            toggleActions: "play none none reverse",
          },
        },
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="start"
      ref={sectionRef}
      className="relative overflow-hidden bg-black px-5 py-20 text-white md:px-10 lg:px-16"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/2 h-[30rem] w-[30rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#FF6045]/[0.045] blur-3xl" />
        <div className="absolute left-1/2 top-1/2 h-[42rem] w-[42rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[0.04]" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-[58vh] max-w-4xl flex-col items-center justify-center text-center">
        <div ref={contentRef}>
          <p className="mb-5 text-xs font-semibold uppercase tracking-[0.48em] text-[#FF6045]/78">
            Ready when you are
          </p>
          <h2
            className="text-[clamp(2.7rem,6vw,6.25rem)] font-light leading-[0.92] tracking-[-0.04em]"
            style={{ fontFamily: '"Outfit", sans-serif' }}
          >
            Enter your command center.
          </h2>
          <p className="mx-auto mt-7 max-w-2xl text-base font-light leading-7 text-white/56 md:text-lg">
            Log in to review drafts, approve schedule changes, and let Obu keep
            the workday moving.
          </p>
        </div>

        <div
          ref={actionsRef}
          className="mt-11 flex flex-col items-center justify-center gap-5 sm:flex-row"
        >
          <a
            href="#login"
            className="group relative flex min-h-[4.5rem] min-w-[15rem] items-center justify-center px-8 py-5 text-center font-mono text-sm font-black uppercase tracking-[-0.04em] text-white transition-transform duration-300 hover:-translate-y-1"
          >
            <span
              className="absolute inset-[-0.75rem] bg-center bg-contain bg-no-repeat transition duration-300 group-hover:brightness-125 group-hover:saturate-150"
              style={{ backgroundImage: 'url("/assets/navbar-button.png")' }}
            />
            <span className="absolute -bottom-1 left-1/2 h-[3px] w-2/3 -translate-x-1/2 scale-x-0 bg-[#FF6045] shadow-[0_0_18px_rgba(255,96,69,0.9)] transition-transform duration-300 group-hover:scale-x-100" />
            <span className="relative z-10 drop-shadow-[0_2px_0_rgba(0,0,0,0.55)]">
              Login
            </span>
          </a>
        </div>

        <div className="mt-7 flex flex-wrap items-center justify-center gap-3 font-mono text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-white/42">
          <span>No sends without approval</span>
          <span className="h-1 w-1 rounded-full bg-white/24" />
          <span>Calendar changes stay visible</span>
          <span className="h-1 w-1 rounded-full bg-white/24" />
          <span>Built for Gmail workflows</span>
        </div>
      </div>
    </section>
  );
}
