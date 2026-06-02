import React from "react";
import { useSite } from "../contexts/SiteContext";
import ScrollReveal from "../components/ScrollReveal";
import {
  FlaskConical,
  Lightbulb,
  Settings,
  CheckCircle2,
  Atom,
} from "lucide-react";

const RndPage = () => {
  const { t } = useSite();

  const icons = [
    <FlaskConical className="w-10 h-10 text-brand-blue" />,
    <Lightbulb className="w-10 h-10 text-brand-blue" />,
    <Settings className="w-10 h-10 text-brand-blue" />,
  ];

  return (
    <div className="pt-24 pb-24 min-h-screen bg-brand-gray">
      {/* Header Section */}
      <section className="bg-brand-blue text-white py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <ScrollReveal>
            <h1 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight drop-shadow-sm">
              {t.pages.rnd.title}
            </h1>
            <p className="text-base md:text-lg font-light tracking-[0.15em] text-blue-100 font-sans uppercase">
              Aluminium Extrusion Institute of Technology
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Overview Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <ScrollReveal>
          <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl shadow-gray-200/50 flex flex-col md:flex-row gap-12 items-center">
            <div className="w-full md:w-1/3 flex justify-center">
              <div className="w-32 h-32 md:w-48 md:h-48 bg-blue-50 rounded-full flex items-center justify-center relative">
                <div className="absolute inset-2 border-2 border-dashed border-brand-blue/30 rounded-full animate-[spin_30s_linear_infinite]"></div>
                <FlaskConical className="w-16 h-16 md:w-24 md:h-24 text-brand-blue" />
              </div>
            </div>
            <div className="w-full md:w-2/3">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                {t.rnd.overview.title}
                <Atom className="w-6 h-6 text-brand-blue" />
              </h2>
              <p className="text-gray-600 leading-[1.8] text-base break-keep">
                {t.rnd.overview.content}
              </p>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* R&D Fields Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <ScrollReveal>
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 tracking-tight">
              {t.rnd.fields_title}
            </h2>
            <div className="h-1 w-20 bg-brand-blue mx-auto mt-6 rounded-full"></div>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-8">
          {t.rnd.fields.map((field: any, idx: number) => (
            <ScrollReveal
              key={idx}
              delay={idx * 0.1}
              className={idx === 2 ? "col-span-2 md:col-span-1" : "col-span-1"}
            >
              <div className="bg-white rounded-2xl p-4 sm:p-8 h-full shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)] border border-gray-100 transition-all duration-300 hover:-translate-y-1 text-left">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-50 rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-8 text-brand-blue">
                  <div className="p-1">
                    {React.cloneElement(icons[idx] as React.ReactElement, {
                      className: "w-6 h-6 sm:w-10 sm:h-10",
                    })}
                  </div>
                </div>
                <h3 className="text-sm sm:text-xl font-bold text-gray-900 mb-3 sm:mb-6 line-clamp-1">
                  {field.title}
                </h3>
                <ul className="space-y-2 sm:space-y-4">
                  {field.items.map((item: string, iIdx: number) => (
                    <li
                      key={iIdx}
                      className="flex items-start gap-1.5 sm:gap-3 text-gray-600"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 sm:w-5 h-5 text-brand-blue flex-shrink-0 mt-0.5" />
                      <span className="leading-relaxed break-keep font-semibold sm:font-medium text-[10px] sm:text-[15px]">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>
    </div>
  );
};

export default RndPage;
