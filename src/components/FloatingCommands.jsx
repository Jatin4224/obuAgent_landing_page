import { useEffect, useRef } from 'react';
import gsap from 'gsap';

const commands = [
  { text: '✓ Meeting scheduled', className: 'left-[6%] top-[32%] hidden lg:block' },
  { text: '✓ Email drafted', className: 'right-[8%] top-[29%] hidden md:block' },
  { text: '✓ Follow-up sent', className: 'left-[10%] bottom-[22%] hidden md:block' },
  { text: '✓ Inbox summarized', className: 'right-[7%] bottom-[25%] hidden lg:block' },
];

export default function FloatingCommands() {
  const rootRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '[data-command-card]',
        { y: 24, opacity: 0, scale: 0.96 },
        { y: 0, opacity: 1, scale: 1, duration: 1, stagger: 0.14, ease: 'power3.out', delay: 0.65 },
      );

      gsap.to('[data-command-card]', {
        y: (index) => (index % 2 === 0 ? -12 : 12),
        x: (index) => (index % 2 === 0 ? 8 : -8),
        duration: 4.5,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
        stagger: 0.35,
      });
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={rootRef} className="pointer-events-none absolute inset-0 z-20">
      {commands.map((command) => (
        <div
          key={command.text}
          data-command-card
          className={`absolute rounded-2xl border border-white/12 bg-white/[0.06] px-4 py-3 text-sm text-white/85 shadow-[0_0_40px_rgba(255,138,61,0.08)] backdrop-blur-2xl ${command.className}`}
        >
          <span className="text-[#FF8A3D]">{command.text.slice(0, 1)}</span>
          {command.text.slice(1)}
        </div>
      ))}
    </div>
  );
}
