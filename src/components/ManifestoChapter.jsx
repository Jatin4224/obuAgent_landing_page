import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import BodyRunParticles from "./BodyRunParticles.jsx";

gsap.registerPlugin(ScrollTrigger);

const textGroups = [
  "Introducing Obu.",
  "Your workday,\nwithout the extra clicks.",
  "Emails drafted.\nMeetings scheduled.\nFollow-ups remembered.",
  "Gmail and Calendar,\nfinally shaped around you.",
  "Not another inbox.\nNot another calendar.",
  "An agent that understands\nhow you actually work.",
];

function ChapterCamera() {
  useFrame(({ clock, camera }) => {
    const elapsed = clock.getElapsedTime();
    camera.position.x = Math.sin(elapsed * 0.12) * 0.08;
    camera.position.y = Math.cos(elapsed * 0.1) * 0.05;
    camera.lookAt(0, -0.55, 0);
  });

  return null;
}

export default function ManifestoChapter() {
  const sectionRef = useRef(null);
  const curtainRef = useRef(null);
  const bodyRevealRef = useRef(0);
  const productIntroRef = useRef(0);
  const groupRefs = useRef([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(curtainRef.current, { opacity: 0 });
      gsap.set(groupRefs.current, {
        y: 100,
        opacity: 0,
        filter: "blur(10px)",
      });

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: true,
        },
      });

      timeline
        .to(curtainRef.current, { opacity: 1, duration: 0.9, ease: "none" }, 0)
        .to(bodyRevealRef, { current: 1, duration: 0.9, ease: "none" }, 0.05)
        .to(productIntroRef, {
          current: 1,
          duration: textGroups.length * 0.9,
          ease: "none",
        }, 0.85);

      textGroups.forEach((_, index) => {
        const group = groupRefs.current[index];
        const at = 0.95 + index * 0.82;
        timeline
          .to(group, {
            y: 0,
            opacity: 1,
            filter: "blur(0px)",
            duration: 0.42,
            ease: "power2.out",
          }, at)
          .to(group, {
            y: -100,
            opacity: 0,
            filter: "blur(8px)",
            duration: 0.48,
            ease: "power2.in",
          }, at + 0.42);
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative isolate z-10 h-[460vh] overflow-visible">
      <div className="sticky top-0 h-screen overflow-hidden">
        <div ref={curtainRef} className="absolute inset-0 z-0 bg-black opacity-0" />
        <Canvas
          className="absolute inset-0 z-10 h-full w-full"
          camera={{ position: [0, 0, 8.6], fov: 43, near: 0.1, far: 100 }}
          dpr={[1, 1.75]}
          gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
        >
          <ChapterCamera />
          <BodyRunParticles bodyRevealRef={bodyRevealRef} productIntroRef={productIntroRef} />
        </Canvas>

        <div className="pointer-events-none absolute inset-0 z-[15] bg-[radial-gradient(circle_at_50%_50%,transparent_0%,rgba(0,0,0,0.18)_45%,rgba(0,0,0,0.9)_95%)]" />

        <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center px-5 text-center text-white drop-shadow-[0_0_28px_rgba(196,181,253,0.24)]">
          {textGroups.map((group, index) => (
            <div
              key={group}
              ref={(node) => {
                groupRefs.current[index] = node;
              }}
              className="absolute mx-auto max-w-[920px] whitespace-pre-line opacity-0"
              style={{
                fontSize: "clamp(2rem, 5vw, 5rem)",
                fontWeight: 400,
                lineHeight: 1.05,
                letterSpacing: "-0.04em",
              }}
            >
              {group}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
