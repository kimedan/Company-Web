import React from "react";
import { useSite } from "../contexts/SiteContext";
import { ShieldCheck, Ruler, ArrowRight, CheckCircle2 } from "lucide-react";
import ScrollReveal from "../components/ScrollReveal";
import { Link } from "react-router-dom";

const MEASUREMENT_TOOLS = [
  {
    name: "3차원 측정기",
    spec: "Mitutoyo CRYSTA-Apex S 574",
    image:
      "https://images.unsplash.com/photo-1581092334245-d4fb30c5e7b2?auto=format&fit=crop&w=600&q=80",
    description: "제품의 복잡한 3차원 형상을 정밀하게 측정 및 검증합니다.",
  },
  {
    name: "비전 측정기",
    spec: "OVP-SERIES",
    image:
      "https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=600&q=80",
    description: "고해상도 카메라를 이용한 비접촉식 정밀 치수 측정 장비입니다.",
  },
  {
    name: "투영기",
    spec: "Mitutoyo PJ-A3000",
    image:
      "https://images.unsplash.com/photo-1616198642750-f8d2cc1f087e?auto=format&fit=crop&w=600&q=80",
    description: "제품의 미세한 곡선과 윤곽을 확대하여 검사합니다.",
  },
  {
    name: "형상 측정기",
    spec: "Mitutoyo CV-2100",
    image:
      "https://images.unsplash.com/photo-1544724569-5f546fd6f2b6?auto=format&fit=crop&w=600&q=80",
    description: "표면 조도와 미세한 윤곽 단면을 분석합니다.",
  },
  {
    name: "만능 재료 시험기",
    spec: "UTM 50Ton",
    image:
      "https://images.unsplash.com/photo-1574676104764-ae327c6f0ee4?auto=format&fit=crop&w=600&q=80",
    description: "완제품 및 시편의 인장, 압축, 굽힘 강도를 테스트합니다.",
  },
  {
    name: "경도계",
    spec: "Rockwell / Vickers",
    image:
      "https://images.unsplash.com/photo-1612803856372-8805ffce1a64?auto=format&fit=crop&w=600&q=80",
    description: "소재 및 피막 표면의 체계적인 경도 측정을 수행합니다.",
  },
];

