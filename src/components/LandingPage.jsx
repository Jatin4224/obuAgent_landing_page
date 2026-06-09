import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Calendar, FileText, Inbox, Mail, MessageSquare, Send } from 'lucide-react';
import ParticleHero from './ParticleHero.jsx';
import HeroOverlay from './HeroOverlay.jsx';

gsap.registerPlugin(ScrollTrigger);

const features = [
  { icon: Mail, title: 'Email management', text: 'Draft replies, triage threads, and keep important conversations moving.' },
  { icon: Calendar, title: 'Calendar scheduling', text: 'Find times, create events, add conferencing, and handle reschedules.' },
  { icon: Inbox, title: 'Inbox summaries', text: 'Turn noisy inboxes into crisp daily briefs and action lists.' },
  { icon: Send, title: 'Follow-up automation', text: 'Send thoughtful nudges after meetings, demos, and open loops.' },
  { icon: FileText, title: 'Meeting prep', text: 'Collect context, agenda notes, and recent emails before every call.' },
];

const integrations = ['Gmail', 'Google Calendar', 'Meet', 'Slack', 'Notion'];

export default function LandingPage() {
  const pageRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray('[data-reveal]').forEach((element) => {
        gsap.fromTo(
          element,
          { y: 34, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.9,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: element,
              start: 'top 82%',
            },
          },
        );
      });
    }, pageRef);

    return () => ctx.revert();
  }, []);

  return (
    <main ref={pageRef} className="min-h-screen overflow-hidden bg-black text-white">
      <section className="relative min-h-screen overflow-hidden">
        <div className="absolute inset-0 z-0">
          <ParticleHero />
        </div>
        <div className="pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(circle_at_50%_46%,transparent_0%,rgba(0,0,0,0.18)_38%,rgba(0,0,0,0.84)_78%)]" />
        <HeroOverlay />
      </section>

      <section id="workflow" className="relative z-20 border-t border-white/10 bg-black px-5 py-24 sm:px-8 lg:px-12">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div data-reveal>
            <p className="mb-4 text-sm font-medium uppercase tracking-[0.28em] text-[#FF8A3D]">Workflow</p>
            <h2 className="max-w-xl text-4xl font-semibold tracking-tight text-white sm:text-5xl">
              Delegate the messy middle of your workday.
            </h2>
            <p className="mt-5 max-w-xl text-base leading-7 text-[#9CA3AF] sm:text-lg">
              Obu turns a plain request into calendar actions, email drafts, approvals, and follow-ups.
            </p>
          </div>

          <div data-reveal className="rounded-[28px] border border-white/12 bg-white/[0.045] p-4 shadow-[0_0_70px_rgba(255,138,61,0.08)] backdrop-blur-xl sm:p-6">
            <div className="rounded-2xl border border-white/12 bg-black/60 p-5">
              <div className="mb-4 flex items-center gap-3 text-[#9CA3AF]">
                <MessageSquare className="h-4 w-4 text-[#FF8A3D]" />
                <span className="text-sm">You</span>
              </div>
              <p className="text-lg leading-8 text-white">
                Schedule a meeting with Sarah next Thursday and send her the roadmap.
              </p>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {['Calendar event created', 'Google Meet added', 'Email sent', 'Waiting for approval'].map((item) => (
                <div key={item} className="rounded-2xl border border-white/12 bg-white/[0.06] px-4 py-4 text-sm text-white/90">
                  <span className="mr-2 text-[#FF8A3D]">✓</span>
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="relative z-20 bg-black px-5 py-24 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-6xl">
          <div data-reveal className="mb-12 max-w-2xl">
            <p className="mb-4 text-sm font-medium uppercase tracking-[0.28em] text-[#FF8A3D]">Features</p>
            <h2 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">A calm control layer for executive work.</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {features.map(({ icon: Icon, title, text }) => (
              <article
                data-reveal
                key={title}
                className="rounded-[24px] border border-white/12 bg-white/[0.045] p-6 backdrop-blur-xl transition duration-300 hover:border-[#FF8A3D]/45 hover:bg-white/[0.07]"
              >
                <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-2xl border border-white/12 bg-white/[0.06] text-[#FF8A3D]">
                  <Icon className="h-5 w-5" strokeWidth={1.7} />
                </div>
                <h3 className="text-xl font-medium text-white">{title}</h3>
                <p className="mt-3 leading-7 text-[#9CA3AF]">{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="docs" className="relative z-20 border-y border-white/10 bg-white/[0.025] px-5 py-20 sm:px-8 lg:px-12">
        <div data-reveal className="mx-auto max-w-6xl">
          <p className="mb-4 text-sm font-medium uppercase tracking-[0.28em] text-[#FF8A3D]">Integrations</p>
          <div className="flex flex-wrap gap-3">
            {integrations.map((item) => (
              <div key={item} className="rounded-full border border-white/12 bg-black/50 px-5 py-3 text-sm text-white/85 backdrop-blur-xl">
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="pricing" className="relative z-20 bg-black px-5 py-28 text-center sm:px-8 lg:px-12">
        <div data-reveal className="mx-auto max-w-3xl">
          <p className="mb-4 text-sm font-medium uppercase tracking-[0.28em] text-[#FF8A3D]">Start</p>
          <h2 className="text-4xl font-semibold tracking-tight text-white sm:text-6xl">Let Obu run your workday.</h2>
          <p className="mx-auto mt-5 max-w-xl text-lg leading-8 text-[#9CA3AF]">
            Connect Gmail and Calendar, then ask Obu to handle the rest.
          </p>
          <a
            href="#"
            className="mt-9 inline-flex items-center gap-2 rounded-full bg-[#FF8A3D] px-6 py-3 text-sm font-semibold text-black shadow-[0_0_34px_rgba(255,138,61,0.35)]"
          >
            Start Free
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </section>
    </main>
  );
}
