import { useEffect, useRef } from "react";
import gsap from "gsap";

const panelClip =
  "polygon(1% 7%, 7% 2%, 16% 4%, 26% 1%, 38% 3%, 49% 1%, 60% 3%, 73% 1%, 85% 3%, 99% 1%, 97% 12%, 99% 25%, 96% 39%, 98% 52%, 95% 66%, 97% 82%, 92% 96%, 78% 94%, 65% 98%, 51% 96%, 37% 99%, 24% 95%, 11% 98%, 3% 91%, 5% 76%, 2% 63%, 4% 48%, 1% 34%, 3% 20%)";

const tapeClip =
  "polygon(0 13%, 8% 8%, 5% 0, 95% 0, 92% 10%, 100% 15%, 96% 36%, 100% 50%, 96% 72%, 100% 91%, 91% 100%, 7% 94%, 9% 84%, 0 80%, 4% 57%, 0 42%)";

const fields = [
  { label: "Your email", type: "email", autoComplete: "email" },
  { label: "Password", type: "password", autoComplete: "current-password" },
  { label: "Workspace name", type: "text" },
  { label: "Access code", type: "text" },
  { label: "Gmail account", type: "email" },
  { label: "Calendar account", type: "email" },
  { label: "Telegram", type: "text" },
  { label: "Invite note", type: "text" },
];

