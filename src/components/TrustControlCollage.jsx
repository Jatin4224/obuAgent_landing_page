import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import TextBlockEffect, {
  TextBlock,
} from "../ui/components/text/TextBlockEffect";

gsap.registerPlugin(ScrollTrigger);

const letters = [
  { char: "C", bg: "#e8d06c", color: "#1b1309", rotate: "-7deg", y: "0.08em" },
  { char: "O", bg: "#d84c45", color: "#180909", rotate: "4deg", y: "-0.02em" },
  { char: "M", bg: "#252a4d", color: "#f5f0ff", rotate: "-3deg", y: "0.03em" },
  { char: "M", bg: "#f4efe8", color: "#121212", rotate: "3deg", y: "-0.04em" },
  { char: "A", bg: "#d9c14f", color: "#161006", rotate: "-2deg", y: "0.05em" },
  { char: "N", bg: "#b8403f", color: "#160909", rotate: "5deg", y: "-0.01em" },
  { char: "D", bg: "#e8d8d1", color: "#141010", rotate: "-4deg", y: "0.04em" },
];

const services = [
  {
    image: "/assets/control-card01.png",
    rotate: "-12deg",
    hoverRotate: "-6deg",
  },
  {
    image: "/assets/control-card02.png",
    rotate: "16deg",
    hoverRotate: "8deg",
  },
  {
    image: "/assets/control-card03.png",
    rotate: "-10deg",
    hoverRotate: "-4deg",
  },
  {
    image: "/assets/control-card04.png",
    rotate: "2deg",
    hoverRotate: "0deg",
  },
  {
    image: "/assets/control-card05.png",
    rotate: "12deg",
    hoverRotate: "6deg",
  },
];

function RansomHeading() {
  return (
    <h2
      className="flex flex-wrap items-center justify-center gap-2 md:gap-3"
      aria-label="COMMAND"
    >
      {letters.map((letter, index) => (
        <span
          key={`${letter.char}-${index}`}
          className="inline-flex h-[clamp(3.5rem,7vw,6rem)] min-w-[clamp(2.7rem,5.6vw,4.8rem)] items-center justify-center border border-black/25 px-3 font-serif text-[clamp(2.6rem,6.3vw,5.4rem)] font-black leading-none shadow-[0_10px_30px_rgba(0,0,0,0.45)]"
          style={{
            background: letter.bg,
            color: letter.color,
            rotate: letter.rotate,
            translate: `0 ${letter.y}`,
            textShadow: "0 1px 0 rgba(255,255,255,0.2)",
          }}
        >
          {letter.char}
        </span>
      ))}
    </h2>
  );
}

export default function TrustControlCollage() {
  const sectionRef = useRef(null);
  const headingRef = useRef(null);
  const cardRefs = useRef([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Heading Intro Animation
      gsap.fromTo(
        headingRef.current.children,
        { y: 80, opacity: 0, rotate: 0, filter: "blur(10px)" },
        {
          y: 0,
          opacity: 1,
          rotate: (index) => Number.parseFloat(letters[index]?.rotate || 0),
          filter: "blur(0px)",
          stagger: 0.055,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 72%",
            toggleActions: "play none none reverse",
          },
        },
      );

      // 2. Cards Intro Animation
      gsap.fromTo(
        cardRefs.current,
        { y: 90, opacity: 0, scale: 0.9, filter: "blur(14px)" },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          filter: "blur(0px)",
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 50%",
            toggleActions: "play none none reverse",
          },
        },
      );

      // 3. Infinite Idle Floating Animation
      gsap.to(cardRefs.current, {
        y: "+=12",
        rotation: "+=1",
        duration: 3.5,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
        delay: 0.5,
        stagger: {
          each: 0.4,
          from: "random",
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const renderCard = (card, index) => (
    <article
      key={`card-${index}`}
      ref={(node) => {
        cardRefs.current[index] = node;
      }}
      className="group relative aspect-[3/2] w-full max-w-[22rem] overflow-visible p-0 shadow-[0_28px_70px_rgba(0,0,0,0.72)] transition-[translate,scale,box-shadow] duration-500 hover:-translate-y-3 hover:scale-[1.05] hover:shadow-[0_42px_100px_rgba(0,0,0,0.82),0_0_42px_rgba(255,255,255,0.06)]"
      style={{ rotate: card.rotate }}
      onMouseEnter={(event) => {
        event.currentTarget.style.rotate = card.hoverRotate;
        event.currentTarget.style.zIndex = 50;
      }}
      onMouseLeave={(event) => {
        event.currentTarget.style.rotate = card.rotate;
        event.currentTarget.style.zIndex = "auto";
      }}
    >
      <img
        src={card.image}
        alt={`Feature ${index + 1}`}
        className="absolute inset-0 h-full w-full object-cover"
        draggable="false"
      />
    </article>
  );

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen overflow-hidden bg-[#000000] px-5 py-24 text-white md:px-10 lg:px-16 "
    >
      <div
        className="pointer-events-none absolute inset-0 z-0 mt-40 opacity-40 "
        style={{
          backgroundImage: 'url("/assets/image.png")',
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          transform: "rotate(45deg) scale(1) ",
        }}
      />
      {/* Increased max-w from 85rem to 96rem to push everything further out horizontally */}
      <div className="relative z-10 mx-auto max-w-[96rem]">
        {/* 1. FIRST DIV: Top Two Cards */}
        {/* Added extra horizontal padding (lg:px-8 xl:px-12) to control exactly how close to the screen edges they go */}
        <div className="relative z-10 flex w-full flex-col items-center justify-between gap-12 md:flex-row md:items-start lg:px-8 xl:px-12">
          {services.slice(0, 2).map((card, index) => renderCard(card, index))}
        </div>

        {/* 2. SECOND DIV: Center Heading */}
        <div className="relative z-20 mt-12 flex flex-col items-center justify-center md:-mt-[10rem] lg:-mt-[12rem]">
          <p className="mb-4 text-center text-xs font-semibold uppercase tracking-[0.48em] text-[#B07B5F]">
            Trust and control
          </p>

          <TextBlockEffect
            compact
            className="bg-transparent"
            triggerStart="top 68%"
          >
            <section className="flex justify-center">
              <TextBlock
                blockColor="#71A624"
                textColor="#ffffff"
                fontFamily='"Outfit", Inter, ui-sans-serif, system-ui, sans-serif'
                className="max-w-none"
                style={{
                  fontSize: "clamp(2.35rem,5.4vw,5.8rem)",
                  fontWeight: 300,
                  lineHeight: 0.95,
                  letterSpacing: "-0.045em",
                }}
              >
                <div ref={headingRef} className="mt-6">
                  <RansomHeading />
                </div>
              </TextBlock>
            </section>
          </TextBlockEffect>

          <p className="mx-auto mt-8 max-w-lg text-center font-mono text-sm font-bold uppercase leading-relaxed tracking-[-0.04em] text-white/70 md:text-base">
            Obu can move quickly through your inbox and calendar, but every
            important action stays visible, reversible, and approved by you.
          </p>
        </div>

        {/* 3. THIRD DIV: Bottom Three Cards */}
        {/* Increased gap from lg:gap-14 to lg:gap-20 xl:gap-24 to create a much wider spread */}
        <div className="relative z-10 mt-12 flex w-full flex-col items-center justify-center gap-10 md:-mt-8 md:flex-row md:flex-wrap lg:-mt-12 lg:flex-nowrap lg:gap-20 xl:gap-24">
          {services
            .slice(2, 5)
            .map((card, index) => renderCard(card, index + 2))}
        </div>
      </div>
    </section>
  );
}
