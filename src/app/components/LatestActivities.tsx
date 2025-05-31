// components/LatestActivities.tsx
import React from "react";
import { useLatestActivities } from "../lib/useLatestActivities";

const LatestActivities: React.FC = () => {
  const { activities, loading, error } = useLatestActivities();

  if (loading) return <p>Yükleniyor...</p>;
  if (error) return <p>Hata: {error}</p>;

  return (
    <div className="mt-8">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Son Etkinlikler</h2>
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-gray-600 text-sm font-medium">Tarih</th>
              <th className="px-6 py-3 text-gray-600 text-sm font-medium">İşlem</th>
              <th className="px-6 py-3 text-gray-600 text-sm font-medium">Firma Adı</th>
              <th className="px-6 py-3 text-gray-600 text-sm font-medium">Durum</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {activities.map((activity, index) => (
              <tr key={index}>
                <td className="px-6 py-4 text-sm text-gray-800">
                  {new Date(activity.tarih).toLocaleDateString("tr-TR")}
                </td>
                <td className="px-6 py-4 text-sm text-gray-800">{activity.islem}</td>
                <td className="px-6 py-4 text-sm text-gray-800">{activity.firma}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    activity.durum === "Onaylandı"
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}>
                    {activity.durum}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LatestActivities;
