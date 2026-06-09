import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function AnimatedOrbits() {
  const svgRef = useRef(null);

  useEffect(() => {
    const paths = svgRef.current.querySelectorAll('[data-draw]');
    const ctx = gsap.context(() => {
      paths.forEach((path, index) => {
        const length = path.getTotalLength();
        gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
        gsap.to(path, {
          strokeDashoffset: 0,
          duration: 2.4 + index * 0.35,
          delay: 0.25 + index * 0.12,
          ease: 'power2.out',
        });
      });

      gsap.to(svgRef.current, {
        rotate: 360,
        duration: 54,
        ease: 'none',
        repeat: -1,
        transformOrigin: '50% 50%',
      });
    }, svgRef);

    return () => ctx.revert();
  }, []);

  return (
    <svg
      ref={svgRef}
      className="h-[min(720px,88vw)] w-[min(720px,88vw)] opacity-75"
      viewBox="0 0 720 720"
      fill="none"
      aria-hidden="true"
    >
      <defs>
        <filter id="orbitGlow" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <ellipse data-draw cx="360" cy="360" rx="286" ry="108" stroke="rgba(255,138,61,0.58)" strokeWidth="1.2" filter="url(#orbitGlow)" />
      <ellipse data-draw cx="360" cy="360" rx="248" ry="92" stroke="rgba(255,255,255,0.28)" strokeWidth="1" transform="rotate(62 360 360)" />
      <ellipse data-draw cx="360" cy="360" rx="312" ry="130" stroke="rgba(255,255,255,0.18)" strokeWidth="1" transform="rotate(-36 360 360)" />
      <path data-draw d="M150 423C235 308 343 285 471 321C532 338 583 326 626 282" stroke="rgba(255,138,61,0.35)" strokeWidth="1.1" />
      <circle cx="214" cy="316" r="3" fill="#FF8A3D" />
      <circle cx="564" cy="392" r="2.5" fill="white" opacity="0.8" />
    </svg>
  );
}
