import { useRef } from "react";
import Hero from "./components/Hero.jsx";
import Nextcomponent from "./components/Nextcomponent.jsx";

export default function App() {
  const nextSectionRef = useRef(null);

  return (
    <>
      <Hero nextSectionRef={nextSectionRef} />
      <Nextcomponent ref={nextSectionRef} />
    </>
  );
}
