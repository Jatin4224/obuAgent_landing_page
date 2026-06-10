const highlightedPhrases = [
  "Obu",
  "workday",
  "extra clicks",
  "Emails drafted",
  "Meetings scheduled",
  "Follow-ups remembered",
  "Gmail",
  "Calendar",
  "you",
  "agent",
  "understands",
  "actually work",
];

const highlightClass =
  "font-normal text-white drop-shadow-[0_0_18px_rgba(255,255,255,0.42)]";

export default function HeroHighlightedText({ children }) {
  const source = String(children);
  const pattern = new RegExp(`(${highlightedPhrases.join("|")})`, "gi");

  return source.split(pattern).map((part, index) => {
    const isHighlighted = highlightedPhrases.some(
      (phrase) => phrase.toLowerCase() === part.toLowerCase(),
    );

    if (part === "") {
      return null;
    }

    return (
      <span key={`${part}-${index}`} className={isHighlighted ? highlightClass : undefined}>
        {part}
      </span>
    );
  });
}
