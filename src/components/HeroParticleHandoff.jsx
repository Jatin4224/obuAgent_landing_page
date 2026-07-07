import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Keep in sync with HeroAutoManifesto / HeroObuVideoFlyIn. The handoff must
// finish before the sticky hero releases (section height − one viewport),
// otherwise the fade-out never plays and the hero cuts off abruptly.
const manifestoStartOffset = 2.95;
const manifestoScrollLength = 7.5;

export default function HeroParticleHandoff({
  rootRef,
  handoffRef,
  videoPlayerRef,
  nextSectionRef,
}) {
  useEffect(() => {
    const ctx = gsap.context(() => {
      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const videoCard = videoPlayerRef?.current;
      const nextSection = nextSectionRef?.current;
      const stickyHero = rootRef.current?.firstElementChild;

      if (!rootRef.current || !handoffRef || !videoCard || !stickyHero) {
        return;
      }

      gsap.set(stickyHero, { autoAlpha: 1, filter: "blur(0px)" });
      gsap.set(nextSection, { clearProps: "all" });

      if (reduceMotion) {
        gsap.set(stickyHero, { autoAlpha: 0 });
        gsap.set(nextSection, { clearProps: "all" });
        return;
      }

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: rootRef.current,
          start: () => `top+=${window.innerHeight * (manifestoStartOffset + manifestoScrollLength + 0.45)} top`,
          end: () => `+=${window.innerHeight * 1.0}`,
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
        .to(stickyHero, {
          autoAlpha: 0,
          filter: "blur(10px)",
          duration: 0.6,
          ease: "power2.out",
        }, 0.62);
    }, rootRef);

    return () => {
      ctx.revert();
    };
  }, [handoffRef, nextSectionRef, rootRef, videoPlayerRef]);

  return null;
}
