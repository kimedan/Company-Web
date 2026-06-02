import React, { useEffect, useRef, useState } from "react";
import { Target, ShieldCheck, Zap } from "lucide-react";
import ScrollReveal from "./ScrollReveal";
import { useSite } from "../contexts/SiteContext";
import philosophyImg from "../assets/금형.jpg";

// Internal component to handle graph animation on scroll visibility
const StatGraph = () => {
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Add a slight delay before starting to draw for better visual effect
          setTimeout(() => setIsVisible(true), 200);
          observer.disconnect(); // Trigger only once
        }
      },
      { threshold: 0.5 }, // Wait until 50% is visible
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className="w-full md:max-w-xl h-24 sm:h-40 md:h-56 relative flex items-end"
    >
      <svg
        className="w-full h-full overflow-visible"
        viewBox="0 0 400 150"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="strokeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            {/* Toned down gradient: Transparent Slate to Soft Slate Blue */}
            <stop offset="0%" stopColor="#94A3B8" stopOpacity="0" />
            <stop offset="40%" stopColor="#64748B" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#475569" stopOpacity="0.8" />
          </linearGradient>
          {/* Subtler Glow Filter */}
          <filter id="glowLine" height="200%" width="200%" x="-50%" y="-50%">
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* The Curve Line - Thinner stroke (3px) */}
        <path
          d="M0,140 C100,140 150,100 200,80 C280,50 350,20 400,10"
          fill="none"
          stroke="url(#strokeGradient)"
          strokeWidth="3"
          strokeLinecap="round"
          filter="url(#glowLine)"
          style={{
            strokeDasharray: 1000,
            strokeDashoffset: isVisible ? 0 : 1000,
            transition: "stroke-dashoffset 2.5s cubic-bezier(0.22, 1, 0.36, 1)",
          }}
        />

        {/* End Point Dot - Smaller and muted color */}
        <circle
          cx="400"
          cy="10"
          r="4"
          fill="#475569"
          stroke="white"
          strokeWidth="2"
          className={`shadow-sm transition-all duration-700 delay-[2200ms] ${isVisible ? "opacity-100 scale-100" : "opacity-0 scale-0"}`}
        />

        {/* Animated Area Fill (Optional subtle fill) */}
        <path
          d="M0,140 C100,140 150,100 200,80 C280,50 350,20 400,10 V150 H0 Z"
          fill="url(#strokeGradient)"
          className={`transition-opacity duration-[3000ms] delay-500 ${isVisible ? "opacity-5" : "opacity-0"}`}
        />
      </svg>
    </div>
  );
};

