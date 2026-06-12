import { Canvas, useFrame } from "@react-three/fiber";
import { useRef } from "react";
import BodyRunParticles from "./BodyRunParticles.jsx";
import EyeParticles from "./EyeParticles.jsx";
import FoxParticles from "./FoxParticles.jsx";
import HeroAutoManifesto from "./HeroAutoManifesto.jsx";
import HeroObuVideoFlyIn from "./HeroObuVideoFlyIn.jsx";
import HeroParticleHandoff from "./HeroParticleHandoff.jsx";
import WorkspacePowerOverlay from "./WorkspacePowerOverlay.jsx";

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
    <section ref={sectionRef} className="relative isolate z-0 h-[1850vh] bg-black">
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
          <BodyRunParticles
            bodyRevealRef={bodyRevealRef}
            productIntroRef={productIntroRef}
            handoffRef={handoffRef}
          />
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
        <HeroParticleHandoff
          rootRef={sectionRef}
          handoffRef={handoffRef}
          videoPlayerRef={videoPlayerRef}
          nextSectionRef={nextSectionRef}
        />
      </div>
    </section>
  );
}
