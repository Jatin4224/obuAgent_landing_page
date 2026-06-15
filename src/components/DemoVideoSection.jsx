import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ElectricVideoCard from "./ElectricVideoCard.jsx";
import TextBlockEffect, {
  TextBlock,
} from "../ui/components/text/TextBlockEffect.jsx";

gsap.registerPlugin(ScrollTrigger);

const stickerClip =
  "polygon(0 9%, 2% 9%, 2% 0, 96% 0, 96% 7%, 100% 7%, 98% 31%, 100% 31%, 98% 66%, 100% 66%, 97% 100%, 4% 100%, 4% 92%, 0 92%, 2% 66%, 0 66%, 2% 36%, 0 36%)";

export default function DemoVideoSection() {
  const sectionRef = useRef(null);
  const cardRef = useRef(null);
  const proofRefs = useRef([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        cardRef.current,
        { y: 80, scale: 0.96, opacity: 0, filter: "blur(14px)" },
        {
          y: 0,
          scale: 1,
          opacity: 1,
          filter: "blur(0px)",
          ease: "power3.out",
          scrollTrigger: {
            trigger: cardRef.current,
            start: "top 82%",
            end: "top 34%",
            scrub: 1,
            invalidateOnRefresh: true,
          },
        },
      );

      gsap.fromTo(
        proofRefs.current,
        { y: 36, opacity: 0, filter: "blur(8px)" },
        {
          y: 0,
          opacity: 1,
          filter: "blur(0px)",
          stagger: 0.08,
          ease: "power2.out",
          scrollTrigger: {
            trigger: cardRef.current,
            start: "center 70%",
            toggleActions: "play none none reverse",
          },
        },
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="demo"
      ref={sectionRef}
      className="relative overflow-hidden bg-black px-5 py-20 text-white md:px-10 lg:px-16"
    >
      <div className="relative z-10 mx-auto flex max-w-7xl flex-col gap-9 md:gap-11">
        <div className="mx-auto max-w-5xl text-center">
          <p className="mb-5 text-xs font-medium uppercase tracking-[0.44em] text-[#FF6045]/72">
            Watch the workflow
          </p>
          <TextBlockEffect
            compact
            className="bg-transparent"
            triggerStart="top 68%"
          >
            <section className="flex justify-center">
              <TextBlock
                blockColor="#f7d84b"
                textColor="#ffffff"
                fontFamily='"Outfit", Inter, ui-sans-serif, system-ui, sans-serif'
                className="max-w-none"
                style={{
                  fontSize: "clamp(2rem,4.4vw,4.7rem)",
                  fontWeight: 300,
                  lineHeight: 0.95,
                  letterSpacing: "-0.045em",
                }}
              >
                See Obu in action.
              </TextBlock>
            </section>
          </TextBlockEffect>
        </div>

        <div ref={cardRef} className="relative mx-auto w-full max-w-[72rem]">
          <div
            className="pointer-events-none absolute inset-x-[-8%] top-1/2 z-0 h-[72%] -translate-y-1/2 opacity-28"
            style={{
              backgroundImage: 'url("/assets/breaking-texture.png")',
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
          />
          <div className="relative z-10">
            <ElectricVideoCard
              youtubeId="W-epbrFWMbk"
              eyebrow="Obu demo"
              title="One prompt becomes the workflow."
              description="Watch the full Obu demo inside the electric glass frame."
            />
          </div>
        </div>

        <div className="mx-auto mt-8 grid max-w-5xl gap-4 md:grid-cols-3">
          {["Draft replies", "Schedule meetings", "Remember follow-ups"].map(
            (item, index) => (
              <button
                key={item}
                ref={(node) => {
                  proofRefs.current[index] = node;
                }}
                type="button"
                className="group relative mx-auto min-h-14 w-full max-w-[16.5rem] text-left"
              >
                <span
                  className="absolute inset-0 translate-x-1.5 translate-y-1.5 bg-[#fff1dc] opacity-95 blur-[0.2px] transition-transform duration-300 group-hover:translate-x-2 group-hover:translate-y-2"
                  style={{ clipPath: stickerClip }}
                />
                <span
                  className="absolute inset-0 translate-x-0.5 translate-y-0.5 bg-[#ffd4b4]/70 transition-transform duration-300 group-hover:translate-x-1 group-hover:translate-y-1"
                  style={{ clipPath: stickerClip }}
                />
                <span
                  className="relative flex min-h-14 items-center justify-center bg-[#FF6045] px-7 py-4 font-sans text-xs font-semibold uppercase tracking-[0.14em] text-black shadow-[inset_0_1px_0_rgba(255,255,255,0.35),0_16px_42px_rgba(255,96,69,0.16)] transition-transform duration-300 group-hover:-translate-x-0.5 group-hover:-translate-y-0.5 md:text-sm"
                  style={{ clipPath: stickerClip }}
                >
                  {item}
                </span>
              </button>
            ),
          )}
        </div>
      </div>
    </section>
  );
}
