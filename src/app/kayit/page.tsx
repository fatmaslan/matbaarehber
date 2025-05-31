"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { supabase } from "../lib/supabaseClient";
import ReCAPTCHA from "react-google-recaptcha";

interface RegisterFormData {
  companyName: string;
  email: string;
  password: string;
  confirmPassword: string;
  
}

const RegisterPage: React.FC = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<RegisterFormData>({
    companyName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Partial<RegisterFormData>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [registerError, setRegisterError] = useState<string | null>(null);
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (errors[name as keyof RegisterFormData]) {
      setErrors({ ...errors, [name]: undefined });
    }
  };

  const validate = (): boolean => {
    const newErrors: Partial<RegisterFormData> = {};

    if (!formData.companyName) {
      newErrors.companyName = "Firma adı gereklidir";
    }
    if (!formData.email) {
      newErrors.email = "E-posta adresi gereklidir";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Geçerli bir e-posta adresi giriniz";
    }
    if (!formData.password) {
      newErrors.password = "Şifre gereklidir";
    } else if (formData.password.length < 6) {
      newErrors.password = "Şifre en az 6 karakter olmalıdır";
    }
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Şifre tekrarı gereklidir";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Şifreler eşleşmiyor";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setRegisterError(null);

  if (!validate()) return;

  if (!recaptchaToken) {
    setRegisterError("Lütfen güvenlik doğrulamasını tamamlayın.");
    return;
  }

  setIsLoading(true);

  try {
    // 1. Önce kendi 'users' tablonuzdan e-posta kontrolü yap
    const { data: existingUsers, error: fetchError } = await supabase
      .from("users_emails")
      .select("email")
      .eq("email", formData.email);

    if (fetchError) {
      console.error("E-posta kontrol hatası:", fetchError.message);
      setRegisterError("E-posta kontrolü sırasında bir hata oluştu.");
      return;
    }

    if (existingUsers && existingUsers.length > 0) {
      setRegisterError("Bu e-posta adresi zaten kayıtlı.");
      return;
    }

    // 2. Kullanıcıyı Supabase Auth sistemine kaydet
    const { data, error } = await supabase.auth.signUp({
  email: formData.email,
  password: formData.password,
  options: {
    user_metadata: {
      company_name: formData.companyName,
    },
  },
    });

    if (error) {
      setRegisterError(error.message);
      return;
    }

    // 3. Eğer kullanıcı başarıyla oluşturulduysa, kendi 'users' tablosuna da ekle
  
    

    // 4. Kullanıcıyı giriş sayfasına yönlendir
    router.push("/giris");
  } catch (error: any) {
    console.error("Kayıt hatası:", error.message);
    setRegisterError("Kayıt sırasında beklenmeyen bir hata oluştu.");
  } finally {
    setIsLoading(false);
  }
};




  const handleRecaptchaChange = (token: string | null) => {
    setRecaptchaToken(token);
  };
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-gradient-to-r from-blue-900 to-blue-700 px-6 py-8 text-white text-center">
          <h1 className="text-2xl font-bold">Kayıt olmak için doldurunuz</h1>
          <p className="mt-2 text-blue-100">
            Matbaa Rehberi ne kayıt olup kolayca firmanızı ekleyin
          </p>
        </div>

        <div className="p-6">
          {registerError && (
            <div className="mb-4 bg-red-50 text-red-700 p-3 rounded-md">
              {registerError}
            </div>
          )}

          <form  onSubmit={handleSubmit}
          >
            
            {/* Firma Adı */}
            <div className="mb-4">
              <label
                htmlFor="companyName"
                className="block text-gray-700 font-medium mb-2"
              >
                Firma Adı
              </label>
              <input
                type="text"
                id="companyName"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-md ${
                  errors.companyName ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Firma Adı"
              />
              {errors.companyName && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.companyName}
                </p>
              )}
            </div>

            {/* E-posta */}
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-gray-700 font-medium mb-2"
              >
                E-posta Adresi
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-md ${
                  errors.email ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="ornek@firma.com"
              />
              {errors.email && (
                <p className="text-sm text-red-500 mt-1">{errors.email}</p>
              )}
            </div>

            {/* Şifre */}
            <div className="mb-4">
              <label
                htmlFor="password"
                className="block text-gray-700 font-medium mb-2"
              >
                Şifre
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-md ${
                  errors.password ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.password && (
                <p className="text-sm text-red-500 mt-1">{errors.password}</p>
              )}
            </div>

            {/* Şifre Tekrarı */}
            <div className="mb-6">
              <label
                htmlFor="confirmPassword"
                className="block text-gray-700 font-medium mb-2"
              >
                Şifre Tekrarı
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-md ${
                  errors.confirmPassword ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.confirmPassword && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.confirmPassword}
                </p>
              )}
            </div>
            <ReCAPTCHA
              sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
              onChange={handleRecaptchaChange}
            />
            <div className="mb-6 text-gray-600 text-sm">
              <p>Kaydınız admin onayından sonra aktif olacaktır.</p>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full bg-blue-600 text-white py-2 px-4 rounded-md font-medium ${
                isLoading
                  ? "opacity-70 cursor-not-allowed"
                  : "hover:bg-blue-700"
              }`}
            >
              {isLoading ? "Kaydınız Oluşturuluyor..." : "Kayıt Ol"}
            </button>
            
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Zaten bir hesabınız var mı?{" "}
              <Link href="/giris" className="text-blue-600 hover:text-blue-800">
                Giriş Yap
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
