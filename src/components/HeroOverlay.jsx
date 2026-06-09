import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Play } from 'lucide-react';
import AnimatedOrbits from './AnimatedOrbits.jsx';
import FloatingCommands from './FloatingCommands.jsx';

gsap.registerPlugin(ScrollTrigger);

export default function HeroOverlay() {
  const rootRef = useRef(null);
  const contentRef = useRef(null);
  const orbitRef = useRef(null);
  const parallax = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '[data-hero-item]',
        { y: 26, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, stagger: 0.11, ease: 'power3.out', delay: 0.15 },
      );

      gsap.to(contentRef.current, {
        y: -90,
        opacity: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: rootRef.current,
          start: 'top top',
          end: '70% top',
          scrub: true,
        },
      });
    }, rootRef);

    const handleMove = (event) => {
      const x = (event.clientX / window.innerWidth - 0.5) * 2;
      const y = (event.clientY / window.innerHeight - 0.5) * 2;
      parallax.current.x = x;
      parallax.current.y = y;
      gsap.to(contentRef.current, { x: x * 10, y: y * 7, duration: 0.8, ease: 'power3.out' });
      gsap.to(orbitRef.current, { x: x * -12, y: y * -10, duration: 0.9, ease: 'power3.out' });
    };

    window.addEventListener('pointermove', handleMove);
    return () => {
      window.removeEventListener('pointermove', handleMove);
      ctx.revert();
    };
  }, []);

  return (
    <div ref={rootRef} className="relative z-30 min-h-screen">
      <nav className="fixed inset-x-0 top-0 z-50 px-5 py-4 sm:px-8 lg:px-10">
        <div className="mx-auto flex max-w-7xl items-center justify-between rounded-full border border-white/12 bg-black/35 px-4 py-3 shadow-[0_0_44px_rgba(0,0,0,0.35)] backdrop-blur-2xl">
          <a href="#" className="flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#FF8A3D] text-sm font-black text-black">O</span>
            <span className="text-sm font-semibold tracking-wide text-white">Obu</span>
          </a>
          <div className="hidden items-center gap-7 text-sm text-white/65 md:flex">
            <a className="transition hover:text-white" href="#features">Features</a>
            <a className="transition hover:text-white" href="#workflow">Workflow</a>
            <a className="transition hover:text-white" href="#pricing">Pricing</a>
            <a className="transition hover:text-white" href="#docs">Docs</a>
          </div>
          <a href="#" className="rounded-full border border-white/12 bg-white px-4 py-2 text-sm font-semibold text-black transition hover:bg-[#FF8A3D]">
            Start Free
          </a>
        </div>
      </nav>

      <div ref={orbitRef} className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
        <AnimatedOrbits />
      </div>
      <FloatingCommands />

      <div className="relative z-30 flex min-h-screen items-center px-5 pt-28 sm:px-8 lg:px-12">
        <div
          ref={contentRef}
          className="mx-auto flex w-full max-w-6xl flex-col items-center text-center"
        >
          <div className="absolute left-1/2 top-[36%] -z-10 h-[320px] w-[min(760px,90vw)] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(0,0,0,0.78)_0%,rgba(0,0,0,0.54)_42%,transparent_75%)] blur-xl" />

          <div data-hero-item className="mb-5 rounded-full border border-white/12 bg-white/[0.06] px-4 py-2 text-xs font-medium uppercase tracking-[0.24em] text-[#FF8A3D] backdrop-blur-xl">
            AI agent for your workday
          </div>
          <h1 data-hero-item className="max-w-[800px] text-balance text-5xl font-semibold leading-[0.98] tracking-tight text-white sm:text-6xl lg:text-7xl">
            Your inbox and calendar, handled by Obu.
          </h1>
          <p data-hero-item className="mt-6 max-w-2xl text-base leading-8 text-[#9CA3AF] sm:text-lg">
            Obu schedules meetings, drafts replies, summarizes inboxes, and keeps your day moving — all through simple chat.
          </p>
          <div data-hero-item className="mt-9 flex flex-col gap-3 sm:flex-row">
            <a href="#" className="inline-flex items-center justify-center gap-2 rounded-full bg-[#FF8A3D] px-6 py-3 text-sm font-semibold text-black shadow-[0_0_36px_rgba(255,138,61,0.36)]">
              Start Free
              <ArrowRight className="h-4 w-4" />
            </a>
            <a href="#" className="inline-flex items-center justify-center gap-2 rounded-full border border-white/12 bg-white/[0.06] px-6 py-3 text-sm font-semibold text-white backdrop-blur-xl transition hover:bg-white/[0.1]">
              <Play className="h-4 w-4 fill-white" />
              Watch Demo
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
