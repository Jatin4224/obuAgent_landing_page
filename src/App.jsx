import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import CustomCursor from "./components/CustomCursor.jsx";
import DemoVideoSection from "./components/DemoVideoSection.jsx";
import FinalCtaSection from "./components/FinalCtaSection.jsx";
import Footer from "./components/Footer.jsx";
import GrainOverlay from "./components/GrainOverlay.jsx";
import Hero from "./components/Hero.jsx";
import LoginScreen from "./components/LoginScreen.jsx";
import MarqueeStrip from "./components/MarqueeStrip.jsx";
import Navbar from "./components/Navbar.jsx";
import Nextcomponent from "./components/Nextcomponent.jsx";
import Preloader from "./components/Preloader.jsx";
import SmoothScroll from "./components/SmoothScroll.jsx";
import TrustControlCollage from "./components/TrustControlCollage.jsx";
import VelocitySkew from "./components/VelocitySkew.jsx";

export default function App() {
  const nextSectionRef = useRef(null);
  const previousRouteRef = useRef(window.location.hash);
  const wipeRef = useRef(null);
  const wipingRef = useRef(false);
  const [route, setRoute] = useState(() => window.location.hash);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      const previous = previousRouteRef.current;
      previousRouteRef.current = hash;

      // Only the landing ↔ login switch swaps screens; run the wipe there.
      // Plain section anchors must not reset scroll (breaks in-page nav).
      const crossingLogin = hash === "#login" || previous === "#login";
      if (!crossingLogin) {
        setRoute(hash);
        return;
      }

      if (wipingRef.current || !wipeRef.current) {
        window.scrollTo({ top: 0, left: 0, behavior: "auto" });
        setRoute(hash);
        return;
      }

      wipingRef.current = true;
      gsap
        .timeline({
          onComplete: () => {
            wipingRef.current = false;
          },
        })
        .set(wipeRef.current, { display: "flex", yPercent: 100 })
        .to(wipeRef.current, {
          yPercent: 0,
          duration: 0.5,
          ease: "power3.inOut",
          onComplete: () => {
            window.scrollTo({ top: 0, left: 0, behavior: "auto" });
            setRoute(hash);
          },
        })
        .to(wipeRef.current, {
          yPercent: -100,
          duration: 0.55,
          ease: "power3.inOut",
          delay: 0.18,
        })
        .set(wipeRef.current, { display: "none" });
    };

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  return (
    <div className="bg-black text-white">
      {!loaded && <Preloader onComplete={() => setLoaded(true)} />}
      <CustomCursor />
      <GrainOverlay />

      {route === "#login" ? (
        <LoginScreen />
      ) : (
        <>
          <Navbar triggerRef={nextSectionRef} />
          <SmoothScroll>
            <Hero nextSectionRef={nextSectionRef} />
            <VelocitySkew>
              <Nextcomponent ref={nextSectionRef} />
              <DemoVideoSection />
              <MarqueeStrip />
              <TrustControlCollage />
              <FinalCtaSection />
              <Footer />
            </VelocitySkew>
          </SmoothScroll>
        </>
      )}

      {/* login ↔ landing wipe transition */}
      <div
        ref={wipeRef}
        className="fixed inset-0 z-[300] hidden items-center justify-center bg-[#FF6045]"
        aria-hidden="true"
      >
        <img
          src="/assets/icon.png"
          alt=""
          className="h-16 w-16 object-contain drop-shadow-[0_6px_20px_rgba(0,0,0,0.35)]"
          draggable="false"
        />
      </div>
    </div>
  );
}
