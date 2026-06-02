import React, { useEffect, useState } from "react";
import {
  HashRouter as Router,
  Routes,
  Route,
  useLocation,
  Link,
} from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Hero from "./components/Hero";
import Philosophy from "./components/Philosophy";
import PromoVideo from "./components/PromoVideo";
import ProductSection from "./components/ProductSection";
import ContactBanner from "./components/ContactBanner";
import ContactForm from "./components/ContactForm";
import PageLayout from "./components/PageLayout";
import ScrollReveal from "./components/ScrollReveal";
import { SiteProvider, useSite } from "./contexts/SiteContext";
import { Product } from "./types";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
// Admin 컴포넌트 lazy import - 방문자는 Admin 코드를 다운받지 않음
const AdminDashboard = React.lazy(() => import("./pages/Admin").then(m => ({ default: m.AdminDashboard })));
const AdminContent   = React.lazy(() => import("./pages/Admin").then(m => ({ default: m.AdminContent })));
const AdminPosts     = React.lazy(() => import("./pages/Admin").then(m => ({ default: m.AdminPosts })));
const AdminSettings  = React.lazy(() => import("./pages/Admin").then(m => ({ default: m.AdminSettings })));
const Login = React.lazy(() => import("./pages/Login"));
import ProcessPage from "./pages/Process";
import QualityPage from "./pages/Quality";
import RndPage from "./pages/RndPage";
import AboutPage from "./pages/AboutPage";
import NewsPage from "./pages/NewsPage";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  TrendingUp,
  ThumbsUp,
  Lightbulb,
  UserCheck,
  Sparkles,
  Award,
  Printer,
  Navigation,
  Feather,
  Factory,
  Settings,
  Cpu,
  Building2,
  Leaf,
  Box,
  Layers,
  ChevronRight,
} from "lucide-react";
import { TRANSLATIONS } from "./translations";

// Scroll to top on route change (push trigger test after workflow scope update)
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

// --- Public Layout Component ---
const PublicLayout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <div className="flex flex-col min-h-screen font-sans antialiased text-brand-text bg-brand-gray selection:bg-brand-blue selection:text-white">
    <Header />
    <main className="flex-grow">{children}</main>
    <Footer />
  </div>
);

// --- Page Components ---

const HomePage = () => (
  <PublicLayout>
    <Hero />
    <Philosophy />
    <PromoVideo />
    <ProductSection />
    <ContactBanner />
  </PublicLayout>
);

// Products Section
const ProductsListPage = () => {
  const { t } = useSite();
  return (
    <PublicLayout>
      <div className="pt-32 pb-24 min-h-screen bg-brand-gray">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            {t.products.title}
          </h1>
          <p className="text-xl text-gray-500 mb-12">{t.products.desc}</p>
          <ProductSection hideHeader={true} />
        </div>
      </div>
    </PublicLayout>
  );
};

import { useParams, Navigate } from "react-router-dom";

const ProductDetailPageWrapper = () => {
  const { slug } = useParams<{ slug: string }>();
  const { products } = useSite();

  // Find by slug first, fallback to id for DB compatibility
  let product = products.find((p) => p.slug === slug);

  if (!product) {
    product = products.find((p) => p.id === slug);
  }

  // Support legacy paths
  if (!product) {
    const legacyMapping: Record<string, string> = {
      light: "auto-parts",
      industry: "industrial-material",
      processing: "non-ferrous-material",
      electronic: "electronics-material",
      construction: "construction-material",
      environmental: "general-material",
      exterior: "general-material",
      substitute: "general-material",
      auto_parts: "auto-parts",
      non_ferrous: "non-ferrous-material",
      general: "general-material",
      industrial: "industrial-material",
      electronics: "electronics-material",
      "general-materials": "general-material",
    };
    const legacySlug = legacyMapping[slug || ""];
    if (legacySlug) {
      // Find if there's a product with this slug
      const fallbackProd = products.find(
        (p) =>
          p.slug === legacySlug ||
          p.id === legacyMapping[legacySlug] ||
          p.id === "p1",
      ); // generic fallback logic
      if (fallbackProd) {
        // Even if we found it, rely on the product's actual slug
        return <Navigate to={`/products/${fallbackProd.slug}`} replace />;
      }
    }
    return <NotFound />;
  }

  // Enforce canonical slug URL
  if (product && product.slug && product.slug !== slug) {
    return <Navigate to={`/products/${product.slug}`} replace />;
  }

  return <ProductDetailPage product={product} />;
};

