"use client";

import { ChevronLeft, Check, X, ExternalLink } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

import { useAuth } from "@/app/context/AuthContext";
import { supabase } from "@/app/lib/supabaseClient";
import BannerOnay from "@/app/components/BannerOnay";

export type Approval = {
  id: string;
  name: string;
  type: "registration" | "update";
  submitted_at: string;
  companyId?: string;
  data: {
    email?: string;
    phone?: string;
    description?: string;
  };
};

const AdminApprovals: React.FC = () => {
  const router = useRouter();
  const { user } = useAuth();
  const [pendingApprovals, setPendingApprovals] = useState<Approval[]>([]);
  const [selectedApproval, setSelectedApproval] = useState<Approval | null>(
    null
  );
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    if (user.user_metadata?.role !== "admin") {
      router.push("/");
      return;
    }

    async function fetchPendingApprovals() {
      setLoading(true);
      setErrorMsg(null);

      const { data, error } = await supabase
        .from("companies")
        .select("*")
        .eq("approved", false);

      if (error) {
        console.error("Onay bekleyenler çekilemedi:", error.message);
        setErrorMsg("Onay bekleyenler alınırken hata oluştu.");
        setPendingApprovals([]);
      } else {
        setPendingApprovals(data || []);
      }

      setLoading(false);
    }

    fetchPendingApprovals();
  }, [user, router]);

  const handleApprove = async (id: string) => {
    setErrorMsg(null);

    // Eğer onaylama işleminde başka tabloya insert gerekiyorsa burada yapabilirsin.
    // Şimdilik sadece pending_approvals kaydını siliyoruz.

    const { error } = await supabase
      .from("companies")
      .update({ approved: true })
      .eq("id", id);
    if (error) {
      setErrorMsg("Onaylama işlemi sırasında hata oluştu: " + error.message);
      return;
    }

    setPendingApprovals((prev) => prev.filter((a) => a.id !== id));
    setIsViewModalOpen(false);
  };

  const handleReject = async (id: string) => {
    setErrorMsg(null);

    const { error } = await supabase
      .from("companies")

      .delete()
      .eq("id", id);

    if (error) {
      setErrorMsg("Reddetme işlemi sırasında hata oluştu: " + error.message);
      return;
    }

    setPendingApprovals((prev) => prev.filter((a) => a.id !== id));
    setIsViewModalOpen(false);
  };

  const viewApprovalDetails = (approval: Approval) => {
    setSelectedApproval(approval);
    setIsViewModalOpen(true);
  };

  if (loading) {
    return <div className="container mx-auto p-8">Yükleniyor...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <Link
          href="/admin"
          className="flex items-center text-blue-600 hover:text-blue-800 mb-4"
        >
          <ChevronLeft size={16} className="mr-1" />
          Admin Paneline Dön
        </Link>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-gradient-to-r from-blue-900 to-blue-700 px-6 py-8 text-white">
            <h1 className="text-2xl font-bold">Onay Bekleyenler</h1>
            <p className="mt-2 text-blue-100">
              Firma kayıtları ve profil güncellemeleri için onay isteklerini
              yönetin
            </p>
          </div>

          <div className="p-6">
            {errorMsg && (
              <div className="mb-4 text-red-600 font-semibold">{errorMsg}</div>
            )}

            {pendingApprovals.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-2">
                  Bekleyen onay isteği bulunmamaktadır.
                </p>
                <Link
                  href="/admin"
                  className="text-blue-600 hover:text-blue-800"
                >
                  Admin Paneline Dön
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Firma
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        İstek Türü
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tarih
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        İşlemler
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {pendingApprovals.map((approval) => (
                      <tr key={approval.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {approval.name}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              approval.type === "registration"
                                ? "bg-green-100 text-green-800"
                                : "bg-blue-100 text-blue-800"
                            }`}
                          >
                            {approval.type === "registration"
                              ? "Profil Güncelleme"
                              : "Yeni Kayıt"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(approval.submitted_at).toLocaleString(
                            "tr-TR",
                            {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => viewApprovalDetails(approval)}
                            className="text-blue-600 hover:text-blue-900 mr-4"
                          >
                            Görüntüle
                          </button>
                          <button
                            onClick={() => handleApprove(approval.id)}
                            className="text-green-600 hover:text-green-900 mr-4"
                          >
                            Onayla
                          </button>
                          <button
                            onClick={() => handleReject(approval.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Reddet
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
        <BannerOnay />
      </div>

      {/* Detay Modalı */}
      {isViewModalOpen && selectedApproval && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-blue-900 to-blue-700 px-6 py-4 text-white flex justify-between items-center">
              <h2 className="text-xl font-bold">
                {selectedApproval.type === "registration"
                  ? "Yeni Firma Kaydı"
                  : "Profil Güncelleme"}
              </h2>
              <button
                onClick={() => setIsViewModalOpen(false)}
                className="text-white hover:text-blue-200"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6">
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Firma Bilgileri
                </h3>
                <div className="bg-gray-50 p-4 rounded-md">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Firma Adı</p>
                      <p className="font-medium">{selectedApproval.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">İstek Tarihi</p>
                      <p className="font-medium">
                        {new Date(selectedApproval.submitted_at).toLocaleString(
                          "tr-TR"
                        )}
                      </p>
                    </div>

                    {selectedApproval.data?.email && (
                      <div>
                        <p className="text-sm text-gray-500">E-posta</p>
                        <p className="font-medium">
                          {selectedApproval.data.email}
                        </p>
                      </div>
                    )}

                    {selectedApproval.data?.phone && (
                      <div>
                        <p className="text-sm text-gray-500">Telefon</p>
                        <p className="font-medium">
                          {selectedApproval.data.phone}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {selectedApproval.data?.description && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    Değişiklikler
                  </h3>
                  <div className="bg-gray-50 p-4 rounded-md">
                    <p className="text-sm text-gray-500">Açıklama</p>
                    <p className="whitespace-pre-wrap">
                      {selectedApproval.data.description}
                    </p>
                  </div>
                </div>
              )}

              {selectedApproval.type === "registration" &&
                selectedApproval.companyId && (
                  <div className="mb-6">
                    <Link
                      href={`/firma/${selectedApproval.companyId}`}
                      target="_blank"
                      className="text-blue-600 hover:text-blue-800 flex items-center"
                    >
                      Firma Profilini Görüntüle
                      <ExternalLink size={16} className="ml-1" />
                    </Link>
                  </div>
                )}

              <div className="flex justify-end space-x-4 mt-6">
                <button
                  onClick={() => handleReject(selectedApproval.id)}
                  className="px-4 py-2 bg-white border border-red-500 text-red-600 rounded-md hover:bg-red-50 transition-colors flex items-center"
                >
                  <X size={16} className="mr-1" />
                  Reddet
                </button>
                <button
                  onClick={() => handleApprove(selectedApproval.id)}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center"
                >
                  <Check size={16} className="mr-1" />
                  Onayla
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminApprovals;
