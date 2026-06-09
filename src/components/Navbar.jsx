import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Navbar() {
  const navRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(navRef.current, { y: -24, opacity: 0, pointerEvents: 'none' });
      gsap.to(navRef.current, {
        y: 0,
        opacity: 1,
        pointerEvents: 'auto',
        duration: 0.55,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: document.body,
          start: '260 top',
          toggleActions: 'play none none reverse',
        },
      });
    }, navRef);

    return () => ctx.revert();
  }, []);

  return (
    <nav ref={navRef} className="fixed inset-x-0 top-0 z-50 px-5 py-4 sm:px-8 lg:px-10">
      <div className="mx-auto flex max-w-7xl items-center justify-between rounded-full border border-white/12 bg-black/45 px-4 py-3 shadow-[0_0_44px_rgba(0,0,0,0.42)] backdrop-blur-2xl">
        <a href="#" className="flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#FF8A3D] text-sm font-black text-black">O</span>
          <span className="text-sm font-semibold tracking-wide text-white">Obu</span>
        </a>
        <div className="hidden items-center gap-7 text-sm text-white/65 md:flex">
          <a className="transition hover:text-white" href="#how">How it works</a>
          <a className="transition hover:text-white" href="#features">Features</a>
          <a className="transition hover:text-white" href="#start">Start</a>
        </div>
        <a href="#start" className="rounded-full border border-white/12 bg-white px-4 py-2 text-sm font-semibold text-black transition hover:bg-[#FF8A3D]">
          Start Free
        </a>
      </div>
    </nav>
  );
}
