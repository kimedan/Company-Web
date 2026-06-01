import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import Button from "./Button";
import {
  ArrowDown,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Calendar,
  ArrowRight,
  ArrowUpRight,
} from "lucide-react";
import { useSite } from "../contexts/SiteContext";
import heroBg from "../assets/IMG_4372.JPG";

const Hero: React.FC = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const { t, content, language, posts } = useSite();

  // Use Refs for direct DOM manipulation to avoid re-renders on scroll (performance optimization)
  const bgRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Teaser Horizontal Scrolling Refs & State
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  // Filter only published articles
  const publishedPosts = posts
    ? posts.filter((post) => post.status === "Published")
    : [];

  const updateScrollButtons = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 5);
      // Allow slight threshold for float calculations
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 5);
    }
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener("scroll", updateScrollButtons);
      // Initial check
      updateScrollButtons();
      
      // Re-check on window resize
      window.addEventListener("resize", updateScrollButtons);
    }
    return () => {
      if (container) {
        container.removeEventListener("scroll", updateScrollButtons);
      }
      window.removeEventListener("resize", updateScrollButtons);
    };
  }, [publishedPosts]);

  // Handle manual navigation scroll
  const scrollTeaser = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 400; // scroll by roughly one card width
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollY = window.scrollY;

          // Apply parallax effect directly to DOM elements
          if (bgRef.current) {
            // Background moves slower than scroll (0.35 speed to make it flow elegantly across folds)
            bgRef.current.style.transform = `translate3d(${mousePos.x * -20}px, ${scrollY * 0.35 + mousePos.y * -20}px, 0) scale(1.05)`;
          }

          if (contentRef.current) {
            // Content moves faster than scroll (parallax) and fades out
            // Simulates the content "lifting off" as you scroll down
            const translateY = scrollY * 0.4;
            const opacity = Math.max(0, 1 - scrollY / 600); // Fades out completely by 600px scroll
            const scale = 1 - scrollY / 2500; // Subtle shrink effect

            contentRef.current.style.transform = `translate3d(0, ${translateY}px, 0) scale(${scale})`;
            contentRef.current.style.opacity = `${opacity}`;

            // Blur effect as it scrolls out
            contentRef.current.style.filter = `blur(${scrollY / 60}px)`;
          }

          if (scrollIndicatorRef.current) {
            // Scroll indicator fades out quickly
            const opacity = Math.max(0, 1 - scrollY / 150);
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
    // Scroll to the next section (DmcRoomTeaser)
    const teaserSection = document.getElementById("dmc-room-teaser");
    if (teaserSection) {
      teaserSection.scrollIntoView({ behavior: "smooth" });
    } else {
      // Fallback
      window.scrollTo({
        top: window.innerHeight,
        behavior: "smooth"
      });
    }
  };

  const isDefaultLang = language === "KOR";

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-hidden bg-[#07090e]"
    >
      {/* 
        Continuous Background Image Layer
        Spans both the Hero Front Content and the DmcRoomTeaser elegantly
      */}
      <div
        ref={bgRef}
        className="absolute inset-[0%] w-full h-[140%] will-change-transform pointer-events-none select-none z-0"
      >
        <img
          src={heroBg}
          alt="Hero Background"
          className="w-full h-full object-cover filter grayscale-[25%] brightness-[0.35] contrast-[1.12]"
        />
        {/* Shading/Vignette gradients layered beautifully */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-[#071D49]/20 to-[#07090e] mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/80" />
      </div>

      {/* Hero First Fold Section */}
      <div className="relative h-screen w-full flex flex-col justify-center z-10 border-b border-white/5">
        <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center w-full">
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

      {/* 
        Seamless Teaser Section (Second Fold)
        No break, transparently overlaying the extended hero background 
      */}
      {publishedPosts.length > 0 && (
        <section
          id="dmc-room-teaser"
          className="relative py-24 z-10 w-full min-h-[600px] flex items-center border-b border-gray-950/40"
        >
          {/* Subtle overlay shading specifically to enrich readability of news items on top of background texture */}
          <div className="absolute inset-0 bg-black/25 backdrop-blur-[0.5px] pointer-events-none" />

          {/* Decorative Ambient Glows */}
          <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[400px] h-[400px] bg-brand-blue/10 rounded-full blur-[140px] pointer-events-none" />
          <div className="absolute bottom-0 right-10 w-[300px] h-[300px] bg-[#64748b]/5 rounded-full blur-[120px] pointer-events-none" />

          {/* Grid Pattern Background */}
          <div 
            className="absolute inset-0 bg-[linear-gradient(to_right,#1f293708_1px,transparent_1px),linear-gradient(to_bottom,#1f293708_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" 
            style={{ maskImage: "radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)", WebkitMaskImage: "radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)" }}
          />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12 gap-6">
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
                  <span className="w-1.5 h-1.5 bg-[#4f46e5] rounded-full animate-pulse" />
                  <span className="text-[11px] font-bold text-gray-400 tracking-[0.15em] uppercase">DMC MEDIA ROOM</span>
                </div>
                <h2 className="text-2xl md:text-3.5xl font-bold text-white tracking-tight font-sans">
                  DMC Room 소식
                </h2>
                <p className="text-sm md:text-base text-gray-300 max-w-xl font-light">
                  대우경금속의 최신 정보와 혁신 활동을 가장 빠르게 전달해 드립니다.
                </p>
              </div>

              {/* Navigation Controls */}
              {publishedPosts.length > 2 && (
                <div className="flex items-center gap-2 self-start md:self-end">
                  <button
                    onClick={() => scrollTeaser("left")}
                    disabled={!canScrollLeft}
                    className={`p-3 rounded-full border transition-all duration-300 ${
                      canScrollLeft
                        ? "border-white/10 text-white bg-white/5 hover:bg-white/10 hover:scale-105"
                        : "border-white/5 text-gray-600 cursor-not-allowed opacity-40"
                    }`}
                    aria-label="이전 소식"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => scrollTeaser("right")}
                    disabled={!canScrollRight}
                    className={`p-3 rounded-full border transition-all duration-300 ${
                      canScrollRight
                        ? "border-white/10 text-white bg-white/5 hover:bg-white/10 hover:scale-105"
                        : "border-white/5 text-gray-600 cursor-not-allowed opacity-40"
                    }`}
                    aria-label="다음 소식"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Horizontal Scrolling Card Container */}
            <div
              ref={scrollContainerRef}
              className="flex gap-6 overflow-x-auto pt-6 pb-8 -mt-6 scrollbar-none snap-x snap-mandatory"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {publishedPosts.map((post) => {
                const plainTextContent = post.content
                  ? post.content.replace(/<[^>]*>/g, "").trim()
                  : "";
                
                return (
                  <div
                    key={post.id}
                    className="w-full sm:w-[380px] shrink-0 snap-start"
                  >
                    <Link
                      to={`/news/${post.id}`}
                      className="group block relative h-[300px] p-6 rounded-2xl border border-white/5 hover:border-white/15 bg-white/[0.02] hover:bg-white/[0.05] backdrop-blur-lg shadow-[0_12px_40px_rgba(0,0,0,0.2)] transition-all duration-300 hover:-translate-y-1.5 overflow-hidden flex flex-col justify-between"
                    >
                      {/* Subtle inner card lighting */}
                      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.01] to-white/[0.04] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      
                      {/* Top Details */}
                      <div className="relative z-10 w-full">
                        <div className="flex items-center justify-between gap-4 mb-4">
                          {/* Badge */}
                          <span className="inline-flex px-3 py-1 bg-white/5 text-white/90 border border-white/10 text-[10px] font-semibold uppercase tracking-wider rounded-full">
                            {post.category || "회사소식"}
                          </span>
                          
                          {/* Date */}
                          <span className="flex items-center gap-1.5 text-xs text-gray-400 font-mono">
                            <Calendar className="w-3.5 h-3.5 text-gray-500" />
                            {post.date}
                          </span>
                        </div>

                        {/* Title */}
                        <h3 className="text-lg md:text-xl font-bold text-white group-hover:text-white transition-colors duration-200 line-clamp-2 leading-snug tracking-tight mb-3">
                          {post.title}
                        </h3>

                        {/* Content Snippet */}
                        {plainTextContent && (
                          <p className="text-sm text-gray-400 line-clamp-3 leading-relaxed font-light font-sans">
                            {plainTextContent}
                          </p>
                        )}
                      </div>

                      {/* Bottom Link */}
                      <div className="relative z-10 flex items-center justify-between text-xs font-bold text-gray-400 group-hover:text-white transition-colors self-end w-full pt-4 border-t border-white/5 mt-4">
                        <span>자세히 보기</span>
                        <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center border border-white/5 group-hover:border-white/20 group-hover:bg-white/10 transition-all duration-300">
                          <ArrowRight className="w-4 h-4 transform group-hover:translate-x-0.5 transition-transform" />
                        </div>
                      </div>
                    </Link>
                  </div>
                );
              })}
            </div>

            {/* View All Bar */}
            <div className="mt-12 flex justify-center">
              <Link
                to="/news"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full border border-white/10 bg-white/5 text-white font-medium text-sm hover:bg-white/10 hover:border-white/20 transition-all duration-300 group"
              >
                모든 소식 확인하기
                <ArrowUpRight className="w-4 h-4 text-gray-400 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default Hero;
