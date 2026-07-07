import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import HeroHighlightedText from "./HeroHighlightedText.jsx";

gsap.registerPlugin(ScrollTrigger);

const textGroups = [
  "Introducing Obu.",
  "Your workday,\nwithout the extra clicks.",
  "Emails drafted.\nMeetings scheduled.\nFollow-ups remembered.",
  "Gmail and Calendar,\nfinally shaped around you.",
  "Not another inbox.\nNot another calendar.",
  "An agent that understands\nhow you actually work.",
];

const fadeInDuration = 0.65;
const holdDuration = 2.1;
const fadeOutDuration = 0.65;
const lineDuration = fadeInDuration + holdDuration + fadeOutDuration;
const manifestoScrollLength = 7.5;

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
        color: "rgba(255,255,255,0.18)",
        textShadow: "0 0 0 rgba(255,255,255,0)",
      });

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: rootRef.current,
          start: () => `top+=${window.innerHeight * 2.95} top`,
          end: () => `+=${window.innerHeight * manifestoScrollLength}`,
          scrub: true,
          invalidateOnRefresh: true,
        },
      });

      timeline.to(
        productIntroRef,
        {
          current: 1,
          duration: textGroups.length * lineDuration,
          ease: "none",
        },
        0,
      );

      groupRefs.current.forEach((group, index) => {
        const at = index * lineDuration;
        timeline
          .to(
            group,
            {
              y: 0,
              opacity: 1,
              filter: "blur(0px)",
              color: "rgba(255,255,255,0.96)",
              textShadow:
                "0 0 18px rgba(255,255,255,0.68), 0 0 42px rgba(196,181,253,0.28)",
              duration: fadeInDuration,
              ease: "none",
              overwrite: "auto",
            },
            at,
          )
          .to(
            group,
            {
              y: 0,
              opacity: 1,
              filter: "blur(0px)",
              color: "rgba(255,255,255,0.96)",
              textShadow:
                "0 0 18px rgba(255,255,255,0.68), 0 0 42px rgba(196,181,253,0.28)",
              duration: holdDuration,
              ease: "none",
              overwrite: "auto",
            },
            at + fadeInDuration,
          )
          .to(
            group,
            {
              y: -100,
              opacity: 0,
              filter: "blur(8px)",
              color: "rgba(255,255,255,0.12)",
              textShadow: "0 0 0 rgba(255,255,255,0)",
              duration: fadeOutDuration,
              ease: "none",
              overwrite: "auto",
            },
            at + fadeInDuration + holdDuration,
          );
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
          className="absolute mx-auto max-w-[760px] whitespace-pre-line opacity-0"
          style={{
            color: "rgba(255,255,255,0.52)",
            fontFamily:
              '"Outfit", Inter, ui-sans-serif, system-ui, sans-serif',
            fontSize: "clamp(1.8rem, 4.2vw, 4rem)",
            fontWeight: 300,
            lineHeight: 1.08,
            letterSpacing: "-0.025em",
            textShadow:
              "0 0 18px rgba(255,255,255,0.22), 0 0 56px rgba(196,181,253,0.16)",
          }}
        >
          <HeroHighlightedText>{group}</HeroHighlightedText>
        </div>
      ))}
    </div>
  );
}
