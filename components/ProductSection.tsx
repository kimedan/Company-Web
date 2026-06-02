import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  Plus,
  X,
  ChevronRight,
  Feather,
  Factory,
  Settings,
  Cpu,
  Building2,
  Leaf,
  Box,
  Layers,
} from "lucide-react";
import ScrollReveal from "./ScrollReveal";
import { useSite } from "../contexts/SiteContext";
import { Product } from "../types";

interface ProductSectionProps {
  hideHeader?: boolean;
}

const ProductSection: React.FC<ProductSectionProps> = ({
  hideHeader = false,
}) => {
  const { products, t } = useSite();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (selectedProduct) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [selectedProduct]);

  // Helper to get translated content if available, fallback to product data
  // Using explicit type casting or checking if items exists to avoid TS errors
  const getProductContent = (product: Product) => {
    // Check if the current translation object has 'items' and if the product ID exists in it
    const translatedItems = (t.products as any).items;
    const translation = translatedItems
      ? translatedItems[product.id] || translatedItems[product.slug || ""]
      : null;

    let translatedCategory = product.category;
    let icon = null;
    let path = product.slug || product.id || "p1";

    const resolvedSlug = product.slug || "";

    // Assign proper icons and categories based on slug first, then ID
    if (resolvedSlug.includes("auto") || product.id === "p1") {
      translatedCategory = t.nav.light;
      icon = <Feather className="w-3.5 h-3.5" />;
    } else if (resolvedSlug.includes("industrial") || product.id === "p2") {
      translatedCategory = t.nav.industry;
      icon = <Factory className="w-3.5 h-3.5" />;
    } else if (resolvedSlug.includes("non-ferrous") || product.id === "p3") {
      translatedCategory = t.nav.processing;
      icon = <Settings className="w-3.5 h-3.5" />;
    } else if (resolvedSlug.includes("electronic") || product.id === "p4") {
      translatedCategory = t.nav.electronic;
      icon = <Cpu className="w-3.5 h-3.5" />;
    } else if (resolvedSlug.includes("construction") || product.id === "p5") {
      translatedCategory = t.nav.construction;
      icon = <Building2 className="w-3.5 h-3.5" />;
    } else if (
      resolvedSlug.includes("general") ||
      resolvedSlug.includes("exterior") ||
      product.id === "p7" ||
      product.id === "p6"
    ) {
      translatedCategory = t.nav.exterior || "일반소재";
      icon = <Box className="w-3.5 h-3.5" />;
    } else if (resolvedSlug.includes("environmental")) {
      translatedCategory = (t.nav as any).environmental || "환경소재";
      icon = <Leaf className="w-3.5 h-3.5" />;
    } else if (resolvedSlug.includes("substitute") || product.id === "p8") {
      translatedCategory = (t.nav as any).substitute || "대체소재";
      icon = <Layers className="w-3.5 h-3.5" />;
    } else {
      icon = <Box className="w-3.5 h-3.5" />;
    }

    return {
      title: translation ? translation.title : product.title,
      description: translation ? translation.desc : product.description,
      imageUrl: product.imageUrl,
      category: translatedCategory,
      badge: translation ? (translation as any).badge : translatedCategory,
      icon,
      path,
    };
  };

  return (
    <section id="products" className="py-32 bg-[#F5F5F7] relative">
      {/* 
        Section Connector (Top):
        Gradient from White (Previous Section) to Gray (Current Section)
        This removes the hard line between the white Philosophy section and this gray section.
      */}
      <div className="absolute top-0 left-0 w-full h-40 bg-gradient-to-b from-white to-[#F5F5F7] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {!hideHeader && (
          <div className="flex flex-col items-center text-center mb-8 gap-4">
            <ScrollReveal>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 tracking-tight break-keep">
                {t.products.title}
              </h2>
            </ScrollReveal>
            <ScrollReveal delay={0.1} className="w-full">
              <p className="text-sm sm:text-base text-gray-500 font-medium break-keep px-4 max-w-3xl mx-auto">
                {t.products.desc}
              </p>
            </ScrollReveal>
            <ScrollReveal
              delay={0.2}
              className="text-center w-full flex justify-center"
            >
              <Link
                to="/products"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white border border-gray-200 text-gray-900 font-bold hover:bg-gray-50 hover:border-gray-300 hover:shadow-lg transition-all duration-300 shadow-sm group"
              >
                {t.products.view_all}{" "}
                <ArrowUpRight className="w-5 h-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>
            </ScrollReveal>
          </div>
        )}

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 lg:gap-8">
          {products.map((product, index) => {
            const content = getProductContent(product);
            return (
              <ScrollReveal key={product.id} delay={index * 0.1}>
                <div
                  onClick={() => setSelectedProduct(product)}
                  className="group block h-full cursor-pointer"
                >
                  <div className="bg-white rounded-2xl sm:rounded-[2rem] overflow-hidden shadow-[0_2px_10px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] hover:-translate-y-2 transition-all duration-500 ease-spring h-full flex flex-col border border-gray-100/50 relative z-0 hover:z-10">
                    {/* Image Container */}
                    <div className="aspect-[4/3] overflow-hidden bg-gray-100 relative">
                      <img
                        src={content.imageUrl}
                        alt={content.title}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500"></div>

                      {/* Category Tag - Slides in on hover, always visible on mobile at top-left for scannability */}
                      <div className="absolute top-2 left-2 sm:top-4 sm:left-4 bg-white/95 backdrop-blur-sm px-2 py-1 rounded-full text-[9px] sm:text-xs font-bold text-brand-blue uppercase tracking-wider shadow-sm opacity-100 sm:translate-y-[-10px] sm:opacity-0 sm:group-hover:translate-y-0 sm:group-hover:opacity-100 transition-all duration-500 ease-spring">
                        {content.category}
                      </div>

                      {/* Overlay Icon */}
                      <div className="absolute bottom-2 right-2 sm:bottom-4 sm:right-4 w-7 h-7 sm:w-10 sm:h-10 bg-white/25 sm:bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center opacity-100 sm:opacity-0 sm:group-hover:opacity-100 scale-100 sm:scale-75 sm:group-hover:scale-100 transition-all duration-500 ease-spring">
                        <Plus className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                      </div>
                    </div>

                    {/* Text Content */}
                    <div className="p-4 sm:p-8 flex-1 flex flex-col relative text-left">
                      <h3 className="text-sm sm:text-2xl font-bold text-gray-900 mb-1.5 sm:mb-3 group-hover:text-brand-blue transition-colors duration-300 line-clamp-1 sm:line-clamp-none">
                        {content.title}
                      </h3>
                      <p className="text-[11px] sm:text-base text-gray-400 sm:text-gray-500 font-medium leading-relaxed mb-3 sm:mb-6 line-clamp-2 sm:line-clamp-3">
                        {content.description}
                      </p>

                      <div className="mt-auto pt-3 sm:pt-6 border-t border-gray-100 flex items-center justify-between text-[10px] sm:text-sm font-bold text-brand-blue">
                        <span>{t.products.detail_btn}</span>
                        <div className="w-5 h-5 sm:w-8 sm:h-8 rounded-full bg-blue-50/70 sm:bg-blue-50 flex items-center justify-center group-hover:bg-brand-blue group-hover:text-white transition-colors duration-300">
                          <ArrowUpRight className="w-3 h-3 sm:w-4 sm:h-4 group-hover:rotate-45 transition-transform duration-500 ease-spring" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            );
          })}
        </div>

        <ScrollReveal delay={0.4}>
          <div className="mt-12 text-center md:hidden">
            <Link
              to="/products"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white border border-gray-200 text-gray-900 font-bold shadow-sm active:scale-95 transition-transform"
            >
              {t.products.view_all} <ArrowUpRight className="w-5 h-5" />
            </Link>
          </div>
        </ScrollReveal>
      </div>

      {/* 
        Bottom Gradient Blend - "Seam Eraser"
        Transitions from Gray (#F5F5F7) to White (next section background)
        Using a tall gradient and backdrop blur to ensure a smooth, seamless transition.
      */}
      <div className="absolute bottom-0 left-0 w-full h-48 pointer-events-none z-10">
        <div className="absolute inset-0 bg-gradient-to-t from-white via-white/60 to-transparent" />
        <div
          className="absolute bottom-0 left-0 w-full h-16 backdrop-blur-[1px] mask-image-gradient-to-t"
          style={{ maskImage: "linear-gradient(to top, black, transparent)" }}
        />
      </div>

      {/* Product Detail Modal */}
      {selectedProduct &&
        (() => {
          const content = getProductContent(selectedProduct);
          return (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
              <div
                className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity animate-fade-in"
                onClick={() => setSelectedProduct(null)}
              ></div>

              <div className="relative bg-white rounded-[2.5rem] shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col md:flex-row overflow-hidden animate-scale-up">
                {/* Close Button */}
                <button
                  onClick={() => setSelectedProduct(null)}
                  className="absolute top-4 right-4 z-20 w-10 h-10 bg-black/20 hover:bg-black/40 text-white rounded-full flex items-center justify-center transition-colors backdrop-blur-md"
                >
                  <X className="w-5 h-5" />
                </button>

                {/* Modal Image Section */}
                <div className="w-full md:w-1/2 aspect-video md:aspect-auto relative bg-gray-100">
                  <img
                    src={content.imageUrl}
                    alt={content.title}
                    className="w-full h-full object-cover"
                  />
                  {/* Mobile Overlay Text */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent md:hidden"></div>
                  <div className="absolute bottom-4 left-4 md:hidden text-white">
                    <p className="text-sm font-bold opacity-80 mb-1 flex items-center gap-1.5">
                      {content.icon} {content.category}
                    </p>
                    <h3 className="text-2xl font-bold">{content.title}</h3>
                  </div>
                </div>

                {/* Modal Content Section */}
                <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col bg-white overflow-y-auto">
                  <div className="hidden md:block">
                    <span className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-brand-blue text-xs font-bold rounded-full w-fit mb-4 tracking-wider">
                      {content.icon}
                      {content.badge}
                    </span>
                    <h3 className="text-3xl font-bold text-gray-900 mb-6 leading-tight">
                      {content.title}
                    </h3>
                  </div>

                  <div className="prose prose-lg text-gray-600 leading-relaxed mb-8 flex-grow">
                    <p className="whitespace-pre-wrap">{content.description}</p>

                    <div className="mt-8 space-y-4">
                      <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
                        <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                          <Plus className="w-4 h-4 text-brand-blue" />{" "}
                          {t.products.modal.feature_title}
                        </h4>
                        <ul className="text-sm space-y-2 text-gray-500">
                          {t.products.modal.features.map((feature, i) => (
                            <li key={i}>• {feature}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="mt-auto pt-6 border-t border-gray-100">
                    <Link
                      to={`/products/${content.path}`}
                      onClick={() => setSelectedProduct(null)}
                      className="flex items-center justify-center w-full py-4 bg-brand-blue text-white font-bold rounded-xl hover:bg-[#051535] transition-all shadow-lg shadow-blue-900/20 hover:shadow-blue-900/30 active:scale-[0.98]"
                    >
                      {t.products.modal.contact_btn}{" "}
                      <ChevronRight className="w-5 h-5 ml-1" />
                    </Link>
                    {t.products.modal.note && (
                      <p className="text-center text-xs text-gray-400 mt-3">
                        {t.products.modal.note}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })()}
    </section>
  );
};

export default ProductSection;
