import { useEffect, useRef } from "react";
import gsap from "gsap";
import { playTick } from "../lib/sound.js";

/**
 * Orange dot + trailing ring cursor. Desktop (fine-pointer) only.
 * - Grows over links/buttons/[data-cursor] targets, with a hover tick.
 * - [data-cursor-label="WATCH"] expands the ring into a labeled badge.
 * - Fades out over iframes (mousemove stops there) and when leaving the window.
 */
export default function CustomCursor() {
  const rootRef = useRef(null);
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const labelRef = useRef(null);

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return undefined;

    const root = rootRef.current;
    const ring = ringRef.current;
    const label = labelRef.current;
    document.documentElement.classList.add("has-custom-cursor");

    const dotX = gsap.quickTo(dotRef.current, "x", { duration: 0.06, ease: "power2.out" });
    const dotY = gsap.quickTo(dotRef.current, "y", { duration: 0.06, ease: "power2.out" });
    const ringX = gsap.quickTo(ring, "x", { duration: 0.28, ease: "power3.out" });
    const ringY = gsap.quickTo(ring, "y", { duration: 0.28, ease: "power3.out" });

    let visible = false;
    let lastHoverTarget = null;

    const show = () => {
      if (visible) return;
      visible = true;
      gsap.to(root, { autoAlpha: 1, duration: 0.25, overwrite: "auto" });
    };

    const hide = () => {
      if (!visible) return;
      visible = false;
      gsap.to(root, { autoAlpha: 0, duration: 0.2, overwrite: "auto" });
    };

    const setMode = (mode, labelText = "") => {
      if (mode === "label") {
        label.textContent = labelText;
        gsap.to(ring, {
          scale: 2.6,
          backgroundColor: "rgba(255,96,69,0.92)",
          borderColor: "rgba(255,96,69,0)",
          duration: 0.3,
          ease: "power3.out",
        });
        gsap.to(label, { autoAlpha: 1, duration: 0.2, delay: 0.08 });
        gsap.to(dotRef.current, { scale: 0, duration: 0.2 });
      } else if (mode === "hover") {
        gsap.to(ring, {
          scale: 1.8,
          backgroundColor: "rgba(255,255,255,0)",
          borderColor: "rgba(255,96,69,0.9)",
          duration: 0.3,
          ease: "power3.out",
        });
        gsap.to(label, { autoAlpha: 0, duration: 0.15 });
        gsap.to(dotRef.current, { scale: 0.55, duration: 0.2 });
      } else {
        gsap.to(ring, {
          scale: 1,
          backgroundColor: "rgba(255,255,255,0)",
          borderColor: "rgba(255,255,255,0.4)",
          duration: 0.3,
          ease: "power3.out",
        });
        gsap.to(label, { autoAlpha: 0, duration: 0.15 });
        gsap.to(dotRef.current, { scale: 1, duration: 0.2 });
      }
    };

    const handleMove = (event) => {
      show();
      dotX(event.clientX);
      dotY(event.clientY);
      ringX(event.clientX);
      ringY(event.clientY);
    };

    const handleOver = (event) => {
      // mousemove never fires inside iframes — fade out so the dot
      // doesn't freeze at the frame's edge (YouTube shows its own cursor).
      if (event.target.tagName === "IFRAME") {
        hide();
        return;
      }

      const labeled = event.target.closest?.("[data-cursor-label]");
      const interactive = event.target.closest?.("a, button, [data-cursor]");
      const target = labeled || interactive;

      if (target && target !== lastHoverTarget) {
        playTick();
      }
      lastHoverTarget = target;

      if (labeled) {
        setMode("label", labeled.dataset.cursorLabel);
      } else if (interactive) {
        setMode("hover");
      } else {
        setMode("default");
      }
    };

    const handleLeaveWindow = (event) => {
      if (!event.relatedTarget) hide();
    };

    const handleDown = () => gsap.to(ring, { scale: "-=0.25", duration: 0.12 });
    const handleUp = () => handleOver({ target: lastHoverTarget ?? document.body });

    window.addEventListener("mousemove", handleMove, { passive: true });
    document.addEventListener("mouseover", handleOver, { passive: true });
    document.addEventListener("mouseout", handleLeaveWindow, { passive: true });
    window.addEventListener("mousedown", handleDown, { passive: true });
    window.addEventListener("mouseup", handleUp, { passive: true });

    return () => {
      document.documentElement.classList.remove("has-custom-cursor");
      window.removeEventListener("mousemove", handleMove);
      document.removeEventListener("mouseover", handleOver);
      document.removeEventListener("mouseout", handleLeaveWindow);
      window.removeEventListener("mousedown", handleDown);
      window.removeEventListener("mouseup", handleUp);
    };
  }, []);

  return (
    <div
      ref={rootRef}
      className="pointer-events-none fixed inset-0 z-[600] opacity-0"
      aria-hidden="true"
    >
      <div
        ref={ringRef}
        className="absolute -left-5 -top-5 flex h-10 w-10 items-center justify-center rounded-full border border-white/40"
      >
        <span
          ref={labelRef}
          className="font-mono text-[0.5rem] font-black uppercase tracking-[0.08em] text-black opacity-0"
        >
          WATCH
        </span>
      </div>
      <div
        ref={dotRef}
        className="absolute -left-[3px] -top-[3px] h-1.5 w-1.5 rounded-full bg-[#FF6045] shadow-[0_0_10px_rgba(255,96,69,0.9)]"
      />
    </div>
  );
}
