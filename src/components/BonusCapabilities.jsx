import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const controls = [
  {
    label: "Review",
    eyebrow: "Human approval",
    title: "Obu prepares. You decide.",
    text: "Drafts, invites, schedule changes, and follow-ups wait for your approval before anything important leaves your workspace.",
    action: "Approve before send",
  },
  {
    label: "Visibility",
    eyebrow: "Clear reasoning",
    title: "See why Obu wants to act.",
    text: "Each suggestion can show the message, calendar context, conflict, or follow-up that caused Obu to recommend the next step.",
    action: "Context stays visible",
  },
  {
    label: "Boundaries",
    eyebrow: "Permission scopes",
    title: "Give Obu only the access it needs.",
    text: "Connect Gmail, Calendar, and workspace tools with clear scopes so automation stays powerful without becoming opaque.",
    action: "Scoped workspace access",
  },
  {
    label: "Undo",
    eyebrow: "Audit trail",
    title: "Every action leaves a receipt.",
    text: "Track what Obu drafted, changed, scheduled, sent, or skipped, so teams can trust the agent without losing accountability.",
    action: "Readable activity history",
  },
  {
    label: "Quiet",
    eyebrow: "Calm defaults",
    title: "Automation that knows when to stop.",
    text: "Obu can summarize, suggest, and prepare in the background, but high-impact decisions stay calm, explicit, and reversible.",
    action: "Assistive, not reckless",
  },
];

export default function BonusCapabilities() {
  const [activeIndex, setActiveIndex] = useState(0);
  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const panelsRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        headerRef.current,
        { y: 70, opacity: 0, filter: "blur(16px)" },
        {
          y: 0,
          opacity: 1,
          filter: "blur(0px)",
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 72%",
            end: "top 38%",
            scrub: 1,
          },
        },
      );

      gsap.fromTo(
        panelsRef.current,
        { y: 80, opacity: 0, scale: 0.97, filter: "blur(16px)" },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          filter: "blur(0px)",
          ease: "power3.out",
          scrollTrigger: {
            trigger: panelsRef.current,
            start: "top 82%",
            end: "top 46%",
            scrub: 1,
          },
        },
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-black px-5 py-28 text-white md:px-10 lg:px-20"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-20 h-px w-[80vw] -translate-x-1/2 bg-gradient-to-r from-transparent via-white/12 to-transparent" />
        <div className="absolute right-[-18rem] top-28 h-[34rem] w-[34rem] rounded-full bg-[#FF6045]/[0.07] blur-3xl" />
        <div className="absolute bottom-[-10rem] left-[-14rem] h-[34rem] w-[34rem] rounded-full bg-violet-500/[0.07] blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl">
        <div ref={headerRef} className="mx-auto max-w-4xl text-center">
          <p className="mb-5 text-xs font-medium uppercase tracking-[0.46em] text-[#FF6045]/75">
            Trust and control
          </p>
          <h2 className="text-[clamp(2.7rem,7vw,7.5rem)] font-light leading-[0.88] tracking-[-0.075em]">
            The agent stays accountable.
          </h2>
          <p className="mx-auto mt-7 max-w-2xl text-base font-light leading-7 text-white/54 md:text-lg">
            Obu can move fast through your workday, but the important moments
            stay visible, reversible, and under your control.
          </p>
        </div>

        <div
          ref={panelsRef}
          className="mt-18 flex min-h-[34rem] flex-col gap-3 md:mt-20 md:h-[35rem] md:flex-row"
        >
          {controls.map((item, index) => {
            const isActive = index === activeIndex;

            return (
              <button
                key={item.title}
                type="button"
                onMouseEnter={() => setActiveIndex(index)}
                onFocus={() => setActiveIndex(index)}
                onClick={() => setActiveIndex(index)}
                className={`group relative overflow-hidden rounded-[2rem] border text-left outline-none transition-[flex,background,border-color,transform] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                  isActive
                    ? "flex-[5] border-[#FF6045]/35 bg-white/[0.07]"
                    : "flex-[1] border-white/10 bg-white/[0.035] hover:border-white/18"
                } min-h-[8rem] shadow-[0_24px_90px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-xl`}
              >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_35%_0%,rgba(255,255,255,0.14),transparent_34%)] opacity-70" />
                <div
                  className={`absolute inset-x-5 top-5 h-px bg-gradient-to-r from-[#FF6045]/70 via-white/20 to-transparent transition-opacity duration-500 ${
                    isActive ? "opacity-100" : "opacity-0"
                  }`}
                />

                <div className="relative flex h-full min-h-[8rem] flex-col p-5 md:p-6">
                  <div className="flex items-center justify-between gap-4">
                    <span className="rounded-full border border-white/10 bg-black/45 px-3 py-1.5 text-[0.62rem] font-medium uppercase tracking-[0.18em] text-white/58">
                      {item.eyebrow}
                    </span>
                    <span className="text-xs text-[#FF6045]/80">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>

                  <div className="mt-auto">
                    <div
                      className={`transition-all duration-700 ${
                        isActive ? "mb-7 opacity-100" : "mb-0 opacity-70 md:[writing-mode:vertical-rl]"
                      }`}
                    >
                      <p className="text-sm font-medium uppercase tracking-[0.18em] text-white/42">
                        {item.label}
                      </p>
                      <h3
                        className={`mt-4 font-light leading-[0.98] tracking-[-0.06em] text-white transition-all duration-700 ${
                          isActive ? "max-w-xl text-[clamp(2rem,4.5vw,4.6rem)]" : "text-2xl md:text-3xl"
                        }`}
                      >
                        {item.title}
                      </h3>
                    </div>

                    <div
                      className={`grid transition-all duration-700 ${
                        isActive ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                      }`}
                    >
                      <div className="overflow-hidden">
                        <p className="max-w-2xl text-base font-light leading-7 text-white/58">
                          {item.text}
                        </p>
                        <div className="mt-8 inline-flex items-center gap-3 rounded-full border border-white/10 bg-black/35 px-4 py-2 text-xs uppercase tracking-[0.18em] text-white/50">
                          <span className="h-2 w-2 rounded-full bg-[#FF6045] shadow-[0_0_16px_rgba(255,96,69,0.75)]" />
                          {item.action}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
