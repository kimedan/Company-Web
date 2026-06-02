import React, { useState } from "react";
import { NAV_ITEMS, LEGAL_TEXTS } from "../constants";
import { Link } from "react-router-dom";
import { Phone, Mail } from "lucide-react";
import { useSite } from "../contexts/SiteContext";
import Logo from "./Logo";
import { Language } from "../types";
import LegalModal from "./LegalModal";

const Footer: React.FC = () => {
  const { config, t, language, setLanguage } = useSite();
  const [activeModal, setActiveModal] = useState<"email" | "privacy" | null>(
    null,
  );

  const getNavLabel = (key: string) => {
    // Top level
    if (key === "회사소개") return t.nav.about;
    if (key === "제품소개") return t.nav.products;
    if (key === "공정소개") return t.nav.process;
    if (key === "연구소") return t.nav.rnd;
    if (key === "고객지원") return t.nav.support;

    // Sub items (About)
    if (key === "회사개요") return t.nav.intro;
    if (key === "회사연혁") return t.nav.history;
    if (key === "경영이념") return t.nav.philosophy;
    if (key === "인증현황") return t.nav.cert;
    if (key === "오시는 길") return t.nav.location;

    // Sub items (Products)
    if (key === "경량소재") return t.nav.light;
    if (key === "산업용소재") return t.nav.industry;
    if (key === "가공소재") return t.nav.processing;
    if (key === "전기전자부품소재") return t.nav.electronic;
    if (key === "건축소재") return t.nav.construction;
    if (key === "환경소재") return t.nav.environmental;
    if (key === "외장소재") return t.nav.exterior;
    if (key === "대체소재") return t.nav.substitute;

    // Sub items (Process)
    if (key === "생산공정") return t.nav.production;
    if (key === "품질검사") return t.nav.quality;

    return key;
  };

  const SubItemLabel = ({ label }: { label: string }) => {
    return <>{getNavLabel(label)}</>;
  };

  return (
    <>
      <footer className="bg-white border-t border-gray-200 pt-20 pb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Top Section: Links */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 mb-16">
            {NAV_ITEMS.map((item) => (
              <div key={item.label} className="flex flex-col space-y-3">
                <h3 className="font-semibold text-gray-900">
                  {getNavLabel(item.label)}
                </h3>
                <ul className="space-y-2">
                  {item.subItems ? (
                    item.subItems.map((sub) => (
                      <li key={sub.path}>
                        <Link
                          to={sub.path}
                          className="text-sm text-gray-500 hover:text-brand-blue transition-colors"
                        >
                          <SubItemLabel label={sub.label} />
                        </Link>
                      </li>
                    ))
                  ) : (
                    <li>
                      <Link
                        to={item.path}
                        className="text-sm text-gray-500 hover:text-brand-blue transition-colors"
                      >
                        {t.common.read_more}
                      </Link>
                    </li>
                  )}
                </ul>
              </div>
            ))}
            <div className="col-span-2 md:col-span-4 lg:col-span-1">
              <h3 className="font-semibold text-gray-900 mb-4">
                {t.footer.lang_select}
              </h3>
              <div className="flex space-x-2">
                {(["KOR", "ENG", "JPN"] as Language[]).map((lang) => (
                  <button
                    key={lang}
                    onClick={() => setLanguage(lang)}
                    className={`px-3 py-1 rounded text-xs font-medium transition-colors border ${
                      language === lang
                        ? "bg-gray-800 text-white border-gray-800"
                        : "bg-white border-gray-200 text-gray-400 hover:border-gray-300 hover:text-gray-600"
                    }`}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-100 my-8"></div>

          {/* Bottom Section: Info */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-6 lg:space-y-0">
            <div className="space-y-4">
              <Link to="/">
                <Logo color="#071D49" className="h-10 mb-2 w-auto" />
              </Link>
              <div className="text-sm text-gray-500 space-y-1">
                <div className="flex items-start md:items-center gap-2">
                  <span className="font-medium min-w-[80px] text-gray-700">
                    {t.footer.daegu}
                  </span>
                  <span>{t.footer.address_daegu}</span>
                </div>
                <div className="flex items-start md:items-center gap-2">
                  <span className="font-medium min-w-[80px] text-gray-700">
                    {t.footer.changnyeong}
                  </span>
                  <span>{t.footer.address_changnyeong}</span>
                </div>
                <div className="flex items-center gap-4 mt-2">
                  <div className="flex items-center gap-1">
                    <Phone className="w-3 h-3" /> 053-611-6061
                  </div>
                  <div className="flex items-center gap-1">
                    <Mail className="w-3 h-3" /> {config.contactEmail}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-start lg:items-end gap-3 text-xs text-gray-400">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setActiveModal("email")}
                  className="hover:text-brand-blue transition-colors font-medium"
                >
                  {t.footer.email_refusal}
                </button>
                <span className="w-[1px] h-3 bg-gray-300"></span>
                <button
                  onClick={() => setActiveModal("privacy")}
                  className="hover:text-brand-blue transition-colors font-medium"
                >
                  {t.footer.privacy_policy}
                </button>
              </div>
              <span>{t.footer.rights}</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <LegalModal
        isOpen={activeModal === "email"}
        onClose={() => setActiveModal(null)}
        title={t.footer.email_refusal}
        content={LEGAL_TEXTS.EMAIL_COLLECTION_REFUSAL}
      />
      <LegalModal
        isOpen={activeModal === "privacy"}
        onClose={() => setActiveModal(null)}
        title={t.footer.privacy_policy}
        content={LEGAL_TEXTS.PRIVACY_POLICY}
      />
    </>
  );
};

export default Footer;
