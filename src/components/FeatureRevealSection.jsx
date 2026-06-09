import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CalendarClock, Inbox, ListChecks, MailCheck, NotebookPen, Reply } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const features = [
  { icon: Inbox, title: 'Inbox summaries', text: 'Wake up to the few messages that actually need your attention.' },
  { icon: Reply, title: 'Smart replies', text: 'Draft thoughtful answers from thread context and your preferred tone.' },
  { icon: CalendarClock, title: 'Calendar scheduling', text: 'Find times, create events, and handle the calendar choreography.' },
  { icon: MailCheck, title: 'Follow-up reminders', text: 'Never lose the next step after a meeting, intro, or sales thread.' },
  { icon: NotebookPen, title: 'Meeting prep', text: 'Agenda notes and recent context are ready before the call starts.' },
  { icon: ListChecks, title: 'Daily planning', text: 'Turn inbox, meetings, and loose tasks into a clear operating plan.' },
];

export default function FeatureRevealSection() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray('[data-feature-card]').forEach((card, index) => {
        gsap.fromTo(
          card,
          { x: index % 2 === 0 ? -80 : 80, opacity: 0, filter: 'blur(16px)' },
          {
            x: 0,
            opacity: 1,
            filter: 'blur(0px)',
            duration: 0.95,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 82%',
            },
          },
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="features" ref={sectionRef} className="relative bg-black px-5 py-28 sm:px-8 lg:px-12">
      <div className="absolute inset-x-0 top-0 h-60 bg-gradient-to-b from-black via-black to-transparent" />
      <div className="relative mx-auto max-w-6xl">
        <div className="mb-14 max-w-2xl">
          <p className="mb-4 text-sm font-medium uppercase tracking-[0.28em] text-[#FF8A3D]">Capabilities</p>
          <h2 className="text-5xl font-semibold tracking-tight text-white sm:text-6xl">A quieter way to run the day.</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {features.map(({ icon: Icon, title, text }) => (
            <article
              key={title}
              data-feature-card
              className="group rounded-[28px] border border-white/12 bg-white/[0.045] p-6 shadow-[0_0_0_rgba(255,138,61,0)] backdrop-blur-xl transition duration-300 hover:border-[#FF8A3D]/45 hover:bg-white/[0.07] hover:shadow-[0_0_54px_rgba(255,138,61,0.12)] sm:p-7"
            >
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/12 bg-white/[0.06] text-[#FF8A3D]">
                <Icon className="h-5 w-5" strokeWidth={1.7} />
              </div>
              <h3 className="text-2xl font-semibold tracking-tight text-white">{title}</h3>
              <p className="mt-3 max-w-md leading-7 text-[#9CA3AF]">{text}</p>
            </article>
          ))}
        </div>
        <div id="start" className="pt-28 text-center">
          <h2 className="text-4xl font-semibold tracking-tight text-white sm:text-6xl">Let Obu run your workday.</h2>
          <p className="mx-auto mt-5 max-w-xl text-lg leading-8 text-[#9CA3AF]">Start with Gmail and Calendar. Let the agent take it from there.</p>
          <a href="#" className="mt-9 inline-flex rounded-full bg-[#FF8A3D] px-6 py-3 text-sm font-semibold text-black shadow-[0_0_36px_rgba(255,138,61,0.32)]">
            Start Free
          </a>
        </div>
      </div>
    </section>
  );
}
