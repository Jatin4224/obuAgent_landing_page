import { useEffect } from "react";
import Lenis from "lenis";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function SmoothScroll({ children }) {
  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduceMotion) {
      ScrollTrigger.refresh();
      return undefined;
    }

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - 2 ** (-10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.15,
      wheelMultiplier: 0.9,
    });

    const handleScroll = () => {
      ScrollTrigger.update();
    };

    lenis.on("scroll", handleScroll);

    // Glide to in-page sections through Lenis instead of hard-jumping.
    // pushState (not location.hash) avoids the app's hashchange handler.
    const handleAnchorClick = (event) => {
      const link = event.target.closest('a[href^="#"]');
      if (!link) return;

      const href = link.getAttribute("href");
      if (!href || href === "#" || href === "#login") return;

      const target = document.querySelector(href);
      if (!target) return;

      event.preventDefault();
      window.history.pushState(null, "", href);
      lenis.scrollTo(target, { duration: 1.6, easing: (t) => 1 - (1 - t) ** 4 });
    };

    document.addEventListener("click", handleAnchorClick);

    let frameId = 0;
    const raf = (time) => {
      lenis.raf(time);
      frameId = requestAnimationFrame(raf);
    };

    frameId = requestAnimationFrame(raf);
    ScrollTrigger.refresh();

    return () => {
      cancelAnimationFrame(frameId);
      document.removeEventListener("click", handleAnchorClick);
      lenis.off("scroll", handleScroll);
      lenis.destroy();
    };
  }, []);

  return children;
}
