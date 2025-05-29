"use client";

import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const ProtectedPage = () => {
  const { user, loading } = useAuth();
  const router = useRouter();

 useEffect(() => {
    if (!loading && !user) {
      // Giriş sayfasına yönlendir, sonra geri dönebilmek için ?next ekle
      const next = encodeURIComponent("/firma-profili");
      router.push(`/giris?next=${next}`);
    }
  }, [user, loading]);

  if (loading) return <p>Yükleniyor...</p>;

  return  <div className="p-4">
      <h1 className="text-xl font-semibold">Firma Profil Sayfası</h1>
      <p>Hoş geldiniz, {user?.email}</p>
    </div>;
};

export default ProtectedPage;
