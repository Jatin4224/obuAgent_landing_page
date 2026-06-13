import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const command = "Schedule Sarah, draft the follow-up, and attach the roadmap.";

const integrations = [
  {
    name: "Gmail",
    icon: "/assets/gmail.png",
    result: "Finds the thread",
    span: "md:col-span-1",
    comingSoon: false,
    accent: "#FF6B6B",
    cubeColor: "#FF8A80",
    cubeShadow: "#c0392b",
    expression: "😄",
    floatDelay: "0s",
  },
  {
    name: "Calendar",
    icon: "/assets/calendar.png",
    result: "Checks availability",
    span: "md:col-span-1",
    comingSoon: false,
    accent: "#8B5CF6",
    cubeColor: "#A78BFA",
    cubeShadow: "#5b21b6",
    expression: "🤩",
    floatDelay: "0.4s",
  },
  {
    name: "Slack",
    icon: "/assets/slack.png",
    result: "Syncs context",
    span: "md:col-span-1",
    comingSoon: true,
    accent: "#4ADE80",
    cubeColor: "#86EFAC",
    cubeShadow: "#15803d",
    expression: "😴",
    floatDelay: "0.8s",
  },
  {
    name: "Notion",
    icon: "/assets/notion.png",
    result: "Updates notes",
    span: "md:col-span-1",
    comingSoon: true,
    accent: "#60A5FA",
    cubeColor: "#93C5FD",
    cubeShadow: "#1d4ed8",
    expression: "😪",
    floatDelay: "0.3s",
  },
  {
    name: "Drive",
    icon: "/assets/drive.png",
    result: "Attaches files",
    span: "md:col-span-2",
    comingSoon: true,
    accent: "#F59E0B",
    cubeColor: "#FCD34D",
    cubeShadow: "#b45309",
    expression: "😏",
    floatDelay: "0.6s",
  },
];

