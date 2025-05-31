"use client";

import { Bell, Users, FolderPlus, Settings } from "lucide-react";
import { supabase } from "../lib/supabaseClient";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import LatestActivities from "../components/LatestActivities";

const AdminDashboard: React.FC = () => {
  const router = useRouter();
  const { user } = useAuth();

  const [pendingApprovalCount, setPendingApprovalCount] = useState(0);
  const [totalCompanies, setTotalCompanies] = useState(0);
  const [totalCategories, setTotalCategories] = useState(0);

  useEffect(() => {
    if (!user) return;

    // Admin olmayan kullanıcıyı yönlendir
    if (user.user_metadata?.role !== "admin") {
      router.push("/");
      return;
    }

  const fetchCounts = async () => {
  const { count: pendingCount, error: pendingError } = await supabase
    .from("companies")
    .select("*", { count: "exact" })
    .eq("approved", false);

    console.log("Error:", pendingError);
  if (pendingError) {
    console.error("Pending count fetch error:", pendingError);
  } else {
    console.log(`Pending Count: ${pendingCount}`);
    setPendingApprovalCount(pendingCount || 0);
  }

  const { count: companyCount, error: companyError } = await supabase
    .from("companies")
    .select("*", { count: "exact" });

  if (companyError) {
    console.error("Company count fetch error:", companyError);
  } else {
    setTotalCompanies(companyCount || 0);
  }

  const { count: categoryCount, error: categoryError } = await supabase
    .from("categories")
    .select("*", { count: "exact" });

  if (categoryError) {
    console.error("Category count fetch error:", categoryError);
  } else {
    setTotalCategories(categoryCount || 0);
  }
};


    fetchCounts();
  }, [user, router]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-gradient-to-r from-blue-900 to-blue-700 px-6 py-8 text-white">
          <h1 className="text-2xl font-bold">Admin Paneli</h1>
          <p className="mt-2 text-blue-100">Matbaa Rehberi ni yönetin</p>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 flex items-center justify-between">
              <div>
                <p className="text-blue-800 font-medium">Onay Bekleyenler</p>
                <p className="text-3xl font-bold text-blue-900">
                  {pendingApprovalCount}
                </p>
              </div>
              <div className="bg-blue-500 text-white p-3 rounded-full">
                <Bell size={24} />
              </div>
            </div>

            <div className="bg-green-50 border border-green-100 rounded-lg p-4 flex items-center justify-between">
              <div>
                <p className="text-green-800 font-medium">Toplam Firma</p>
                <p className="text-3xl font-bold text-green-900">
                  {totalCompanies}
                </p>
              </div>
              <div className="bg-green-500 text-white p-3 rounded-full">
                <Users size={24} />
              </div>
            </div>

            <div className="bg-purple-50 border border-purple-100 rounded-lg p-4 flex items-center justify-between">
              <div>
                <p className="text-purple-800 font-medium">Toplam Kategori</p>
                <p className="text-3xl font-bold text-purple-900">
                  {totalCategories}
                </p>
              </div>
              <div className="bg-purple-500 text-white p-3 rounded-full">
                <FolderPlus size={24} />
              </div>
            </div>
          </div>

          {/* Menü bağlantıları */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link
              href="/admin/onaylar"
              className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow group"
            >
              <div className="flex items-center mb-4">
                <div className="bg-blue-100 text-blue-600 p-3 rounded-lg mr-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <Bell size={24} />
                </div>
                <h2 className="text-xl font-bold text-gray-800">
                  Onay Bekleyenler
                </h2>
              </div>
              <p className="text-gray-600 mb-4">
                Firma kayıtları ve profil güncellemeleri için onay isteklerini
                yönetin.
              </p>
              {pendingApprovalCount > 0 && (
                <div className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm inline-block">
                  {pendingApprovalCount} bekleyen onay
                </div>
              )}
            </Link>

            <Link
              href="/admin/kategoriler"
              className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow group"
            >
              <div className="flex items-center mb-4">
                <div className="bg-purple-100 text-purple-600 p-3 rounded-lg mr-4 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                  <Settings size={24} />
                </div>
                <h2 className="text-xl font-bold text-gray-800">
                  Kategori Yönetimi
                </h2>
              </div>
              <p className="text-gray-600">
                Ana kategorileri ve alt kategorileri ekleyin, düzenleyin veya
                silin.
              </p>
            </Link>
          </div>

          {/* Son Etkinlikler (İsteğe bağlı dinamik yapılabilir) */}
          <div className="mt-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Son Etkinlikler
            </h2>
            <LatestActivities />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
