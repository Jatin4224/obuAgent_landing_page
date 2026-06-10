import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import obuVideo from "../assets/obu-working-phone.mp4";

gsap.registerPlugin(ScrollTrigger);

const fadeInDuration = 0.65;
const holdDuration = 4;
const fadeOutDuration = 0.65;
const lineDuration = fadeInDuration + holdDuration + fadeOutDuration;
const manifestoScrollLength = 13.2;
const finalLineStart = lineDuration * 5;

export default function HeroObuVideoFlyIn({ rootRef }) {
  const videoCardRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const isMobile = () => window.innerWidth < 768;

      gsap.set(videoCardRef.current, {
        xPercent: () => (isMobile() ? -50 : 0),
        x: () => window.innerWidth + 120,
        opacity: 0,
        scale: 0.9,
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

      timeline.addLabel("introLine", 0);
      timeline.to(
        videoCardRef.current,
        {
          opacity: 1,
          scale: 1,
          duration: fadeInDuration,
          ease: "none",
        },
        "introLine",
      );
      timeline.to(
        videoCardRef.current,
        {
          x: 0,
          duration: finalLineStart,
          ease: "none",
        },
        "introLine",
      );
    }, videoCardRef);

    return () => {
      ctx.revert();
    };
  }, [rootRef]);

  return (
    <div
      ref={videoCardRef}
      className="pointer-events-none absolute bottom-[6vh] left-1/2 z-[28] h-[160px] w-[260px] overflow-hidden bg-transparent md:bottom-[8vh] md:left-[5vw] md:h-[190px] md:w-[320px]"
    >
      <video
        src={obuVideo}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        className="h-full w-full object-cover"
      />
    </div>
  );
}