// ── Cute 3D CSS Cube Character ──────────────────────────────────
function CuteCube({
  color,
  shadowColor,
  expression,
  comingSoon,
  accent,
  size = 64,
}) {
  const [wiggle, setWiggle] = useState(false);
  const s = size;
  const side = s * 0.18; // side face depth
  const leg = s * 0.22;
  const arm = s * 0.18;
  const eye = s * 0.11;
  const pupil = s * 0.055;
  const cheek = s * 0.09;
  const mouth = s * 0.22;

  // darken color for sides
  const darker = shadowColor;
  const top = lighten(color, 30);

  return (
    <div
      className="select-none"
      style={{
        position: "relative",
        width: s + arm * 2.4,
        height: s + leg + s * 0.15,
        cursor: "pointer",
        flexShrink: 0,
      }}
      onClick={() => {
        setWiggle(true);
        setTimeout(() => setWiggle(false), 600);
      }}
    >
      <style>{`
        @keyframes cubefloat {
          0%,100% { transform: translateY(0px); }
          50%      { transform: translateY(-8px); }
        }
        @keyframes wiggle {
          0%,100% { transform: translateY(0px) rotate(0deg); }
          20%     { transform: translateY(-6px) rotate(-6deg); }
          40%     { transform: translateY(-4px) rotate(6deg); }
          60%     { transform: translateY(-8px) rotate(-4deg); }
          80%     { transform: translateY(-2px) rotate(3deg); }
        }
        @keyframes blink {
          0%,90%,100% { transform: scaleY(1); }
          95% { transform: scaleY(0.1); }
        }
        @keyframes spherefloat {
          0%,100% { transform: translate(0,0); }
          33%     { transform: translate(4px,-6px); }
          66%     { transform: translate(-3px,3px); }
        }
        .cube-body {
          animation: cubefloat 3s ease-in-out infinite;
        }
        .cube-body.wiggling {
          animation: wiggle 0.6s ease-in-out !important;
        }
        .cube-eye {
          animation: blink 4s ease-in-out infinite;
          transform-origin: center bottom;
        }
      `}</style>

      {/* Floating micro spheres */}
      {[
        {
          w: s * 0.09,
          x: arm * 0.4,
          y: s * 0.05,
          delay: "0s",
          col: color,
          op: comingSoon ? 0.2 : 0.7,
        },
        {
          w: s * 0.06,
          x: s + arm * 1.8,
          y: s * 0.25,
          delay: "1s",
          col: accent,
          op: comingSoon ? 0.15 : 0.6,
        },
        {
          w: s * 0.05,
          x: s * 0.5,
          y: s + leg * 0.3,
          delay: "1.8s",
          col: "#fff",
          op: comingSoon ? 0.1 : 0.35,
        },
        {
          w: s * 0.07,
          x: arm * 1.1,
          y: s * 0.7,
          delay: "0.6s",
          col: lighter(color, 50),
          op: comingSoon ? 0.15 : 0.5,
        },
      ].map((sp, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: sp.x,
            top: sp.y,
            width: sp.w,
            height: sp.w,
            borderRadius: "50%",
            background: sp.col,
            opacity: sp.op,
            animation: `spherefloat ${2.5 + i * 0.4}s ease-in-out infinite`,
            animationDelay: sp.delay,
            filter: "blur(0.5px)",
          }}
        />
      ))}

      {/* Body wrapper (floats up/down) */}
      <div
        className={`cube-body${wiggle ? " wiggling" : ""}`}
        style={{
          position: "absolute",
          left: arm * 1.2,
          top: 0,
          width: s,
          animationDelay: "0.2s",
          filter: comingSoon ? "grayscale(0.6) brightness(0.65)" : "none",
        }}
      >
        {/* ── LEFT ARM ── */}
        <div
          style={{
            position: "absolute",
            left: -arm * 1.05,
            top: s * 0.28,
            width: arm * 0.55,
            height: arm * 1.1,
            background: `linear-gradient(90deg, ${darker} 0%, ${color} 100%)`,
            borderRadius: "40% 20% 30% 50%",
            transform: "rotate(-15deg)",
            boxShadow: `2px 2px 6px rgba(0,0,0,0.35)`,
          }}
        />

        {/* ── RIGHT ARM ── */}
        <div
          style={{
            position: "absolute",
            right: -arm * 1.05,
            top: s * 0.28,
            width: arm * 0.55,
            height: arm * 1.1,
            background: `linear-gradient(270deg, ${darker} 0%, ${color} 100%)`,
            borderRadius: "20% 40% 50% 30%",
            transform: "rotate(15deg)",
            boxShadow: `-2px 2px 6px rgba(0,0,0,0.35)`,
          }}
        />

        {/* ── MAIN BODY (front face) ── */}
        <div
          style={{
            position: "relative",
            width: s,
            height: s,
            background: `linear-gradient(145deg, ${lighter(color, 25)} 0%, ${color} 55%, ${darker} 100%)`,
            borderRadius: s * 0.22,
            boxShadow: `
            ${s * 0.04}px ${s * 0.07}px 0 ${s * 0.03}px ${darker},
            0 ${s * 0.1}px ${s * 0.2}px rgba(0,0,0,0.4),
            inset 0 ${s * 0.04}px ${s * 0.08}px rgba(255,255,255,0.25)
          `,
            overflow: "hidden",
          }}
        >
          {/* Page curl top-right like the reference image */}
          <div
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              width: s * 0.22,
              height: s * 0.22,
              background: `linear-gradient(225deg, rgba(255,255,255,0.35) 0%, transparent 60%)`,
              borderRadius: `0 ${s * 0.22}px 0 ${s * 0.18}px`,
            }}
          />

          {/* Shine streak */}
          <div
            style={{
              position: "absolute",
              top: s * 0.05,
              left: s * 0.1,
              width: s * 0.12,
              height: s * 0.38,
              background: "rgba(255,255,255,0.2)",
              borderRadius: 99,
              transform: "rotate(20deg)",
            }}
          />

          {/* ── FACE ── */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              paddingTop: s * 0.05,
            }}
          >
            {/* Eyes row */}
            <div
              style={{ display: "flex", gap: s * 0.16, marginBottom: s * 0.06 }}
            >
              {[0, 1].map((i) => (
                <div key={i} style={{ position: "relative" }}>
                  {/* Eye white */}
                  <div
                    style={{
                      width: eye,
                      height: eye,
                      background: "#fff",
                      borderRadius: "50%",
                      boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {/* Pupil */}
                    <div
                      className="cube-eye"
                      style={{
                        width: pupil,
                        height: pupil,
                        background: "#1a1a2e",
                        borderRadius: "50%",
                        marginTop: pupil * 0.3,
                      }}
                    />
                  </div>
                  {/* Star sparkle on eye */}
                  {!comingSoon && (
                    <div
                      style={{
                        position: "absolute",
                        top: -eye * 0.15,
                        right: -eye * 0.15,
                        width: eye * 0.3,
                        height: eye * 0.3,
                        background: "#fff",
                        borderRadius: "50%",
                        opacity: 0.9,
                      }}
                    />
                  )}
                </div>
              ))}
            </div>

            {/* Cheeks */}
            <div
              style={{
                display: "flex",
                gap: s * 0.28,
                marginBottom: s * 0.04,
                marginTop: -s * 0.02,
              }}
            >
              {[0, 1].map((i) => (
                <div
                  key={i}
                  style={{
                    width: cheek,
                    height: cheek * 0.6,
                    background: "rgba(255,100,100,0.45)",
                    borderRadius: "50%",
                    filter: "blur(2px)",
                  }}
                />
              ))}
            </div>

            {/* Mouth */}
            {comingSoon ? (
              // sleeping "zzz" mouth — flat line
              <div
                style={{
                  width: mouth * 0.7,
                  height: 2,
                  background: "rgba(0,0,0,0.35)",
                  borderRadius: 99,
                }}
              />
            ) : (
              // happy arc
              <div
                style={{
                  width: mouth,
                  height: mouth * 0.5,
                  border: "none",
                  borderBottom: `${s * 0.035}px solid rgba(0,0,0,0.35)`,
                  borderRadius: `0 0 ${mouth}px ${mouth}px`,
                }}
              />
            )}
          </div>
        </div>

        {/* ── LEGS ── */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-around",
            paddingTop: s * 0.04,
            paddingLeft: s * 0.1,
            paddingRight: s * 0.1,
          }}
        >
          {[0, 1].map((i) => (
            <div
              key={i}
              style={{
                width: s * 0.2,
                height: leg,
                background: `linear-gradient(180deg, ${color} 0%, ${darker} 100%)`,
                borderRadius: `${s * 0.05}px ${s * 0.05}px ${s * 0.1}px ${s * 0.1}px`,
                boxShadow: "0 4px 8px rgba(0,0,0,0.3)",
                transformOrigin: "top center",
              }}
            />
          ))}
        </div>

        {/* Shadow under cube */}
        <div
          style={{
            position: "absolute",
            bottom: -leg * 0.3,
            left: "50%",
            transform: "translateX(-50%)",
            width: s * 0.6,
            height: s * 0.1,
            background: "rgba(0,0,0,0.2)",
            borderRadius: "50%",
            filter: "blur(6px)",
          }}
        />
      </div>

      {/* ZZZ for sleeping ones */}
      {comingSoon && (
        <div
          style={{
            position: "absolute",
            right: arm * 0.2,
            top: -s * 0.12,
            fontSize: s * 0.18,
            opacity: 0.5,
            color: "#fff",
            animation: "spherefloat 2s ease-in-out infinite",
            fontWeight: 700,
          }}
        >
          zzz
        </div>
      )}
    </div>
  );
}

