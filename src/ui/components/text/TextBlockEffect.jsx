import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitType from "split-type";

gsap.registerPlugin(ScrollTrigger);

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

export function TextBlock({
  blockColor = "#DDFC3E",
  textColor = "#ededed",
  fontFamily = "'DM Sans', sans-serif",
  className,
  style = {},
  children,
}) {
  return (
    <div
      className={cn(
        "relative z-[2] flex max-w-[900px] items-center justify-center text-center",
        className,
      )}
      data-text-block-wrapper
    >
      <p
        data-text-block
        data-block-color={blockColor}
        className="text-[clamp(2.3rem,6vw,6.8rem)] font-normal leading-[1.08] opacity-0"
        style={{ color: textColor, fontFamily, ...style }}
      >
        {children}
      </p>
    </div>
  );
}

export default function TextBlockEffect({
  children,
  className,
  triggerStart = "top 58%",
}) {
  const containerRef = useRef(null);
  const splitInstancesRef = useRef([]);

  useEffect(() => {
    if (!containerRef.current) return undefined;

    const ctx = gsap.context(() => {
      const texts = containerRef.current.querySelectorAll("[data-text-block]");
      const timelines = [];

      texts.forEach((textEl) => {
        try {
          const split = new SplitType(textEl, {
            types: "lines",
            lineClass: "line",
          });
          splitInstancesRef.current.push(split);

          const color = textEl.dataset.blockColor ?? "#DDFC3E";
          const lineTexts = [];
          const lineBoxes = [];

          split.lines?.forEach((line) => {
            const lineText = document.createElement("div");
            lineText.className = "line-text relative z-[1]";
            lineText.innerHTML = line.innerHTML;

            const lineBox = document.createElement("div");
            lineBox.className = "absolute left-[-1%] top-0 z-[2] h-[102%] w-[102%]";

            line.innerHTML = "";
            line.classList.add("relative", "overflow-hidden");
            line.appendChild(lineText);
            line.appendChild(lineBox);

            gsap.set(textEl, { opacity: 1 });
            gsap.set(lineText, { opacity: 0, yPercent: 12, filter: "blur(8px)" });
            gsap.set(lineBox, {
              scaleX: 0,
              transformOrigin: "left center",
              backgroundColor: color,
            });

            lineTexts.push(lineText);
            lineBoxes.push(lineBox);
          });

          const section = textEl.closest("section") || containerRef.current;
          const duration = 0.34;
          const timeline = gsap.timeline({
            scrollTrigger: {
              trigger: section,
              start: triggerStart,
              toggleActions: "play none none reverse",
            },
          });

          timeline
            .to(lineBoxes, {
              scaleX: 1,
              duration,
              stagger: duration * 0.42,
              ease: "power2.inOut",
            })
            .set(lineTexts, { opacity: 1 })
            .to(
              lineTexts,
              {
                yPercent: 0,
                filter: "blur(0px)",
                duration: 0.28,
                stagger: duration * 0.24,
                ease: "power2.out",
              },
              "<",
            )
            .to(lineBoxes, {
              scaleX: 0,
              transformOrigin: "right center",
              duration,
              stagger: duration * 0.42,
              ease: "power2.inOut",
            });

          timelines.push(timeline);
        } catch (error) {
          console.warn("[TextBlockEffect] SplitType failed:", error);
        }
      });

      ScrollTrigger.refresh();

      return () => {
        timelines.forEach((timeline) => timeline.kill());
      };
    }, containerRef);

    return () => {
      splitInstancesRef.current.forEach((split) => split.revert());
      splitInstancesRef.current = [];
      ctx.revert();
    };
  }, [triggerStart]);

  return (
    <main
      ref={containerRef}
      className={cn(
        "min-h-screen w-full overflow-x-hidden bg-black text-[#ededed]",
        className,
      )}
    >
      {children}
    </main>
  );
}
