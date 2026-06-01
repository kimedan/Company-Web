import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useSite } from "../contexts/SiteContext";
import Header from "../components/Header";
import Footer from "../components/Footer";
import {
  Calendar,
  User,
  ArrowLeft,
  Eye,
  FileText,
  ChevronRight,
  ChevronLeft,
  Clock,
  ExternalLink
} from "lucide-react";

const NewsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { posts, updatePost } = useSite();

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 6;

  // Find the selected post if ID is provided
  const currentPost = id ? posts.find((p) => p.id === id) : null;

  // Track page view count in-memory or on mount
  useEffect(() => {
    if (currentPost && id) {
      const timer = setTimeout(() => {
        if (updatePost) {
          updatePost(id, { views: (currentPost.views || 0) + 1 });
        }
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [id, currentPost]);

  // Scroll to top on page load or post navigation
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [id, currentPage]);

  // Filter only published posts for the public view
  const publishedPosts = posts.filter((p) => p.status === "Published");

  // Format date helper
  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
    } catch {
      return dateStr;
    }
  };

  // Pagination calculations
  const totalItems = publishedPosts.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentPagePosts = publishedPosts.slice(startIndex, endIndex);

  const handlePageChange = (pageNum: number) => {
    if (pageNum >= 1 && pageNum <= totalPages) {
      setCurrentPage(pageNum);
    }
  };

  // Generate ellipsis page numbers like: 1 2 3 ... 109 < >
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 4) {
        pages.push(1, 2, 3, 4, 5, "...", totalPages);
      } else if (currentPage >= totalPages - 3) {
        pages.push(1, "...", totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages);
      }
    }
    return pages;
  };

  // Render list of news posts
  const renderList = () => {
    if (publishedPosts.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-32 text-center">
          <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-6">
            <FileText className="w-8 h-8 text-gray-500 stroke-[1.5]" />
          </div>
          <h3 className="text-xl font-bold text-gray-200 mb-2 font-sans">등록된 소식이 없습니다</h3>
          <p className="text-sm text-gray-500 font-light">현재 DMC Room의 새로운 소식을 준비하고 있습니다.</p>
        </div>
      );
    }

    return (
      <div className="space-y-16">
        {/* News Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
          {currentPagePosts.map((post) => (
            <Link
              key={post.id}
              to={`/news/${post.id}`}
              className="group flex flex-col bg-[#121212]/80 backdrop-blur-md rounded-3xl overflow-hidden border border-gray-800 hover:border-gray-600 hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)] hover:-translate-y-1.5 transition-all duration-300"
              id={`news-card-${post.id}`}
            >
              {/* Thumbnail */}
              <div className="aspect-[16/10] w-full bg-zinc-900 overflow-hidden relative border-b border-gray-900">
                {post.imageUrl ? (
                  <img
                    src={post.imageUrl}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-gray-600 gap-2">
                    <FileText className="w-8 h-8 stroke-[1.5]" />
                    <span className="text-[10px] font-bold text-gray-500 tracking-widest uppercase">DAEWOO METAL</span>
                  </div>
                )}
                {/* Category Badge */}
                <span className="absolute top-4 left-4 inline-flex px-3 py-1 bg-white/5 text-[#f8f8f8] border border-white/10 text-[10px] font-medium uppercase tracking-wider rounded-full">
                  {post.category || "회사소식"}
                </span>
              </div>

              {/* Post Details */}
              <div className="p-6 md:p-8 flex flex-col flex-grow">
                <div className="flex items-center gap-3 text-xs font-mono text-gray-500 mb-4">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-gray-600" />
                    {formatDate(post.date)}
                  </span>
                  <span className="w-1 h-1 bg-gray-700 rounded-full" />
                  <span className="flex items-center gap-1.5">
                    <Eye className="w-3.5 h-3.5 text-gray-600" />
                    {post.views || 0}
                  </span>
                </div>

                <h3 className="text-lg md:text-xl font-bold text-white group-hover:text-[#f8f8f8] transition-colors duration-200 line-clamp-2 leading-snug mb-3">
                  {post.title}
                </h3>

                <p className="text-sm text-gray-400 line-clamp-3 leading-relaxed mb-6 font-light whitespace-pre-line">
                  {post.content ? post.content.replace(/<[^>]*>/g, "") : ""}
                </p>

                <div className="mt-auto flex items-center text-xs font-bold text-gray-300 group-hover:text-white transition-colors duration-150 gap-1">
                  자세히 보기
                  <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Toss Style Premium Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-1 pt-12 border-t border-gray-900">
            {/* Previous Page Link */}
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="w-10 h-10 rounded-full flex items-center justify-center text-gray-500 hover:text-white hover:bg-white/5 disabled:opacity-20 disabled:hover:text-gray-500 disabled:hover:bg-transparent transition-all duration-200"
              aria-label="Previous page"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Page Index Buttons with Ellipsis */}
            {getPageNumbers().map((p, idx) => {
              if (p === "...") {
                return (
                  <span
                    key={`dots-${idx}`}
                    className="w-10 h-10 flex items-center justify-center text-gray-600 text-sm font-medium"
                  >
                    ...
                  </span>
                );
              }
              return (
                <button
                  key={`page-${p}`}
                  onClick={() => handlePageChange(p as number)}
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-200 ${
                    currentPage === p
                      ? "bg-white/10 text-white font-bold"
                      : "text-gray-500 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {p}
                </button>
              );
            })}

            {/* Next Page Link */}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="w-10 h-10 rounded-full flex items-center justify-center text-gray-500 hover:text-white hover:bg-white/5 disabled:opacity-20 disabled:hover:text-gray-500 disabled:hover:bg-transparent transition-all duration-200"
              aria-label="Next page"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    );
  };

  // Render detail view of a news post
  const renderDetail = (post: typeof posts[0]) => {
    return (
      <div className="max-w-4xl mx-auto">
        {/* Navigation / Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-medium text-gray-500 mb-8 select-none">
          <Link to="/" className="hover:text-white transition-colors">홈</Link>
          <ChevronRight className="w-3.5 h-3.5 text-gray-700" />
          <Link to="/news" className="hover:text-white transition-colors">DMC Room</Link>
          <ChevronRight className="w-3.5 h-3.5 text-gray-700" />
          <span className="text-gray-400 truncate">{post.title}</span>
        </div>

        {/* Back Button */}
        <button
          onClick={() => navigate("/news")}
          className="inline-flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-white mb-10 group transition-colors focus:outline-none"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          목록으로 돌아가기
        </button>

        {/* Article Meta */}
        <div className="border-b border-gray-900 pb-8 mb-10">
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="inline-flex px-3 py-1 bg-white/5 text-[#f8f8f8] border border-white/10 text-[11px] font-medium uppercase tracking-wider rounded-full">
              {post.category || "회사소식"}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4.5xl font-bold text-white leading-tight mb-8 break-keep">
            {post.title}
          </h1>
          <div className="flex flex-wrap items-center gap-6 text-sm text-gray-400">
            <div className="flex items-center gap-1.5 font-mono">
              <Calendar className="w-4 h-4 text-gray-600" />
              <span>{formatDate(post.date)}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <User className="w-4 h-4 text-gray-600" />
              <span>{post.author || "관리자"}</span>
            </div>
            <div className="flex items-center gap-1.5 font-mono ml-auto text-gray-500">
              <Eye className="w-4 h-4 text-gray-600" />
              <span>조회수 {post.views || 0}</span>
            </div>
          </div>
        </div>

        {/* Primary/Lead Image */}
        {post.imageUrl && (
          <div className="aspect-[16/9] w-full bg-zinc-950 rounded-3xl overflow-hidden mb-12 border border-gray-900 shadow-xl">
            <img
              src={post.imageUrl}
              alt={post.title}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
        )}

        {/* Body Content */}
        <div className="whitespace-pre-line text-base sm:text-lg text-gray-200 leading-8 mb-16 max-w-none font-sans font-light">
          {post.content ? (
            post.content.split("\n").map((para, idx) => {
              if (!para.trim()) return <div key={idx} className="h-6" />;
              return (
                <p key={idx} className="mb-6 last:mb-0 break-all text-justify text-gray-300">
                  {para}
                </p>
              );
            })
          ) : (
            <p className="text-gray-500 italic">내용이 비어 있는 게시글입니다.</p>
          )}
        </div>

        {/* Secondary / Additional Gallery Images */}
        {post.additionalImages && post.additionalImages.length > 0 && (
          <div className="mb-16 border-t border-gray-900 pt-12">
            <h3 className="text-lg font-bold text-gray-200 mb-6 font-sans">첨부 이미지</h3>
            <div className={`grid gap-6 ${post.additionalImages.length === 1 ? 'grid-cols-1' : 'grid-cols-2 md:grid-cols-3'}`}>
              {post.additionalImages.map((imgUrl, idx) => (
                <div
                  key={idx}
                  className="aspect-square bg-zinc-950 rounded-2xl overflow-hidden border border-gray-900 shadow-md relative group cursor-zoom-in"
                >
                  <img
                    src={imgUrl}
                    alt={`${post.title} attachment ${idx + 1}`}
                    className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
                    referrerPolicy="no-referrer"
                    onClick={() => window.open(imgUrl, "_blank")}
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all">
                    <ExternalLink className="w-5 h-5 text-white" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Bottom Navigation Control bar */}
        <div className="border-t border-gray-900 pt-8 flex justify-center">
          <Link
            to="/news"
            className="px-8 py-3.5 bg-white/5 hover:bg-white/10 border border-gray-800 hover:border-gray-700 text-white text-sm font-semibold rounded-full shadow-lg transition-all text-center active:scale-95"
          >
            목록으로 가기
          </Link>
        </div>
      </div>
    );
  };

  return (
    <div
      className="bg-[#0a0a0a] text-white min-h-screen flex flex-col"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      {/* Global Header */}
      <Header />

      {/* Hero Section of News Room */}
      <div className="flex-grow pt-40 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        {!currentPost && (
          <div className="mb-16 border-b border-gray-900 pb-12">
            <h1 className="text-3xl md:text-6xl font-bold text-white mb-6 tracking-tight break-keep font-sans">
              DMC Room
            </h1>
            <p className="text-base md:text-xl text-gray-400 max-w-3xl leading-relaxed font-light break-keep">
              대우경금속의 새로운 소식과 언론 보도자료를 투명하고 신속하게 전해드립니다.
            </p>
          </div>
        )}

        {/* Page Content Selector */}
        {currentPost ? renderDetail(currentPost) : renderList()}
      </div>

      {/* Global Footer */}
      <Footer />
    </div>
  );
};

export default NewsPage;
