import { useRef } from "react";
import DemoVideoSection from "./components/DemoVideoSection.jsx";
import Hero from "./components/Hero.jsx";
import Nextcomponent from "./components/Nextcomponent.jsx";
import SmoothScroll from "./components/SmoothScroll.jsx";
import TrustControlCollage from "./components/TrustControlCollage.jsx";

export default function App() {
  const nextSectionRef = useRef(null);

  return (
    <div className="bg-black text-white">
      <SmoothScroll>
        <Hero nextSectionRef={nextSectionRef} />
        <Nextcomponent ref={nextSectionRef} />
        <DemoVideoSection />
        <TrustControlCollage />
      </SmoothScroll>
    </div>
  );
}
