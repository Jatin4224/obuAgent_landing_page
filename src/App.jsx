import { useEffect, useRef, useState } from "react";
import DemoVideoSection from "./components/DemoVideoSection.jsx";
import FinalCtaSection from "./components/FinalCtaSection.jsx";
import Footer from "./components/Footer.jsx";
import Hero from "./components/Hero.jsx";
import LoginScreen from "./components/LoginScreen.jsx";
import Navbar from "./components/Navbar.jsx";
import Nextcomponent from "./components/Nextcomponent.jsx";
import SmoothScroll from "./components/SmoothScroll.jsx";
import TrustControlCollage from "./components/TrustControlCollage.jsx";

export default function App() {
  const nextSectionRef = useRef(null);
  const [route, setRoute] = useState(() => window.location.hash);

  useEffect(() => {
    const handleHashChange = () => {
      setRoute(window.location.hash);
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    };

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  if (route === "#login") {
    return <LoginScreen />;
  }

  return (
    <div className="bg-black text-white">
      <Navbar triggerRef={nextSectionRef} />
      <SmoothScroll>
        <Hero nextSectionRef={nextSectionRef} />
        <Nextcomponent ref={nextSectionRef} />
        <DemoVideoSection />
        <TrustControlCollage />
        <FinalCtaSection />
        <Footer />
      </SmoothScroll>
    </div>
  );
}
