import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const manifestoStartOffset = 2.95;
const manifestoScrollLength = 13.2;

export default function HeroParticleHandoff({
  rootRef,
  handoffRef,
  videoPlayerRef,
  nextSectionRef,
}) {
  const dustRef = useRef(null);
  const veilRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const nextSection = nextSectionRef?.current;
      const videoCard = videoPlayerRef?.current;

      if (!rootRef.current || !handoffRef || !nextSection || !videoCard) {
        return;
      }

      gsap.set(dustRef.current, { autoAlpha: 0, y: 80 });
      gsap.set(veilRef.current, { autoAlpha: 0 });

      gsap.set(nextSection, {
        autoAlpha: 0,
        pointerEvents: "none",
        y: 110,
        filter: "blur(18px)",
      });

      if (reduceMotion) {
        gsap.set(nextSection, {
          autoAlpha: 1,
          pointerEvents: "auto",
          y: 0,
          filter: "blur(0px)",
        });
        return;
      }

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: rootRef.current,
          start: () => `top+=${window.innerHeight * (manifestoStartOffset + manifestoScrollLength - 0.2)} top`,
          end: () => `+=${window.innerHeight * 1.7}`,
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });

      timeline
        .to(handoffRef, {
          current: 1,
          duration: 1,
          ease: "power2.inOut",
        })
        .to(videoCard, {
          opacity: 0,
          filter: "blur(18px)",
          scale: 0.96,
          y: -34,
          duration: 0.75,
          ease: "power2.inOut",
        }, "<")
        .to(dustRef.current, {
          autoAlpha: 1,
          y: 0,
          duration: 0.55,
          ease: "power2.out",
        }, "<")
        .to(veilRef.current, {
          autoAlpha: 1,
          duration: 0.55,
          ease: "power2.inOut",
        }, "-=0.25")
        .set(nextSection, {
          position: "fixed",
          inset: 0,
          zIndex: 50,
          autoAlpha: 1,
          pointerEvents: "auto",
        })
        .fromTo(nextSection, {
          y: 110,
          opacity: 0,
          filter: "blur(18px)",
        }, {
          y: 0,
          opacity: 1,
          filter: "blur(0px)",
          duration: 0.9,
          ease: "power3.out",
        }, "-=0.35")
        .to(veilRef.current, {
          autoAlpha: 0,
          duration: 0.7,
          ease: "power2.out",
        }, "-=0.4")
        .to(dustRef.current, {
          autoAlpha: 0.35,
          y: -60,
          duration: 0.7,
          ease: "power2.out",
        }, "<");
    }, rootRef);

    return () => {
      ctx.revert();
    };
  }, [handoffRef, nextSectionRef, rootRef, videoPlayerRef]);

  return (
    <>
      <div
        ref={dustRef}
        className="pointer-events-none absolute inset-0 z-[35] opacity-0 mix-blend-screen blur-[1px] will-change-[opacity,transform]"
        style={{
          background:
            "radial-gradient(circle at 46% 56%, rgba(255,255,255,0.2), transparent 2px), radial-gradient(circle at 51% 62%, rgba(196,181,253,0.22), transparent 2px), radial-gradient(circle at 55% 58%, rgba(255,255,255,0.16), transparent 1.5px), radial-gradient(circle at 42% 65%, rgba(196,181,253,0.18), transparent 2px), radial-gradient(circle at 58% 70%, rgba(255,255,255,0.12), transparent 2px), radial-gradient(circle at 50% 76%, rgba(196,181,253,0.2), transparent 1.5px)",
          backgroundSize: "120px 120px, 160px 160px, 90px 90px, 140px 140px, 180px 180px, 110px 110px",
          animation: "obu-dust-float 9s ease-in-out infinite alternate",
        }}
      />
      <div
        ref={veilRef}
        className="pointer-events-none fixed inset-0 z-[40] opacity-0 backdrop-blur-md will-change-opacity"
        style={{
          background:
            "linear-gradient(to top, #000 0%, rgba(0,0,0,0.92) 34%, rgba(0,0,0,0.34) 70%, transparent 100%)",
        }}
      />
    </>
  );
}
