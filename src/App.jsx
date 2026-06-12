import { useRef } from "react";
import Hero from "./components/Hero.jsx";
import Nextcomponent from "./components/Nextcomponent.jsx";
import SmoothScroll from "./components/SmoothScroll.jsx";

export default function App() {
  const nextSectionRef = useRef(null);

  return (
    <SmoothScroll>
      <Hero nextSectionRef={nextSectionRef} />
      <Nextcomponent ref={nextSectionRef} />
    </SmoothScroll>
  );
}
