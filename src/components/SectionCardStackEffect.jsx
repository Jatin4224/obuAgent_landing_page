import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function SectionCardStackEffect() {
  useEffect(() => {
    const ctx = gsap.context(() => {
      const sections = gsap.utils.toArray("[data-card-section]");

      sections.forEach((section, index) => {
        const content = section.querySelector("[data-card-content]");

        if (!content) return;

        gsap.set(section, {
          perspective: 1200,
          transformStyle: "preserve-3d",
        });
        gsap.set(content, {
          transformOrigin: "center center",
          transformStyle: "preserve-3d",
          force3D: true,
        });

        if (index >= sections.length - 1) return;

        ScrollTrigger.create({
          trigger: section,
          start: "top top",
          endTrigger: sections[sections.length - 1],
          end: "top top",
          pin: true,
          pinSpacing: false,
          invalidateOnRefresh: true,
        });

        ScrollTrigger.create({
          trigger: sections[index + 1],
          start: "top bottom",
          end: "top top",
          scrub: true,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const progress = self.progress;

            gsap.set(content, {
              opacity: 1 - progress * 0.64,
              yPercent: -16 * progress,
              z: -430 * progress,
              rotationX: 42 * progress,
              scale: 1 - 0.045 * progress,
              filter: `blur(${4 * progress}px)`,
            });
          },
        });
      });

      ScrollTrigger.refresh();
    });

    return () => ctx.revert();
  }, []);

  return null;
}
