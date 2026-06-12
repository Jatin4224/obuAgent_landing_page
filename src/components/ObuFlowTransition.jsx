import FlowArt, { FlowSection } from "../ui/components/scroll/FlowArt.jsx";
import MaskRevealOnHover from "./MaskRevealOnHover.jsx";

const dividerClass = "my-[2vw] border-none border-t opacity-70";

function TransitionLine({ children }) {
  return (
    <h2
      className="text-[clamp(4rem,13vw,15rem)] font-semibold uppercase leading-[0.82] tracking-[-0.075em]"
      style={{
        fontFamily: 'Georgia, "Times New Roman", serif',
      }}
    >
      {children}
    </h2>
  );
}

export default function ObuFlowTransition() {
  return (
    <MaskRevealOnHover
      className="h-screen"
      maskSizeSmall={18}
      maskSizeLarge={260}
      maskBackground="rgba(18,12,32,0.98)"
      originalContent={
        <FlowArt className="bg-black">
      <FlowSection style={{ backgroundColor: "#050505", color: "#fff" }}>
        <p className="text-xs font-semibold uppercase tracking-[0.42em] text-white/58">
          01 - Hero complete
        </p>
        <hr className={`${dividerClass} border-white/28`} />
        <div className="mt-auto">
          <TransitionLine>
            Obu
            <br />
            Is
            <br />
            Awake
          </TransitionLine>
        </div>
        <hr className={`${dividerClass} border-white/22`} />
        <p className="max-w-[46ch] text-[clamp(1.2rem,2.4vw,2.4rem)] font-light leading-snug text-white/68">
          The particle creature recedes. The product layer comes forward.
        </p>
      </FlowSection>

      <FlowSection style={{ backgroundColor: "#110a18", color: "#fff" }}>
        <p className="text-xs font-bold uppercase tracking-[0.42em] text-[#ffb28a]/80">
          02 - Workspace handoff
        </p>
        <hr className={`${dividerClass} border-white/24`} />
        <div>
          <TransitionLine>
            Tools
            <br />
            Start
            <br />
            Moving
          </TransitionLine>
        </div>
        <hr className={`${dividerClass} border-white/18`} />
        <p className="ml-auto max-w-[44ch] text-right text-[clamp(1.15rem,2.2vw,2.25rem)] font-normal leading-snug text-white/66">
          Gmail, Calendar, meetings, and follow-ups collapse into one simple prompt.
        </p>
      </FlowSection>

      <FlowSection style={{ backgroundColor: "#030303", color: "#fff" }}>
        <p className="text-xs font-semibold uppercase tracking-[0.42em] text-white/42">
          03 - Product experience
        </p>
        <hr className={`${dividerClass} border-white/20`} />
        <div className="mt-auto">
          <TransitionLine>
            One
            <br />
            Prompt
          </TransitionLine>
        </div>
        <hr className={`${dividerClass} border-white/16`} />
        <p className="max-w-[48ch] text-[clamp(1.15rem,2.2vw,2.25rem)] font-normal leading-snug text-white/58">
          Now the interface takes over with calm, readable product storytelling.
        </p>
      </FlowSection>
        </FlowArt>
      }
      maskContent={
        <div className="flex h-full w-full items-center justify-center bg-[radial-gradient(circle_at_50%_50%,rgba(124,58,237,0.26),rgba(0,0,0,0.96)_58%,#000_100%)] px-8 text-center text-white">
          <div className="max-w-5xl">
            <p className="mb-8 text-xs font-semibold uppercase tracking-[0.5em] text-white/46">
              Obu sees the workflow
            </p>
            <h2
              className="text-[clamp(3rem,9vw,10rem)] font-semibold uppercase leading-[0.86] tracking-[-0.075em]"
              style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
            >
              Email.
              <br />
              Calendar.
              <br />
              Follow-up.
            </h2>
            <p className="mx-auto mt-8 max-w-2xl text-[clamp(1rem,2vw,1.6rem)] leading-snug text-white/58">
              Move the cursor to reveal the quiet intelligence underneath the transition.
            </p>
          </div>
        </div>
      }
    />
  );
}
