import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
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
          className="inline-flex h-[clamp(3rem,5.8vw,5rem)] min-w-[clamp(2.35rem,4.8vw,4rem)] items-center justify-center border border-black/25 px-3 font-serif text-[clamp(2.2rem,5.2vw,4.45rem)] font-black leading-none shadow-[0_10px_30px_rgba(0,0,0,0.45)]"
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

      gsap.fromTo(
        cardRefs.current,
        { y: 72, opacity: 0, scale: 0.94, filter: "blur(12px)" },
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

      gsap.to(cardRefs.current, {
        y: "+=7",
        rotation: "+=0.45",
        duration: 4.8,
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
      className="group relative aspect-[3/2] w-full max-w-[18.5rem] overflow-visible p-0 shadow-[0_28px_70px_rgba(0,0,0,0.68)] transition-[translate,scale,box-shadow] duration-500 hover:-translate-y-2 hover:scale-[1.035] hover:shadow-[0_40px_90px_rgba(0,0,0,0.8),0_0_36px_rgba(255,255,255,0.05)] md:max-w-[19.5rem]"
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
      id="control"
      ref={sectionRef}
      className="relative min-h-[92vh] overflow-hidden bg-black px-5 py-20 text-white md:px-10 lg:px-14"
    >
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-[0.24]"
        style={{
          backgroundImage: 'url("/assets/command-texture.png")',
          backgroundSize: "min(92rem, 120vw) auto",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          transform: "rotate(28deg) scale(1.08)",
        }}
      />
      <div className="relative z-10 mx-auto max-w-[96rem]">
        <div className="relative z-10 flex w-full flex-col items-center justify-between gap-10 md:flex-row md:items-start lg:px-10 xl:px-16">
          {services.slice(0, 2).map((card, index) => renderCard(card, index))}
        </div>

        <div className="relative z-20 mt-10 flex flex-col items-center justify-center md:-mt-[9rem] lg:-mt-[11rem]">
          <p className="mb-4 text-center text-xs font-semibold uppercase tracking-[0.48em] text-[#B07B5F]">
            Trust and control
          </p>

          <div ref={headingRef} className="mt-6">
            <RansomHeading />
          </div>

          <p className="mx-auto mt-7 max-w-xl text-center font-mono text-xs font-bold uppercase leading-6 tracking-[-0.035em] text-white/58 md:text-sm">
            Obu can move quickly through your inbox and calendar, but every
            important action stays visible, reversible, and approved by you.
          </p>
        </div>

        <div className="relative z-10 mt-12 flex w-full flex-col items-center justify-center gap-9 md:-mt-6 md:flex-row md:flex-wrap lg:mt-12 lg:flex-nowrap lg:gap-16 xl:gap-24">
          {services
            .slice(2, 5)
            .map((card, index) => renderCard(card, index + 2))}
        </div>
      </div>
    </section>
  );
}
