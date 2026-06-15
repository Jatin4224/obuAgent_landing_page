import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const productLinks = [
  { label: "Workflow", href: "#workflow" },
  { label: "Demo", href: "#demo" },
  { label: "Control", href: "#control" },
  { label: "Pricing", href: "#pricing" },
];

const companyLinks = [
  { label: "About", href: "#about" },
  { label: "Careers", href: "#careers" },
  { label: "Contact", href: "#contact" },
];

const resourceLinks = [
  { label: "Docs", href: "#docs" },
  { label: "Changelog", href: "#changelog" },
  { label: "Status", href: "#status" },
];

const socials = [
  { label: "X", href: "#" },
  { label: "GitHub", href: "#" },
  { label: "LinkedIn", href: "#" },
];

export default function Footer() {
  const footerRef = useRef(null);
  const columnsRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        footerRef.current,
        { y: 28, opacity: 0, filter: "blur(8px)" },
        {
          y: 0,
          opacity: 1,
          filter: "blur(0px)",
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: footerRef.current,
            start: "top 90%",
            toggleActions: "play none none reverse",
          },
        },
      );

      gsap.fromTo(
        columnsRef.current.children,
        { y: 18, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          ease: "power2.out",
          stagger: 0.08,
          scrollTrigger: {
            trigger: columnsRef.current,
            start: "top 88%",
            toggleActions: "play none none reverse",
          },
        },
      );
    }, footerRef);

    return () => ctx.revert();
  }, []);

  return (
    <footer
      ref={footerRef}
      className="relative overflow-hidden bg-black px-5 pb-10 pt-24 text-white md:px-10 lg:px-20"
    >
      {/* ambient background */}
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute inset-0 opacity-45"
          style={{
            backgroundImage: 'url("/assets/breaking-texture.png")',
            backgroundSize: "52rem auto",
            backgroundPosition: "center bottom",
            backgroundRepeat: "repeat",
          }}
        />
        <div className="absolute left-1/2 top-0 h-80 w-[70vw] -translate-x-1/2 rounded-full bg-[#4d2dff]/10 blur-3xl" />
        <div className="absolute -bottom-24 right-0 h-72 w-72 rounded-full bg-[#FF6045]/10 blur-[110px]" />
      </div>

      {/* giant ghost wordmark — signature element */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 select-none overflow-hidden leading-[0.8]">
        <span
          className="block translate-y-[26%] text-center font-mono text-[24vw] font-black uppercase tracking-tighter text-transparent md:text-[18vw]"
          style={{ WebkitTextStroke: "1px rgba(255,255,255,0.05)" }}
        >
          OBU
        </span>
      </div>

      <div className="relative z-10 mx-auto max-w-7xl">
        {/* CTA banner */}
        <div className="flex flex-col items-start justify-between gap-10 pb-14 md:flex-row md:items-end">
          <div className="max-w-xl">
            <h2 className="text-3xl font-light leading-[1.1] tracking-tight text-white md:text-5xl">
              Let the busywork
              <br />
              <span className="font-black text-white/90">run itself.</span>
            </h2>
          </div>

          <a
            href="#login"
            className="group relative flex min-h-[4.5rem] min-w-[15rem] items-center justify-center px-8 py-5 text-center font-mono text-sm font-black uppercase tracking-[-0.04em] text-white transition-transform duration-300 hover:-translate-y-1"
          >
            <span
              className="absolute inset-[-0.75rem] bg-center bg-contain bg-no-repeat transition duration-300 group-hover:brightness-125 group-hover:saturate-150"
              style={{ backgroundImage: 'url("/assets/orange-button.png")' }}
            />
            <span className="absolute -bottom-1 left-1/2 h-[3px] w-2/3 -translate-x-1/2 scale-x-0 bg-[#FF6045] shadow-[0_0_18px_rgba(255,96,69,0.9)] transition-transform duration-300 group-hover:scale-x-100" />
            <span className="relative z-10 drop-shadow-[0_2px_0_rgba(0,0,0,0.55)] mb-2">
              Get Started
            </span>
          </a>
        </div>

        {/* columns */}
        <div
          ref={columnsRef}
          className="grid gap-12 py-14 md:grid-cols-[1.4fr_0.8fr_0.8fr_0.8fr]"
        >
          <div>
            <div className="flex items-center gap-3">
              <img
                src="/assets/icon.png"
                alt=""
                className="h-12 w-12 rounded-xl object-contain ring-1 ring-white/10 drop-shadow-[0_0_24px_rgba(255,96,69,0.18)]"
                draggable="false"
              />
              <span className="font-mono text-base font-black uppercase tracking-[-0.02em] text-white">
                Obu
              </span>
            </div>
            <p className="mt-5 max-w-sm text-sm font-light leading-7 text-white/45">
              AI executive assistance for inboxes, calendars, meetings, and the
              follow-ups that keep work moving.
            </p>
            <div className="mt-6 flex items-center gap-5 font-mono text-[0.68rem] font-black uppercase tracking-[0.14em] text-white/35">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  className="transition-colors duration-300 hover:text-[#FF6045]"
                >
                  {s.label}
                </a>
              ))}
            </div>
          </div>

          <FooterColumn title="Product" links={productLinks} />
          <FooterColumn title="Company" links={companyLinks} />
          <FooterColumn title="Resources" links={resourceLinks} />
        </div>

        {/* bottom bar */}
        <div className="flex flex-col gap-3 pt-6 font-mono text-[0.68rem] uppercase tracking-[0.14em] text-white/30 md:flex-row md:items-center md:justify-between">
          <p>© 2026 Obu. All rights reserved.</p>
          <p>Built for calm, approved automation.</p>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, links }) {
  return (
    <div>
      <h3 className="font-mono text-[0.62rem] font-black uppercase tracking-[0.18em] text-white/30">
        {title}
      </h3>
      <ul className="mt-5 flex flex-col gap-3">
        {links.map((link) => (
          <li key={link.label}>
            <a
              href={link.href}
              className="group relative inline-block font-mono text-[0.78rem] font-bold uppercase tracking-[-0.02em] text-white/55 transition-colors duration-300 hover:text-white"
            >
              {link.label}
              <span className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-[#FF6045] shadow-[0_0_10px_rgba(255,96,69,0.8)] transition-transform duration-300 group-hover:scale-x-100" />
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
