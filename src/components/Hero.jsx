import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { playBoop } from "../lib/sound.js";
import EyeParticles from "./EyeParticles.jsx";
import FoxParticles from "./FoxParticles.jsx";
import HeroAutoManifesto from "./HeroAutoManifesto.jsx";
import HeroMusicPlayer from "./HeroMusicPlayer.jsx";
import HeroObuVideoFlyIn from "./HeroObuVideoFlyIn.jsx";
import HeroParticleHandoff from "./HeroParticleHandoff.jsx";
import WorkspacePowerOverlay from "./WorkspacePowerOverlay.jsx";

gsap.registerPlugin(ScrollTrigger);

function ScrollCue({ rootRef }) {
  const cueRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(cueRef.current, {
        autoAlpha: 0,
        y: 14,
        ease: "none",
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top top",
          end: () => `+=${window.innerHeight * 0.5}`,
          scrub: 0.4,
          invalidateOnRefresh: true,
        },
      });
    }, cueRef);

    return () => ctx.revert();
  }, [rootRef]);

  return (
    <div
      ref={cueRef}
      className="pointer-events-none absolute bottom-7 left-1/2 z-[60] flex -translate-x-1/2 flex-col items-center gap-2.5"
    >
      <span className="font-mono text-[0.6rem] font-bold uppercase tracking-[0.34em] text-white/45">
        Scroll
      </span>
      <span className="relative h-9 w-5 rounded-full border border-white/25">
        <span className="absolute left-1/2 top-1.5 h-1.5 w-1 -translate-x-1/2 animate-bounce rounded-full bg-[#FF6045] shadow-[0_0_10px_rgba(255,96,69,0.8)]" />
      </span>
    </div>
  );
}

function CinematicCamera() {
  useFrame(({ clock, camera }) => {
    const elapsed = clock.getElapsedTime();
    camera.position.x = Math.sin(elapsed * 0.16) * 0.16;
    camera.position.y = Math.cos(elapsed * 0.13) * 0.08;

    // 1. Shifting the lookAt down on the Y-axis (-0.6) forces the raccoon up in frame
    camera.lookAt(0, -0.6, 0);
  });

  return null;
}

export default function Hero({ nextSectionRef }) {
  const sectionRef = useRef(null);
  const wakeProgressRef = useRef(0);
  const pullBackRef = useRef(0);
  const bodyRevealRef = useRef(0);
  const productIntroRef = useRef(0);
  const handoffRef = useRef(0);
  const videoPlayerRef = useRef(null);

  return (
    // Height budget: orb activation ~2.95 screens + manifesto 7.5 + handoff
    // pause 0.45 + fade 1.0 = 11.9 screens of choreography; the sticky child
    // releases at (height − 100vh) = 12 screens, so the fade completes pinned.
    <section ref={sectionRef} className="relative isolate z-0 h-[1300vh] bg-black">
      <div className="sticky top-0 h-screen w-screen overflow-hidden bg-black">
        {/* 2. PLACED BEHIND: Rendered the text streams first with a lower z-index */}
        <div className="absolute inset-0 z-10 pointer-events-none">
          <WorkspacePowerOverlay
            rootRef={sectionRef}
            wakeProgressRef={wakeProgressRef}
            pullBackRef={pullBackRef}
            bodyRevealRef={bodyRevealRef}
          />
        </div>

        {/* 3. TRANSPARENT CANVAS: Configured with a higher z-index and alpha context */}
        <Canvas
          className="h-full w-full relative z-20"
          camera={{ position: [0, 0, 8.6], fov: 43, near: 0.1, far: 100 }}
          dpr={[1, 1.75]}
          gl={{
            antialias: false,
            alpha: true, // Enabled alpha channel transparency
            powerPreference: "high-performance",
          }}
        >
          {/* Note: Removed the solid black curtain color attachment so layers underneath peek through */}
          <CinematicCamera />
          <FoxParticles
            wakeProgressRef={wakeProgressRef}
            dissolveRef={pullBackRef}
          />
          <EyeParticles
            wakeProgressRef={wakeProgressRef}
            dissolveRef={pullBackRef}
          />
        </Canvas>

        <div className="pointer-events-none absolute inset-0 z-[25] bg-[radial-gradient(circle_at_50%_48%,transparent_0%,rgba(0,0,0,0.1)_45%,rgba(0,0,0,0.82)_92%)]" />
        <HeroObuVideoFlyIn ref={videoPlayerRef} rootRef={sectionRef} />
        <HeroAutoManifesto rootRef={sectionRef} productIntroRef={productIntroRef} />
        <HeroMusicPlayer rootRef={sectionRef} />
        <HeroParticleHandoff
          rootRef={sectionRef}
          handoffRef={handoffRef}
          videoPlayerRef={videoPlayerRef}
          nextSectionRef={nextSectionRef}
        />
        <ScrollCue rootRef={sectionRef} />

        {/* Easter egg: boop the fox's nose → particle ripple */}
        <button
          type="button"
          aria-label="Boop the fox"
          className="absolute left-1/2 top-[58%] z-[26] h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-full"
          onClick={() => {
            window.dispatchEvent(new Event("obu-fox-boop"));
            playBoop();
          }}
        />
      </div>
    </section>
  );
}
