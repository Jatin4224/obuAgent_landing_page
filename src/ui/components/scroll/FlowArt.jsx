import { Children, cloneElement, forwardRef, useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export const FlowSection = forwardRef(function FlowSection(
  { children, className = "", style, ...props },
  ref,
) {
  return (
    <section
      ref={ref}
      className={`absolute inset-0 flex h-screen w-full flex-col overflow-hidden p-[clamp(1.5rem,4vw,4.5rem)] ${className}`}
      style={style}
      {...props}
    >
      {children}
    </section>
  );
});

export default function FlowArt({ children, className = "" }) {
  const rootRef = useRef(null);
  const sectionRefs = useRef([]);
  const sections = Children.toArray(children);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const panels = sectionRefs.current.filter(Boolean);

      if (panels.length < 2) return;

      gsap.set(panels, {
        yPercent: 100,
        rotateX: 18,
        scale: 0.96,
        transformOrigin: "50% 0%",
      });
      gsap.set(panels[0], {
        yPercent: 0,
        rotateX: 0,
        scale: 1,
      });

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top top",
          end: () => `+=${window.innerHeight * (panels.length - 1)}`,
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      panels.slice(1).forEach((panel, index) => {
        const previous = panels[index];
        const at = index;

        timeline
          .to(
            previous,
            {
              yPercent: -34,
              rotateX: -12,
              scale: 0.94,
              opacity: 0.25,
              filter: "blur(8px)",
              ease: "none",
              duration: 1,
            },
            at,
          )
          .to(
            panel,
            {
              yPercent: 0,
              rotateX: 0,
              scale: 1,
              opacity: 1,
              filter: "blur(0px)",
              ease: "none",
              duration: 1,
            },
            at,
          );
      });
    }, rootRef);

    return () => ctx.revert();
  }, [sections.length]);

  return (
    <div
      ref={rootRef}
      className={`relative h-screen overflow-hidden [perspective:1800px] ${className}`}
    >
      {sections.map((child, index) =>
        cloneElement(child, {
          ref: (node) => {
            sectionRefs.current[index] = node;

            const childRef = child.ref;
            if (typeof childRef === "function") childRef(node);
            else if (childRef) childRef.current = node;
          },
        }),
      )}
    </div>
  );
}
