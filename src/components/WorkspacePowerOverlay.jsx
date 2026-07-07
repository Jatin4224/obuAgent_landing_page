import { useEffect, useRef, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const icons = [
  {
    id: "linkedin",
    label: "LinkedIn",
    side: "left",
    x: 8,
    top: "20%",
    src: "/assets/linkdin.png",
    fallback: "in",
    text: "obu, post on linkedin",
  },
  {
    id: "gmail",
    label: "Gmail",
    side: "left",
    x: 14,
    top: "46%",
    src: "/assets/gmail.png",
    fallback: "M",
    text: "obu, send the mail",
  },
  {
    id: "slack",
    label: "Slack",
    side: "left",
    x: 6,
    top: "75%",
    src: "/assets/slack.png",
    fallback: "#",
    text: "obu, ping the team",
  },
  {
    id: "calendar",
    label: "Calendar",
    side: "right",
    x: 8,
    top: "18%",
    src: "/assets/calendar.png",
    fallback: "31",
    text: "obu, schedule the meet",
  },
  {
    id: "drive",
    label: "Drive",
    side: "right",
    x: 14,
    top: "47%",
    src: "/assets/drive.png",
    fallback: "D",
    text: "obu, pull the doc",
  },
  {
    id: "notion",
    label: "Notion",
    side: "right",
    x: 6,
    top: "76%",
    src: "/assets/notion.png",
    fallback: "N",
    text: "obu, log the notes",
  },
];

const activationOrder = [
  "gmail",
  "calendar",
  "slack",
  "notion",
  "linkedin",
  "drive",
];

function buildPath(orbEl, svgEl) {
  const svgRect = svgEl.getBoundingClientRect();
  const orbRect = orbEl.getBoundingClientRect();

  const ox = orbRect.left + orbRect.width / 2 - svgRect.left;
  const oy = orbRect.top + orbRect.height / 2 - svgRect.top;
  const fx = svgRect.width / 2;
  const fy = svgRect.height / 2;

  const cx = ox + (fx - ox) * 0.55;
  const cy = oy;
  const cx2 = fx + (ox - fx) * 0.15;
  const cy2 = fy + (oy - fy) * 0.35;

  return {
    d: `M ${ox} ${oy} C ${cx} ${cy}, ${cx2} ${cy2}, ${fx} ${fy}`,
  };
}

export default function WorkspacePowerOverlay({
  rootRef,
  wakeProgressRef,
  pullBackRef,
  bodyRevealRef,
}) {
  const overlayRef = useRef(null);
  const svgRef = useRef(null);
  const pathRefs = useRef({});
  const textGroupRefs = useRef({}); // Ref to control the visibility of the entire stream
  const textPathRefs = useRef({}); // Ref to animate the looping movement
  const orbRefs = useRef({});

  const rebuildPaths = useCallback(() => {
    const svg = svgRef.current;
    if (!svg) return;

    activationOrder.forEach((id) => {
      const orb = orbRefs.current[id];
      const path = pathRefs.current[id];
      if (!orb || !path) return;

      const { d } = buildPath(orb, svg);
      path.setAttribute("d", d);
    });
  }, []);

  useEffect(() => {
    let ctx;
    let onResize;
    const frameId = requestAnimationFrame(() => {
      rebuildPaths();

      ctx = gsap.context(() => {
        gsap.set(overlayRef.current, { opacity: 1 });

        activationOrder.forEach((id) => {
          const textGroup = textGroupRefs.current[id];
          const textPath = textPathRefs.current[id];
          const orb = orbRefs.current[id];
          if (!textGroup || !textPath || !orb) return;

          // Elements start hidden and locked until scroll triggers their activation zone
          gsap.set(textGroup, { opacity: 0 });
          gsap.set(textPath, { attr: { startOffset: "0%" }, opacity: 0 });
          gsap.set(orb, {
            opacity: 0.08,
            scale: 0.85,
            filter: "grayscale(1) blur(2px)",
          });
        });

        // 1. REPEATED LOOP ENGINE: Runs completely independent of the scrollbar position
        activationOrder.forEach((id, index) => {
          const textPath = textPathRefs.current[id];
          if (!textPath) return;

          gsap
            .timeline({
              repeat: -1, // Loops infinitely
              repeatDelay: 0.4, // Small pause before the word spawns again
              delay: index * 0.35, // Staggers initial spawn cascade for a natural stream look
            })
            .fromTo(
              textPath,
              { attr: { startOffset: "0%" }, opacity: 0 },
              {
                opacity: 1,
                attr: { startOffset: "15%" },
                duration: 0.6,
                ease: "none",
              },
            )
            .to(textPath, {
              attr: { startOffset: "80%" },
              duration: 1.8,
              ease: "none",
            })
            .to(textPath, {
              opacity: 0,
              attr: { startOffset: "100%" },
              duration: 0.6,
              ease: "none",
            });
        });

        // 2. SCROLL REVEAL TIMELINE: Handles activation thresholds on scroll
        const timeline = gsap.timeline({
          scrollTrigger: {
          trigger: rootRef.current,
          start: "top top",
          end: () => `+=${window.innerHeight * 2.8}`,
          scrub: 0.5,
          },
        });

        activationOrder.forEach((id, index) => {
          const textGroup = textGroupRefs.current[id];
          const orb = orbRefs.current[id];
          if (!textGroup || !orb) return;

          const at = 0.85 + index * 0.42;

          timeline
            // Fades the text group container into visibility as you scroll past
            .to(textGroup, { opacity: 1, duration: 0.3, ease: "none" }, at)
            .to(
              orb,
              {
                opacity: 1,
                scale: 1,
                filter: "grayscale(0) blur(0px)",
                boxShadow:
                  "0 0 34px rgba(181,160,255,0.48), inset 0 0 24px rgba(255,255,255,0.08)",
                borderColor: "rgba(196,181,253,0.72)",
                duration: 0.3,
                ease: "none",
              },
              at,
            )
            // Fades the streams down slightly later in the page flow to avoid visual clutter
            .to(
              textGroup,
              { opacity: 0.4, duration: 0.3, ease: "none" },
              at + 0.6,
            );
        });

        const wakeStart = 0.85 + activationOrder.length * 0.42 + 0.18;
        const activationCompleteAt = wakeStart + 0.95;
        const pullBackStart = activationCompleteAt + 0.5;

        timeline.to(
          wakeProgressRef,
          { current: 1, duration: 0.95, ease: "none" },
          wakeStart,
        );

        const orbNodes = Object.values(orbRefs.current).filter(Boolean);
        timeline.to(
          orbNodes,
          {
            scale: 1.035,
            duration: 0.32,
            stagger: 0.04,
            yoyo: true,
            repeat: 1,
            ease: "none",
          },
          ">-0.1",
        );

        timeline
          .to(
            pullBackRef,
            { current: 1, duration: 1.15, ease: "none" },
            pullBackStart,
          )
          .to(
            bodyRevealRef,
            { current: 1, duration: 1.05, ease: "none" },
            pullBackStart + 0.1,
          )
          .to(
            overlayRef.current,
            { opacity: 0.2, duration: 0.85, ease: "none" },
            pullBackStart + 0.18,
          );
      }, overlayRef);

      onResize = () => {
        rebuildPaths();
        ScrollTrigger.refresh();
      };
      window.addEventListener("resize", onResize);
    });

    return () => {
      cancelAnimationFrame(frameId);
      if (ctx) ctx.revert();
      if (onResize) window.removeEventListener("resize", onResize);
    };
  }, [rootRef, wakeProgressRef, pullBackRef, bodyRevealRef, rebuildPaths]);

  return (
    <div ref={overlayRef} className="pointer-events-none absolute inset-0 z-20">
      <svg
        ref={svgRef}
        className="absolute inset-0 h-full w-full"
        style={{ overflow: "visible" }}
        aria-hidden="true"
      >
        <defs>
          <filter id="textGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {icons.map((icon) => (
          <g key={icon.id}>
            {/* Invisible trajectory rail track */}
            <path
              id={`track-${icon.id}`}
              ref={(node) => {
                if (node) pathRefs.current[icon.id] = node;
              }}
              d=""
              fill="none"
              stroke="transparent"
              strokeWidth="0"
            />

            {/* Floating typography stream */}
            <text
              ref={(node) => {
                if (node) textGroupRefs.current[icon.id] = node;
              }}
              fill="rgba(196, 181, 253, 0.9)"
              fontSize="10px"
              fontWeight="600"
              letterSpacing="1.5px"
              filter="url(#textGlow)"
              style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}
            >
              <textPath
                ref={(node) => {
                  if (node) textPathRefs.current[icon.id] = node;
                }}
                href={`#track-${icon.id}`}
                startOffset="0%"
                side={icon.side === "right" ? "right" : "left"}
              >
                {icon.text}
              </textPath>
            </text>
          </g>
        ))}
      </svg>

      {icons.map((icon) => (
        <div
          key={icon.id}
          ref={(node) => {
            if (node) orbRefs.current[icon.id] = node;
          }}
          data-active-orb
          className="pointer-events-auto absolute flex h-20 w-20 -translate-y-1/2 transform-gpu items-center justify-center rounded-full border border-white/10 bg-black/45 backdrop-blur-xl transition duration-300 hover:scale-105 hover:border-[#c4b5fd]/80 hover:shadow-[0_0_38px_rgba(196,181,253,0.42)] sm:h-24 sm:w-24"
          style={{
            top: icon.top,
            [icon.side === "left" ? "left" : "right"]: `${icon.x}%`,
            willChange: "transform, opacity, box-shadow",
          }}
          aria-label={icon.label}
        >
          <img
            src={icon.src}
            alt=""
            className="h-9 w-9 object-contain sm:h-11 sm:w-11"
            onError={(e) => {
              e.currentTarget.style.display = "none";
              if (e.currentTarget.nextElementSibling) {
                e.currentTarget.nextElementSibling.style.display = "block";
              }
            }}
          />
          <span className="hidden text-xl font-bold text-white/90">
            {icon.fallback}
          </span>
        </div>
      ))}
    </div>
  );
}
