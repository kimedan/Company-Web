import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import Button from "./Button";
import {
  ArrowDown,
  ChevronDown,
  Calendar,
  ArrowRight,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
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
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const isHovered = useRef(false);
  const isTransitioning = useRef(false);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const scrollPosRef = useRef<number>(0);

  // Filter only published articles
  const publishedPosts = posts
    ? posts.filter((post) => post.status === "Published")
    : [];

  const isDefaultLang = language === "KOR";

  // Slider states
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [fadeState, setFadeState] = useState<"in" | "out">("in");
  const [isMobile, setIsMobile] = useState(false);

  // Resize listener to capture mobile viewport context
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Force slide index back to 0 on mobile layout context shift
  useEffect(() => {
    if (isMobile) {
      setCurrentSlideIndex(0);
    }
  }, [isMobile]);

  // Brand base slide definition
  const brandSlide = {
    type: "brand",
    bgImage: heroBg,
    badge: isDefaultLang ? content["home_hero_badge"] || t.hero.badge : t.hero.badge,
    title: (
      <>
        {isDefaultLang ? content["home_hero_title_prefix"] || t.hero.title_prefix : t.hero.title_prefix}
        <br />
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-100 via-gray-300 to-gray-500 drop-shadow-lg">
          {isDefaultLang ? content["home_hero_title_highlight"] || t.hero.title_highlight : t.hero.title_highlight}
        </span>
      </>
    ),
    desc: isDefaultLang ? content["home_hero_desc"] || t.hero.desc : t.hero.desc,
    cta: (
      <Button
        size="lg"
        onClick={() => scrollToContent()}
        className="group bg-white !text-[#071D49] hover:bg-gray-200 border-none px-8 py-4 text-lg font-bold shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)] cursor-pointer"
      >
        {t.hero.btn_main}
        <ArrowDown className="ml-2 w-5 h-5 group-hover:translate-y-1 transition-transform duration-300" />
      </Button>
    ),
  };

  // Dynamic Slide Array - limited to only brand slide on mobile viewport
  const dynamicSlides = isMobile
    ? [brandSlide]
    : [
        brandSlide,
        ...publishedPosts
          .filter((post) => post.showOnHero)
          .sort((a, b) => {
            const aOrder = typeof a.heroOrder === "number" ? a.heroOrder : 0;
            const bOrder = typeof b.heroOrder === "number" ? b.heroOrder : 0;
            return aOrder - bOrder;
          })
          .map((post) => {
            const plainTextContent = post.content
              ? post.content.replace(/<[^>]*>/g, "").trim().slice(0, 180)
              : "";
            return {
              type: "news",
              id: post.id,
              bgImage: post.imageUrl || null,
              badge: post.category || "회사소식",
              title: post.title,
              desc: post.heroDescription || plainTextContent || "DMC Room 최신 소식입니다.",
              cta: (
                <Link
                  to={`/news/${post.id}`}
                  className="inline-flex items-center gap-2.5 px-8 py-4 rounded-xl border border-white/20 text-white hover:text-white bg-white/5 hover:bg-white/10 hover:border-white/30 text-lg font-bold transition-all shadow-[0_0_20px_rgba(255,255,255,0.02)] hover:shadow-[0_0_30px_rgba(255,255,255,0.15)] group shrink-0 cursor-pointer animate-fade-in"
                >
                  소식 더보기
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              ),
            };
          }),
      ];

  // Auto-rotator loop for dynamicSlides
  useEffect(() => {
    if (dynamicSlides.length <= 1) return;

    const interval = setInterval(() => {
      const nextIdx = (currentSlideIndex + 1) % dynamicSlides.length;
      setFadeState("out");
      setTimeout(() => {
        setCurrentSlideIndex(nextIdx);
        setFadeState("in");
      }, 400); // Switch slide slightly earlier (400ms instead of 600ms) to reduce black screen gap
    }, 5800);

    return () => clearInterval(interval);
  }, [dynamicSlides.length, currentSlideIndex]);

  // Infinite Continuous Auto-Scroll Effect for News/Teaser section with dynamic layout resilience
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container || publishedPosts.length === 0) return;

    const topFive = publishedPosts.slice(0, 5);
    let animationId: number;

    const initializeScroll = () => {
      const firstCard = container.firstElementChild as HTMLElement;
      if (!firstCard) return;
      const computedStyle = window.getComputedStyle(container);
      const gap = parseFloat(computedStyle.gap) || 24;
      const cardWidth = firstCard.offsetWidth + gap;
      const singleSetWidth = topFive.length * cardWidth;
      
      // Initial positioning centered on Copy 2 loop for seamless left/right sliding
      container.scrollLeft = singleSetWidth;
      scrollPosRef.current = singleSetWidth;
    };

    // Delay initialization slightly to ensure all child nodes have completely finished rendering
    const initTimeout = setTimeout(initializeScroll, 150);

    const step = () => {
      if (container) {
        if (!isHovered.current && !isTransitioning.current) {
          scrollPosRef.current += 0.65; // Buttery smooth incremental flow speed (float tracking solves integer rounding bug)

          const firstCard = container.firstElementChild as HTMLElement;
          if (firstCard) {
            const computedStyle = window.getComputedStyle(container);
            const gap = parseFloat(computedStyle.gap) || 24;
            const cardWidth = firstCard.offsetWidth + gap;
            const singleSetWidth = topFive.length * cardWidth;

            if (scrollPosRef.current >= singleSetWidth * 2) {
              scrollPosRef.current -= singleSetWidth;
            } else if (scrollPosRef.current <= 0) {
              scrollPosRef.current += singleSetWidth;
            }

            container.scrollLeft = Math.round(scrollPosRef.current);
          }
        } else {
          // Keep the float accumulator in perfect sync with mouse dragging or snapping
          scrollPosRef.current = container.scrollLeft;
        }
      }
      animationId = requestAnimationFrame(step);
    };

    animationId = requestAnimationFrame(step);

    const handleResize = () => {
      initializeScroll();
    };
    window.addEventListener("resize", handleResize);

    return () => {
      clearTimeout(initTimeout);
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", handleResize);
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, [publishedPosts.length]);

  const handleNav = (direction: "left" | "right") => {
    const container = scrollContainerRef.current;
    if (!container || publishedPosts.length === 0) return;

    isTransitioning.current = true;

    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }

    const firstCard = container.firstElementChild as HTMLElement;
    if (!firstCard) return;

    const computedStyle = window.getComputedStyle(container);
    const gap = parseFloat(computedStyle.gap) || 24;
    const cardWidth = firstCard.offsetWidth + gap;
    const topFiveCount = Math.min(publishedPosts.length, 5);
    const singleSetWidth = topFiveCount * cardWidth;

    let currentScroll = container.scrollLeft;

    // Boundary check before moving: snap seamlessly to matching position if near edge
    if (currentScroll < singleSetWidth) {
      container.scrollLeft += singleSetWidth;
      currentScroll = container.scrollLeft;
    } else if (currentScroll >= singleSetWidth * 2) {
      container.scrollLeft -= singleSetWidth;
      currentScroll = container.scrollLeft;
    }

    const currentCardIndex = Math.round(currentScroll / cardWidth);
    const targetIndex = direction === "right" ? currentCardIndex + 1 : currentCardIndex - 1;
    const targetScrollLeft = targetIndex * cardWidth;

    container.scrollTo({
      left: targetScrollLeft,
      behavior: "smooth",
    });

    scrollPosRef.current = targetScrollLeft;

    // Pause continuous flow briefly (450ms) to let slide transition lock in, then seamlessly resume auto-drifting without sticking
    hoverTimeoutRef.current = setTimeout(() => {
      isTransitioning.current = false;

      if (container) {
        if (container.scrollLeft < singleSetWidth) {
          container.scrollLeft += singleSetWidth;
        } else if (container.scrollLeft >= singleSetWidth * 2) {
          container.scrollLeft -= singleSetWidth;
        }
        scrollPosRef.current = container.scrollLeft;
      }
    }, 450);
  };

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollY = window.scrollY;

          // Apply parallax effect directly to DOM elements
          if (bgRef.current) {
            bgRef.current.style.transform = `translate3d(${mousePos.x * -20}px, ${scrollY * 0.12 + mousePos.y * -20}px, 0) scale(1.02)`;
          }

          if (contentRef.current) {
            const translateY = scrollY * 0.4;
            const scrollOpacity = Math.max(0, 1 - scrollY / 600);
            const scale = 1 - scrollY / 2500;

            contentRef.current.style.transform = `translate3d(0, ${translateY}px, 0) scale(${scale})`;
            contentRef.current.style.opacity = `${scrollOpacity * (fadeState === "in" ? 1 : 0)}`;

            contentRef.current.style.filter = `blur(${scrollY / 60}px)`;
          }

          if (scrollIndicatorRef.current) {
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
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = (e.clientY / window.innerHeight) * 2 - 1;
      setMousePos({ x, y });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("mousemove", handleMouseMove);

    // Initial run to lay out the styles correctly on load
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [mousePos, fadeState, currentSlideIndex, dynamicSlides.length]);

  const scrollToContent = () => {
    const teaserSection = document.getElementById("dmc-room-teaser");
    if (teaserSection) {
      teaserSection.scrollIntoView({ behavior: "smooth" });
    } else {
      window.scrollTo({
        top: window.innerHeight,
        behavior: "smooth"
      });
    }
  };

  const currentSlide = dynamicSlides[currentSlideIndex] || dynamicSlides[0];
  const isNewsSlide = currentSlide?.type === "news";

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
        style={{
          height: isNewsSlide ? "100vh" : "115%",
          opacity: fadeState === "in" ? 1 : 0,
          transition: "opacity 600ms cubic-bezier(0.4, 0, 0.2, 1)",
        }}
        className="absolute inset-[0%] w-full will-change-transform pointer-events-none select-none z-0"
      >
        {dynamicSlides.map((slide, idx) => {
          const isCurrent = idx === currentSlideIndex;
          const imageSrc = slide.bgImage || heroBg;
          const isNewsImage = slide.type === "news" && slide.bgImage;

          return (
            <div
              key={`hero-bg-layer-${idx}`}
              className={`absolute inset-0 w-full h-full ${
                isCurrent ? "opacity-100 z-10" : "opacity-0 z-0"
              }`}
            >
              {isNewsImage ? (
                <div className="relative w-full h-full flex items-center justify-center bg-black/80">
                  {/* Background blurred helper image for mobile portrait layouts so we do not get blank black bars */}
                  <img
                    src={imageSrc}
                    alt=""
                    className="absolute inset-0 w-full h-full object-cover filter grayscale-[10%] brightness-[0.3] blur-[12px] opacity-75 sm:hidden pointer-events-none select-none"
                    referrerPolicy="no-referrer"
                  />
                  {/* Crisp main slide image - contain fit on mobile to show full details, cover on desktop */}
                  <img
                    src={imageSrc}
                    alt=""
                    className="relative w-full h-full object-contain sm:object-cover sm:object-center filter grayscale-[0%] brightness-[0.55] contrast-[1.05] blur-[0.5px] scale-100"
                    referrerPolicy="no-referrer"
                  />
                </div>
              ) : (
                <img
                  src={imageSrc}
                  alt=""
                  className="w-full h-full object-cover object-center filter grayscale-[25%] brightness-[0.35] contrast-[1.12]"
                  referrerPolicy="no-referrer"
                />
              )}
            </div>
          );
        })}
        {/* Shading/Vignette gradients layered beautifully */}
        <div 
          className="absolute inset-0 bg-gradient-to-b from-black/45 via-[#071D49]/20 to-[#07090e] mix-blend-multiply z-20 transition-opacity duration-[600ms]" 
          style={{ opacity: isNewsSlide ? 0.45 : 1 }}
        />
        <div 
          className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/80 z-20 transition-opacity duration-[600ms]" 
          style={{ opacity: isNewsSlide ? 0.5 : 1 }}
        />
      </div>

      {/* Hero First Fold Section */}
      <div className="relative h-screen w-full flex flex-col justify-center z-10 border-b border-white/5">
        <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center w-full">
          <div
            ref={contentRef}
            className={`max-w-4xl space-y-10 will-change-transform origin-center transition-opacity duration-[600ms] cubic-bezier(0.4, 0, 0.2, 1) ${
              fadeState === "in"
                ? "opacity-100"
                : "opacity-0"
            }`}
          >
            {/* Badge */}
            <div className="opacity-100">
              <span className="inline-block px-4 py-1.5 rounded-full border border-white/20 text-white/90 text-sm font-medium backdrop-blur-md bg-white/5 shadow-[0_0_15px_rgba(255,255,255,0.05)] uppercase tracking-wider">
                {currentSlide.badge}
              </span>
            </div>

            {currentSlide.type === "brand" ? (
              <h1 className="text-3xl md:text-5xl lg:text-7xl font-bold text-white tracking-tighter leading-[1.2] md:leading-[1.1] break-keep">
                {currentSlide.title}
              </h1>
            ) : (
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white tracking-tighter leading-[1.2] md:leading-[1.1] break-keep line-clamp-2">
                {currentSlide.title}
              </h1>
            )}

            <p className="text-base md:text-xl lg:text-2xl text-gray-300 md:text-gray-400 leading-relaxed max-w-3xl whitespace-pre-line break-keep select-text line-clamp-3">
              {currentSlide.desc}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              {currentSlide.cta}
            </div>
          </div>
        </div>

        {/* iOS-style dynamic slider pagination dots at the bottom-center */}
        {dynamicSlides.length > 1 && (
          <div className="absolute bottom-24 left-1/2 transform -translate-x-1/2 z-30 flex items-center gap-2 bg-black/25 backdrop-blur-md px-4 py-2.5 rounded-full border border-white/5 shadow-lg">
            {dynamicSlides.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  if (idx === currentSlideIndex) return;
                  setFadeState("out");
                  setTimeout(() => {
                    setCurrentSlideIndex(idx);
                    setFadeState("in");
                  }, 400); // Trigger fade-in slightly earlier (400ms) to bypass the dark gap
                }}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  idx === currentSlideIndex
                    ? "w-6 bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]"
                    : "w-1.5 bg-white/35 hover:bg-white/60 cursor-pointer"
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        )}

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
      {publishedPosts.length > 0 && (() => {
        const topFive = publishedPosts.slice(0, 5);
        
        // Infinite duplication to support gapless scrolling and navigation
        const repeatCount = Math.max(3, Math.ceil(12 / topFive.length));
        const marqueePosts: typeof topFive = [];
        for (let i = 0; i < repeatCount; i++) {
          marqueePosts.push(...topFive);
        }

        return (
          <section
            id="dmc-room-teaser"
            className="relative py-24 z-10 w-full min-h-[600px] flex items-center border-b border-gray-950/40"
          >
            <style>{`
              .no-scrollbar::-webkit-scrollbar {
                display: none;
              }
              .no-scrollbar {
                -ms-overflow-style: none;
                scrollbar-width: none;
              }
            `}</style>

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
              </div>

              {/* Responsive Unified Carousel Group (Supports continuous marquee & navigation arrows) */}
              <div className="relative w-full group/carousel">
                {/* Left Navigation Arrow (Liquid Glassmorphism) positioned outside */}
                <button
                  id="news-nav-left"
                  type="button"
                  onClick={() => handleNav('left')}
                  className="absolute left-2 sm:-left-5 md:-left-10 lg:-left-16 xl:-left-24 top-1/2 -translate-y-1/2 z-30 w-12 h-12 md:w-16 md:h-16 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 border border-white/15 hover:border-white/30 backdrop-blur-md text-white shadow-[0_8px_32px_rgba(0,0,0,0.3)] transition-all duration-300 hover:scale-105 active:scale-95 opacity-100 md:opacity-0 md:group-hover/carousel:opacity-100 cursor-pointer"
                  aria-label="Previous News"
                >
                  <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
                </button>

                {/* Right Navigation Arrow (Liquid Glassmorphism) positioned outside */}
                <button
                  id="news-nav-right"
                  type="button"
                  onClick={() => handleNav('right')}
                  className="absolute right-2 sm:-right-5 md:-right-10 lg:-right-16 xl:-right-24 top-1/2 -translate-y-1/2 z-30 w-12 h-12 md:w-16 md:h-16 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 border border-white/15 hover:border-white/30 backdrop-blur-md text-white shadow-[0_8px_32px_rgba(0,0,0,0.3)] transition-all duration-300 hover:scale-105 active:scale-95 opacity-100 md:opacity-0 md:group-hover/carousel:opacity-100 cursor-pointer"
                  aria-label="Next News"
                >
                  <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
                </button>

                {/* Overflow Clipped Masking Area (keeps cards perfectly bounds-confined without clipping outer absolute arrows) */}
                <div className="w-full overflow-hidden py-10 px-4 -mx-4">
                  {/* Unified Horizontal Scroll Container */}
                  <div
                    id="news-marquee-container"
                    ref={scrollContainerRef}
                    onMouseEnter={() => { isHovered.current = true; }}
                    onMouseLeave={() => { isHovered.current = false; }}
                    onTouchStart={() => { isHovered.current = true; }}
                    onTouchEnd={() => { isHovered.current = false; }}
                    className="w-full flex gap-5 md:gap-6 overflow-x-auto no-scrollbar py-4 px-1 select-none cursor-grab active:cursor-grabbing snap-x snap-mandatory md:snap-none"
                  >
                  {marqueePosts.map((post, idx) => {
                    const plainTextContent = post.content
                      ? post.content.replace(/<[^>]*>/g, "").trim()
                      : "";
                    
                    return (
                      <div
                        id={`news-card-wrapper-${post.id}-${idx}`}
                        key={`${post.id}-${idx}`}
                        className="w-[290px] xs:w-[320px] md:w-[380px] shrink-0 snap-center first:pl-4"
                      >
                        <Link
                          id={`news-card-${post.id}-${idx}`}
                          to={`/news/${post.id}`}
                          className="group block relative h-[280px] md:h-[300px] p-5 md:p-6 rounded-2xl border border-white/5 hover:border-white/15 bg-white/[0.02] hover:bg-white/[0.06] backdrop-blur-lg shadow-[0_12px_40px_rgba(0,0,0,0.2)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.45)] transition-all duration-300 hover:-translate-y-2 text-left overflow-hidden flex flex-col justify-between"
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
                            <h3 className="text-base md:text-xl font-bold text-white group-hover:text-white transition-colors duration-200 line-clamp-2 leading-snug tracking-tight mb-3">
                              {post.title}
                            </h3>

                            {/* Content Snippet */}
                            {plainTextContent && (
                              <p className="text-xs md:text-sm text-gray-400 line-clamp-3 leading-relaxed font-light font-sans">
                                {plainTextContent}
                              </p>
                            )}
                          </div>

                          {/* Bottom Link */}
                          <div className="relative z-10 flex items-center justify-between text-xs font-bold text-gray-400 group-hover:text-white transition-colors self-end w-full pt-4 border-t border-white/5 mt-4">
                            <span>자세히 보기</span>
                            <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-white/5 flex items-center justify-center border border-white/5 group-hover:border-white/20 group-hover:bg-white/10 transition-all duration-300">
                              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-0.5 transition-transform text-white" />
                            </div>
                          </div>
                        </Link>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

              {/* View All Bar */}
              <div className="mt-8 flex justify-center">
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
        );
      })()}
    </div>
  );
};

export default Hero;
