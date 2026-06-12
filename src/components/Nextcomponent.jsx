import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Make sure your paths match your project structure!
import obuVideo from "../../src/assets/step1.mp4";
import obuVideo2 from "../../src/assets/step2.mp4";
import obuVideo3 from "../../src/assets/step3.mp4";
import TextBlockEffect, {
  TextBlock,
} from "../ui/components/text/TextBlockEffect.jsx";

gsap.registerPlugin(ScrollTrigger);

const steps = [
  {
    number: "01",
    title: "Describe what you need",
    body: 'No need to wonder what to ask. Tell Obu what you want, like "reschedule Sarah" or "draft a follow-up." Obu understands the context and starts preparing in seconds.',
    prompt: "Schedule Sarah for Thursday",
    color: "from-[#e25785] via-[#f6c9d7] to-[#f33c68]",
    video: obuVideo,
    videoSide: "right",
  },
  {
    number: "02",
    title: "Tweak it. Ask for suggestions, just talk to it",
    body: "Obu reads the context and lets you refine the plan conversationally. Make it shorter, warmer, later, clearer, or more detailed.",
    prompt: "Make the reply warmer",
    color: "from-[#6658f0] via-[#eadfff] to-[#f2c9df]",
    video: obuVideo2,
    videoSide: "left",
  },
  {
    number: "03",
    title: "Approve and let Obu handle the clicks",
    body: "Review the final draft, meeting, or follow-up once. When it looks right, approve it and Obu sends, schedules, updates, and remembers.",
    prompt: "Approve and send",
    color: "from-[#f0754e] via-[#ffd9c8] to-[#f25e87]",
    video: obuVideo3,
    videoSide: "right",
  },
];

