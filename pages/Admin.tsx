import React, { useState } from "react";
import AdminLayout from "../components/AdminLayout";
import { useSite } from "../contexts/SiteContext";
import {
  Users,
  Eye,
  FileText,
  MousePointer,
  Plus,
  Trash2,
  Search,
  Palette,
  Globe,
  Save,
  Upload,
  Image as ImageIcon,
  X,
  LayoutTemplate,
  Layers,
  Award,
  Package,
  Pencil,
  Wand2,
  Loader2,
  Download,
  RefreshCcw,
  AlertTriangle,
  Settings,
} from "lucide-react";
import { BorderRadiusSize } from "../types";
import { uploadImageToStorage } from "../utils/firebase";

import AdminProductModal from "../components/AdminProductModal";

// --- Dashboard Component ---

export const AdminDashboard: React.FC = () => {
  const { posts, certifications } = useSite();
  const totalViews = posts.reduce((acc, curr) => acc + curr.views, 0);

  const stats = [
    {
      label: "총 방문자 수",
      value: "12,450",
      change: "+12%",
      icon: <Users className="w-6 h-6 text-blue-600" />,
    },
    {
      label: "인증서 보유",
      value: certifications.length.toString(),
      change: "현황",
      icon: <Award className="w-6 h-6 text-green-600" />,
    },
    {
      label: "게시글 수",
      value: posts.length.toString(),
      change: "+2",
      icon: <FileText className="w-6 h-6 text-purple-600" />,
    },
    {
      label: "문의 접수",
      value: "8",
      change: "+8",
      icon: <MousePointer className="w-6 h-6 text-orange-600" />,
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Important Notice */}
        <div className="bg-brand-blue/5 border border-brand-blue/20 rounded-2xl p-6 flex items-start gap-4">
          <div className="p-2 bg-brand-blue/10 rounded-full text-brand-blue">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-brand-blue font-bold text-lg mb-1">
              데이터 동기화 (Firebase 연동 완료)
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              모든 사이트의 텍스트, 이미지 및 브랜드 설정(로고 등)이
              클라우드(Firebase)에 실시간으로 안전하게 저장됩니다.
              <br />
              좌측의 <strong>[사이트 설정]</strong> 메뉴에서{" "}
              <strong>로고 이미지</strong>를 바로 업로드하고 변경하실 수
              있습니다.
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-gray-50 rounded-xl">{stat.icon}</div>
                <span className="text-xs font-medium px-2 py-1 bg-green-50 text-green-700 rounded-full">
                  {stat.change}
                </span>
              </div>
              <h3 className="text-gray-500 text-sm font-medium">
                {stat.label}
              </h3>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold mb-4">빠른 바로가기</h3>
            <div className="flex gap-4">
              <a
                href="#/admin/content"
                className="flex-1 bg-blue-50 p-4 rounded-xl text-brand-blue font-bold hover:bg-blue-100 transition-colors text-center"
              >
                페이지 문구 수정
              </a>
              <a
                href="#/admin/posts"
                className="flex-1 bg-gray-50 p-4 rounded-xl text-gray-700 font-bold hover:bg-gray-100 transition-colors text-center"
              >
                새 공지사항 작성
              </a>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

// --- Content Manager Component (Updated) ---
export const AdminContent: React.FC = () => {
  const {
    certifications,
    addCertification,
    updateCertification,
    deleteCertification,
    content,
    updateContent,
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    processSteps,
    updateProcessStep,
    resetProcessSteps,
    equipments,
    updateEquipment,
    resetEquipments,
  } = useSite();
  const [activeTab, setActiveTab] = useState<
    "cert" | "text" | "images" | "products" | "process" | "equipment"
  >("products");
  const [newCert, setNewCert] = useState({ title: "", imageUrl: "" });
  const [uploading, setUploading] = useState<{ [key: string]: boolean }>({});

  // Product Modal State
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
   const handleCertUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (uploading["newCert"]) return;
    const file = e.target.files?.[0];
    if (file) {
      setUploading((prev) => ({ ...prev, newCert: true }));
      try {
        const url = await uploadImageToStorage(file, "certificates/");
        const suggestedTitle = file.name.replace(/\.[^/.]+$/, "");
        setNewCert((prev) => ({
          ...prev,
          imageUrl: url,
          title: prev.title || suggestedTitle,
        }));
      } finally {
        setUploading((prev) => ({ ...prev, newCert: false }));
      }
    }
  };

  const handleAddCert = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCert.title || !newCert.imageUrl) return;
    addCertification(newCert);
    setNewCert({ title: "", imageUrl: "" });
  };

  const handleContentImageUpload = async (
    key: string,
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (uploading[key]) return;
    const file = e.target.files?.[0];
    if (file) {
      setUploading((prev) => ({ ...prev, [key]: true }));
      try {
        const url = await uploadImageToStorage(file, "content_images/");
        updateContent(key, url);
        alert("이미지가 성공적으로 업로드되었습니다.");
      } catch (error: any) {
        alert(`업로드 실패: ${error.message}`);
      } finally {
        setUploading((prev) => ({ ...prev, [key]: false }));
      }
    }
  };

  const handleProcessImageUpload = async (
    id: string,
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const key = `step_${id}`;
    if (uploading[key]) return;
    const file = e.target.files?.[0];
    if (file) {
      setUploading((prev) => ({ ...prev, [key]: true }));
      try {
        const url = await uploadImageToStorage(file, "process/");
        updateProcessStep(id, { imageUrl: url });
        alert("공정 이미지가 성공적으로 업로드되었습니다.");
      } catch (error: any) {
        alert(`업로드 실패: ${error.message}`);
      } finally {
        setUploading((prev) => ({ ...prev, [key]: false }));
      }
    }
  };

  const handleEquipmentImageUpload = async (
    id: string,
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const key = `eq_${id}`;
    if (uploading[key]) return;
    const file = e.target.files?.[0];
    if (file) {
      setUploading((prev) => ({ ...prev, [key]: true }));
      try {
        const url = await uploadImageToStorage(file, "equipment/");
        updateEquipment(id, { imageUrl: url });
        alert("설비 이미지가 성공적으로 업로드되었습니다.");
      } catch (error: any) {
        alert(`업로드 실패: ${error.message}`);
      } finally {
        setUploading((prev) => ({ ...prev, [key]: false }));
      }
    }
  };

  const handleContentFileUpload = async (
    key: string,
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (uploading[key]) return;
    const file = e.target.files?.[0];
    if (file) {
      setUploading((prev) => ({ ...prev, [key]: true }));
      try {
        const url = await uploadImageToStorage(file, "content_files/");
        updateContent(key, url);
        alert("파일이 성공적으로 업로드되었습니다.");
      } catch (error: any) {
        alert(`업로드 실패: ${error.message}`);
      } finally {
        setUploading((prev) => ({ ...prev, [key]: false }));
      }
    }
  };

  const FileUploadBlock = ({
    label,
    contentKey,
    description,
    accept = "*/*",
  }: {
    label: string;
    contentKey: string;
    description?: string;
    accept?: string;
  }) => {
    const isUploadingThis = uploading[contentKey];
    return (
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between h-full">
        <div>
          <div className="flex justify-between items-start mb-4">
            <div>
              <h4 className="font-bold text-gray-900 flex items-center gap-2">
                <FileText className="w-5 h-5 text-gray-500" /> {label}
              </h4>
              {description && (
                <p className="text-xs text-gray-500 mt-1">{description}</p>
              )}
            </div>
          </div>

          <div className="space-y-3">
            <div className="relative p-6 bg-gray-50 rounded-lg border border-gray-200 text-center transition-colors hover:bg-gray-100 flex flex-col items-center justify-center">
              {isUploadingThis ? (
                <div className="flex flex-col items-center justify-center text-brand-blue py-2">
                  <Loader2 className="w-6 h-6 animate-spin mb-2" />
                  <span className="text-xs font-medium">업로드 중...</span>
                </div>
              ) : content[contentKey] ? (
                <div className="flex flex-col items-center text-brand-blue py-2">
                  <Download className="w-8 h-8 mb-2" />
                  <span className="text-sm font-bold truncate max-w-[200px]">
                    파일 등록됨
                  </span>
                </div>
              ) : (
                <div className="flex flex-col items-center text-gray-400 py-2">
                  <Upload className="w-8 h-8 mb-2" />
                  <span className="text-xs font-medium">
                    여기를 클릭하여 파일 업로드
                  </span>
                </div>
              )}
              <input
                type="file"
                accept={accept}
                className="absolute inset-0 opacity-0 cursor-pointer"
                onChange={(e) => handleContentFileUpload(contentKey, e)}
                disabled={isUploadingThis}
              />
            </div>
          </div>
        </div>
        <div className="flex justify-between items-center mt-4">
          <span className="text-[10px] text-gray-400 font-mono truncate max-w-[150px]">
            {content[contentKey]
              ? "..." + content[contentKey].slice(-15)
              : "미등록"}
          </span>
          {content[contentKey] && (
            <button
              onClick={() => updateContent(contentKey, "")}
              className="text-xs text-red-500 font-bold hover:text-red-700"
            >
              파일 삭제
            </button>
          )}
        </div>
      </div>
    );
  };

  const ImageUploadBlock = ({
    label,
    contentKey,
    description,
  }: {
    label: string;
    contentKey: string;
    description?: string;
  }) => {
    const isUploadingThis = uploading[contentKey];
    return (
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h4 className="font-bold text-gray-900">{label}</h4>
            {description && (
              <p className="text-xs text-gray-500 mt-1">{description}</p>
            )}
          </div>
        </div>

        <div className="space-y-3">
          <div className="relative aspect-video w-full bg-gray-50 rounded-lg overflow-hidden border border-gray-200">
            {isUploadingThis ? (
              <div className="flex flex-col items-center justify-center w-full h-full text-brand-blue">
                <Loader2 className="w-8 h-8 animate-spin mb-2" />
                <span className="text-xs font-medium">업로드 중...</span>
              </div>
            ) : content[contentKey] ? (
              <img
                src={content[contentKey]}
                alt={label}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex items-center justify-center w-full h-full text-gray-400">
                <ImageIcon className="w-8 h-8" />
              </div>
            )}
            <label
              className={`absolute inset-0 bg-black/0 hover:bg-black/50 transition-colors flex items-center justify-center cursor-pointer group ${isUploadingThis ? "pointer-events-none" : ""}`}
            >
              <span className="bg-white/90 text-gray-900 px-4 py-2 rounded-lg font-bold text-sm opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2">
                <Upload className="w-4 h-4" /> 이미지 변경
              </span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleContentImageUpload(contentKey, e)}
                disabled={isUploadingThis}
              />
            </label>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <span className="truncate flex-1 font-mono bg-gray-50 p-1 rounded">
              {content[contentKey]?.substring(0, 40)}...
            </span>
            <button
              onClick={() => updateContent(contentKey, "")}
              className="text-red-400 hover:text-red-500"
            >
              삭제
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex space-x-4 border-b border-gray-200 pb-1 overflow-x-auto">
          <button
            onClick={() => setActiveTab("products")}
            className={`pb-3 px-4 font-bold text-sm transition-colors whitespace-nowrap ${activeTab === "products" ? "text-brand-blue border-b-2 border-brand-blue" : "text-gray-500 hover:text-gray-700"}`}
          >
            제품 관리
          </button>
          <button
            onClick={() => setActiveTab("cert")}
            className={`pb-3 px-4 font-bold text-sm transition-colors whitespace-nowrap ${activeTab === "cert" ? "text-brand-blue border-b-2 border-brand-blue" : "text-gray-500 hover:text-gray-700"}`}
          >
            인증서 관리
          </button>
          <button
            onClick={() => setActiveTab("text")}
            className={`pb-3 px-4 font-bold text-sm transition-colors whitespace-nowrap ${activeTab === "text" ? "text-brand-blue border-b-2 border-brand-blue" : "text-gray-500 hover:text-gray-700"}`}
          >
            텍스트 편집
          </button>
          <button
            onClick={() => setActiveTab("images")}
            className={`pb-3 px-4 font-bold text-sm transition-colors whitespace-nowrap ${activeTab === "images" ? "text-brand-blue border-b-2 border-brand-blue" : "text-gray-500 hover:text-gray-700"}`}
          >
            이미지 관리
          </button>
          <button
            onClick={() => setActiveTab("process")}
            className={`pb-3 px-4 font-bold text-sm transition-colors whitespace-nowrap ${activeTab === "process" ? "text-brand-blue border-b-2 border-brand-blue" : "text-gray-500 hover:text-gray-700"}`}
          >
            공정소개 관리
          </button>
          <button
            onClick={() => setActiveTab("equipment")}
            className={`pb-3 px-4 font-bold text-sm transition-colors whitespace-nowrap ${activeTab === "equipment" ? "text-brand-blue border-b-2 border-brand-blue" : "text-gray-500 hover:text-gray-700"}`}
          >
            측정설비 관리
          </button>
        </div>

        {activeTab === "products" && (
          <div className="animate-fade-in space-y-8">
            <div className="bg-blue-50 p-6 rounded-2xl flex items-center justify-between border border-blue-100">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white rounded-full text-brand-blue shadow-sm">
                  <Package className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-brand-blue text-lg">
                    제품 소재 관리
                  </h3>
                  <p className="text-gray-600 text-sm">
                    제품들의 이미지, 상세 설명 및 스펙을 관리합니다.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setEditingProduct({ isNew: true })}
                className="bg-brand-blue text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-blue-900 transition-colors shadow-sm"
              >
                <Plus className="w-5 h-5" /> 새 제품 등록
              </button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col h-full group"
                >
                  <div className="relative aspect-[4/3] bg-gray-100 rounded-xl overflow-hidden mb-4 border border-gray-200">
                    {product.imageUrl ? (
                      <img
                        src={product.imageUrl}
                        alt={product.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center w-full h-full text-gray-400">
                        <ImageIcon className="w-8 h-8" />
                      </div>
                    )}
                    <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => {
                          if (window.confirm("정말 삭제하시겠습니까?")) {
                            deleteProduct(product.id);
                          }
                        }}
                        className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg shadow-sm"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="flex-1 flex flex-col">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-bold text-gray-900 text-lg line-clamp-1">
                        {product.title}
                      </h4>
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded font-mono truncate max-w-[80px]">
                        {product.slug}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 line-clamp-2 mb-4 leading-relaxed">
                      {product.description}
                    </p>

                    <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between">
                      <span className="text-xs font-bold text-gray-400">
                        스펙 {product.specs?.length || 0}개
                      </span>
                      <button
                        onClick={() => setEditingProduct(product)}
                        className="text-brand-blue font-bold text-sm flex items-center gap-1 hover:text-blue-900 bg-blue-50 px-3 py-1.5 rounded-lg group-hover:bg-blue-100 transition-colors"
                      >
                        <Pencil className="w-3.5 h-3.5" /> 상세 편집
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {editingProduct && (
              <AdminProductModal
                product={editingProduct.isNew ? {} : editingProduct}
                isNew={editingProduct.isNew}
                onClose={() => setEditingProduct(null)}
                onSave={(savedData) => {
                  if (editingProduct.isNew) {
                    addProduct(savedData);
                  } else {
                    updateProduct(editingProduct.id, savedData);
                  }
                  setEditingProduct(null);
                }}
              />
            )}
          </div>
        )}

        {activeTab === "cert" && (
          <div className="space-y-8 animate-fade-in">
            {/* Add New Cert */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="font-bold text-lg mb-4">새 인증서 등록</h3>
              <form
                onSubmit={handleAddCert}
                className="flex flex-col md:flex-row gap-4 items-end"
              >
                <div className="flex-1 w-full">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    인증서명
                  </label>
                  <input
                    type="text"
                    value={newCert.title}
                    onChange={(e) =>
                      setNewCert({ ...newCert, title: e.target.value })
                    }
                    placeholder="예: ISO 14001"
                    className="w-full border border-gray-300 rounded-lg p-3"
                  />
                </div>
                <div className="flex-1 w-full">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    이미지
                  </label>
                  <div className="flex gap-2">
                    <label
                      className={`flex-1 cursor-pointer border border-gray-300 bg-gray-50 text-gray-500 rounded-lg p-3 flex items-center justify-center hover:bg-gray-100 ${uploading["newCert"] ? "opacity-50 pointer-events-none" : ""}`}
                    >
                      {uploading["newCert"] ? (
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      ) : (
                        <Upload className="w-4 h-4 mr-2" />
                      )}
                      {uploading["newCert"]
                        ? "업로드 중..."
                        : newCert.imageUrl
                          ? "이미지 변경"
                          : "이미지 업로드"}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleCertUpload}
                        className="hidden"
                        disabled={uploading["newCert"]}
                      />
                    </label>
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={uploading["newCert"]}
                  className="bg-brand-blue text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-900 w-full md:w-auto disabled:opacity-50"
                >
                  등록
                </button>
              </form>
              {newCert.imageUrl && (
                <div className="mt-4 w-32 h-40 bg-gray-100 rounded-lg border border-gray-200 overflow-hidden relative">
                  <img
                    src={newCert.imageUrl}
                    alt="Preview"
                    className="w-full h-full object-contain"
                  />
                  <button
                    onClick={() => setNewCert({ ...newCert, imageUrl: "" })}
                    className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>

            {/* List */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="font-bold text-lg mb-6">
                등록된 인증서 목록 ({certifications.length})
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                {certifications.map((cert) => {
                  const cleanTitle = cert.title.replace(/\.[^/.]+$/, "");
                  return (
                    <div
                      key={cert.id}
                      className="group relative bg-gray-50 rounded-xl p-3 border border-gray-200 flex flex-col"
                    >
                      <div className="aspect-[3/4] bg-white rounded-lg overflow-hidden mb-3 flex items-center justify-center relative">
                        <img
                          src={cert.imageUrl}
                          alt={cleanTitle}
                          className="w-full h-full object-contain"
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                          <label className={`text-white bg-blue-500 p-2 rounded-full hover:bg-blue-600 cursor-pointer ${uploading[cert.id] ? "opacity-50 pointer-events-none" : ""}`}>
                            <Upload className="w-4 h-4" />
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              disabled={uploading[cert.id]}
                              onChange={async (e) => {
                                if (uploading[cert.id]) return;
                                const file = e.target.files?.[0];
                                if (file) {
                                  setUploading((prev) => ({
                                    ...prev,
                                    [cert.id]: true,
                                  }));
                                  try {
                                    const url = await uploadImageToStorage(
                                      file,
                                      "certificates/",
                                    );
                                    updateCertification(cert.id, {
                                      imageUrl: url,
                                    });
                                  } catch (err) {
                                    console.error(err);
                                  } finally {
                                    setUploading((prev) => ({
                                      ...prev,
                                      [cert.id]: false,
                                    }));
                                  }
                                }
                              }}
                            />
                          </label>
                          <button
                            onClick={() => deleteCertification(cert.id)}
                            className="text-white bg-red-500 p-2 rounded-full hover:bg-red-600"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <input
                        type="text"
                        value={cleanTitle}
                        onChange={(e) =>
                          updateCertification(cert.id, {
                            title: e.target.value,
                          })
                        }
                        className="text-center text-sm font-medium border border-transparent hover:border-gray-300 focus:border-brand-blue rounded px-1 py-0.5 outline-none bg-transparent focus:bg-white w-full transition-colors"
                        placeholder="인증서명"
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {activeTab === "text" && (
          <div className="grid md:grid-cols-2 gap-8 animate-fade-in">
            {/* Hero Section Edit */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
              <div className="flex items-center gap-2 mb-2 border-b border-gray-100 pb-3">
                <div className="p-2 bg-blue-50 rounded text-brand-blue">
                  <LayoutTemplate className="w-4 h-4" />
                </div>
                <h3 className="font-bold">메인 페이지 - 히어로 섹션</h3>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-500 uppercase">
                  타이틀 접두어
                </label>
                <input
                  type="text"
                  value={content["home_hero_title_prefix"] || ""}
                  onChange={(e) =>
                    updateContent("home_hero_title_prefix", e.target.value)
                  }
                  className="w-full border border-gray-200 rounded-lg p-2 mt-1"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase">
                  강조 타이틀
                </label>
                <input
                  type="text"
                  value={content["home_hero_title_highlight"] || ""}
                  onChange={(e) =>
                    updateContent("home_hero_title_highlight", e.target.value)
                  }
                  className="w-full border border-gray-200 rounded-lg p-2 mt-1"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase">
                  설명 문구
                </label>
                <textarea
                  rows={3}
                  value={content["home_hero_desc"] || ""}
                  onChange={(e) =>
                    updateContent("home_hero_desc", e.target.value)
                  }
                  className="w-full border border-gray-200 rounded-lg p-2 mt-1 resize-none"
                />
              </div>
            </div>

            {/* Intro Page Edit */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
              <div className="flex items-center gap-2 mb-2 border-b border-gray-100 pb-3">
                <div className="p-2 bg-purple-50 rounded text-purple-600">
                  <FileText className="w-4 h-4" />
                </div>
                <h3 className="font-bold">회사소개 - 개요 페이지</h3>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-500 uppercase">
                  메인 타이틀 1
                </label>
                <input
                  type="text"
                  value={content["intro_main_title_1"] || ""}
                  onChange={(e) =>
                    updateContent("intro_main_title_1", e.target.value)
                  }
                  className="w-full border border-gray-200 rounded-lg p-2 mt-1"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase">
                  메인 타이틀 2 (강조)
                </label>
                <input
                  type="text"
                  value={content["intro_main_title_2"] || ""}
                  onChange={(e) =>
                    updateContent("intro_main_title_2", e.target.value)
                  }
                  className="w-full border border-gray-200 rounded-lg p-2 mt-1"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase">
                  소개글
                </label>
                <textarea
                  rows={5}
                  value={content["intro_desc"] || ""}
                  onChange={(e) => updateContent("intro_desc", e.target.value)}
                  className="w-full border border-gray-200 rounded-lg p-2 mt-1 resize-none"
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === "images" && (
          <div className="animate-fade-in space-y-8">
            {/* Section: Company Intro */}
            <div>
              <h3 className="text-lg font-bold text-gray-800 mb-4 px-1 border-l-4 border-brand-blue pl-3">
                회사 개요 (Factory)
              </h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <FileUploadBlock
                  label="대구공장 사업자등록증"
                  contentKey="daegu_biz_reg_pdf"
                  description="회사개요 사업장 안내에 표시되는 대구공장 사업자등록증 파일(.pdf, .jpg 등)"
                  accept=".pdf,image/*"
                />
                <FileUploadBlock
                  label="창녕공장 사업자등록증"
                  contentKey="changnyeong_biz_reg_pdf"
                  description="회사개요 사업장 안내에 표시되는 창녕공장 사업자등록증 파일(.pdf, .jpg 등)"
                  accept=".pdf,image/*"
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === "process" && (
          <div className="animate-fade-in space-y-8">
            <div className="bg-emerald-50 p-6 rounded-2xl flex items-center gap-4 border border-emerald-100">
              <div className="p-3 bg-white rounded-full text-emerald-600 shadow-sm">
                <Settings className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-emerald-600 text-lg">
                  공정소개 관리
                </h3>
                <p className="text-gray-600 text-sm">
                  공정소개 페이지에 표시되는 각 단계의 이미지와 설명을
                  관리합니다.
                </p>
              </div>
              <button
                onClick={() => {
                  if (
                    window.confirm(
                      "공정소개 단계를 초기화하시겠습니까? (이 작업은 되돌릴 수 없습니다.)",
                    )
                  ) {
                    resetProcessSteps();
                    alert("초기화되었습니다.");
                  }
                }}
                className="ml-auto bg-emerald-100 text-emerald-700 px-4 py-2 rounded-lg font-bold text-sm hover:bg-emerald-200"
              >
                단계를 기본값으로 초기화
              </button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...processSteps]
                .sort((a, b) => a.order - b.order)
                .map((step) => {
                  const isUploadingStep = uploading[`step_${step.id}`];
                  return (
                    <div
                      key={step.id}
                      className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col h-full"
                    >
                      <div className="relative aspect-[4/3] bg-gray-100 rounded-xl overflow-hidden mb-4 border border-gray-200">
                        {isUploadingStep ? (
                          <div className="flex flex-col items-center justify-center h-full text-brand-blue">
                            <Loader2 className="w-6 h-6 animate-spin mb-2" />
                            <span className="text-xs">업로드 중</span>
                          </div>
                        ) : step.imageUrl ? (
                          <img
                            src={step.imageUrl}
                            alt={step.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full text-gray-400">
                            <ImageIcon className="w-8 h-8" />
                          </div>
                        )}
                        <label
                          className={`absolute inset-0 bg-black/0 hover:bg-black/40 transition-colors flex items-center justify-center cursor-pointer group ${isUploadingStep ? "pointer-events-none" : ""}`}
                        >
                          <span className="bg-white/90 text-gray-900 px-3 py-1.5 rounded-lg font-bold text-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2">
                            <Upload className="w-3 h-3" /> 사진 변경
                          </span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) =>
                              handleProcessImageUpload(step.id, e)
                            }
                            disabled={isUploadingStep}
                          />
                        </label>
                      </div>

                      <div className="space-y-3 flex-1">
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-bold text-gray-400 block mb-1">
                            단계 {step.order}
                          </label>
                          <button
                            onClick={() =>
                              updateProcessStep(step.id, { imageUrl: "" })
                            }
                            className="text-xs text-red-500 hover:underline"
                          >
                            사진 삭제
                          </button>
                        </div>
                        <textarea
                          rows={2}
                          className="font-bold text-gray-900 text-lg w-full border border-transparent hover:border-gray-200 focus:border-brand-blue outline-none rounded px-1 transition-colors bg-transparent placeholder-gray-400 resize-none break-keep"
                          value={step.title}
                          onChange={(e) =>
                            updateProcessStep(step.id, {
                              title: e.target.value,
                            })
                          }
                          placeholder="공정 이름 (예: 빌렛 입고 / 가열)"
                        />
                        <div>
                          <label className="text-xs font-bold text-gray-400 block mb-1">
                            설명 (선택사항)
                          </label>
                          <textarea
                            rows={2}
                            className="w-full text-sm border border-gray-200 rounded-lg p-2 resize-none focus:ring-1 focus:ring-brand-blue outline-none"
                            value={step.description || ""}
                            placeholder="공정 단계에 대한 설명을 입력하세요..."
                            onChange={(e) =>
                              updateProcessStep(step.id, {
                                description: e.target.value,
                              })
                            }
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        )}

        {activeTab === "equipment" && (
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 animate-fade-in">
            <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
              <div>
                <h3 className="font-bold text-lg text-gray-900">
                  측정설비 관리
                </h3>
                <p className="text-gray-500 text-sm mt-1">
                  품질검사 페이지에 표시될 측정 설비들의 목록과 이미지를
                  관리합니다.
                </p>
              </div>
              <button
                onClick={() => {
                  if (
                    window.confirm(
                      "모든 설비 내용을 초기 기본값으로 복구하시겠습니까?",
                    )
                  )
                    resetEquipments();
                }}
                className="px-4 py-2 border border-red-200 text-red-500 rounded-lg text-sm font-bold hover:bg-red-50 transition-colors"
              >
                초기화 (복원)
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {equipments.map((eq) => {
                const isUploadingEq = uploading[`eq_${eq.id}`];
                return (
                  <div
                    key={eq.id}
                    className="bg-gray-50 rounded-xl p-4 border border-gray-200 flex flex-col gap-4 group"
                  >
                    <div className="relative aspect-[4/3] bg-white rounded-lg overflow-hidden border border-gray-200">
                      {isUploadingEq ? (
                        <div className="flex flex-col items-center justify-center h-full text-brand-blue">
                          <Loader2 className="w-6 h-6 animate-spin mb-2" />
                          <span className="text-xs">업로드 중</span>
                        </div>
                      ) : eq.imageUrl ? (
                        <img
                          src={eq.imageUrl}
                          alt={eq.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full text-gray-400">
                          <ImageIcon className="w-8 h-8" />
                        </div>
                      )}
                      <label
                        className={`absolute inset-0 bg-black/0 hover:bg-black/40 transition-colors flex items-center justify-center cursor-pointer group-hover:bg-black/40 ${isUploadingEq ? "pointer-events-none" : ""}`}
                      >
                        <span className="bg-white/90 text-gray-900 px-3 py-1.5 rounded-lg font-bold text-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2">
                          <Upload className="w-3 h-3" /> 사진 변경
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleEquipmentImageUpload(eq.id, e)}
                          disabled={isUploadingEq}
                        />
                      </label>
                      <button
                        onClick={() => updateEquipment(eq.id, { imageUrl: "" })}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>

                    <div className="space-y-2 flex-1">
                      <div>
                        <label className="text-xs font-bold text-gray-400 block mb-1">
                          설비명
                        </label>
                        <input
                          type="text"
                          className="w-full text-sm font-bold border border-gray-200 rounded-lg p-2 focus:ring-1 focus:ring-brand-blue outline-none"
                          value={eq.name}
                          onChange={(e) =>
                            updateEquipment(eq.id, { name: e.target.value })
                          }
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-gray-400 block mb-1">
                          제조사 / 모델명
                        </label>
                        <input
                          type="text"
                          className="w-full text-sm border border-gray-200 rounded-lg p-2 focus:ring-1 focus:ring-brand-blue outline-none"
                          value={eq.spec}
                          onChange={(e) =>
                            updateEquipment(eq.id, { spec: e.target.value })
                          }
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-gray-400 block mb-1">
                          측정 목적 및 주요 기능
                        </label>
                        <textarea
                          rows={3}
                          className="w-full text-xs text-gray-600 border border-gray-200 rounded-lg p-2 resize-none focus:ring-1 focus:ring-brand-blue outline-none"
                          value={eq.description}
                          onChange={(e) =>
                            updateEquipment(eq.id, {
                              description: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

// --- Post Manager Component ---
export const AdminPosts: React.FC = () => {
  const { posts, deletePost, addPost, updatePost } = useSite();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    category: "보도자료",
    author: "관리자",
    date: new Date().toISOString().split("T")[0],
    status: "Published" as "Published" | "Draft",
    content: "",
    imageUrl: "",
    additionalImages: [] as string[],
  });

  const [isUploadingThumbnail, setIsUploadingThumbnail] = useState(false);
  const [isUploadingAttachments, setIsUploadingAttachments] = useState(false);

  const handleThumbnailUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingThumbnail(true);
    try {
      const url = await uploadImageToStorage(file, "news_thumbnails/");
      setFormData((prev) => ({ ...prev, imageUrl: url }));
    } catch (err) {
      console.error(err);
      alert("대표 이미지 업로드에 실패했습니다.");
    } finally {
      setIsUploadingThumbnail(false);
    }
  };

  const handleAttachmentsUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setIsUploadingAttachments(true);
    try {
      const uploadedUrls: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const url = await uploadImageToStorage(files[i], "news_attachments/");
        uploadedUrls.push(url);
      }
      setFormData((prev) => ({
        ...prev,
        additionalImages: [...(prev.additionalImages || []), ...uploadedUrls],
      }));
    } catch (err) {
      console.error(err);
      alert("첨부 이미지 업로드 중 오류가 발생했습니다.");
    } finally {
      setIsUploadingAttachments(false);
    }
  };

  const removeAttachment = (urlToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      additionalImages: prev.additionalImages.filter((url) => url !== urlToRemove),
    }));
  };

  const openCreateModal = () => {
    setEditingPostId(null);
    setFormData({
      title: "",
      category: "보도자료",
      author: "관리자",
      date: new Date().toISOString().split("T")[0],
      status: "Published",
      content: "",
      imageUrl: "",
      additionalImages: [],
    });
    setIsModalOpen(true);
  };

  const openEditModal = (post: typeof posts[0]) => {
    setEditingPostId(post.id);
    setFormData({
      title: post.title,
      category: post.category || "보도자료",
      author: post.author || "관리자",
      date: post.date || new Date().toISOString().split("T")[0],
      status: post.status || "Published",
      content: post.content || "",
      imageUrl: post.imageUrl || "",
      additionalImages: post.additionalImages || [],
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title) return;

    if (editingPostId) {
      if (updatePost) {
        updatePost(editingPostId, formData);
      }
    } else {
      addPost(formData);
    }
    setIsModalOpen(false);
  };

  // Filter posts based on search query
  const filteredPosts = posts.filter(
    (post) =>
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900">게시글 관리</h2>
            <p className="text-sm text-gray-500">
              DMC Room 및 사이트 공지사항과 보도자료를 관리합니다.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="제목/카테고리 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-brand-blue w-48 sm:w-64"
              />
            </div>
            <button
              onClick={openCreateModal}
              className="bg-brand-blue text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-blue-900 transition-colors shrink-0"
            >
              <Plus className="w-4 h-4" /> 게시글 작성
            </button>
          </div>
        </div>

        {/* Table representation */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                <th className="px-6 py-4 font-medium">대표이미지</th>
                <th className="px-6 py-4 font-medium">제목</th>
                <th className="px-6 py-4 font-medium">카테고리</th>
                <th className="px-6 py-4 font-medium">작성자</th>
                <th className="px-6 py-4 font-medium">작성일</th>
                <th className="px-6 py-4 font-medium">상태</th>
                <th className="px-6 py-4 font-medium">조회수</th>
                <th className="px-6 py-4 font-medium text-right">관리</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredPosts.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-gray-500 text-sm">
                    검색 결과 또는 등록된 게시글이 없습니다.
                  </td>
                </tr>
              ) : (
                filteredPosts.map((post) => (
                  <tr key={post.id} className="hover:bg-gray-50/50 transition-colors">
                    {/* Representative Image Column */}
                    <td className="px-6 py-3">
                      <div className="w-12 h-12 rounded-lg bg-gray-50 border border-gray-100 overflow-hidden flex items-center justify-center">
                        {post.imageUrl ? (
                          <img
                            src={post.imageUrl}
                            alt=""
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <ImageIcon className="w-5 h-5 text-gray-300" />
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-semibold text-gray-900 block max-w-xs sm:max-w-md truncate">
                        {post.title}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      <span className="px-2.5 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-semibold">
                        {post.category || "회사소식"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">{post.author || "관리자"}</td>
                    <td className="px-6 py-4 text-sm text-gray-500 font-mono">{post.date}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          post.status === "Published"
                            ? "bg-green-50 text-green-700 border border-green-100"
                            : "bg-yellow-50 text-yellow-700 border border-yellow-100"
                        }`}
                      >
                        {post.status === "Published" ? "게시됨" : "임시저장"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 font-mono">
                      {(post.views || 0).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-1">
                        <button
                          onClick={() => openEditModal(post)}
                          className="text-gray-400 hover:text-brand-blue hover:bg-gray-50 rounded-lg p-2 transition-colors"
                          title="수정"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm("정말로 이 게시글을 삭제하시겠습니까?")) {
                              deletePost(post.id);
                            }
                          }}
                          className="text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg p-2 transition-colors"
                          title="삭제"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal - Rich Dialog */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-3xl w-full max-w-3xl p-6 sm:p-8 shadow-2xl relative my-8">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute right-6 top-6 text-gray-400 hover:text-gray-600 transition-colors p-1 bg-gray-55 hover:bg-gray-100 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold text-gray-900 border-b border-gray-100 pb-4 mb-6">
              {editingPostId ? "게시글 수정" : "새 게시글 작성"}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-6">
                {/* Title */}
                <div className="sm:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">제목</label>
                  <input
                    type="text"
                    required
                    placeholder="제목을 입력하세요."
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl p-3 focus:outline-none focus:border-brand-blue text-sm"
                  />
                </div>

                {/* Category Selection / input */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5 font-medium">
                    카테고리
                  </label>
                  <div className="flex gap-2">
                    <select
                      value={["보도자료", "공지사항", "전시회", "인증소식", "신제품"].includes(formData.category) ? formData.category : "custom"}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val !== "custom") {
                          setFormData({ ...formData, category: val });
                        } else {
                          setFormData({ ...formData, category: "" });
                        }
                      }}
                      className="border border-gray-200 rounded-xl p-3 focus:outline-none focus:border-brand-blue text-sm bg-white"
                    >
                      <option value="보도자료">보도자료</option>
                      <option value="공지사항">공지사항</option>
                      <option value="전시회">전시회</option>
                      <option value="인증소식">인증소식</option>
                      <option value="신제품">신제품</option>
                      <option value="custom">직접 입력...</option>
                    </select>
                    {!["보도자료", "공지사항", "전시회", "인증소식", "신제품"].includes(formData.category) && (
                      <input
                        type="text"
                        placeholder="카테고리명"
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="flex-1 border border-gray-200 rounded-xl p-3 focus:outline-none focus:border-brand-blue text-sm"
                      />
                    )}
                  </div>
                </div>

                {/* Datepicker */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">작성일</label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl p-3 focus:outline-none focus:border-brand-blue text-sm font-mono"
                  />
                </div>

                {/* Author */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">작성자</label>
                  <input
                    type="text"
                    required
                    value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl p-3 focus:outline-none focus:border-brand-blue text-sm"
                  />
                </div>

                {/* Status Toggle */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5 font-medium">
                    게시 상태
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.value as "Published" | "Draft" })
                    }
                    className="w-full border border-gray-200 rounded-xl p-3 focus:outline-none focus:border-brand-blue text-sm bg-white"
                  >
                    <option value="Published">게시 (공개)</option>
                    <option value="Draft">임시 저장 (비공개)</option>
                  </select>
                </div>
              </div>

              {/* Representative Image (Thumbnail) */}
              <div className="border border-gray-100 rounded-2xl p-4 bg-gray-50/50">
                <label className="block text-sm font-bold text-gray-800 mb-2">대표 이미지 (썸네일)</label>
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <div className="w-28 h-20 rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden flex items-center justify-center shrink-0 relative group">
                    {formData.imageUrl ? (
                      <>
                        <img
                          src={formData.imageUrl}
                          alt=""
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                        <button
                          type="button"
                          onClick={() => setFormData((prev) => ({ ...prev, imageUrl: "" }))}
                          className="absolute inset-0 bg-black/60 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity rounded-xl"
                          title="대표이미지 삭제"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </>
                    ) : (
                      <ImageIcon className="w-6 h-6 text-gray-300" />
                    )}
                  </div>
                  <div className="flex-1 w-full">
                    <label
                      className={`cursor-pointer inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-xs font-semibold text-gray-700 shadow-sm hover:bg-gray-50 transition-colors ${
                        isUploadingThumbnail ? "opacity-50 pointer-events-none" : ""
                      }`}
                    >
                      {isUploadingThumbnail ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          업로드 중...
                        </>
                      ) : (
                        <>
                          <Upload className="w-3.5 h-3.5" />
                          이미지 찾기 및 업로드
                        </>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleThumbnailUpload}
                        className="hidden"
                        disabled={isUploadingThumbnail}
                      />
                    </label>
                    <p className="text-[11px] text-gray-400 mt-1.5 leading-relaxed">
                      DMC Room 목록 페이지에 노출될 대표 가로형 이미지를 권장합니다. (16:10 비율 최적)
                    </p>
                  </div>
                </div>
              </div>

              {/* Post Content */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">본문 내용</label>
                <textarea
                  required
                  rows={8}
                  placeholder="보도자료 소식 혹은 공지 게시글 내용을 상세히 기재해 주세요."
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl p-3 focus:outline-none focus:border-brand-blue text-sm font-sans whitespace-pre-line resize-y"
                />
              </div>

              {/* Gallery / Additional Images */}
              <div className="border border-gray-100 rounded-2xl p-4 bg-gray-50/50">
                <div className="flex justify-between items-center mb-3">
                  <label className="block text-sm font-bold text-gray-800">첨부 파일/추가 이미지</label>
                  <label
                    className={`cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-bold text-gray-700 shadow-sm hover:bg-gray-50 transition-all ${
                      isUploadingAttachments ? "opacity-50 pointer-events-none" : ""
                    }`}
                  >
                    {isUploadingAttachments ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        업로드 중...
                      </>
                    ) : (
                      <>
                        <Plus className="w-3.5 h-3.5" />
                        추가 이미지 선택
                      </>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleAttachmentsUpload}
                      className="hidden"
                      disabled={isUploadingAttachments}
                    />
                  </label>
                </div>

                {/* Additional Images Grid with Hover Deletes */}
                {formData.additionalImages && formData.additionalImages.length > 0 ? (
                  <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
                    {formData.additionalImages.map((imgUrl, i) => (
                      <div
                        key={i}
                        className="aspect-square bg-white border border-gray-100 rounded-lg overflow-hidden relative group shadow-sm"
                      >
                        <img
                          src={imgUrl}
                          alt=""
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                        <button
                          type="button"
                          onClick={() => removeAttachment(imgUrl)}
                          className="absolute inset-0 bg-black/60 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                          title="첨부파일 삭제"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-gray-400 py-3 text-center italic bg-white border border-gray-150/60 rounded-xl border-dashed">
                    게시물 하단에 추가 노출시킬 첨부 이미지가 있는 경우 등록할 수 있습니다. (다중 선택 가능)
                  </p>
                )}
              </div>

              {/* Footer controls */}
              <div className="border-t border-gray-100 pt-6 flex justify-end gap-3.5">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 text-gray-600 hover:bg-gray-100 rounded-xl text-sm font-semibold transition-colors"
                >
                  작성 취소
                </button>
                <button
                  type="submit"
                  disabled={isUploadingThumbnail || isUploadingAttachments}
                  className="px-6 py-2.5 bg-brand-blue hover:bg-blue-900 disabled:opacity-50 text-white rounded-xl text-sm font-bold transition-all flex items-center gap-2 shadow-md active:scale-95"
                >
                  <Save className="w-4 h-4" />
                  저장하기
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

// --- Settings Manager Component ---
export const AdminSettings: React.FC = () => {
  const { config, updateConfig, exportSiteData, importSiteData } = useSite();
  const [localConfig, setLocalConfig] = useState(config);

  const handleSave = () => {
    updateConfig(localConfig);
    alert("설정이 저장되었습니다.");
  };

  const handleExport = () => {
    exportSiteData();
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const json = event.target?.result as string;
        if (json) {
          const success = importSiteData(json);
          if (success) {
            alert("데이터 복원이 완료되었습니다. 페이지를 새로고침합니다.");
            window.location.reload();
          } else {
            alert("데이터 복원에 실패했습니다. 파일 형식을 확인해주세요.");
          }
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <AdminLayout>
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Settings Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* General Settings */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-blue-50 rounded-lg">
                <Globe className="w-5 h-5 text-brand-blue" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">
                기본 정보 & SEO
              </h3>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  사이트 이름
                </label>
                <input
                  type="text"
                  value={localConfig.siteName}
                  onChange={(e) =>
                    setLocalConfig({ ...localConfig, siteName: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-brand-blue outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  대표 이메일
                </label>
                <input
                  type="email"
                  value={localConfig.contactEmail}
                  onChange={(e) =>
                    setLocalConfig({
                      ...localConfig,
                      contactEmail: e.target.value,
                    })
                  }
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-brand-blue outline-none"
                />
              </div>
            </div>
          </div>

          {/* Design Settings */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-purple-50 rounded-lg">
                <Palette className="w-5 h-5 text-purple-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">
                디자인 커스터마이징
              </h3>
            </div>

            <div className="space-y-8">
              {/* Border Radius Control */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                  <LayoutTemplate className="w-4 h-4" />
                  버튼 및 카드 스타일 (Border Radius)
                </label>
                <div className="grid grid-cols-4 gap-4">
                  {[
                    { label: "Square", value: "rounded-none" },
                    { label: "Small", value: "rounded-md" },
                    { label: "Large", value: "rounded-xl" },
                    { label: "Round", value: "rounded-full" },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() =>
                        setLocalConfig({
                          ...localConfig,
                          borderRadius: opt.value as BorderRadiusSize,
                        })
                      }
                      className={`py-3 px-2 border rounded-lg text-sm transition-all ${
                        localConfig.borderRadius === opt.value
                          ? "border-brand-blue bg-blue-50 text-brand-blue font-bold shadow-sm"
                          : "border-gray-200 text-gray-600 hover:border-gray-300"
                      }`}
                    >
                      <div
                        className={`w-8 h-8 bg-gray-200 mx-auto mb-2 ${opt.value === "rounded-full" ? "rounded-full" : opt.value}`}
                      ></div>
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="border-t border-gray-100 my-4"></div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  브랜드 컬러
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="color"
                    value={localConfig.primaryColor}
                    onChange={(e) =>
                      setLocalConfig({
                        ...localConfig,
                        primaryColor: e.target.value,
                      })
                    }
                    className="w-12 h-12 rounded-lg cursor-pointer border-0 p-1 bg-white shadow-sm"
                  />
                  <div className="flex-1">
                    <input
                      type="text"
                      value={localConfig.primaryColor}
                      onChange={(e) =>
                        setLocalConfig({
                          ...localConfig,
                          primaryColor: e.target.value,
                        })
                      }
                      className="w-full border border-gray-300 rounded-lg p-3 font-mono uppercase"
                    />
                  </div>
                </div>
              </div>

              {/* Preview Section */}
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                <p className="text-xs font-bold text-gray-500 mb-3 uppercase">
                  Style Preview
                </p>
                <div className="flex gap-3">
                  <button
                    className={`px-4 py-2 text-white text-sm font-medium shadow-sm transition-colors ${localConfig.borderRadius}`}
                    style={{ backgroundColor: localConfig.primaryColor }}
                  >
                    Primary Button
                  </button>
                  <button
                    className={`px-4 py-2 border bg-white text-sm font-medium ${localConfig.borderRadius}`}
                    style={{
                      color: localConfig.primaryColor,
                      borderColor: localConfig.primaryColor,
                    }}
                  >
                    Secondary
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Save Actions */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 sticky top-6">
            <h3 className="font-bold text-gray-800 mb-2">설정 저장</h3>
            <p className="text-sm text-gray-500 mb-6">
              변경사항을 사이트에 즉시 반영합니다.
            </p>

            <button
              onClick={handleSave}
              className={`w-full py-3 bg-gray-900 text-white font-bold shadow-lg hover:bg-black transition-all flex items-center justify-center gap-2 active:scale-95 ${localConfig.borderRadius}`}
            >
              <Save className="w-4 h-4" /> 변경사항 저장
            </button>

            <div className="mt-4 pt-4 border-t border-gray-100 text-center">
              <a
                href="/"
                target="_blank"
                className="text-sm text-gray-500 hover:text-brand-blue hover:underline"
              >
                사이트 미리보기
              </a>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};
