import React, { useState, useRef, useEffect } from "react";
import { Play, X } from "lucide-react";
import ScrollReveal from "./ScrollReveal";

const PromoVideo: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 1200, height: 700 });

  // Video Configuration
  const videoId = "naTeRG6LQ8w";
  const siParam = "lqkesAld0AZtEWIr"; // Updated SI parameter from new snippet
  const startParam = "0"; // Start at 0 seconds

  useEffect(() => {
    if (!containerRef.current) return;

    const updateSize = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight,
        });
      }
    };

    updateSize();

    // Use ResizeObserver for precise container monitoring
    const observer = new ResizeObserver(() => {
      updateSize();
    });
    observer.observe(containerRef.current);

    window.addEventListener("resize", updateSize);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateSize);
    };
  }, []);

  // Compute 16:9 Cover Size with safety buffer
  let iframeWidth = dimensions.width;
  let iframeHeight = dimensions.width * (9 / 16);

  if (iframeHeight < dimensions.height) {
    iframeHeight = dimensions.height;
    iframeWidth = dimensions.height * (16 / 9);
  }

  // 1.05x multiplier ensures video edges are tucked safely behind the hidden container seams
  const finalWidth = iframeWidth * 1.05;
  const finalHeight = iframeHeight * 1.05;

  return (
    <>
      <section
        ref={containerRef}
        className="relative h-[500px] md:h-[700px] w-full overflow-hidden bg-black group cursor-pointer"
        onClick={() => setIsOpen(true)}
      >
        {/* Background Video (Muted, Autoplay, No Controls) */}
        {/* Used youtube-nocookie.com and correct referrerPolicy */}
        <div className="absolute inset-0 w-full h-full pointer-events-none opacity-60 overflow-hidden flex items-center justify-center">
          <iframe
            style={{
              width: `${finalWidth}px`,
              height: `${finalHeight}px`,
              pointerEvents: "none",
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
            }}
            src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&mute=1&controls=0&start=${startParam}&si=${siParam}&playsinline=1&rel=0&playlist=${videoId}&loop=1`}
            title="Promo Background"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
          ></iframe>
        </div>

        {/* Dark Overlay for text readability */}
        <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-colors duration-500"></div>

        {/* Center Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center z-10 px-4">
          <ScrollReveal>
            <span className="inline-block px-3 py-1 border border-white/30 rounded-full text-white/90 text-xs font-bold tracking-[0.2em] mb-6 backdrop-blur-md uppercase shadow-lg">
              Brand Film
            </span>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <h2 className="text-4xl md:text-7xl font-bold text-white mb-10 tracking-tight drop-shadow-2xl">
              DAEWOO METAL
            </h2>
          </ScrollReveal>

          <ScrollReveal delay={0.2} className="w-full flex justify-center">
            <button className="relative w-24 h-24 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30 group-hover:scale-110 group-hover:bg-white group-hover:text-black text-white transition-all duration-500 ease-spring shadow-[0_0_40px_rgba(255,255,255,0.1)] group-hover:shadow-[0_0_60px_rgba(255,255,255,0.4)]">
              <Play className="w-10 h-10 ml-1 fill-current" />

              {/* Ripple Effect Ring */}
              <div className="absolute inset-0 rounded-full border border-white/40 animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite] opacity-75"></div>
            </button>
          </ScrollReveal>
        </div>
      </section>

      {/* Fullscreen Video Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-xl animate-fade-in p-4 sm:p-10">
          {/* Close Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen(false);
            }}
            className="absolute top-6 right-6 text-white/50 hover:text-white hover:rotate-90 transition-all duration-300 z-50 p-2"
          >
            <X className="w-12 h-12" />
          </button>

          {/* Video Container */}
          <div className="w-full max-w-7xl aspect-video rounded-3xl overflow-hidden shadow-2xl relative border border-white/10 bg-black animate-scale-up">
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&start=${startParam}&si=${siParam}&rel=0`}
              title="Daewoo Metal Promo Video"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      )}
    </>
  );
};

export default PromoVideo;
