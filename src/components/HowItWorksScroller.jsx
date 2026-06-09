import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const steps = [
  {
    eyebrow: '01',
    title: 'Ask Obu',
    body: 'User types: "Schedule a meeting with Sarah next Thursday."',
    image: 'radial-gradient(circle at 25% 20%, rgba(255,138,61,0.22), transparent 34%), radial-gradient(circle at 80% 70%, rgba(121,92,255,0.28), transparent 38%), linear-gradient(135deg, #09090b, #030305)',
  },
  {
    eyebrow: '02',
    title: 'Obu Understands',
    body: 'Obu reads calendar availability and email context.',
    image: 'radial-gradient(circle at 30% 80%, rgba(121,92,255,0.32), transparent 38%), radial-gradient(circle at 80% 18%, rgba(255,255,255,0.1), transparent 30%), linear-gradient(135deg, #050510, #000)',
  },
  {
    eyebrow: '03',
    title: 'Obu Prepares',
    body: 'Creates event, adds Google Meet, drafts message.',
    image: 'radial-gradient(circle at 18% 30%, rgba(255,138,61,0.2), transparent 34%), radial-gradient(circle at 70% 56%, rgba(150,132,255,0.3), transparent 42%), linear-gradient(135deg, #09090b, #020202)',
  },
  {
    eyebrow: '04',
    title: 'You Approve',
    body: 'User clicks approve and everything is done.',
    image: 'radial-gradient(circle at 72% 22%, rgba(255,138,61,0.24), transparent 32%), radial-gradient(circle at 24% 74%, rgba(121,92,255,0.27), transparent 40%), linear-gradient(135deg, #050505, #09090f)',
  },
];

export default function HowItWorksScroller() {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);

  useEffect(() => {
    const cards = gsap.utils.toArray('[data-step-card]');
    const ctx = gsap.context(() => {
      gsap.to(trackRef.current, {
        x: () => -(trackRef.current.scrollWidth - window.innerWidth),
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          pin: true,
          scrub: 1,
          start: 'top top',
          end: () => `+=${trackRef.current.scrollWidth}`,
          invalidateOnRefresh: true,
        },
      });

      gsap.to('[data-bg-shift]', {
        xPercent: -8,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });

      cards.forEach((card) => {
        const handleMove = (event) => {
          const rect = card.getBoundingClientRect();
          const x = (event.clientX - rect.left) / rect.width - 0.5;
          const y = (event.clientY - rect.top) / rect.height - 0.5;
          gsap.to(card, { rotateY: x * 7, rotateX: -y * 7, duration: 0.35, ease: 'power2.out' });
        };
        const handleLeave = () => gsap.to(card, { rotateX: 0, rotateY: 0, duration: 0.55, ease: 'power3.out' });
        card.addEventListener('pointermove', handleMove);
        card.addEventListener('pointerleave', handleLeave);
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="how" ref={sectionRef} className="relative h-screen overflow-hidden bg-black">
      <div data-bg-shift className="absolute inset-y-0 left-0 w-[120vw] bg-[radial-gradient(circle_at_20%_50%,rgba(120,96,255,0.2),transparent_32%),radial-gradient(circle_at_72%_42%,rgba(255,138,61,0.12),transparent_28%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,#000_0%,rgba(0,0,0,0.7)_18%,rgba(0,0,0,0.28)_50%,#000_100%)]" />
      <div className="relative z-10 flex h-full items-center">
        <div ref={trackRef} className="flex w-max items-center gap-5 pl-[8vw] pr-[8vw] sm:gap-8">
          <div className="w-[82vw] max-w-xl shrink-0">
            <p className="mb-4 text-sm font-medium uppercase tracking-[0.28em] text-[#FF8A3D]">How it works</p>
            <h2 className="text-5xl font-semibold tracking-tight text-white sm:text-6xl">From one sentence to finished work.</h2>
          </div>
          {steps.map((step) => (
            <article
              key={step.title}
              data-step-card
              className="group relative h-[62vh] w-[82vw] max-w-[520px] shrink-0 overflow-hidden rounded-[30px] border border-white/12 bg-white/[0.06] p-6 shadow-[0_0_70px_rgba(121,92,255,0.12)] backdrop-blur-xl will-change-transform sm:p-8"
              style={{ transformStyle: 'preserve-3d' }}
            >
              <div className="absolute inset-0 opacity-90 transition duration-500 group-hover:scale-105" style={{ background: step.image }} />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.04),rgba(0,0,0,0.72))]" />
              <div className="relative z-10 flex h-full flex-col justify-between">
                <span className="w-fit rounded-full border border-white/12 bg-black/40 px-4 py-2 text-xs font-semibold tracking-[0.22em] text-[#FF8A3D] backdrop-blur-xl">
                  {step.eyebrow}
                </span>
                <div>
                  <h3 className="text-4xl font-semibold tracking-tight text-white">{step.title}</h3>
                  <p className="mt-4 max-w-sm text-lg leading-8 text-white/72">{step.body}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