const Philosophy: React.FC = () => {
  const { content, t } = useSite();

  const values = [
    {
      icon: <Target className="w-7 h-7" />,
      title: t.philosophy.val1_title,
      desc: t.philosophy.val1_desc,
    },
    {
      icon: <ShieldCheck className="w-7 h-7" />,
      title: t.philosophy.val2_title,
      desc: t.philosophy.val2_desc,
    },
    {
      icon: <Zap className="w-7 h-7" />,
      title: t.philosophy.val3_title,
      desc: t.philosophy.val3_desc,
    },
  ];

  return (
    <section
      id="philosophy"
      className="py-32 bg-[#f8f8f8] overflow-hidden relative"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="mb-24 lg:mb-32">
          <ScrollReveal>
            <h2 className="text-2xl md:text-3xl font-bold text-brand-blue mb-6 flex items-center gap-3">
              <span className="w-10 h-[2px] bg-brand-blue inline-block"></span>
              {t.philosophy.label}
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={0.1}>
            <p className="text-4xl sm:text-5xl md:text-7xl font-bold text-gray-900 tracking-tight leading-[1.3] mb-8 whitespace-pre-line break-keep">
              {t.philosophy.title}
            </p>
          </ScrollReveal>
          <ScrollReveal delay={0.2}>
            <p className="max-w-3xl text-xl sm:text-2xl text-gray-500 font-medium leading-relaxed whitespace-pre-line break-keep">
              {t.philosophy.desc}
            </p>
          </ScrollReveal>
        </div>

        {/* Content Section: Image & Values */}
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 mb-32">
          {/* Left: Image Card */}
          <div className="lg:w-1/2 relative">
            <ScrollReveal mode="scale" className="sticky top-32">
              <div className="aspect-[16/10] sm:aspect-[4/5] rounded-2xl sm:rounded-[3rem] overflow-hidden shadow-2xl relative group transform transition-transform duration-700 hover:scale-[1.02]">
                <img
                  src={philosophyImg}
                  alt="Factory Interior"
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-500"></div>

                <div className="absolute bottom-4 left-4 right-4 sm:bottom-8 sm:left-8 sm:right-8">
                  <div className="bg-white/90 backdrop-blur-lg p-4 sm:p-8 rounded-2xl sm:rounded-3xl shadow-lg border border-white/20 transform transition-transform duration-500 group-hover:-translate-y-2">
                    <span className="text-brand-blue font-bold tracking-wide text-xs sm:text-sm uppercase mb-1 sm:mb-2 block">
                      Since 2013
                    </span>
                    <p className="text-gray-900 font-bold text-base sm:text-2xl whitespace-pre-line leading-snug">
                      {t.philosophy.card_title}
                    </p>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* Right: Values List (2-column on mobile, vertical list on desktop) */}
          <div className="lg:w-1/2 grid grid-cols-2 lg:grid-cols-1 gap-4 lg:gap-0 lg:space-y-6">
            {values.map((item, index) => (
              <ScrollReveal
                key={index}
                delay={index * 0.1}
                className={index === 2 ? "col-span-2 lg:col-span-1" : "col-span-1"}
              >
                <div className="group flex flex-col sm:flex-row gap-3 sm:gap-8 items-start p-4 sm:p-8 rounded-2xl sm:rounded-3xl transition-all duration-500 ease-spring bg-white sm:bg-transparent border border-gray-100 sm:border-transparent hover:bg-gray-50 hover:shadow-lg hover:-translate-y-1 cursor-default hover:border-gray-100 shadow-[0_4px_12px_rgba(0,0,0,0.02)] sm:shadow-none h-full text-left">
                  <div className="flex-shrink-0 w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-[#071D49]/5 flex items-center justify-center shadow-sm text-brand-blue transform transition-all duration-500 ease-spring group-hover:scale-110 group-hover:bg-brand-blue group-hover:text-white">
                    <div className="p-1">
                      {React.cloneElement(item.icon as React.ReactElement, {
                        className: "w-5 h-5 sm:w-7 sm:h-7",
                      })}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-2xl font-bold text-gray-900 mb-1 sm:mb-3 group-hover:text-brand-blue transition-colors line-clamp-1">
                      {item.title}
                    </h3>
                    <p className="text-[11px] sm:text-base text-gray-400 sm:text-gray-500 leading-relaxed font-semibold sm:font-medium group-hover:text-gray-600 transition-colors break-keep whitespace-pre-line line-clamp-3 sm:line-clamp-none">
                      {item.desc}
                    </p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>

        {/* 
            Refined Stat Section: NO BOX / NO SHAPE 
            Minimalist layout floating directly on the page background 
        */}
        <ScrollReveal width="full" delay={0.2}>
          <div className="relative pt-12 sm:pt-16 border-t border-gray-100">
            <div className="grid grid-cols-2 lg:flex lg:flex-row lg:items-end lg:justify-between items-center gap-4 sm:gap-12 md:gap-24">
              {/* Text Content - Typography Size Reduced & Balanced */}
              <div className="relative z-10 text-left">
                <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-4">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-500"></span>
                  <span className="text-[10px] sm:text-sm font-bold uppercase tracking-[0.15em] sm:tracking-[0.2em] text-slate-500">
                    {t.philosophy.stat_label}
                  </span>
                </div>

                <div className="flex items-baseline gap-0.5 sm:gap-1 mb-3 sm:mb-6">
                  {/* Reduced size from 10rem to 7xl/8xl for better proportion */}
                  <span className="text-3xl sm:text-6xl md:text-8xl font-bold tracking-tighter text-[#071D49] leading-none">
                    15,000
                  </span>
                  <span className="text-xl sm:text-4xl md:text-5xl font-light text-slate-400 mb-1 sm:mb-2 ml-0.5">
                    +
                  </span>
                </div>

                <p className="text-[11px] sm:text-lg md:text-xl text-gray-500 leading-relaxed font-semibold sm:font-medium max-w-sm sm:max-w-lg break-keep">
                  {t.philosophy.stat_desc?.split("\n").map((line, i) => (
                    <React.Fragment key={i}>
                      {line}
                      <br />
                    </React.Fragment>
                  )) ||
                    "연간 1.5만 톤 이상의 생산 능력을 통해 고객의 비즈니스 성장을 든든하게 지원합니다."}
                </p>
              </div>

              {/* Animated Graph Component - Floating seamlessly */}
              <div className="w-full flex items-end justify-end">
                <StatGraph />
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default Philosophy;
