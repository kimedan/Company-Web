import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Lock, ArrowLeft, Loader2, Mail, ShieldCheck } from "lucide-react";
import Button from "../components/Button";
import Logo from "../components/Logo";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { login, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/admin-dmc";

  // [중요] 로그인 페이지 접속 시 기존 세션 강제 종료 (혹시 모를 캐시 문제 방지)
  useEffect(() => {
    // 로그인 페이지에 들어왔다는 것은 명시적으로 로그인을 하겠다는 뜻이므로,
    // 기존에 남아있을지 모르는 dmcadmin 같은 로컬 세션을 정리합니다.
    if (!location.state?.from) {
      logout();
    }
  }, [logout, location]);

  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Strict Email Validation (legacy ID 차단)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("올바른 이메일 형식을 입력해주세요. (예: admin@aldmc.co.kr)");
      return;
    }

    setIsLoading(true);

    const success = await login(email, pw);

    if (success) {
      navigate(from, { replace: true });
    } else {
      setError("이메일 또는 비밀번호가 올바르지 않습니다.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 relative z-[100]">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden animate-fade-in">
        {/* Header */}
        <div className="bg-[#071D49] p-8 text-center relative">
          <button
            onClick={() => navigate("/")}
            className="absolute top-6 left-6 text-white/50 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="flex justify-center mb-4">
            <div className="bg-white/10 p-4 rounded-full">
              <Lock className="w-8 h-8 text-white" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-white">관리자 로그인</h2>
        </div>

        {/* Form */}
        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                E-mail
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-4 pl-12 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-all"
                  required
                />
                <Mail className="w-5 h-5 text-gray-400 absolute top-1/2 left-4 -translate-y-1/2" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                value={pw}
                onChange={(e) => setPw(e.target.value)}
                className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-all"
                required
              />
            </div>

            {error && (
              <div className="text-red-500 text-sm font-medium text-center bg-red-50 p-3 rounded-lg">
                {error}
              </div>
            )}

            <Button
              type="submit"
              fullWidth
              className="rounded-xl h-14 font-bold text-lg shadow-lg shadow-blue-900/10"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" /> 접속 중...
                </span>
              ) : (
                "로그인"
              )}
            </Button>
          </form>

          <div className="mt-8 text-center space-y-4">
            {/* 버전 확인용 라벨: 강제 변경을 위해 v2.4로 업데이트 */}
            <div className="inline-flex items-center gap-1 text-[10px] text-gray-400 bg-gray-100 px-2 py-1 rounded-full">
              <ShieldCheck className="w-3 h-3" /> System v2.5
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
