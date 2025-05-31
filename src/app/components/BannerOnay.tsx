'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

type Approval = {
  id: string;
  title: string;
  image_url: string[];
  link_url: string;
  is_active: boolean;
  approved: boolean;
  created_at: string;
  position: 'top' | 'left' | 'right';
  slot_number: number;
  slot_index: number;
};

export default function BannerOnay() {
  const [banners, setBanners] = useState<Approval[]>([]);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const [newBanner, setNewBanner] = useState({
    title: '',
    image_url: '',
    link_url: '',
    position: 'top' as 'top' | 'left' | 'right',
    slot_number: 1,
    slot_index: 1,
    is_active: true,
    approved: true,
  });

  const fetchAllBanners = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('banners')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Veri alınırken hata:', error.message);
      setErrorMsg('Reklamlar alınırken hata oluştu.');
    } else {
      setBanners(data as Approval[]);
      setErrorMsg('');
    }
    setLoading(false);
  };

  const addNewBanner = async () => {
    if (!newBanner.title || !newBanner.image_url || !newBanner.link_url) {
      setErrorMsg('Lütfen tüm zorunlu alanları doldurun.');
      return;
    }

    const { error } = await supabase.from('banners').insert([
      {
        title: newBanner.title,
        image_url: [newBanner.image_url], 
        link_url: newBanner.link_url,
        position: newBanner.position,
        slot_number: newBanner.slot_number,
        slot_index: newBanner.slot_index,
        is_active: newBanner.is_active,
        approved: newBanner.approved,
      },
    ]);

    if (error) {
      setErrorMsg('Reklam eklenirken hata oluştu.');
    } else {
      setNewBanner({
        title: '',
        image_url: '',
        link_url: '',
        position: 'top',
        slot_number: 1,
        slot_index: 1,
        is_active: true,
        approved: true,
      });
      fetchAllBanners();
      setErrorMsg('');
    }
  };

  const toggleActive = async (id: string, current: boolean) => {
    setErrorMsg('');
    const { error } = await supabase
      .from('banners')
      .update({ is_active: !current })
      .eq('id', id);

    if (error) {
      setErrorMsg('Durum güncellenirken hata oluştu.');
    } else {
      fetchAllBanners();
    }
  };

  // Silme fonksiyonu eklendi
  const deleteBanner = async (id: string) => {
    setErrorMsg('');
    if (!confirm('Reklamı silmek istediğinize emin misiniz?')) return;

    const { error } = await supabase
      .from('banners')
      .delete()
      .eq('id', id);

    if (error) {
      setErrorMsg('Silme işlemi sırasında hata oluştu.');
    } else {
      setBanners((prev) => prev.filter((banner) => banner.id !== id));
    }
  };

  useEffect(() => {
    fetchAllBanners();
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Reklam Yönetimi</h1>

      {/* Yeni Reklam Formu */}
      <div className="bg-gray-50 border p-6 rounded mb-8">
        <h2 className="text-lg font-semibold mb-4">Yeni Reklam Ekle</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Reklam Başlığı"
            value={newBanner.title}
            onChange={(e) => setNewBanner({ ...newBanner, title: e.target.value })}
            className="border px-3 py-2 rounded"
          />
          <input
            type="text"
            placeholder="Görsel URL"
            value={newBanner.image_url}
            onChange={(e) => setNewBanner({ ...newBanner, image_url: e.target.value })}
            className="border px-3 py-2 rounded"
          />
          <input
            type="text"
            placeholder="Link URL"
            value={newBanner.link_url}
            onChange={(e) => setNewBanner({ ...newBanner, link_url: e.target.value })}
            className="border px-3 py-2 rounded"
          />
          <select
            value={newBanner.position}
            onChange={(e) => setNewBanner({ ...newBanner, position: e.target.value as 'top' | 'left' | 'right' })}
            className="border px-3 py-2 rounded"
          >
            <option value="top">Top</option>
            <option value="left">Left</option>
            <option value="right">Right</option>
          </select>
          <input
            type="number"
            min={1}
            placeholder="Slot Sayısı"
            value={newBanner.slot_number}
            onChange={(e) => setNewBanner({ ...newBanner, slot_number: parseInt(e.target.value) || 1 })}
            className="border px-3 py-2 rounded"
          />
          <input
            type="number"
            min={1}
            placeholder="Slot İndeksi"
            value={newBanner.slot_index}
            onChange={(e) => setNewBanner({ ...newBanner, slot_index: parseInt(e.target.value) || 1 })}
            className="border px-3 py-2 rounded"
          />
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={newBanner.is_active}
              onChange={(e) => setNewBanner({ ...newBanner, is_active: e.target.checked })}
            />
            <span>Aktif</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={newBanner.approved}
              onChange={(e) => setNewBanner({ ...newBanner, approved: e.target.checked })}
            />
            <span>Onaylı</span>
          </label>
        </div>

        {errorMsg && <p className="text-red-600 mt-2">{errorMsg}</p>}

        <button
          onClick={addNewBanner}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Reklamı Ekle
        </button>
      </div>

      {/* Reklam Listesi */}
      {loading ? (
        <p>Yükleniyor...</p>
      ) : (
        <div className="space-y-4">
          {banners.map((banner) => (
            <div key={banner.id} className="p-4 border rounded flex justify-between items-center">
              <div>
                <p className="font-semibold">{banner.title}</p>
                <p className="text-sm text-gray-600">Pozisyon: {banner.position}</p>
                <p className="text-sm text-gray-600">Slot: {banner.slot_index}/{banner.slot_number}</p>
                <a
                  href={banner.link_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 text-sm underline"
                >
                  Linke Git
                </a>
              </div>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => toggleActive(banner.id, banner.is_active)}
                  className={`px-3 py-1 rounded ${
                    banner.is_active ? 'bg-green-500 text-white' : 'bg-gray-400 text-white'
                  }`}
                >
                  {banner.is_active ? 'Pasifleştir' : 'Aktifleştir'}
                </button>

                {/* Silme butonu */}
                <button
                  onClick={() => deleteBanner(banner.id)}
                  className="px-3 py-1 rounded bg-red-600 hover:bg-red-700 text-white"
                >
                  Sil
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