const ProductDetailPage = ({ product }: { product: Product }) => {
  const { t } = useSite();

  // Try to get translation for the product
  const translatedItems = (t.products as any).items;
  const translation = translatedItems
    ? translatedItems[product.id] || translatedItems[product.slug || ""]
    : null;

  const categoryName = translation ? translation.title : product.title;
  const subtitle = translation ? translation.desc : product.description;

  const resolvedSlug = product.slug || "";
  let icon = null;
  let badgeText =
    translation && translation.badge ? translation.badge : product.category;

  if (resolvedSlug.includes("auto") || product.id === "p1")
    icon = <Feather className="w-3.5 h-3.5" />;
  else if (resolvedSlug.includes("industrial") || product.id === "p2")
    icon = <Factory className="w-3.5 h-3.5" />;
  else if (resolvedSlug.includes("non-ferrous") || product.id === "p3")
    icon = <Settings className="w-3.5 h-3.5" />;
  else if (resolvedSlug.includes("electronic") || product.id === "p4")
    icon = <Cpu className="w-3.5 h-3.5" />;
  else if (resolvedSlug.includes("construction") || product.id === "p5")
    icon = <Building2 className="w-3.5 h-3.5" />;
  else if (
    resolvedSlug.includes("general") ||
    resolvedSlug.includes("exterior") ||
    product.id === "p7" ||
    product.id === "p6"
  ) {
    icon = <Box className="w-3.5 h-3.5" />;
    if (!translation) badgeText = (t.nav as any).exterior || "일반소재";
  } else if (resolvedSlug.includes("environmental"))
    icon = <Leaf className="w-3.5 h-3.5" />;
  else if (resolvedSlug.includes("substitute") || product.id === "p8")
    icon = <Layers className="w-3.5 h-3.5" />;
  else icon = <Box className="w-3.5 h-3.5" />;

  const badge = (
    <span className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-brand-blue text-xs font-bold rounded-full w-fit tracking-wider shadow-sm">
      {icon}
      {badgeText}
    </span>
  );

  return (
    <PublicLayout>
      <div className="fixed right-4 md:right-6 lg:right-8 xl:right-12 top-1/2 -translate-y-1/2 z-50 hidden sm:block">
        <Link
          to="/products"
          className="flex items-center gap-2 p-1.5 pr-4 bg-white/90 backdrop-blur-md text-brand-blue font-medium text-xs rounded-full shadow-[0_8px_30px_rgba(0,0,0,0.12)] border border-blue-50 hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(0,0,0,0.16)] transition-all duration-300 group"
        >
          <div className="w-8 h-8 flex-shrink-0 rounded-full bg-blue-50 flex items-center justify-center group-hover:bg-brand-blue group-hover:text-white transition-colors duration-300 shadow-sm">
            <ChevronRight className="w-4 h-4 rotate-180" />
          </div>
          <span className="whitespace-nowrap tracking-tight">
            {t.products.back_to}
          </span>
        </Link>
      </div>

      <PageLayout title={categoryName} subtitle={subtitle} badge={badge}>
        <div className="grid md:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Left Column: Images */}
          <div className="space-y-4">
            <div className="aspect-[4/3] bg-gray-100 rounded-3xl overflow-hidden shadow-sm border border-gray-100">
              {product.imageUrl ? (
                <img
                  src={product.imageUrl}
                  alt={categoryName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <Box className="w-12 h-12" />
                </div>
              )}
            </div>
            {product.additionalImages &&
              product.additionalImages.length > 0 && (
                <div className="grid grid-cols-4 gap-4 mt-6">
                  {product.additionalImages.map((imgUrl, i) => (
                    <div
                      key={i}
                      className="aspect-square bg-gray-100 rounded-2xl overflow-hidden shadow-sm border border-gray-100"
                    >
                      <img
                        src={imgUrl}
                        alt={`${categoryName} ${i}`}
                        className="w-full h-full object-cover hover:scale-110 transition-transform duration-500 cursor-pointer"
                      />
                    </div>
                  ))}
                </div>
              )}
          </div>

          {/* Right Column: Details & Specs */}
          <div className="space-y-8">
            {product.fullDescription && (
              <div className="prose prose-blue max-w-none">
                <h3 className="text-xl font-bold text-gray-900 mb-4 tracking-tight">
                  상세 정보
                </h3>
                <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                  {product.fullDescription}
                </p>
              </div>
            )}

            {product.specs && product.specs.length > 0 && (
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4 tracking-tight">
                  제품 사양
                </h3>
                <div className="bg-gray-50 rounded-2xl border border-gray-100 overflow-hidden divide-y divide-gray-100">
                  {product.specs.map((spec, index) => (
                    <div
                      key={index}
                      className="flex flex-col sm:flex-row sm:items-center px-6 py-4 hover:bg-white transition-colors"
                    >
                      <div className="w-1/3 text-sm font-bold text-gray-900 min-w-[120px] pb-1 sm:pb-0">
                        {spec.label}
                      </div>
                      <div className="w-2/3 text-sm text-gray-600">
                        {spec.value}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {!product.fullDescription &&
              (!product.specs || product.specs.length === 0) && (
                <div className="text-gray-500 bg-gray-50 p-6 rounded-2xl border border-gray-100">
                  상세 정보가 아직 등록되지 않았습니다. 관리자 페이지에서 내용을
                  추가해주세요.
                </div>
              )}
          </div>
        </div>
      </PageLayout>
    </PublicLayout>
  );
};

// Other Sections

// Improved Contact/Support Page
const ContactPage = () => {
  const { t } = useSite();

  return (
    <PublicLayout>
      <PageLayout
        title={t.pages.support.title}
        subtitle={t.pages.support.subtitle}
      >
        <div className="max-w-3xl mx-auto">
          <ContactForm />
        </div>
      </PageLayout>
    </PublicLayout>
  );
};

const NotFound = () => (
  <PublicLayout>
    <div className="pt-32 min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">
        페이지를 찾을 수 없습니다.
      </h1>
      <p className="text-gray-500 mb-8">
        요청하신 페이지가 존재하지 않거나 이동되었을 수 있습니다.
      </p>
      <a href="/" className="text-brand-blue hover:underline">
        홈으로 돌아가기
      </a>
    </div>
  </PublicLayout>
);

const App: React.FC = () => {
  return (
    <AuthProvider>
      <SiteProvider>
        <Router>
          <ScrollToTop />
          <Routes>
            {/* Login / Admin Routes - lazy loaded, 방문자는 다운받지 않음 */}
            <Route
              path="/login"
              element={
                <React.Suspense fallback={<div className="min-h-screen bg-[#07090e]" />}>
                  <Login />
                </React.Suspense>
              }
            />

            {/* Admin Routes (Protected + lazy) */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <React.Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center"><span className="text-gray-400 text-sm">로딩 중...</span></div>}>
                    <AdminDashboard />
                  </React.Suspense>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/content"
              element={
                <ProtectedRoute>
                  <React.Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center"><span className="text-gray-400 text-sm">로딩 중...</span></div>}>
                    <AdminContent />
                  </React.Suspense>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/posts"
              element={
                <ProtectedRoute>
                  <React.Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center"><span className="text-gray-400 text-sm">로딩 중...</span></div>}>
                    <AdminPosts />
                  </React.Suspense>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/settings"
              element={
                <ProtectedRoute>
                  <React.Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center"><span className="text-gray-400 text-sm">로딩 중...</span></div>}>
                    <AdminSettings />
                  </React.Suspense>
                </ProtectedRoute>
              }
            />

            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />

            {/* About Routes */}
            <Route
              path="/about"
              element={
                <PublicLayout>
                  <AboutPage />
                </PublicLayout>
              }
            />
            <Route
              path="/about/:section"
              element={
                <PublicLayout>
                  <AboutPage />
                </PublicLayout>
              }
            />

            {/* Product Routes */}
            <Route path="/products" element={<ProductsListPage />} />
            {/* Map product detail pages to use translations */}
            <Route
              path="/products/:slug"
              element={<ProductDetailPageWrapper />}
            />

            {/* Other Routes */}
            <Route path="/process" element={<ProcessPage />} />
            <Route
              path="/quality"
              element={
                <PublicLayout>
                  <QualityPage />
                </PublicLayout>
              }
            />
            <Route
              path="/rnd"
              element={
                <PublicLayout>
                  <RndPage />
                </PublicLayout>
              }
            />

            {/* Replaced SupportPage with ContactPage */}
            <Route path="/support" element={<ContactPage />} />
            <Route path="/contact" element={<ContactPage />} />

            {/* News Room Routes */}
            <Route
              path="/news"
              element={
                <PublicLayout>
                  <NewsPage />
                </PublicLayout>
              }
            />
            <Route
              path="/news/:id"
              element={
                <PublicLayout>
                  <NewsPage />
                </PublicLayout>
              }
            />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </SiteProvider>
    </AuthProvider>
  );
};

export default App;
