import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const navLinks = [
  { label: "Workflow", href: "#workflow" },
  { label: "Demo", href: "#demo" },
  { label: "Control", href: "#control" },
];

export default function Navbar({ triggerRef }) {
  const navRef = useRef(null);

  useEffect(() => {
    const trigger = triggerRef?.current || document.body;

    const ctx = gsap.context(() => {
      gsap.set(navRef.current, {
        y: -28,
        opacity: 0,
        filter: "blur(10px)",
        pointerEvents: "none",
      });

      gsap.to(navRef.current, {
        y: 0,
        opacity: 1,
        filter: "blur(0px)",
        pointerEvents: "auto",
        duration: 0.65,
        ease: "power3.out",
        scrollTrigger: {
          trigger,
          start: "top 82%",
          toggleActions: "play none none reverse",
        },
      });
    }, navRef);

    return () => ctx.revert();
  }, [triggerRef]);

  return (
    <nav
      ref={navRef}
      className="fixed inset-x-0 top-0 z-[80] px-4 py-3 sm:px-7 lg:px-10"
    >
      <div className="mx-auto flex max-w-[96rem] items-center justify-between">
        <a
          href="#"
          className="group relative flex min-w-24 items-center gap-3 py-2"
          aria-label="Obu home"
        >
          <img
            src="/assets/icon.png"
            alt=""
            className="h-12 w-12 object-contain drop-shadow-[0_0_22px_rgba(255,96,69,0.22)] transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:rotate-[-4deg] sm:h-14 sm:w-14"
            draggable="false"
          />
        </a>

        <div className="hidden items-center gap-8 rounded-full border border-white/[0.07] bg-black/30 px-8 py-4 shadow-[0_16px_60px_rgba(0,0,0,0.38)] backdrop-blur-xl md:flex lg:gap-12">
          {navLinks.map((link) => (
            <a
              key={link.href}
              className="group relative font-mono text-[0.78rem] font-black uppercase tracking-[-0.04em] text-white/88 transition hover:text-white lg:text-[0.86rem]"
              href={link.href}
            >
              <span>{link.label}</span>
              <span className="absolute -bottom-2 left-0 h-[3px] w-full origin-left scale-x-0 bg-[#FF6045] shadow-[0_0_18px_rgba(255,96,69,0.85)] transition-transform duration-300 ease-out group-hover:scale-x-100" />
            </a>
          ))}
        </div>

        <a
          href="#login"
          className="group relative flex min-h-14 min-w-[8.75rem] items-center justify-center px-5 py-3 text-center font-mono text-[0.78rem] font-black uppercase tracking-[-0.04em] text-white transition-transform duration-300 hover:-translate-y-0.5 sm:min-w-[11.5rem] sm:text-sm"
        >
          <span
            className="absolute inset-[-0.45rem] bg-center bg-contain bg-no-repeat transition duration-300 group-hover:brightness-125 group-hover:saturate-150"
            style={{ backgroundImage: 'url("/assets/navbar-button.png")' }}
          />
          <span className="absolute -bottom-1 left-1/2 h-[3px] w-3/4 -translate-x-1/2 scale-x-0 bg-[#FF6045] shadow-[0_0_18px_rgba(255,96,69,0.9)] transition-transform duration-300 group-hover:scale-x-100" />
          <span className="relative z-10 drop-shadow-[0_2px_0_rgba(0,0,0,0.5)]">
            Login
          </span>
        </a>
      </div>
    </nav>
  );
}
