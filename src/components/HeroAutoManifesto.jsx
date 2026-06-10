import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const textGroups = [
  "Introducing Obu.",
  "Your workday,\nwithout the extra clicks.",
  "Emails drafted.\nMeetings scheduled.\nFollow-ups remembered.",
  "Gmail and Calendar,\nfinally shaped around you.",
  "Not another inbox.\nNot another calendar.",
  "An agent that understands\nhow you actually work.",
];

export default function HeroAutoManifesto({ rootRef, productIntroRef }) {
  const root = useRef(null);
  const groupRefs = useRef([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(root.current, { autoAlpha: 1 });
      gsap.set(groupRefs.current, {
        y: 100,
        opacity: 0,
        filter: "blur(10px)",
      });

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: rootRef.current,
          start: () => `top+=${window.innerHeight * 2.95} top`,
          end: () => `+=${window.innerHeight * 2.35}`,
          scrub: true,
          invalidateOnRefresh: true,
        },
      });

      timeline.to(productIntroRef, {
        current: 1,
        duration: textGroups.length * 0.9,
        ease: "none",
      }, 0);

      groupRefs.current.forEach((group, index) => {
        const at = index * 0.82;
        timeline
          .to(group, {
            y: 0,
            opacity: 1,
            filter: "blur(0px)",
            duration: 0.42,
            ease: "none",
          }, at)
          .to(group, {
            y: -100,
            opacity: 0,
            filter: "blur(8px)",
            duration: 0.48,
            ease: "none",
          }, at + 0.42);
      });
    }, root);

    return () => {
      ctx.revert();
    };
  }, [rootRef, productIntroRef]);

  return (
    <div
      ref={root}
      className="pointer-events-none absolute inset-0 z-30 flex items-center justify-center px-5 text-center opacity-0"
    >
      {textGroups.map((group, index) => (
        <div
          key={group}
          ref={(node) => {
            groupRefs.current[index] = node;
          }}
          className="absolute mx-auto max-w-[920px] whitespace-pre-line opacity-0"
          style={{
            color: "#FFFFFF",
            fontFamily:
              '"Gilroy Light", "Gilroy Regular", Gilroy, Inter, ui-sans-serif, system-ui, sans-serif',
            fontSize: "clamp(2rem, 5vw, 5rem)",
            fontWeight: 300,
            lineHeight: 1.08,
            letterSpacing: "-0.025em",
            textShadow:
              "0 0 14px rgba(255,255,255,0.72), 0 0 34px rgba(255,244,232,0.46), 0 0 70px rgba(255,186,122,0.28), 0 0 104px rgba(196,181,253,0.24)",
          }}
        >
          {group}
        </div>
      ))}
    </div>
  );
}
