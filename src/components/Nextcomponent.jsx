import { forwardRef } from "react";

const Nextcomponent = forwardRef(function Nextcomponent(_, ref) {
  return (
    <section
      ref={ref}
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-black px-6 text-center text-white"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_48%,rgba(168,85,247,0.15),transparent_34%),radial-gradient(circle_at_50%_100%,rgba(255,255,255,0.08),transparent_32%)]" />
      <div className="relative z-10 mx-auto max-w-4xl">
        <p className="mb-5 text-xs uppercase tracking-[0.52em] text-white/45">
          Obu workspace
        </p>
        <h2
          className="text-white"
          style={{
            fontFamily:
              '"Gilroy Light", "Gilroy Regular", Gilroy, Inter, ui-sans-serif, system-ui, sans-serif',
            fontSize: "clamp(3rem, 8vw, 7.5rem)",
            fontWeight: 300,
            lineHeight: 0.95,
            letterSpacing: "-0.05em",
            textShadow:
              "0 0 22px rgba(255,255,255,0.34), 0 0 72px rgba(196,181,253,0.24)",
          }}
        >
          Work moves without the noise.
        </h2>
        <p className="mx-auto mt-7 max-w-2xl text-base leading-7 text-white/58 md:text-lg">
          Obu brings email, calendar, meetings, and follow-ups into one calm
          command center.
        </p>
      </div>
    </section>
  );
});

export default Nextcomponent;