export default function LoginScreen() {
  const screenRef = useRef(null);
  const panelRef = useRef(null);
  const fieldRefs = useRef([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        panelRef.current,
        { y: 34, opacity: 0, scale: 0.985, filter: "blur(14px)" },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          filter: "blur(0px)",
          duration: 0.9,
          ease: "power3.out",
        },
      );

      gsap.fromTo(
        fieldRefs.current,
        { y: 18, opacity: 0, filter: "blur(7px)" },
        {
          y: 0,
          opacity: 1,
          filter: "blur(0px)",
          stagger: 0.045,
          delay: 0.25,
          duration: 0.55,
          ease: "power3.out",
        },
      );
    }, screenRef);

    return () => ctx.revert();
  }, []);

  return (
    <main
      ref={screenRef}
      className="relative min-h-screen overflow-hidden bg-black px-3 py-3 text-white sm:px-5 sm:py-5"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          backgroundImage:
            'radial-gradient(circle at 12% 70%, rgba(76,255,105,0.08), transparent 20%), radial-gradient(circle at 92% 8%, rgba(91,48,188,0.24), transparent 24%), linear-gradient(rgba(0,0,0,0.45), rgba(0,0,0,0.72)), url("/assets/bg-texture.png")',
          backgroundSize: "auto, auto, auto, 54rem auto",
          backgroundPosition: "center",
          backgroundRepeat: "repeat",
        }}
      />

      <a
        href="#"
        className="group absolute right-5 top-5 z-40 hidden min-h-14 min-w-[9rem] items-center justify-center px-5 py-3 font-mono text-xs font-black uppercase tracking-[-0.04em] text-white transition-transform duration-300 hover:-translate-y-0.5 md:flex"
      >
        <span
          className="absolute inset-[-0.45rem] bg-center bg-contain bg-no-repeat opacity-70 transition duration-300 group-hover:opacity-100 group-hover:brightness-125"
          style={{ backgroundImage: 'url("/assets/navbar-button.png")' }}
        />
        <span className="relative z-10">Back</span>
      </a>

      <div className="absolute left-4 top-6 z-30 hidden rotate-[-8deg] md:block">
        <span
          className="inline-flex font-black uppercase leading-none text-[#ff8a65] opacity-70"
          style={{
            fontFamily: '"Outfit", system-ui, sans-serif',
            fontSize: "clamp(2.1rem, 4vw, 4.8rem)",
            letterSpacing: "-0.12em",
            textShadow: "2px 2px 0 #000",
          }}
        >
          O<span className="text-[#f2d66d]">B</span>
          <span className="text-[#e9f6ff]">U</span>
        </span>
      </div>

      <section className="relative z-10 mx-auto flex min-h-[calc(100vh-1.5rem)] max-w-[96rem] items-center justify-center">
        <div
          ref={panelRef}
          className="relative w-full bg-[#050606]/95 px-7 py-12 shadow-[0_46px_130px_rgba(0,0,0,0.85)] sm:px-10 md:px-16 lg:px-24 lg:py-20"
          style={{
            clipPath: panelClip,
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.035), rgba(255,255,255,0.015)), url("/assets/command-texture.png")',
            backgroundSize: "auto, 76rem auto",
            backgroundPosition: "center",
          }}
        >
          <div
            className="pointer-events-none absolute inset-[-0.35rem] -z-10 bg-[#7b7b78]/35 blur-[1px]"
            style={{ clipPath: panelClip }}
          />
          <div className="pointer-events-none absolute inset-0 border border-white/[0.035]" />
          <div className="pointer-events-none absolute inset-x-12 top-0 h-8 bg-white/10 blur-xl" />

          <a
            href="#"
            className="group absolute right-[8%] top-[10%] h-12 w-12 rotate-12"
            aria-label="Close login"
          >
            <span className="absolute left-1/2 top-1/2 h-[2px] w-10 -translate-x-1/2 -translate-y-1/2 rotate-45 bg-[#ff2c2c] shadow-[0_0_12px_rgba(255,44,44,0.55)] transition group-hover:scale-110" />
            <span className="absolute left-1/2 top-1/2 h-[2px] w-10 -translate-x-1/2 -translate-y-1/2 -rotate-45 bg-[#ff2c2c] shadow-[0_0_12px_rgba(255,44,44,0.55)] transition group-hover:scale-110" />
          </a>

          <div className="max-w-[78rem]">
            <div className="mb-12">
              <h1 className="font-mono text-[clamp(2.5rem,5vw,5.7rem)] font-black uppercase leading-none tracking-[-0.09em] text-white">
                Login to Obu
              </h1>
              <p className="mt-7 font-mono text-[clamp(1rem,1.6vw,1.55rem)] font-black uppercase tracking-[-0.08em] text-white/46">
                And get back to your command center
              </p>
            </div>

            <form
              className="grid gap-x-9 gap-y-8 md:grid-cols-2 xl:grid-cols-3"
              onSubmit={(event) => event.preventDefault()}
            >
              {fields.map((field, index) => (
                <label
                  key={field.label}
                  ref={(node) => {
                    if (node) fieldRefs.current[index] = node;
                  }}
                  className={`block ${index < 2 ? "xl:col-span-1" : ""}`}
                >
                  <span className="block font-mono text-[0.82rem] font-black uppercase tracking-[-0.04em] text-white/82 md:text-base">
                    {field.label}
                  </span>
                  <input
                    type={field.type}
                    autoComplete={field.autoComplete}
                    className="mt-5 h-9 w-full border-0 border-b border-white/24 bg-transparent px-0 font-mono text-base font-bold text-white outline-none transition placeholder:text-white/18 focus:border-[#FF6045] focus:shadow-[0_8px_18px_-18px_rgba(255,96,69,0.8)]"
                  />
                </label>
              ))}

              <div
                ref={(node) => {
                  if (node) fieldRefs.current[fields.length] = node;
                }}
                className="flex flex-wrap items-center gap-5 pt-3 md:col-span-2 xl:col-span-3"
              >
                <button
                  type="submit"
                  className="group relative min-h-16 min-w-44 px-8 py-5 font-mono text-sm font-black uppercase tracking-[-0.04em] text-white transition-transform duration-300 hover:-translate-y-1"
                >
                  <span
                    className="absolute inset-[-0.65rem] bg-center bg-contain bg-no-repeat transition duration-300 group-hover:brightness-125 group-hover:saturate-150"
                    style={{
                      backgroundImage: 'url("/assets/navbar-button.png")',
                    }}
                  />
                  <span className="absolute -bottom-1 left-1/2 h-[3px] w-2/3 -translate-x-1/2 scale-x-0 bg-[#FF6045] shadow-[0_0_18px_rgba(255,96,69,0.9)] transition-transform duration-300 group-hover:scale-x-100" />
                  <span className="relative z-10">Submit</span>
                </button>

                <button
                  type="button"
                  className="relative min-h-16 min-w-56 bg-[#2f3332] px-8 py-5 font-mono text-sm font-black uppercase tracking-[-0.04em] text-white shadow-[9px_11px_0_rgba(0,0,0,0.24)] transition hover:-translate-y-1 hover:bg-[#3d4241]"
                  style={{ clipPath: tapeClip }}
                >
                  Contact manager
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}