function StepCard({
  step,
  index,
  setRowRef,
  setTextRef,
  setVisualRef,
  setBadgeRef,
  setPromptRef,
}) {
  const videoLeft = step.videoSide === "left";

  return (
    <section
      ref={(node) => setRowRef(node, index)}
      className="relative flex min-h-screen items-center justify-center overflow-hidden border-b border-white/8 px-8 py-16 md:px-16 lg:px-24 xl:px-32"
    >
      <div
        className={`grid w-full grid-cols-1 items-center gap-12 md:gap-10 ${
          videoLeft ? "md:grid-cols-[66%_34%]" : "md:grid-cols-[34%_66%]"
        }`}
      >
        <div
          ref={(node) => setTextRef(node, index)}
          className={`relative z-10 flex w-full max-w-[31rem] flex-col justify-center ${
            videoLeft ? "md:order-2 md:mr-auto" : "md:ml-auto"
          }`}
        >
          <h2
            className="max-w-[31rem] text-white"
            style={{
              fontFamily: '"Outfit", sans-serif',
              fontSize: "clamp(3rem, 5vw, 5.8rem)",
              fontWeight: 300,
              lineHeight: 0.92,
              letterSpacing: "-0.02em",
            }}
          >
            {step.title}
          </h2>
          <p className="mt-10 max-w-[25rem] text-lg leading-7 text-white/58 md:text-xl md:leading-8">
            {step.body}
          </p>
        </div>

        <div
          className={`relative flex min-h-[58vh] items-center justify-center md:min-h-[78vh] ${
            videoLeft ? "md:order-1" : ""
          }`}
        >
          <div
            ref={(node) => setVisualRef(node, index)}
            className={`relative aspect-video w-full max-w-[56rem] will-change-[transform,opacity,filter]`}
          >
            <video
              src={step.video}
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              className="h-full w-full object-cover mix-blend-screen"
            />
            <div className="pointer-events-none absolute bottom-13 right-15 flex h-14 w-14 items-center justify-center rounded-full bg-grey-800 text-2xl text-white backdrop-blur-md">
              ||
            </div>
          </div>

          <div className="pointer-events-none absolute left-1/2 top-1/2 z-20 aspect-video w-full max-w-[56rem] -translate-x-1/2 -translate-y-1/2">
            <div
              ref={(node) => setBadgeRef(node, index)}
              className={`absolute top-1/2 flex h-16 w-28 items-center justify-center rounded-full bg-[#ff6045] text-3xl font-light text-white md:h-20 md:w-36 md:text-4xl ${
                videoLeft ? "right-0" : "left-0"
              }`}
            >
              {step.number}
            </div>

            <div
              ref={(node) => setPromptRef(node, index)}
              className="absolute left-1/2 top-1/2 flex h-12 w-[70%] max-w-[34rem] items-center rounded-full bg-white px-7 text-black backdrop-blur-md"
            >
              <span className="truncate text-sm text-black/60 md:text-base">
                {step.prompt}
              </span>
              <span className="ml-auto flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#ff6045] text-white">
                ?
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const Nextcomponent = forwardRef(function Nextcomponent(_, ref) {
  const sectionRef = useRef(null);
  const introCardRef = useRef(null);

  // Notice we removed introRef because the TextBlock component handles its own animations
  const rowRefs = useRef([]);
  const textRefs = useRef([]);
  const visualRefs = useRef([]);
  const badgeRefs = useRef([]);
  const promptRefs = useRef([]);

  useImperativeHandle(ref, () => sectionRef.current);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (introCardRef.current) {
        gsap.set(introCardRef.current.parentElement, {
          perspective: 1200,
          transformStyle: "preserve-3d",
        });

        gsap.fromTo(
          introCardRef.current,
          {
            opacity: 0,
            yPercent: 18,
            z: -430,
            rotationX: 42,
            scale: 0.955,
            filter: "blur(12px)",
            transformOrigin: "center center",
            transformStyle: "preserve-3d",
          },
          {
            opacity: 1,
            yPercent: 0,
            z: 0,
            rotationX: 0,
            scale: 1,
            filter: "blur(0px)",
            ease: "none",
            scrollTrigger: {
              trigger: introCardRef.current.parentElement,
              start: "top 86%",
              end: "center center",
              scrub: 1,
              invalidateOnRefresh: true,
            },
          },
        );
      }

      rowRefs.current.forEach((row, index) => {
        const videoLeft = steps[index].videoSide === "left";
        const textDirection = videoLeft ? 1 : -1;
        const visualDirection = videoLeft ? -1 : 1;

        const badgeXPercent = videoLeft ? 50 : -50;

        const text = textRefs.current[index];
        const visual = visualRefs.current[index];
        const badge = badgeRefs.current[index];
        const prompt = promptRefs.current[index];

        gsap.fromTo(
          text,
          {
            x: textDirection * 160,
            y: 96,
            rotate: textDirection * -9,
            opacity: 0,
            filter: "blur(12px)",
          },
          {
            x: 0,
            y: 0,
            rotate: 0,
            opacity: 1,
            filter: "blur(0px)",
            ease: "none",
            scrollTrigger: {
              trigger: row,
              start: "top 78%",
              end: "center center",
              scrub: 1,
              invalidateOnRefresh: true,
            },
          },
        );

        gsap.fromTo(
          visual,
          {
            x: visualDirection * 190,
            y: -112,
            scale: 0.92,
            opacity: 0.72,
            rotate: visualDirection * -8,
          },
          {
            x: 0,
            y: 0,
            scale: 1,
            opacity: 1,
            rotate: 0,
            ease: "none",
            scrollTrigger: {
              trigger: row,
              start: "top 82%",
              end: "center center",
              scrub: 1,
              invalidateOnRefresh: true,
            },
          },
        );

        gsap.fromTo(
          badge,
          {
            x: visualDirection * 90,
            y: -46,
            xPercent: badgeXPercent,
            yPercent: -50,
            rotate: visualDirection * -4,
            opacity: 0,
            filter: "blur(10px)",
          },
          {
            x: 0,
            y: 0,
            xPercent: badgeXPercent,
            yPercent: -50,
            rotate: 0,
            opacity: 1,
            filter: "blur(0px)",
            ease: "none",
            scrollTrigger: {
              trigger: row,
              start: "top 72%",
              end: "center center",
              scrub: 1,
              invalidateOnRefresh: true,
            },
          },
        );

        gsap.fromTo(
          prompt,
          {
            x: visualDirection * 90,
            y: -46,
            xPercent: -50,
            yPercent: -50,
            rotate: visualDirection * -4,
            opacity: 0,
            filter: "blur(10px)",
          },
          {
            x: 0,
            y: 0,
            xPercent: -50,
            yPercent: -50,
            rotate: 0,
            opacity: 1,
            filter: "blur(0px)",
            ease: "none",
            scrollTrigger: {
              trigger: row,
              start: "top 72%",
              end: "center center",
              scrub: 1,
              invalidateOnRefresh: true,
            },
          },
        );

        gsap.to(visual, {
          y: -42,
          ease: "none",
          scrollTrigger: {
            trigger: row,
            start: "center center",
            end: "bottom top",
            scrub: 1,
            invalidateOnRefresh: true,
          },
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen bg-black text-white"
    >
      <div className="relative z-10">
        {/* NEW INTRO: Centered, Short, with TextBlock Effect */}
        <TextBlockEffect>
          <section className="relative flex min-h-screen w-full items-center justify-center overflow-hidden px-8">
            <div
              ref={introCardRef}
              className="max-w-4xl text-center text-4xl md:text-6xl lg:text-7xl"
            >
              <TextBlock
                blockColor="#ff6045"
                textColor="#ffffff"
                fontFamily='"Outfit", sans-serif'
              >
                One prompt. One click. Obu handles the rest.
              </TextBlock>
            </div>
          </section>
        </TextBlockEffect>

        {/* STEP CARDS */}
        {steps.map((step, index) => (
          <StepCard
            key={step.number}
            step={step}
            index={index}
            setRowRef={(node, refIndex) => {
              if (node) rowRefs.current[refIndex] = node;
            }}
            setTextRef={(node, refIndex) => {
              if (node) textRefs.current[refIndex] = node;
            }}
            setVisualRef={(node, refIndex) => {
              if (node) visualRefs.current[refIndex] = node;
            }}
            setBadgeRef={(node, refIndex) => {
              if (node) badgeRefs.current[refIndex] = node;
            }}
            setPromptRef={(node, refIndex) => {
              if (node) promptRefs.current[refIndex] = node;
            }}
          />
        ))}
      </div>
    </section>
  );
});

export default Nextcomponent;
