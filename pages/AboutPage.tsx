import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useSite } from "../contexts/SiteContext";
import ScrollReveal from "../components/ScrollReveal";
import {
  Phone,
  MapPin,
  TrendingUp,
  ThumbsUp,
  Lightbulb,
  UserCheck,
  Sparkles,
  Award,
  Printer,
  Navigation,
  Download,
  X,
} from "lucide-react";
import { Language } from "../types";
import introImg1 from "../assets/대구공장.JPG";
import introImg2 from "../assets/창녕공장.png";

const AboutPage = () => {
  const { content, t, language, certifications } = useSite();
  const location = useLocation();
  const isDefaultLang = language === "KOR";

  // For location tab
  const [activeTab, setActiveTab] = useState<"daegu" | "changnyeong">("daegu");
  const [selectedCert, setSelectedCert] = useState<{
    title: string;
    imageUrl: string;
  } | null>(null);

  useEffect(() => {
    // Determine section from pathname (e.g. /about/intro -> 'intro')
    const hash = location.pathname.split("/").pop() || "intro";
    // Small timeout ensures the DOM has updated and element exists
    setTimeout(() => {
      const element = document.getElementById(hash);
      if (element) {
        let offset = 100;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;
        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }, 100);
  }, [location.pathname]);

  // History Data
  const historyData = t.history.groups;

  // Philosophy Data
  const coreValues = [
    {
      icon: <ThumbsUp className="w-8 h-8" />,
      title: t.philosophy.cv_1_title,
      subtitle: t.philosophy.cv_1_sub,
      desc: t.philosophy.cv_1_desc,
      bg: "bg-blue-50",
    },
    {
      icon: <Lightbulb className="w-8 h-8" />,
      title: t.philosophy.cv_2_title,
      subtitle: t.philosophy.cv_2_sub,
      desc: t.philosophy.cv_2_desc,
      bg: "bg-blue-50",
    },
    {
      icon: <UserCheck className="w-8 h-8" />,
      title: t.philosophy.cv_3_title,
      subtitle: t.philosophy.cv_3_sub,
      desc: t.philosophy.cv_3_desc,
      bg: "bg-blue-50",
    },
  ];

  // Location Data
  const locations = {
    daegu: {
      name: t.footer.daegu,
      address: t.footer.address_daegu,
      tel: "053-611-6061",
      fax: "053-611-6066",
      mapQuery: "대구광역시 달성군 구지면 달성2차동3로 46",
    },
    changnyeong: {
      name: t.footer.changnyeong,
      address: t.footer.address_changnyeong,
      tel: "055-533-0013",
      fax: "055-533-0225",
      mapQuery: "경남 창녕군 대합면 대합産業단지로 22-44",
    },
  };
  const activeLoc = locations[activeTab];

  return (
    <div className="pt-24 pb-24 min-h-screen bg-brand-gray space-y-32">
      {/* 1. Intro Section (회사개요) */}
      <section
        id="intro"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12"
      >
        <ScrollReveal>
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 tracking-tight">
              {t.pages.intro.title}
            </h1>
            <p className="text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed">
              {t.pages.intro.subtitle}
            </p>
            <div className="h-1 w-20 bg-brand-blue mx-auto mt-8 rounded-full"></div>
          </div>
        </ScrollReveal>

        <div className="space-y-16">
          <ScrollReveal>
            <div className="text-center max-w-3xl mx-auto space-y-6 mb-12">
              <h3 className="text-3xl md:text-5xl font-bold text-gray-900 leading-tight">
                {isDefaultLang
                  ? content["intro_main_title_1"]
                  : language === "ENG"
                    ? "Global Leader"
                    : "Global Leader"}{" "}
                <br />
                <span className="text-brand-blue">
                  {isDefaultLang
                    ? content["intro_main_title_2"]
                    : language === "ENG"
                      ? "In Aluminum Extrusion"
                      : "In Aluminum Extrusion"}
                </span>
              </h3>
              <p className="text-gray-600 leading-relaxed text-lg break-keep whitespace-pre-wrap">
                {isDefaultLang
                  ? content["intro_desc"]
                  : (t.pages.intro as any).desc}
              </p>
            </div>
          </ScrollReveal>

          {/* Factory Images (2-column on mobile) */}
          <div className="grid grid-cols-2 gap-3 sm:gap-8">
            <ScrollReveal delay={0.1}>
              <div className="group relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl h-[160px] sm:h-[300px] md:h-[400px]">
                <img
                  src={introImg1}
                  alt="대구공장 전경"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent flex items-end p-3 sm:p-8 text-left">
                  <div className="text-white transform transition-transform duration-300 group-hover:-translate-y-2">
                    <h4 className="text-xs sm:text-2xl font-bold mb-0.5 sm:mb-2">
                      {t.footer.daegu}
                    </h4>
                    <p className="text-white/80 text-[10px] sm:text-sm font-medium leading-normal break-keep">
                      {language === "KOR"
                        ? "최첨단 압출 설비 및 본사 운영\nIATF 16949 인증 사업장"
                        : language === "ENG"
                          ? "HQ & State-of-the-art Facility"
                          : "最先端押出設備および本社運営"}
                    </p>
                  </div>
                </div>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={0.2}>
              <div className="group relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl h-[160px] sm:h-[300px] md:h-[400px]">
                <img
                  src={introImg2}
                  alt="창녕공장 전경"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent flex items-end p-3 sm:p-8 text-left">
                  <div className="text-white transform transition-transform duration-300 group-hover:-translate-y-2">
                    <h4 className="text-xs sm:text-2xl font-bold mb-0.5 sm:mb-2">
                      {t.footer.changnyeong}
                    </h4>
                    <p className="text-white/80 text-[10px] sm:text-sm font-medium leading-normal break-keep">
                      {language === "KOR"
                        ? "대규모 물류 센터 및 제 2 생산 거점\n스마트 팩토리 시스템 구축"
                        : language === "ENG"
                          ? "Large-scale Logistics & 2nd Factory"
                          : "大規模物流センターおよび第2生産拠点"}
                    </p>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>

          <ScrollReveal delay={0.3}>
            <div className="bg-white rounded-[2.5rem] p-8 md:p-12 border border-gray-100 shadow-sm transition-all duration-300 hover:shadow-lg">
              <h3 className="text-xl font-bold text-gray-900 mb-8 flex items-center gap-3">
                <span className="w-1.5 h-6 bg-brand-blue rounded-full"></span>
                {language === "KOR"
                  ? "기업 상세 정보"
                  : language === "ENG"
                    ? "Company Details"
                    : "企業詳細情報"}
              </h3>

              <div className="space-y-6">
                {/* Row Item */}
                <div className="flex flex-col md:flex-row md:items-baseline border-b border-gray-200 pb-6">
                  <div className="w-40 font-bold text-gray-500 shrink-0 mb-2 md:mb-0">
                    {language === "KOR"
                      ? "회사명"
                      : language === "ENG"
                        ? "Company Name"
                        : "会社名"}
                  </div>
                  <div className="font-bold text-lg text-gray-900">
                    {language === "KOR"
                      ? "(주)대우경금속"
                      : "Daewoo Light Metal Co., Ltd."}
                  </div>
                </div>

                <div className="flex flex-col md:flex-row md:items-baseline border-b border-gray-200 pb-6">
                  <div className="w-40 font-bold text-gray-500 shrink-0 mb-2 md:mb-0">
                    {language === "KOR"
                      ? "대표이사"
                      : language === "ENG"
                        ? "CEO"
                        : "代表取締役"}
                  </div>
                  <div className="font-bold text-lg text-gray-900">
                    {language === "KOR" ? "김도연" : "Kim Do-yeon"}
                  </div>
                </div>

                <div className="flex flex-col md:flex-row md:items-baseline border-b border-gray-200 pb-6">
                  <div className="w-40 font-bold text-gray-500 shrink-0 mb-2 md:mb-0">
                    {language === "KOR"
                      ? "주요사업"
                      : language === "ENG"
                        ? "Main Business"
                        : "主要事業"}
                  </div>
                  <div className="text-gray-800 leading-relaxed">
                    {language === "KOR"
                      ? "알루미늄 압출 제조 및 판매 (자동차, 전자, 건축, 산업용 소재)"
                      : language === "ENG"
                        ? "Aluminum Extrusion Manufacturing & Sales"
                        : "アルミニウム押出製造および販売"}
                  </div>
                </div>

                <div className="flex flex-col md:flex-row md:items-start border-b gap-4 border-gray-200 pb-6">
                  <div className="w-40 font-bold text-gray-500 shrink-0 mb-4 md:mb-0 pt-1">
                    {t.footer.locations}
                  </div>
                  <div className="flex-1 space-y-4">
                    <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100 hover:shadow-md transition-shadow flex justify-between items-center group">
                      <div>
                        <span className="font-bold block text-brand-blue mb-2">
                          {t.footer.daegu}
                        </span>
                        <p className="text-gray-700 text-sm mb-2">
                          {t.footer.address_daegu}
                        </p>
                        <p className="text-xs text-gray-500 mb-1">
                          T. 053-611-6061 | F. 053-611-6066
                        </p>
                        <p className="text-xs text-gray-500 font-medium">
                          {t.footer.biz_reg_no}514-81-85389
                        </p>
                      </div>
                      <a
                        href={content["daegu_biz_reg_pdf"] || "#"}
                        onClick={(e) => {
                          if (!content["daegu_biz_reg_pdf"]) {
                            e.preventDefault();
                            alert(t.footer.biz_reg_alert);
                          }
                        }}
                        target={
                          content["daegu_biz_reg_pdf"] ? "_blank" : undefined
                        }
                        rel={
                          content["daegu_biz_reg_pdf"]
                            ? "noreferrer"
                            : undefined
                        }
                        download={!!content["daegu_biz_reg_pdf"]}
                        className="flex flex-col items-center gap-1.5 p-3 rounded-xl hover:bg-gray-200/50 transition-colors cursor-pointer text-gray-500 hover:text-brand-blue shrink-0"
                        title={t.footer.biz_reg_cert}
                      >
                        <div className="p-2 bg-white shadow-sm border border-gray-200 rounded-full group-hover:scale-110 transition-transform">
                          <Download className="w-5 h-5" />
                        </div>
                        <span className="text-[10px] font-bold whitespace-nowrap">
                          {t.footer.biz_reg_cert}
                        </span>
                      </a>
                    </div>
                    <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100 hover:shadow-md transition-shadow flex justify-between items-center group">
                      <div>
                        <span className="font-bold block text-brand-blue mb-2">
                          {t.footer.changnyeong}
                        </span>
                        <p className="text-gray-700 text-sm mb-2">
                          {t.footer.address_changnyeong}
                        </p>
                        <p className="text-xs text-gray-500 mb-1">
                          T. 055-533-0013 | F. 055-533-0225
                        </p>
                        <p className="text-xs text-gray-500 font-medium">
                          {t.footer.biz_reg_no}806-85-00405
                        </p>
                      </div>
                      <a
                        href={content["changnyeong_biz_reg_pdf"] || "#"}
                        onClick={(e) => {
                          if (!content["changnyeong_biz_reg_pdf"]) {
                            e.preventDefault();
                            alert(t.footer.biz_reg_alert);
                          }
                        }}
                        target={
                          content["changnyeong_biz_reg_pdf"]
                            ? "_blank"
                            : undefined
                        }
                        rel={
                          content["changnyeong_biz_reg_pdf"]
                            ? "noreferrer"
                            : undefined
                        }
                        download={!!content["changnyeong_biz_reg_pdf"]}
                        className="flex flex-col items-center gap-1.5 p-3 rounded-xl hover:bg-gray-200/50 transition-colors cursor-pointer text-gray-500 hover:text-brand-blue shrink-0"
                        title={t.footer.biz_reg_cert}
                      >
                        <div className="p-2 bg-white shadow-sm border border-gray-200 rounded-full group-hover:scale-110 transition-transform">
                          <Download className="w-5 h-5" />
                        </div>
                        <span className="text-[10px] font-bold whitespace-nowrap">
                          {t.footer.biz_reg_cert}
                        </span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* 2. History Section (회사연혁) */}
      <section id="history" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6 tracking-tight">
              {t.pages.history.title}
            </h2>
            <div className="h-1 w-20 bg-brand-blue mx-auto mt-8 rounded-full"></div>
          </div>
        </ScrollReveal>

        <div className="py-8">
          <div className="flex justify-center mb-20">
            <ScrollReveal mode="scale">
              <div className="w-40 h-40 rounded-full bg-brand-blue text-white flex flex-col items-center justify-center shadow-xl shadow-blue-900/20 border-8 border-white ring-1 ring-gray-100">
                <span className="text-xl font-medium opacity-90">Present</span>
                <span className="text-lg opacity-80 my-0.5">~</span>
                <span className="text-3xl font-bold">2013</span>
              </div>
            </ScrollReveal>
          </div>

          <div className="space-y-20 relative">
            <div className="absolute left-[19px] md:left-1/2 top-0 bottom-0 w-[2px] bg-blue-100 -translate-x-1/2"></div>
            {historyData.map((group, gIdx) => {
              const isLeft = gIdx % 2 !== 0;
              return (
                <div key={group.year} className="relative">
                  <ScrollReveal>
                    <div className="flex items-center mb-8 relative">
                      <div className="absolute left-[19px] md:left-1/2 -translate-x-1/2 w-5 h-5 rounded-full bg-white border-[5px] border-brand-blue z-10 shadow-sm"></div>
                      <div className="pl-14 md:pl-0 md:absolute md:left-1/2 md:-translate-x-1/2 md:-top-14 z-10">
                        <span className="text-4xl font-bold text-brand-blue bg-brand-gray px-4 inline-block">
                          {group.year}
                        </span>
                      </div>
                    </div>
                  </ScrollReveal>
                  <div
                    className={`pl-14 md:pl-0 md:flex ${isLeft ? "md:flex-row-reverse" : ""} md:gap-0`}
                  >
                    <div className="hidden md:block md:w-1/2"></div>
                    <div
                      className={`md:w-1/2 ${isLeft ? "md:pr-16 md:text-right" : "md:pl-16 md:text-left"} space-y-5 pb-6`}
                    >
                      {group.events.map((event, idx) => (
                        <ScrollReveal key={idx} delay={idx * 0.05}>
                          <div
                            className={`group flex flex-col md:block hover:bg-white hover:border-gray-200 border border-transparent hover:shadow-sm hover:rounded-xl p-3 -m-3 transition-all duration-300`}
                          >
                            <span className="inline-block text-brand-blue/70 font-bold text-sm mb-1 md:mr-2">
                              {event.date}
                            </span>
                            <span className="text-gray-800 font-medium text-lg leading-snug group-hover:text-brand-blue transition-colors">
                              {event.desc}
                            </span>
                          </div>
                        </ScrollReveal>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="relative h-10">
            <div className="absolute left-[19px] md:left-1/2 -translate-x-1/2 top-0 w-3 h-3 rounded-full bg-blue-200"></div>
          </div>
        </div>
      </section>

      {/* 3. Philosophy Section (경영이념) */}
      <section
        id="philosophy"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <ScrollReveal>
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6 tracking-tight">
              {t.pages.philosophy.title}
            </h2>
            <div className="h-1 w-20 bg-brand-blue mx-auto mt-8 rounded-full"></div>
          </div>
        </ScrollReveal>

        <div className="space-y-24">
          <ScrollReveal>
            <div className="group relative w-full rounded-[2.5rem] overflow-hidden shadow-2xl transition-all duration-500 hover:shadow-[0_20px_60px_-15px_rgba(7,29,73,0.3)]">
              <div className="absolute inset-0 bg-[conic-gradient(at_bottom_left,_var(--tw-gradient-stops))] from-slate-900 via-[#071D49] to-[#0A265E]"></div>
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,#1e3a8a,transparent)] opacity-60 mix-blend-screen"></div>
              <div
                className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage:
                    "radial-gradient(rgba(255,255,255,0.3) 1px, transparent 1px)",
                  backgroundSize: "40px 40px",
                }}
              ></div>

              <div className="relative z-10 flex flex-col items-center justify-center py-24 px-6 text-center">
                <div className="relative mb-10">
                  <div className="absolute inset-0 rounded-full bg-blue-400/30 blur-xl transition-opacity duration-1000 group-hover:opacity-70"></div>
                  <div className="absolute inset-0 rounded-full border border-white/10 scale-150 transition-transform duration-700 group-hover:scale-[1.6]"></div>
                  <div className="w-24 h-24 bg-gradient-to-tr from-white/10 to-white/5 backdrop-blur-md rounded-full border border-white/20 flex items-center justify-center shadow-[0_0_30px_rgba(255,255,255,0.1)] group-hover:scale-110 transition-transform duration-500 ease-spring">
                    <TrendingUp
                      className="w-10 h-10 text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]"
                      strokeWidth={1.5}
                    />
                  </div>
                </div>
                <h2 className="text-5xl md:text-7xl font-bold mb-8 tracking-tight text-white drop-shadow-lg">
                  Nonstop{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 via-white to-blue-200 animate-text-shimmer bg-[length:200%_auto]">
                    Jump
                  </span>
                </h2>
                <div className="w-16 h-1 bg-gradient-to-r from-transparent via-blue-400 to-transparent mb-8 opacity-50"></div>
                <p className="text-lg md:text-2xl text-blue-50/90 max-w-3xl mx-auto leading-relaxed font-light tracking-wide mix-blend-overlay whitespace-pre-line">
                  {t.philosophy.nonstop_desc}
                </p>
              </div>
              <div className="absolute inset-0 bg-gradient-to-tr from-white/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
            </div>
          </ScrollReveal>

          <div>
            <ScrollReveal>
              <div className="text-center mb-12">
                <h3 className="text-2xl font-bold text-gray-900 flex items-center justify-center gap-2">
                  <Sparkles className="w-5 h-5 text-brand-blue" />
                  {t.philosophy.core_values_title}
                </h3>
                <div className="w-12 h-1 bg-gray-200 mx-auto mt-4 rounded-full"></div>
              </div>
            </ScrollReveal>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-8">
              {coreValues.map((val, idx) => (
                <ScrollReveal
                  key={idx}
                  delay={idx * 0.1}
                  className={idx === 2 ? "col-span-2 md:col-span-1" : "col-span-1"}
                >
                  <div className="group bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-8 border border-gray-100 shadow-[0_4px_12px_rgba(0,0,0,0.02)] sm:shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-500 ease-spring h-full flex flex-col items-center text-center">
                    <div
                      className={`w-12 h-12 sm:w-20 sm:h-20 ${val.bg} rounded-xl sm:rounded-2xl flex items-center justify-center mb-3 sm:mb-6 text-brand-blue group-hover:scale-110 transition-transform duration-300`}
                    >
                      <div className="p-1">
                        {React.cloneElement(val.icon as React.ReactElement, {
                          className: "w-6 h-6 sm:w-8 sm:h-8",
                        })}
                      </div>
                    </div>
                    <h4 className="text-sm sm:text-2xl font-bold text-gray-900 mb-0.5 sm:mb-1">
                      {val.title}
                    </h4>
                    <p className="text-[9px] sm:text-xs font-bold text-brand-blue uppercase tracking-widest mb-3 sm:mb-6 opacity-60">
                      {val.subtitle}
                    </p>
                    <p className="text-[11px] sm:text-base text-gray-400 sm:text-gray-500 leading-relaxed whitespace-pre-line break-keep font-semibold sm:font-medium">
                      {val.desc}
                    </p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 4. Certification Section (인증현황) */}
      <section id="cert" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6 tracking-tight">
              {t.pages.cert.title}
            </h2>
            <div className="h-1 w-20 bg-brand-blue mx-auto mt-8 rounded-full"></div>
          </div>
        </ScrollReveal>

        <ScrollReveal>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
            {certifications.map((cer, idx) => {
              const certItems = (t.pages.cert as any).items;
              const translatedTitle = certItems?.[cer.id] || cer.title;
              const cleanTitle = translatedTitle.replace(/\.[^/.]+$/, "");

              return (
                <div key={cer.id} className="group flex flex-col items-center">
                  <div
                    className="w-full relative bg-white border border-gray-100 p-2 md:p-4 rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.03)] group-hover:shadow-xl group-hover:-translate-y-2 transition-all duration-300 ease-spring cursor-pointer"
                    onClick={() => setSelectedCert(cer)}
                  >
                    {/* Download Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        const link = document.createElement("a");
                        link.href = cer.imageUrl;
                        link.download = `${cleanTitle}.png`;
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                      }}
                      className="absolute top-2 right-2 sm:top-4 sm:right-4 z-20 w-7 h-7 md:w-10 md:h-10 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center text-gray-500 hover:text-brand-blue hover:bg-white shadow-sm border border-gray-100 transition-all opacity-100 sm:opacity-0 sm:group-hover:opacity-100 hover:scale-110"
                      title="Download"
                    >
                      <Download className="w-3.5 h-3.5 md:w-5 md:h-5" />
                    </button>

                    <div className="aspect-[3/4] overflow-hidden rounded-lg bg-white relative flex items-center justify-center">
                      <div className="absolute inset-0 flex items-center justify-center text-gray-300 bg-gray-50 text-xs">
                        <Award className="w-12 h-12 opacity-20" />
                      </div>
                      <img
                        src={cer.imageUrl}
                        alt={cleanTitle}
                        loading="lazy"
                        className="relative z-10 w-full h-full object-contain transform transition-transform duration-500 group-hover:scale-105"
                        onError={(e) => {
                          e.currentTarget.style.opacity = "0.3";
                        }}
                      />
                    </div>
                  </div>
                  <p className="mt-3 text-center font-bold text-gray-800 text-xs md:text-base group-hover:text-brand-blue transition-colors break-keep px-1">
                    {cleanTitle}
                  </p>
                </div>
              );
            })}
          </div>
        </ScrollReveal>
      </section>

      {/* 5. Location Section (오시는 길) */}
      <section
        id="location"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-32"
      >
        <ScrollReveal>
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6 tracking-tight">
              {t.pages.location.title}
            </h2>
            <div className="h-1 w-20 bg-brand-blue mx-auto mt-8 rounded-full"></div>
          </div>
        </ScrollReveal>

        <div className="space-y-8">
          <ScrollReveal>
            <div className="w-full h-[400px] md:h-[500px] bg-gray-100 rounded-3xl overflow-hidden shadow-lg border border-gray-100 relative">
              <iframe
                title="Location Map"
                width="100%"
                height="100%"
                frameBorder="0"
                scrolling="no"
                marginHeight={0}
                marginWidth={0}
                src={`https://maps.google.com/maps?q=${encodeURIComponent(activeLoc.mapQuery)}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                className="w-full h-full"
              ></iframe>
              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-4 py-2 rounded-xl shadow-md border border-gray-200">
                <span className="font-bold text-brand-blue flex items-center gap-2">
                  <MapPin className="w-4 h-4" /> {activeLoc.name}
                </span>
              </div>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 gap-6">
            {(["daegu", "changnyeong"] as const).map((key) => {
              const loc = locations[key];
              const isActive = activeTab === key;
              return (
                <ScrollReveal key={key} delay={0.1}>
                  <div
                    onClick={() => setActiveTab(key)}
                    className={`p-6 md:p-8 rounded-2xl cursor-pointer transition-all duration-300 ease-spring ${
                      isActive
                        ? "bg-white shadow-xl scale-[1.02] border-2 border-brand-blue z-10 relative"
                        : "bg-white hover:bg-gray-50 hover:shadow-md border border-gray-200"
                    }`}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <h4
                        className={`font-bold text-xl ${isActive ? "text-brand-blue" : "text-gray-900"}`}
                      >
                        {loc.name}
                      </h4>
                      {isActive && (
                        <div className="bg-brand-blue text-white p-1 rounded-full">
                          <Navigation className="w-4 h-4" />
                        </div>
                      )}
                    </div>
                    <div className="space-y-3 text-sm md:text-base">
                      <p className="flex items-start gap-3 text-gray-600">
                        <MapPin
                          className={`w-5 h-5 shrink-0 mt-0.5 ${isActive ? "text-brand-blue" : "text-gray-400"}`}
                        />
                        <span>{loc.address}</span>
                      </p>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 pl-8">
                        <p className="flex items-center gap-2 text-gray-500">
                          <Phone className="w-4 h-4" /> {loc.tel}
                        </p>
                        <p className="flex items-center gap-2 text-gray-500">
                          <Printer className="w-4 h-4" /> {loc.fax}
                        </p>
                      </div>
                    </div>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Certificate Modal */}
      {selectedCert && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={() => setSelectedCert(null)}
        >
          <div
            className="relative max-w-4xl max-h-[90vh] w-full flex flex-col bg-white rounded-2xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 md:p-6 border-b border-gray-100">
              <h3 className="text-xl md:text-2xl font-bold text-gray-900">
                {(t.pages.cert as any).items?.[selectedCert.id] ||
                  selectedCert.title}
              </h3>
              <div className="flex items-center gap-3">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    const link = document.createElement("a");
                    link.href = selectedCert.imageUrl;
                    link.download = `${selectedCert.title}.png`;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                  }}
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-50 text-brand-blue hover:bg-brand-blue hover:text-white transition-colors"
                  title="Download"
                >
                  <Download className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setSelectedCert(null)}
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-900 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            {/* Image Wrapper */}
            <div
              className="relative flex-1 overflow-auto bg-gray-50 p-4 flex items-center justify-center"
              onClick={() => setSelectedCert(null)}
            >
              <img
                src={selectedCert.imageUrl}
                alt={selectedCert.title}
                className="max-w-full max-h-[70vh] object-contain shadow-md rounded border border-gray-200"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AboutPage;
