import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const commands = [
  {
    label: "Summarize my inbox",
    status: "Inbox scanned",
    result: "18 important messages, 4 need replies, 2 meetings requested.",
    panels: ["Gmail search", "Priority map", "Daily brief"],
  },
  {
    label: "Schedule Sarah for Thursday",
    status: "Calendar slot found",
    result: "Thursday 2:30 PM is open. Meet link and agenda are ready.",
    panels: ["Availability", "Invite draft", "Meet link"],
  },
  {
    label: "Draft a follow-up to Alex",
    status: "Reply prepared",
    result: "Warm follow-up drafted from the last thread and project context.",
    panels: ["Thread context", "Draft reply", "Approval"],
  },
  {
    label: "Prep me for tomorrow",
    status: "Day planned",
    result: "Meetings, notes, blockers, and follow-ups arranged into one brief.",
    panels: ["Tomorrow", "Meeting prep", "Focus plan"],
  },
];

const activity = [
  "Reading Gmail context",
  "Checking calendar availability",
  "Finding follow-up history",
  "Preparing approval step",
];

function CommandChip({ command, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group flex w-full items-center justify-between rounded-full border px-5 py-4 text-left text-sm transition duration-300 md:text-base ${
        active
          ? "border-[#ff8a3d]/70 bg-[#ff8a3d]/12 text-white shadow-[0_0_36px_rgba(255,138,61,0.18)]"
          : "border-white/10 bg-white/[0.035] text-white/58 hover:border-white/22 hover:bg-white/[0.06] hover:text-white"
      }`}
    >
      <span>{command.label}</span>
      <span
        className={`ml-4 h-2.5 w-2.5 rounded-full transition ${
          active ? "bg-[#ff8a3d]" : "bg-white/18 group-hover:bg-white/45"
        }`}
      />
    </button>
  );
}

function WorkspacePanel({ title, children, className = "" }) {
  return (
    <div
      className={`rounded-[28px] border border-white/10 bg-white/[0.045] p-5 shadow-[0_24px_80px_rgba(0,0,0,0.32)] backdrop-blur-xl ${className}`}
    >
      <div className="mb-5 flex items-center justify-between">
        <p className="text-xs uppercase tracking-[0.28em] text-white/34">{title}</p>
        <span className="h-2 w-2 rounded-full bg-[#ff8a3d] shadow-[0_0_18px_rgba(255,138,61,0.8)]" />
      </div>
      {children}
    </div>
  );
}

export default function CommandCenter() {
  const sectionRef = useRef(null);
  const headingRef = useRef(null);
  const commandRefs = useRef([]);
  const panelRefs = useRef([]);
  const beamRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(1);

  const activeCommand = commands[activeIndex];

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        headingRef.current,
        { y: 90, opacity: 0, filter: "blur(16px)" },
        {
          y: 0,
          opacity: 1,
          filter: "blur(0px)",
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
            end: "top 28%",
            scrub: 1,
            invalidateOnRefresh: true,
          },
        },
      );

      gsap.fromTo(
        commandRefs.current,
        { x: -70, opacity: 0, filter: "blur(10px)" },
        {
          x: 0,
          opacity: 1,
          filter: "blur(0px)",
          stagger: 0.08,
          ease: "power2.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 48%",
            toggleActions: "play none none reverse",
          },
        },
      );

      gsap.fromTo(
        panelRefs.current,
        { y: 80, opacity: 0, rotateX: 10, filter: "blur(14px)" },
        {
          y: 0,
          opacity: 1,
          rotateX: 0,
          filter: "blur(0px)",
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 42%",
            toggleActions: "play none none reverse",
          },
        },
      );

      gsap.to(beamRef.current, {
        backgroundPosition: "220% 50%",
        duration: 2.4,
        repeat: -1,
        ease: "none",
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveIndex((index) => (index + 1) % commands.length);
    }, 3600);

    return () => window.clearInterval(interval);
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-black px-6 py-28 text-white md:px-12 lg:px-20"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(124,58,237,0.22),transparent_34%),radial-gradient(circle_at_85%_45%,rgba(255,138,61,0.12),transparent_28%),linear-gradient(180deg,#000,#05030a_42%,#000)]" />
      <div className="pointer-events-none absolute inset-0 opacity-35 [background-image:radial-gradient(rgba(255,255,255,0.24)_1px,transparent_1px)] [background-size:42px_42px]" />

      <div className="relative z-10 mx-auto max-w-7xl">
        <div ref={headingRef} className="mx-auto max-w-5xl text-center">
          <p className="mb-6 text-xs font-medium uppercase tracking-[0.42em] text-[#ffb28a]/70">
            Obu Command Center
          </p>
          <h2
            className="text-[clamp(3.25rem,8vw,8.5rem)] font-light leading-[0.88] tracking-[-0.055em]"
            style={{ fontFamily: '"Outfit", Inter, ui-sans-serif, system-ui, sans-serif' }}
          >
            Tell Obu once.
            <br />
            Watch work move.
          </h2>
          <p className="mx-auto mt-8 max-w-3xl text-lg leading-8 text-white/54 md:text-2xl md:leading-9">
            One command becomes inbox search, calendar checks, drafted replies, meeting prep, and approval steps.
          </p>
        </div>

        <div className="mt-20 grid gap-6 lg:grid-cols-[0.9fr_1.25fr_0.95fr] lg:items-stretch">
          <div
            ref={(node) => {
              panelRefs.current[0] = node;
            }}
            className="rounded-[32px] border border-white/10 bg-white/[0.035] p-4 backdrop-blur-xl"
          >
            <div className="mb-5 px-2 pt-2">
              <p className="text-xs uppercase tracking-[0.3em] text-white/32">Commands</p>
            </div>
            <div className="space-y-3">
              {commands.map((command, index) => (
                <div
                  key={command.label}
                  ref={(node) => {
                    commandRefs.current[index] = node;
                  }}
                >
                  <CommandChip
                    command={command}
                    active={index === activeIndex}
                    onClick={() => setActiveIndex(index)}
                  />
                </div>
              ))}
            </div>
          </div>

          <div
            ref={(node) => {
              panelRefs.current[1] = node;
            }}
            className="relative min-h-[34rem] overflow-hidden rounded-[36px] border border-white/10 bg-[#050508]/90 p-6 shadow-[0_40px_130px_rgba(0,0,0,0.5)]"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_34%,rgba(124,58,237,0.25),transparent_34%),radial-gradient(circle_at_50%_80%,rgba(255,138,61,0.13),transparent_32%)]" />
            <div className="relative z-10 flex h-full flex-col">
              <div className="flex items-center justify-between border-b border-white/10 pb-5">
                <div>
                  <p className="text-xs uppercase tracking-[0.32em] text-white/32">Live agent</p>
                  <p className="mt-2 text-xl text-white">Obu is working</p>
                </div>
                <div className="rounded-full border border-[#ff8a3d]/40 bg-[#ff8a3d]/10 px-4 py-2 text-sm text-[#ffb28a]">
                  Active
                </div>
              </div>

              <div className="my-8 rounded-[28px] border border-white/10 bg-black/40 p-5">
                <p className="text-sm text-white/38">Current prompt</p>
                <p className="mt-3 text-2xl font-light text-white md:text-3xl">
                  {activeCommand.label}
                </p>
              </div>

              <div ref={beamRef} className="h-px w-full bg-[linear-gradient(90deg,transparent,rgba(196,181,253,0.25),#ff8a3d,rgba(196,181,253,0.25),transparent)] bg-[length:220%_100%]" />

              <div className="mt-8 space-y-4">
                {activity.map((item, index) => (
                  <div key={item} className="flex items-center gap-4">
                    <span
                      className={`flex h-8 w-8 items-center justify-center rounded-full border text-xs ${
                        index <= activeIndex
                          ? "border-[#ff8a3d]/50 bg-[#ff8a3d]/12 text-[#ffb28a]"
                          : "border-white/10 bg-white/[0.03] text-white/30"
                      }`}
                    >
                      {index + 1}
                    </span>
                    <div className="h-px flex-1 bg-white/10" />
                    <p className="w-52 text-right text-sm text-white/58">{item}</p>
                  </div>
                ))}
              </div>

              <div className="mt-auto rounded-[24px] border border-white/10 bg-white/[0.045] p-5">
                <p className="text-xs uppercase tracking-[0.28em] text-white/32">
                  Result
                </p>
                <p className="mt-3 text-lg leading-7 text-white/74">
                  {activeCommand.result}
                </p>
              </div>
            </div>
          </div>

          <div
            ref={(node) => {
              panelRefs.current[2] = node;
            }}
            className="grid gap-4"
          >
            <WorkspacePanel title="Workspace">
              <div className="space-y-3">
                {activeCommand.panels.map((panel) => (
                  <div
                    key={panel}
                    className="flex items-center justify-between rounded-2xl border border-white/8 bg-black/28 px-4 py-3"
                  >
                    <span className="text-white/72">{panel}</span>
                    <span className="text-xs uppercase tracking-[0.2em] text-[#ffb28a]/80">
                      Ready
                    </span>
                  </div>
                ))}
              </div>
            </WorkspacePanel>

            <WorkspacePanel title="Approvals" className="min-h-48">
              <div className="rounded-2xl bg-white/[0.04] p-4">
                <p className="text-sm text-white/42">Waiting on you</p>
                <p className="mt-2 text-xl font-light text-white">Review draft and send</p>
                <button
                  type="button"
                  className="mt-5 rounded-full bg-white px-5 py-3 text-sm font-medium text-black transition hover:bg-[#ff8a3d] hover:text-white"
                >
                  Approve
                </button>
              </div>
            </WorkspacePanel>
          </div>
        </div>
      </div>
    </section>
  );
}