// color helpers
function lighter(hex, amount) {
  try {
    const n = parseInt(hex.slice(1), 16);
    const r = Math.min(255, (n >> 16) + amount);
    const g = Math.min(255, ((n >> 8) & 0xff) + amount);
    const b = Math.min(255, (n & 0xff) + amount);
    return `rgb(${r},${g},${b})`;
  } catch {
    return hex;
  }
}
function lighten(hex, amount) {
  return lighter(hex, amount);
}

// ── Main Component ────────────────────────────────────────────
export default function IntegrationsBentoCute() {
  const sectionRef = useRef(null);
  const introBoxRef = useRef(null);
  const typedRef = useRef(null);
  const bentoRefs = useRef([]);
  const finalBoxRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(introBoxRef.current, {
        opacity: 0,
        y: 40,
        filter: "blur(12px)",
      });
      gsap.set(bentoRefs.current, {
        opacity: 0,
        y: 40,
        filter: "blur(10px)",
        scale: 0.95,
      });
      gsap.set(finalBoxRef.current, { opacity: 0, y: 20, filter: "blur(8px)" });

      const typeState = { count: 0 };

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "center center",
          end: "+=250%",
          scrub: 1,
          pin: true,
          anticipatePin: 1,
        },
      });

      tl.to(introBoxRef.current, {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        duration: 0.8,
        ease: "power3.out",
      })
        .to(
          typeState,
          {
            count: command.length,
            duration: 1.5,
            ease: "none",
            onUpdate() {
              if (typedRef.current)
                typedRef.current.textContent = command.slice(
                  0,
                  Math.round(typeState.count),
                );
            },
          },
          "<0.2",
        )
        .to(
          bentoRefs.current,
          {
            opacity: 1,
            y: 0,
            scale: 1,
            filter: "blur(0px)",
            duration: 0.8,
            stagger: 0.15,
            ease: "back.out(1.2)",
          },
          "<0.8",
        )
        .to(
          finalBoxRef.current,
          {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 0.8,
            ease: "power3.out",
          },
          "-=0.2",
        );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-screen items-center justify-center overflow-hidden px-5 py-16 text-white"
      style={{
        background: "#000",
        fontFamily: '"Inter", system-ui, sans-serif',
      }}
    >
      {/* subtle bg */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <div
          className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(139,92,246,0.07) 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute bottom-[-15%] right-[-10%] w-[45vw] h-[45vw] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(255,107,107,0.05) 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
            maskImage:
              "radial-gradient(ellipse 70% 70% at 50% 50%, black 20%, transparent 100%)",
          }}
        />
      </div>

      <div className="relative z-10 w-full max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
        {/* ── ROW 1: Command Box ── */}
        <div
          ref={introBoxRef}
          className="col-span-1 md:col-span-3 flex flex-col justify-center relative overflow-hidden"
          style={{
            borderRadius: "1.75rem",
            border: "1px solid rgba(255,255,255,0.08)",
            background: "rgba(255,255,255,0.03)",
            backdropFilter: "blur(20px)",
            padding: "2rem 2.25rem",
            boxShadow:
              "0 0 0 1px rgba(255,255,255,0.04), 0 8px 40px rgba(0,0,0,0.6)",
          }}
        >
          <div className="flex items-center gap-2 mb-4">
            <div
              className="w-1.5 h-1.5 rounded-full bg-[#8B5CF6]"
              style={{ boxShadow: "0 0 8px rgba(139,92,246,0.8)" }}
            />
            <p
              style={{
                fontSize: "0.65rem",
                fontWeight: 600,
                letterSpacing: "0.25em",
                textTransform: "uppercase",
                color: "rgba(139,92,246,0.8)",
              }}
            >
              Connected Workspace
            </p>
          </div>
          <h2
            style={{
              fontSize: "clamp(1.9rem,4vw,3.5rem)",
              fontWeight: 600,
              letterSpacing: "-0.04em",
              lineHeight: 1.05,
              color: "#fff",
              marginBottom: "1.75rem",
            }}
          >
            Obu works across{" "}
            <span style={{ color: "rgba(255,255,255,0.3)" }}>your tools.</span>
          </h2>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.875rem",
              borderRadius: "999px",
              border: "1px solid rgba(255,255,255,0.1)",
              background: "rgba(255,255,255,0.05)",
              backdropFilter: "blur(16px)",
              padding: "0.875rem 1.25rem",
              boxShadow:
                "inset 0 1px 0 rgba(255,255,255,0.06), 0 4px 24px rgba(0,0,0,0.4)",
            }}
          >
            <span
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 36,
                height: 36,
                flexShrink: 0,
                borderRadius: "50%",
                background: "linear-gradient(135deg,#8B5CF6,#EC4899)",
                fontSize: "0.85rem",
                fontWeight: 700,
                color: "#fff",
                boxShadow: "0 0 20px rgba(139,92,246,0.4)",
              }}
            >
              ✦
            </span>
            <p
              style={{
                flex: 1,
                fontSize: "1rem",
                fontWeight: 300,
                letterSpacing: "-0.01em",
                color: "rgba(255,255,255,0.85)",
              }}
            >
              <span ref={typedRef} />
              <span
                style={{
                  display: "inline-block",
                  width: 2,
                  height: "1.1em",
                  background: "#8B5CF6",
                  marginLeft: 3,
                  verticalAlign: "text-bottom",
                  borderRadius: 1,
                  animation: "pulse 1s ease-in-out infinite",
                }}
              />
            </p>
          </div>
        </div>

        {/* ── INTEGRATION TILES ── */}
        {integrations.map((item, index) => (
          <div
            key={item.name}
            ref={(node) => {
              if (node) bentoRefs.current[index] = node;
            }}
            className={`${item.span} relative group flex flex-col justify-between overflow-hidden`}
            style={{
              borderRadius: "1.5rem",
              border: `1px solid ${item.comingSoon ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.08)"}`,
              background: item.comingSoon
                ? "rgba(255,255,255,0.015)"
                : "rgba(255,255,255,0.03)",
              backdropFilter: "blur(20px)",
              padding: "1.5rem",
              boxShadow: item.comingSoon
                ? "none"
                : `0 0 0 1px rgba(255,255,255,0.03), 0 4px 24px rgba(0,0,0,0.5), 0 0 40px ${item.accent}08`,
              transition:
                "transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease",
              minHeight: 200,
            }}
            onMouseEnter={(e) => {
              if (item.comingSoon) return;
              e.currentTarget.style.transform = "translateY(-4px)";
              e.currentTarget.style.borderColor = `${item.accent}35`;
              e.currentTarget.style.boxShadow = `0 0 0 1px ${item.accent}20, 0 16px 48px rgba(0,0,0,0.6), 0 0 60px ${item.accent}15`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.borderColor = item.comingSoon
                ? "rgba(255,255,255,0.05)"
                : "rgba(255,255,255,0.08)";
              e.currentTarget.style.boxShadow = item.comingSoon
                ? "none"
                : `0 0 0 1px rgba(255,255,255,0.03), 0 4px 24px rgba(0,0,0,0.5), 0 0 40px ${item.accent}08`;
            }}
          >
            {/* Corner glow */}
            {!item.comingSoon && (
              <div
                className="absolute top-0 left-0 w-32 h-32 pointer-events-none"
                style={{
                  background: `radial-gradient(circle at 0% 0%, ${item.accent}15 0%, transparent 70%)`,
                  borderRadius: "1.5rem 0 0 0",
                }}
              />
            )}

            {/* ── Cute Cube ── */}
            <div className="relative z-10 flex justify-center mb-2 pt-2">
              <CuteCube
                color={item.cubeColor}
                shadowColor={item.cubeShadow}
                expression={item.expression}
                comingSoon={item.comingSoon}
                accent={item.accent}
                size={72}
              />
            </div>

            {/* Name + live/soon + result */}
            <div className="relative z-10 flex items-end justify-between gap-3 mt-auto">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  {item.comingSoon ? (
                    <span
                      style={{
                        fontSize: "0.55rem",
                        fontWeight: 500,
                        letterSpacing: "0.18em",
                        textTransform: "uppercase",
                        color: "rgba(255,255,255,0.2)",
                        border: "1px solid rgba(255,255,255,0.07)",
                        borderRadius: "999px",
                        padding: "3px 8px",
                        background: "rgba(0,0,0,0.3)",
                      }}
                    >
                      Soon
                    </span>
                  ) : (
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 5 }}
                    >
                      <div
                        style={{
                          width: 6,
                          height: 6,
                          borderRadius: "50%",
                          background: item.accent,
                          boxShadow: `0 0 8px ${item.accent}`,
                          animation: "pulse 2s ease-in-out infinite",
                        }}
                      />
                      <span
                        style={{
                          fontSize: "0.58rem",
                          fontWeight: 600,
                          letterSpacing: "0.15em",
                          textTransform: "uppercase",
                          color: item.accent,
                        }}
                      >
                        Live
                      </span>
                    </div>
                  )}
                </div>
                <h3
                  style={{
                    fontSize: "clamp(1.25rem,2vw,1.5rem)",
                    fontWeight: 500,
                    letterSpacing: "-0.03em",
                    color: item.comingSoon ? "rgba(255,255,255,0.2)" : "#fff",
                    lineHeight: 1,
                  }}
                >
                  {item.name}
                </h3>
              </div>

              <div
                style={{
                  whiteSpace: "nowrap",
                  fontSize: "0.58rem",
                  fontWeight: 600,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  padding: "5px 12px",
                  borderRadius: "999px",
                  ...(item.comingSoon
                    ? {
                        border: "1px solid rgba(255,255,255,0.06)",
                        color: "rgba(255,255,255,0.18)",
                        background: "rgba(0,0,0,0.2)",
                      }
                    : {
                        border: `1px solid ${item.accent}35`,
                        color: item.accent,
                        background: `${item.accent}12`,
                        boxShadow: `0 0 16px ${item.accent}15`,
                      }),
                }}
              >
                {item.result}
              </div>
            </div>
          </div>
        ))}

        {/* ── FINAL ROW ── */}
        <div
          ref={finalBoxRef}
          className="col-span-1 md:col-span-3 flex items-center justify-center relative overflow-hidden"
          style={{
            borderRadius: "1.75rem",
            border: "1px solid rgba(255,255,255,0.07)",
            background: "rgba(255,255,255,0.02)",
            backdropFilter: "blur(24px)",
            padding: "2.25rem 2rem",
            boxShadow:
              "0 0 0 1px rgba(255,255,255,0.03), 0 8px 40px rgba(0,0,0,0.5)",
          }}
        >
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse 50% 80% at 50% 50%, rgba(139,92,246,0.06) 0%, transparent 70%)",
            }}
          />
          <h3
            className="relative z-10 text-center"
            style={{
              fontSize: "clamp(1.5rem,3vw,2.5rem)",
              fontWeight: 500,
              letterSpacing: "-0.03em",
              lineHeight: 1.15,
              color: "#fff",
            }}
          >
            One prompt becomes your{" "}
            <span
              style={{
                background: "linear-gradient(135deg,#8B5CF6,#EC4899,#F59E0B)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              whole workflow.
            </span>
          </h3>
        </div>
      </div>

      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}`}</style>
    </section>
  );
}
