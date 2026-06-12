const tornClip =
  "polygon(1.2% 8%, 2.8% 5.2%, 4.4% 6.8%, 6.1% 3.9%, 8% 6.4%, 9.8% 3.4%, 12% 6.9%, 14.1% 4.1%, 16.4% 6.7%, 18.2% 3.8%, 20.7% 6.2%, 23% 4.3%, 25.2% 7.1%, 27.6% 3.5%, 30% 6.4%, 32.4% 4.1%, 35% 7.2%, 37.6% 3.7%, 40% 6.5%, 42.4% 4.2%, 45% 6.9%, 47.6% 3.6%, 50% 6.6%, 52.5% 4.1%, 55% 7.3%, 57.4% 3.8%, 60% 6.4%, 62.3% 4.3%, 65% 7%, 67.4% 3.5%, 70% 6.7%, 72.5% 4%, 75% 7.2%, 77.3% 3.7%, 80% 6.3%, 82.2% 4.4%, 84.8% 6.8%, 87.3% 3.5%, 90% 6.7%, 92.1% 4%, 94.3% 7.5%, 96.5% 4.8%, 98.8% 7.8%, 97% 10.5%, 99.2% 13.2%, 97.1% 16%, 99% 19.1%, 96.9% 22.4%, 99.1% 25.5%, 97% 29%, 99.2% 32.2%, 96.8% 35.4%, 99% 38.8%, 97% 42.1%, 99.3% 45.4%, 96.7% 48.8%, 99.2% 52%, 97% 55.5%, 99.1% 58.7%, 96.8% 62.2%, 99.2% 65.4%, 97% 68.8%, 99% 72.1%, 96.9% 75.5%, 99.1% 78.8%, 96.8% 82.2%, 98.9% 85.6%, 96.5% 89%, 98.5% 92.5%, 96.1% 95.6%, 93.7% 93.9%, 91.2% 96.7%, 88.8% 94.1%, 86.2% 97%, 83.5% 94%, 81% 96.8%, 78.4% 93.7%, 75.8% 97.1%, 73.1% 94%, 70.5% 96.7%, 68% 93.8%, 65.4% 97.2%, 62.8% 94.1%, 60.1% 96.9%, 57.6% 93.6%, 55% 97.2%, 52.4% 94%, 49.8% 96.9%, 47.2% 93.7%, 44.6% 97%, 42% 94.1%, 39.5% 96.8%, 36.8% 93.8%, 34.2% 97.2%, 31.6% 94%, 29% 96.8%, 26.4% 93.7%, 23.8% 97%, 21.2% 94.1%, 18.6% 96.9%, 16% 93.6%, 13.4% 97%, 10.8% 94%, 8.2% 96.7%, 5.7% 93.5%, 3.1% 96%, 1.3% 92.4%, 3.2% 89.2%, 1% 85.8%, 3.1% 82.5%, 1% 79.2%, 3.2% 75.8%, 0.9% 72.4%, 3.1% 69.1%, 1% 65.7%, 3.3% 62.4%, 0.9% 59%, 3.1% 55.8%, 1% 52.4%, 3.2% 49%, 0.9% 45.6%, 3.1% 42.2%, 1% 38.9%, 3.3% 35.5%, 1% 32.1%, 3.2% 28.8%, 0.9% 25.4%, 3.1% 22%, 1.1% 18.7%, 3.2% 15.2%, 1% 11.8%)";

export default function ElectricVideoCard({
  src,
  youtubeId,
  title = "Obu demo",
}) {
  return (
    <div className="relative mx-auto w-full">
      <div className="pointer-events-none absolute -inset-8 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.08),transparent_18%),radial-gradient(circle_at_80%_70%,rgba(255,255,255,0.06),transparent_18%)] opacity-40" />
      <div className="pointer-events-none absolute -inset-8 opacity-25 [background-image:radial-gradient(rgba(255,255,255,0.18)_1px,transparent_1px)] [background-size:5px_5px]" />

      <div className="relative p-3 md:p-5">
        <div
          className="absolute inset-3 translate-y-3 bg-[#FF6045] md:inset-5 md:translate-y-4"
          style={{ clipPath: tornClip }}
        />
        <div
          className="relative bg-white p-[10px] shadow-[0_26px_90px_rgba(0,0,0,0.48),0_0_38px_rgba(255,96,69,0.18)] md:p-[14px]"
          style={{ clipPath: tornClip }}
        >
          <div
            className="relative overflow-hidden bg-black"
            style={{ clipPath: tornClip }}
          >
            {youtubeId ? (
              <iframe
                src={`https://www.youtube.com/embed/${youtubeId}?rel=0&modestbranding=1&playsinline=1`}
                title={title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="aspect-video h-full w-full"
              />
            ) : (
              <video
                src={src}
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
                className="aspect-video h-full w-full object-cover"
              />
            )}
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,transparent_58%,rgba(0,0,0,0.28)_100%)]" />
            <div className="pointer-events-none absolute inset-0 opacity-[0.16] mix-blend-overlay [background-image:radial-gradient(rgba(255,255,255,0.8)_1px,transparent_1px)] [background-size:3px_3px]" />
          </div>
        </div>
      </div>
    </div>
  );
}
