import React, { useEffect, useState, useRef } from "react";
import Button from "./Button";
import { ArrowDown, ChevronDown } from "lucide-react";
import { useSite } from "../contexts/SiteContext";
import heroBg from "../assets/IMG_4372.JPG";

const Hero: React.FC = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Use Refs for direct DOM manipulation to avoid re-renders on scroll (performance optimization)
  const bgRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const { t, content, language } = useSite();

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollY = window.scrollY;

          // Apply parallax effect directly to DOM elements
          if (bgRef.current) {
            // Background moves slower than scroll (0.5 speed)
            // Added mouse position interaction for subtle depth
            bgRef.current.style.transform = `translate3d(${mousePos.x * -20}px, ${scrollY * 0.5 + mousePos.y * -20}px, 0) scale(1.05)`;
          }

          if (contentRef.current) {
            // Content moves faster than scroll (parallax) and fades out
            // Simulates the content "lifting off" as you scroll down
            const translateY = scrollY * 0.4;
            const opacity = Math.max(0, 1 - scrollY / 500); // Fades out completely by 500px scroll
            const scale = 1 - scrollY / 2000; // Subtle shrink effect

            contentRef.current.style.transform = `translate3d(0, ${translateY}px, 0) scale(${scale})`;
            contentRef.current.style.opacity = `${opacity}`;

            // Blur effect as it scrolls out
            contentRef.current.style.filter = `blur(${scrollY / 50}px)`;
          }

          if (scrollIndicatorRef.current) {
            // Scroll indicator fades out quickly
            const opacity = Math.max(0, 1 - scrollY / 100);
            scrollIndicatorRef.current.style.opacity = `${opacity}`;
            scrollIndicatorRef.current.style.transform = `translate3d(-50%, ${scrollY * 0.8}px, 0)`;
          }

          ticking = false;
        });
        ticking = true;
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      // Calculate mouse position relative to center of screen (-1 to 1)
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = (e.clientY / window.innerHeight) * 2 - 1;
      setMousePos({ x, y });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [mousePos]);

  const scrollToContent = () => {
    // Scroll to the next section (Products)
    const productsSection = document.getElementById("products");
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  const isDefaultLang = language === "KOR";

  return (
    <div
      ref={containerRef}
      className="relative h-screen w-full overflow-hidden bg-[#111111]"
    >
      {/* 
        Background Image Layer 
        Optimized: Using ref for direct DOM manipulation
      */}
      <div
        ref={bgRef}
        className="absolute inset-[-5%] w-[110%] h-[120%] will-change-transform"
      >
        <div className="w-full h-full">
          <img
            src={heroBg}
            alt="Hero Background"
            className="w-full h-full object-cover filter grayscale brightness-[0.4] contrast-125"
          />
        </div>

        {/* Gradient Overlays */}
        {/* 1. Dark overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#071D49]/40 to-[#050505]/70 mix-blend-multiply sm:via-[#071D49]/30 sm:to-[#050505]/60" />

        {/* 2. Top fade for header */}
        <div className="absolute top-0 left-0 w-full h-40 bg-gradient-to-b from-black/60 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
        <div
          ref={contentRef}
          className="max-w-4xl space-y-10 will-change-transform origin-center"
        >
          {/* Badge */}
          <div
            className="opacity-0 animate-slow-reveal"
            style={{ animationDelay: "0.2s" }}
          >
            <span className="inline-block px-4 py-1.5 rounded-full border border-white/20 text-white/90 text-sm font-medium backdrop-blur-md bg-white/5 shadow-[0_0_15px_rgba(255,255,255,0.05)]">
              {isDefaultLang
                ? content["home_hero_badge"] || t.hero.badge
                : t.hero.badge}
            </span>
          </div>

          <h1
            className="text-3xl md:text-5xl lg:text-7xl font-bold text-white tracking-tighter leading-[1.2] md:leading-[1.1] opacity-0 animate-slow-reveal break-keep"
            style={{ animationDelay: "0.4s" }}
          >
            {isDefaultLang
              ? content["home_hero_title_prefix"] || t.hero.title_prefix
              : t.hero.title_prefix}{" "}
            <br />
            {/* Metallic Text Effect */}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-100 via-gray-300 to-gray-500 drop-shadow-lg">
              {isDefaultLang
                ? content["home_hero_title_highlight"] || t.hero.title_highlight
                : t.hero.title_highlight}
            </span>
          </h1>

          <p
            className="text-base md:text-xl lg:text-2xl text-gray-300 md:text-gray-400 leading-relaxed max-w-3xl opacity-0 animate-slow-reveal whitespace-pre-line break-keep"
            style={{ animationDelay: "0.7s" }}
          >
            {isDefaultLang
              ? content["home_hero_desc"] || t.hero.desc
              : t.hero.desc}
          </p>

          <div
            className="flex flex-col sm:flex-row gap-4 pt-6 opacity-0 animate-slow-reveal"
            style={{ animationDelay: "1s" }}
          >
            <Button
              size="lg"
              onClick={scrollToContent}
              className="group bg-white !text-[#071D49] hover:bg-gray-200 border-none px-8 py-4 text-lg font-bold shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)]"
            >
              {t.hero.btn_main}
              <ArrowDown className="ml-2 w-5 h-5 group-hover:translate-y-1 transition-transform duration-300" />
            </Button>
          </div>
        </div>
      </div>

      {/* 
        Bottom Transition - Smooth Blur & Ambient Shadow
        Softens the transition from the dark hero to the light section below
      */}
      <div className="absolute bottom-0 left-0 w-full h-40 z-10 pointer-events-none overflow-hidden">
        {/* Richer dark vignette to enrich base shadow and contrast with scroll indicator */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        
        {/* Softer backdrop blur to smoothly diffuse the image/video edge even more naturally */}
        <div 
          className="absolute inset-0 backdrop-blur-[0.8px]"
          style={{
            maskImage: "linear-gradient(to top, black 20%, transparent 80%)",
            WebkitMaskImage: "linear-gradient(to top, black 20%, transparent 80%)"
          }}
        />
        
        {/* Faint ambient transition tint matching the next section's background */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#f8f8f8]/30 to-transparent" />
      </div>

      {/* Scroll Indicator */}
      <div
        ref={scrollIndicatorRef}
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center space-y-3 transition-all duration-300 hover:text-white cursor-pointer z-20"
        onClick={scrollToContent}
      >
        <ChevronDown
          className="w-10 h-10 text-white animate-soft-blink"
          strokeWidth={1.5}
        />
      </div>
    </div>
  );
};

export default Hero;
