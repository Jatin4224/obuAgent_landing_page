import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Play } from 'lucide-react';
import ObuParticleHero from './ObuParticleHero.jsx';

gsap.registerPlugin(ScrollTrigger);

const heading = 'Meet Obu, the AI agent that runs your workday.';

export default function HeroReveal() {
  const sectionRef = useRef(null);
  const particleRef = useRef(null);
  const copyRef = useRef(null);

  useEffect(() => {
    const words = copyRef.current.querySelectorAll('[data-word]');

    const ctx = gsap.context(() => {
      gsap.set(copyRef.current, { y: 90, opacity: 0 });
      gsap.set(words, { yPercent: 110, opacity: 0 });
      gsap.set('[data-hero-sub], [data-hero-actions]', { y: 28, opacity: 0 });

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1,
        },
      });

      timeline
        .to(particleRef.current, { y: -130, scale: 0.82, opacity: 0.78, ease: 'power2.out' }, 0)
        .to(copyRef.current, { y: 0, opacity: 1, ease: 'power3.out' }, 0.18)
        .to(words, { yPercent: 0, opacity: 1, stagger: 0.035, ease: 'power3.out' }, 0.24)
        .to('[data-hero-sub]', { y: 0, opacity: 1, ease: 'power3.out' }, 0.48)
        .to('[data-hero-actions]', { y: 0, opacity: 1, ease: 'power3.out' }, 0.62);
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative h-[210vh] bg-black">
      <div className="sticky top-0 h-screen overflow-hidden">
        <div ref={particleRef} className="absolute inset-0 z-0">
          <ObuParticleHero />
        </div>
        <div className="pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(circle_at_50%_47%,transparent_0%,rgba(0,0,0,0.05)_34%,rgba(0,0,0,0.72)_82%)]" />
        <div className="absolute inset-x-0 bottom-0 z-10 h-1/2 bg-gradient-to-t from-black via-black/70 to-transparent" />

        <div ref={copyRef} className="relative z-20 flex h-screen items-end justify-center px-5 pb-[11vh] text-center sm:px-8">
          <div className="max-w-5xl">
            <h1 className="text-balance text-5xl font-semibold leading-[0.98] tracking-tight text-white sm:text-6xl lg:text-7xl">
              {heading.split(' ').map((word, index) => (
                <span key={`${word}-${index}`} className="inline-block overflow-hidden pr-[0.18em]">
                  <span data-word className="inline-block">{word}</span>
                </span>
              ))}
            </h1>
            <p data-hero-sub className="mx-auto mt-6 max-w-2xl text-base leading-8 text-[#9CA3AF] sm:text-lg">
              Emails, calendars, meetings, and follow-ups handled through simple chat.
            </p>
            <div data-hero-actions className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <a href="#start" className="inline-flex items-center justify-center gap-2 rounded-full bg-[#FF8A3D] px-6 py-3 text-sm font-semibold text-black shadow-[0_0_36px_rgba(255,138,61,0.36)]">
                Start Free
                <ArrowRight className="h-4 w-4" />
              </a>
              <a href="#how" className="inline-flex items-center justify-center gap-2 rounded-full border border-white/12 bg-white/[0.06] px-6 py-3 text-sm font-semibold text-white backdrop-blur-xl transition hover:bg-white/[0.1]">
                <Play className="h-4 w-4 fill-white" />
                Watch Demo
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
