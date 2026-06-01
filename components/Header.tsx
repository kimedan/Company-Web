import React, { useState, useEffect } from "react";
import { NAV_ITEMS } from "../constants";
import { Menu, X, ChevronDown, Globe, ArrowRight } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import Logo from "./Logo";
import { useSite } from "../contexts/SiteContext";
import { Language } from "../types";

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { config, language, setLanguage, t } = useSite();

  const [activeRoute, setActiveRoute] = useState(location.pathname);

  useEffect(() => {
    setActiveRoute(location.pathname);
  }, [location.pathname]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);

      let currentActive = location.pathname;

      if (location.pathname.startsWith("/about")) {
        const sections = [
          { id: "intro", path: "/about/intro" },
          { id: "history", path: "/about/history" },
          { id: "philosophy", path: "/about/philosophy" },
          { id: "cert", path: "/about/cert" },
          { id: "location", path: "/about/location" },
        ];

        for (const sec of sections) {
          const el = document.getElementById(sec.id);
          if (el) {
            const rect = el.getBoundingClientRect();
            // Using 1/3 viewport height as the trigger line
            if (
              rect.top <= window.innerHeight / 3 &&
              rect.bottom >= window.innerHeight / 3
            ) {
              currentActive = sec.path;
            }
          }
        }
      }

      setActiveRoute(currentActive);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // run once on mount or route change to catch initial position

    return () => window.removeEventListener("scroll", handleScroll);
  }, [location.pathname]);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  const isParentActive = (itemPath: string) => {
    if (itemPath === "/" && activeRoute === "/") return true;
    if (itemPath.startsWith("/about") && activeRoute.startsWith("/about"))
      return true;
    if (itemPath.startsWith("/products") && activeRoute.startsWith("/products"))
      return true;
    if (itemPath !== "/" && activeRoute.startsWith(itemPath)) return true;
    return false;
  };

  const isHome = location.pathname === "/";
  const isTransparent = isHome && !isScrolled && !isMobileMenuOpen;
  const logoColor = isTransparent ? "white" : config.primaryColor;

  // Helper to translate Nav Labels and Sub-labels
  const getNavLabel = (key: string) => {
    // Top level
    if (key === "회사소개") return t.nav.about;
    if (key === "제품소개") return t.nav.products;
    if (key === "공정소개") return t.nav.process;
    if (key === "연구소") return t.nav.rnd;
    if (key === "회사소식") return t.nav.news;
    if (key === "고객지원") return t.nav.support;

    // Sub items (About)
    if (key === "회사개요") return t.nav.intro;
    if (key === "회사연혁") return t.nav.history;
    if (key === "경영이념") return t.nav.philosophy;
    if (key === "인증현황") return t.nav.cert;
    if (key === "오시는 길") return t.nav.location;

    // Sub items (Products)
    if (key === "자동차부품소재") return t.nav.light;
    if (key === "산업소재") return t.nav.industry;
    if (key === "비철가공소재") return t.nav.processing;
    if (key === "전기전자부품소재") return t.nav.electronic;
    if (key === "건축소재") return t.nav.construction;
    if (key === "일반소재") return t.nav.general || t.nav.exterior || key;

    // Sub items (Process)
    if (key === "생산공정") return t.nav.production;
    if (key === "품질검사") return t.nav.quality;

    return key;
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transform-gpu transition-[padding] duration-300 ease-in-out ${
          !isScrolled ? "py-5" : "py-3"
        }`}
      >
        {/* Separated background & blur layer to prevent scroll flicker & compositing artifacts */}
        <div className="absolute inset-0 -z-10 isolate overflow-hidden pointer-events-none">
          <div
            className={`absolute inset-0 backdrop-blur-xl transform-gpu backface-hidden will-change-[opacity,background-color] transition-all duration-300 ease-in-out ${
              !isTransparent
                ? "bg-white/80 shadow-[0_1px_0_rgba(0,0,0,0.05)] opacity-100"
                : "bg-transparent shadow-none opacity-0"
            }`}
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center relative">
            {/* Logo */}
            <Link
              to="/"
              className="flex items-center space-x-2 z-50 group shrink-0"
              onClick={(e) => {
                if (location.pathname === "/") {
                  e.preventDefault();
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }
              }}
            >
              <Logo
                color={logoColor}
                className="h-10 w-auto md:h-12 transition-colors duration-300"
              />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-2 absolute left-1/2 -translate-x-1/2 will-change-transform">
              {NAV_ITEMS.map((item) => (
                <div
                  key={item.path}
                  className="relative group min-w-[90px] px-3 py-2 flex justify-center"
                >
                  <Link
                    to={item.path}
                    className={`text-[14px] transition-colors duration-200 flex items-center gap-1.5 font-medium
                      ${
                        !isTransparent
                          ? isParentActive(item.path)
                            ? "text-gray-900"
                            : "text-gray-600 hover:text-gray-900"
                          : isParentActive(item.path)
                            ? "text-white"
                            : "text-white/80 hover:text-white"
                      }`}
                  >
                    {getNavLabel(item.label)}
                    {item.subItems && (
                      <span className="w-3 h-3 flex items-center justify-center shrink-0">
                        <ChevronDown className="w-full h-full opacity-60 transition-transform duration-300 group-hover:rotate-180 transform-gpu" />
                      </span>
                    )}
                  </Link>

                  {/* Mega Dropdown Menu (Enhanced Glassmorphism) */}
                  {item.subItems && (
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 pt-4 opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-opacity transition-transform duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)] will-change-[transform,opacity] z-50">
                      <div
                        className={`
                        isolate rounded-2xl border overflow-hidden p-1.5
                        transition-[background-color,border-color,opacity,transform] duration-300 shadow-[0_8px_32px_0_rgba(0,0,0,0.1)]
                        ${
                          isTransparent
                            ? "bg-black/30 border-white/10 shadow-black/20" // Dark Glass (High Transparency)
                            : "bg-white/70 border-white/20 shadow-gray-200/50" // Light Glass (Frosted)
                        }
                        ${item.subItems.length > 5 ? "w-[540px]" : "w-max"}
                      `}
                      >
                        <div
                          className={`
                          ${
                            item.subItems.length > 5
                              ? "grid grid-cols-4 gap-1"
                              : "flex flex-row gap-1"
                          }
                        `}
                        >
                          {item.subItems.map((sub) => (
                            <Link
                              key={sub.path}
                              to={sub.path}
                              className={`
                                flex items-center justify-center rounded-xl transition-all duration-200
                                ${
                                  item.subItems!.length > 5
                                    ? "py-2.5 px-2 text-center"
                                    : "py-2 px-5 min-w-[100px] text-center"
                                }
                                ${
                                  isTransparent
                                    ? activeRoute === sub.path
                                      ? "bg-white/30 text-white shadow-[0_0_15px_rgba(255,255,255,0.2)]"
                                      : "text-white/90 hover:bg-white/20 hover:text-white hover:shadow-[0_0_15px_rgba(255,255,255,0.1)]"
                                    : activeRoute === sub.path
                                      ? "bg-gray-800/95 text-white shadow-md border border-gray-700/50"
                                      : "text-gray-700 hover:bg-black/5 hover:text-gray-900 hover:shadow-sm"
                                }
                              `}
                            >
                              <span className="block text-[13px] font-medium leading-tight">
                                {getNavLabel(sub.label)}
                              </span>
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {isParentActive(item.path) && (
                    <span
                      className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 rounded-full ${!isTransparent ? "bg-gray-800" : "bg-white"}`}
                    />
                  )}
                </div>
              ))}
            </nav>

            {/* Right Actions: Lang Switcher & CTA */}
            <div className="hidden md:flex items-center gap-2">
              {/* Language Switcher */}
              <div className="relative group">
                <button
                  className={`flex items-center gap-1 text-[12.5px] font-bold px-3 py-2 rounded-full transition-all ${
                    !isTransparent
                      ? "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                      : "text-white/80 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span>{language}</span>
                </button>
                <div className="absolute top-full right-0 pt-2 w-24 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity z-50">
                  <div className="bg-white/95 isolate rounded-lg shadow-xl border border-gray-100 overflow-hidden py-1">
                    {["KOR", "ENG", "JPN"].map((lang) => (
                      <button
                        key={lang}
                        onClick={() => setLanguage(lang as Language)}
                        className={`w-full text-left px-4 py-2 text-[12.5px] font-medium hover:bg-gray-50 ${language === lang ? "text-brand-blue bg-blue-50" : "text-gray-600"}`}
                      >
                        {lang}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Enhanced CTA Button - Minimal Ghost Style to Hover Fill */}
              <Link to="/contact">
                <button
                  className={`
                  group relative overflow-hidden flex items-center gap-2 text-[14px] font-bold px-6 py-2.5 rounded-full transition-all duration-300 ease-spring
                  ${
                    !isTransparent
                      ? "text-gray-900 bg-transparent hover:bg-gray-100"
                      : "text-white bg-transparent hover:bg-white/20"
                  }
                `}
                >
                  <span className="relative z-10 flex items-center gap-1">
                    {t.nav.contact}
                    {/* Arrow Animation */}
                    <ArrowRight
                      className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1"
                      strokeWidth={2.5}
                    />
                  </span>
                </button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center gap-3">
              <button
                className="z-50 focus:outline-none p-2"
                onClick={toggleMobileMenu}
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6 text-gray-900" />
                ) : (
                  <Menu
                    className={`h-6 w-6 ${!isTransparent ? "text-gray-900" : "text-white"}`}
                  />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 bg-white z-40 transform transition-transform duration-300 ease-in-out md:hidden ${
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="pt-28 px-6 h-full overflow-y-auto pb-10">
          <div className="flex justify-end items-center mb-6">
            <div className="flex bg-gray-100 rounded-lg p-1">
              {["KOR", "ENG", "JPN"].map((lang) => (
                <button
                  key={lang}
                  onClick={() => setLanguage(lang as Language)}
                  className={`px-3 py-1 text-[12.5px] font-bold rounded ${language === lang ? "bg-white shadow-sm text-brand-blue" : "text-gray-500"}`}
                >
                  {lang}
                </button>
              ))}
            </div>
          </div>
          <nav className="flex flex-col space-y-8">
            {NAV_ITEMS.map((item) => (
              <div
                key={item.label}
                className="border-b border-gray-100 pb-6 last:border-0"
              >
                <Link
                  to={item.path}
                  className="text-2xl font-bold text-gray-900 block mb-4"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {getNavLabel(item.label)}
                </Link>
                {item.subItems && (
                  <div className="pl-4 flex flex-col space-y-3 border-l-2 border-gray-100">
                    {item.subItems.map((sub) => (
                      <Link
                        key={sub.path}
                        to={sub.path}
                        className="text-gray-500 hover:text-gray-900 text-lg font-medium"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {getNavLabel(sub.label)}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>
          <div className="mt-8 mb-8">
            <Link
              to="/contact"
              className={`block w-full bg-gray-900 text-white text-center py-4 font-bold text-lg shadow-lg active:scale-95 transition-transform ${config.borderRadius}`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {t.nav.contact}
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