const QualityPage: React.FC = () => {
  const { equipments, t } = useSite();

  return (
    <div className="pt-24 pb-24 min-h-screen bg-brand-gray">
      {/* Hero Section */}
      <section className="relative bg-brand-blue text-white py-24 md:py-32 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Adds a subtle responsive gradient overlay for mobile text legibility if background images were used, 
            or just enhances the base appearance */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-brand-blue/90 md:hidden"></div>
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <ScrollReveal>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 tracking-tight drop-shadow-md break-keep">
              {t.quality?.title || "품질검사"}
            </h1>
            <p className="text-sm md:text-lg font-light tracking-[0.1em] text-blue-100 font-sans break-keep">
              {t.quality?.subtitle || "QUALITY ASSURANCE & INSPECTION"}
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 space-y-24">
        {/* Intro */}
        <section>
          <ScrollReveal>
            <div className="max-w-4xl mx-auto text-center">
              <ShieldCheck className="w-14 h-14 md:w-16 md:h-16 text-brand-blue mx-auto mb-6" />
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-6 tracking-tight break-keep">
                {t.quality?.intro_title || "타협 없는 품질의 기준"}
              </h2>
              <p className="text-sm sm:text-base md:text-xl text-gray-500 leading-relaxed break-keep">
                {t.quality?.intro_desc ||
                  "대우경금속은 고객에게 무결점 제품을 제공하기 위해 최첨단 측정 설비와 철저한 다중 검사 시스템을 구축하고 있습니다. 원소재 입고부터 최종 출하까지 모든 공정을 철저히 감독합니다."}
              </p>
            </div>
          </ScrollReveal>
        </section>

        {/* Feature Grid - Equipment */}
        <section>
          <ScrollReveal>
            <div className="flex items-center gap-3 mb-8 md:mb-10 border-b border-gray-200 pb-4">
              <Ruler className="w-7 h-7 md:w-8 md:h-8 text-brand-blue shrink-0" />
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight break-keep">
                {t.quality?.equip_title || "측정설비 보유현황"}
              </h2>
            </div>
          </ScrollReveal>

          {/* Table Overview */}
          <ScrollReveal delay={0.1}>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mb-12">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="py-3 px-4 md:py-4 md:px-6 font-bold text-gray-700 text-xs md:text-base border-r border-gray-200 w-1/4 break-keep">
                        {t.quality?.th_name || "설비명"}
                      </th>
                      <th className="py-3 px-4 md:py-4 md:px-6 font-bold text-gray-700 text-xs md:text-base border-r border-gray-200 w-1/4 break-keep">
                        {t.quality?.th_maker || "제조사 / 모델명"}
                      </th>
                      <th className="py-3 px-4 md:py-4 md:px-6 font-bold text-gray-700 text-xs md:text-base break-keep">
                        {t.quality?.th_purpose || "측정 목적 및 주요 기능"}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {equipments.map((tool, idx) => {
                      const translationKey = tool.id;
                      const qualityTranslations = t.quality as any;
                      const translatedItem =
                        qualityTranslations?.items?.[translationKey];

                      return (
                        <tr
                          key={tool.id}
                          className="hover:bg-gray-50/50 transition-colors"
                        >
                          <td className="py-3 px-4 md:py-4 md:px-6 text-xs md:text-sm font-semibold text-gray-900 border-r border-gray-100 break-keep">
                            {translatedItem?.name || tool.name}
                          </td>
                          <td className="py-3 px-4 md:py-4 md:px-6 text-xs md:text-sm text-gray-600 font-medium border-r border-gray-100 break-keep">
                            {translatedItem?.spec || tool.spec}
                          </td>
                          <td className="py-3 px-4 md:py-4 md:px-6 text-xs md:text-sm text-gray-500 break-keep">
                            {translatedItem?.description || tool.description}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </ScrollReveal>

          {/* Grid Layout for Modern Look */}
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-8">
            {equipments.map((tool, index) => {
              const translationKey = tool.id;
              const qualityTranslations = t.quality as any;
              const translatedItem =
                qualityTranslations?.items?.[translationKey];

              return (
                <ScrollReveal key={tool.id} delay={index * 0.1}>
                  <div className="bg-white rounded-2xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 group hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-shadow duration-300 flex flex-col h-full text-left">
                    <div className="aspect-[4/3] bg-gray-100 relative overflow-hidden">
                      <img
                        src={tool.imageUrl}
                        alt={translatedItem?.name || tool.name}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                      />
                      {/* Mobile gradient overlay for better contrast if text overlaps, also gives a premium feel */}
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/20 block md:hidden pointer-events-none"></div>
                      <div className="absolute top-2 right-2 sm:top-4 sm:right-4 bg-white/95 backdrop-blur-sm px-2 py-0.5 sm:px-3 sm:py-1 rounded-full shadow-sm border border-gray-100 text-[9px] sm:text-xs font-bold tracking-wider text-gray-700 uppercase break-keep">
                        {translatedItem?.spec || tool.spec}
                      </div>
                    </div>
                    <div className="p-3.5 sm:p-6 flex flex-col flex-grow">
                      <h3 className="text-sm sm:text-xl font-bold text-gray-900 mb-1 sm:mb-2 break-keep line-clamp-1">
                        {translatedItem?.name || tool.name}
                      </h3>
                      <p className="text-[11px] sm:text-base text-gray-400 sm:text-gray-500 leading-relaxed flex-grow break-keep line-clamp-2 sm:line-clamp-none">
                        {translatedItem?.description || tool.description}
                      </p>
                      <div className="mt-3 sm:mt-6 pt-3 border-t border-gray-100 flex items-center gap-1 sm:gap-2 text-brand-blue font-semibold text-[10px] sm:text-sm">
                        <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                        <span className="break-keep">
                          {t.quality?.calibrated || "정밀 검교정 완료"}
                        </span>
                      </div>
                    </div>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </section>

        {/* Certification Link */}
        <section>
          <ScrollReveal>
            <div className="bg-white rounded-3xl p-6 sm:p-8 md:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-shadow">
              <div className="text-center md:text-left">
                <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-3 md:mb-4 tracking-tight break-keep">
                  {t.quality?.cert_title || "국제적으로 입증된 품질 관리"}
                </h3>
                <p className="text-sm sm:text-base md:text-lg text-gray-500 break-keep">
                  {t.quality?.cert_desc ||
                    "IATF 16949, ISO 9001 등 대우경금속의 품질 경영 인프라를 증명하는 인증 내역을 확인하세요."}
                </p>
              </div>
              <Link
                to="/about/cert"
                className="shrink-0 w-full md:w-auto flex items-center justify-center gap-2 px-6 sm:px-8 py-3.5 sm:py-4 bg-gray-900 hover:bg-black text-white text-sm sm:text-base font-semibold rounded-xl sm:rounded-full transition-all group break-keep"
              >
                {t.quality?.btn_cert || "인증현황 바로가기"}
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </ScrollReveal>
        </section>
      </div>
    </div>
  );
};

export default QualityPage;
