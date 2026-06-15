import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import heavenAudio from "../assets/Heaven.mp3";

gsap.registerPlugin(ScrollTrigger);

export default function HeroMusicPlayer({ rootRef }) {
  const audioRef = useRef(null);
  const playerRef = useRef(null);
  const startedRef = useRef(false);
  const introActiveRef = useRef(false);
  const userPausedRef = useRef(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [needsTap, setNeedsTap] = useState(false);

  const playAudio = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    try {
      audio.volume = 0.28;
      await audio.play();
      startedRef.current = true;
      userPausedRef.current = false;
      setIsPlaying(true);
      setNeedsTap(false);
    } catch {
      setIsPlaying(false);
      setNeedsTap(true);
    }
  };

  const pauseAudio = () => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.pause();
    userPausedRef.current = true;
    setIsPlaying(false);
  };

  useEffect(() => {
    const tryDefaultPlay = () => {
      if (
        introActiveRef.current &&
        !startedRef.current &&
        !userPausedRef.current
      ) {
        playAudio();
      }
    };

    const interactionEvents = ["pointerdown", "touchstart", "keydown", "wheel"];
    interactionEvents.forEach((eventName) => {
      window.addEventListener(eventName, tryDefaultPlay, { passive: true });
    });

    const ctx = gsap.context(() => {
      gsap.set(playerRef.current, { autoAlpha: 0, y: 16, filter: "blur(8px)" });

      ScrollTrigger.create({
        trigger: rootRef.current,
        start: () => `top+=${window.innerHeight * 2.95} top`,
        invalidateOnRefresh: true,
        onEnter: () => {
          introActiveRef.current = true;
          gsap.to(playerRef.current, {
            autoAlpha: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 0.45,
            ease: "power3.out",
          });

          if (!startedRef.current && !userPausedRef.current) playAudio();
        },
        onEnterBack: () => {
          introActiveRef.current = true;
          gsap.to(playerRef.current, {
            autoAlpha: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 0.35,
            ease: "power3.out",
          });
        },
        onLeaveBack: () => {
          introActiveRef.current = false;
          pauseAudio();
          userPausedRef.current = false;
          startedRef.current = false;
          if (audioRef.current) audioRef.current.currentTime = 0;
          gsap.to(playerRef.current, {
            autoAlpha: 0,
            y: 16,
            filter: "blur(8px)",
            duration: 0.3,
            ease: "power2.out",
          });
        },
      });
    }, playerRef);

    return () => {
      pauseAudio();
      interactionEvents.forEach((eventName) => {
        window.removeEventListener(eventName, tryDefaultPlay);
      });
      ctx.revert();
    };
  }, [rootRef]);

  const toggleAudio = () => {
    if (isPlaying) {
      pauseAudio();
      return;
    }

    userPausedRef.current = false;
    playAudio();
  };

  return (
    <div
      ref={playerRef}
      className="pointer-events-auto absolute bottom-5 right-5 z-[70] opacity-0 sm:bottom-7 sm:right-7"
    >
      <audio ref={audioRef} src={heavenAudio} preload="auto" loop />

      <button
        type="button"
        onClick={toggleAudio}
        className="group flex items-center gap-3 rounded-full border border-white/[0.14] bg-black/36 px-3.5 py-3 text-left shadow-[0_18px_60px_rgba(0,0,0,0.45),inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-2xl transition hover:border-[#FF6045]/45 hover:bg-black/52 sm:px-4"
        aria-pressed={isPlaying}
        aria-label={isPlaying ? "Pause music" : "Play music"}
      >
        <span className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.06]">
          <span className="absolute inset-0 rounded-full bg-[#FF6045]/10 blur-md transition group-hover:bg-[#FF6045]/18" />
          {isPlaying ? (
            <span className="relative flex gap-1">
              <span className="h-4 w-1 rounded-full bg-white" />
              <span className="h-4 w-1 rounded-full bg-white" />
            </span>
          ) : (
            <span className="relative ml-0.5 h-0 w-0 border-y-[7px] border-l-[10px] border-y-transparent border-l-white" />
          )}
        </span>

        <span className="hidden sm:block">
          <span className="block font-mono text-[0.62rem] font-black uppercase tracking-[0.18em] text-white/42">
            Soundtrack
          </span>
          <span className="mt-0.5 block max-w-[11rem] truncate text-sm font-light text-white/82">
            {needsTap
              ? "play music"
              : isPlaying
                ? "Heaven is playing"
                : "listen good music"}
          </span>
        </span>
      </button>
    </div>
  );
}
