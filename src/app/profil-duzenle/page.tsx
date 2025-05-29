"use client";

import { useAuth } from "../context/AuthContext";
import { Category, ProfileFormData } from "../../../types";

import { Upload, X, PlusCircle, Camera } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabaseClient";

const ProfileEditPage: React.FC = () => {
  const router = useRouter();
  const { user } = useAuth();
  const [formData, setFormData] = useState<ProfileFormData>({
    name: "",
    description: "",
    address: "",
    phone: "",
    fax: "",
    email: "",
    website: "",
    facebook: "",
    instagram: "",
    twitter: "",
    linkedin: "",
    categoryIds: [],
    subcategoryIds: [],
    images: [],
    productImages: [],
    logo: "", // <- eksikti
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof ProfileFormData, string>>
  >({});
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [allCategories, setAllCategories] = useState<Category[]>([]);

  useEffect(() => {
    if (!user) {
      router.push("/giris");
      return;
    }

    const fetchProfile = async () => {
      if (!user) {
        console.error("Kullanıcı giriş yapmamış");
        return;
      }
      console.log("Kullanıcı bilgileri alınıyor:", user.id);
  const { data, error } = await supabase
  .from("companies")
    .select("*")
        .eq("email", user.email)
      .maybeSingle();

    console.log(" Firma verisi:", data);
    console.log(" Hata varsa:", error);

      if (error || !data) {
        console.error("Firma bilgileri alınamadı:", error?.message || error);
        return;
      }

      if (!data) {
        console.warn("Henüz firma bilgisi yok.");
        return;
      }

      if (data) {
        setFormData({
          
          name: data.name || "",
          description: data.description || "",
          address: data.address || "",
          phone: data.phone || "",
          fax: data.fax || "",
          email: data.email || "",
          website: data.website || "",
          facebook: data.facebook || "",
          instagram: data.instagram || "",
          twitter: data.twitter || "",
          linkedin: data.linkedin || "",
          categoryIds: data.categoryIds || [],
          subcategoryIds: data.subcategoryIds || [],
          images: data.images || [],
          productImages: data.productImages || [],
          logo: data.logo || "",
        });
      }
    };
    console.log("Kullanıcı bilgileri alınıyor:", user);
    fetchProfile();
  }, [user, router]);

  // kategoriler
  useEffect(() => {
    const fetchCategories = async () => {
      const { data, error } = await supabase.from("categories").select(`
    *,
    company_categories (
      category: categories (id, name)
    ),
    subcategories (id, name, category_id)
  `);

      if (!error && data) {
        setAllCategories(data as Category[]);
      }
    };

    fetchCategories();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Hata mesajını temizle
    if (errors[name as keyof ProfileFormData]) {
      setErrors({ ...errors, [name]: undefined });
    }
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const categoryId = e.target.value;
    const updatedCategoryIds = [...formData.categoryIds];

    if (updatedCategoryIds.includes(categoryId)) {
      setFormData({
        ...formData,
        categoryIds: updatedCategoryIds.filter((id) => id !== categoryId),
        subcategoryIds: [], // Alt kategorileri sıfırla
      });
    } else {
      setFormData({
        ...formData,
        categoryIds: [...updatedCategoryIds, categoryId],
        subcategoryIds: [], // Alt kategorileri sıfırla
      });
    }
  };

  const handleSubcategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const subcategoryId = e.target.value;
    const isChecked = e.target.checked;
    let updatedSubcategoryIds = [...formData.subcategoryIds];

    if (isChecked && !updatedSubcategoryIds.includes(subcategoryId)) {
      updatedSubcategoryIds.push(subcategoryId);
    } else if (!isChecked) {
      updatedSubcategoryIds = updatedSubcategoryIds.filter(
        (id) => id !== subcategoryId
      );
    }

    setFormData({ ...formData, subcategoryIds: updatedSubcategoryIds });
  };

  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "logo" | "images" | "productImages"
  ) => {
    const files = e.target.files;
    if (!files) return;

    if (!user) {
      router.push("/giris");
      return;
    }
    const uploadedUrls: string[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const filePath = `${user.id}/${Date.now()}-${file.name}`;
      const { error } = await supabase.storage
        .from("company-assets")
        .upload(filePath, file);

      if (!error) {
        const { data: publicUrlData } = supabase.storage
          .from("company-assets")
          .getPublicUrl(filePath);

        uploadedUrls.push(publicUrlData.publicUrl);
      }
    }

    if (type === "images") {
      setFormData({
        ...formData,
        images: [...formData.images, ...uploadedUrls],
      });
    } else if (type === "productImages") {
      setFormData({
        ...formData,
        productImages: [...formData.productImages, ...uploadedUrls],
      });
    } else if (type === "logo") {
      setFormData({ ...formData, logo: uploadedUrls[0] });
    }
  };

  const removeImage = (index: number, type: "images" | "productImages") => {
    if (type === "images") {
      const updatedImages = [...formData.images];
      updatedImages.splice(index, 1);
      setFormData({ ...formData, images: updatedImages });
    } else {
      const updatedProductImages = [...formData.productImages];
      updatedProductImages.splice(index, 1);
      setFormData({ ...formData, productImages: updatedProductImages });
    }
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof ProfileFormData, string>> = {};

    if (!formData.name) {
      newErrors.name = "Firma adı gereklidir";
    }

    if (!formData.description) {
      newErrors.description = "Firma açıklaması gereklidir";
    }

    if (!formData.address) {
      newErrors.address = "Adres gereklidir";
    }

    if (!formData.phone) {
      newErrors.phone = "Telefon numarası gereklidir";
    }

    if (!formData.email) {
      newErrors.email = "E-posta adresi gereklidir";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Geçerli bir e-posta adresi giriniz";
    }

    if (formData.categoryIds.length === 0) {
      newErrors.categoryIds = "En az bir kategori seçmelisiniz";
    }

    if (formData.subcategoryIds.length === 0) {
      newErrors.subcategoryIds = "En az bir alt kategori seçmelisiniz";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    setSubmitSuccess(false);

    if (!user) {
      router.push("/giris");
      return;
    }

    if (!validate()) return;
    setIsLoading(true);

    try {
      const { error } = await supabase
        .from("companies")
        .update({
          name: formData.name,
          description: formData.description,
          address: formData.address,
          phone: formData.phone,
          fax: formData.fax,
          email: formData.email,
          website: formData.website,
          facebook: formData.facebook,
          instagram: formData.instagram,
          twitter: formData.twitter,
          linkedin: formData.linkedin,
          categoryIds: formData.categoryIds, // integer array beklenir
          subcategoryIds: formData.subcategoryIds, // integer array beklenir
          images: formData.images, // string array beklenir
          productImages: formData.productImages, // string array beklenir
          logo: formData.logo, // string beklenir
        })
        .eq("user_id", user.id);

      if (error) throw error;

      setSubmitSuccess(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error: any) {
      console.error(
        "Dosya yükleme hatası:",
        error.message,
        error.status,
        error.error
      );
      setSubmitError("Profil güncellenemedi. Lütfen tekrar deneyin.");
    } finally {
      setIsLoading(false);
    }
  };

  // Kategori seçiliyse alt kategorileri göster
  const getAvailableSubcategories = () => {
    const subcategories: Array<{
      id: string;
      name: string;
      categoryId: string;
    }> = [];

    allCategories.forEach((category) => {
      if (formData.categoryIds.includes(category.id)) {
        category.subcategories.forEach((subcat) => {
          subcategories.push({
            id: subcat.id,
            name: subcat.name,
            categoryId: category.id,
          });
        });
      }
    });

    return subcategories;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-gradient-to-r from-blue-900 to-blue-700 px-6 py-8 text-white">
          <h1 className="text-2xl font-bold">Firma Profili Düzenle</h1>
          <p className="mt-2 text-blue-100">
            Firmanızın bilgilerini güncelleyin. Değişiklikler admin onayından
            sonra yayınlanacaktır.
          </p>
        </div>

        <div className="p-6">
          {submitError && (
            <div className="mb-6 bg-red-50 text-red-700 p-4 rounded-md">
              {submitError}
            </div>
          )}

          {submitSuccess && (
            <div className="mb-6 bg-green-50 text-green-700 p-4 rounded-md">
              Profil güncelleme talebiniz alınmıştır. Admin onayından sonra
              değişiklikler yayınlanacaktır.
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-800 mb-4">
                  Firma Bilgileri
                </h2>

                <div className="mb-4">
                  <label
                    htmlFor="name"
                    className="block text-gray-700 font-medium mb-2"
                  >
                    Firma Adı*
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.name ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors.name && (
                    <p className="mt-1 text-red-500 text-sm">{errors.name}</p>
                  )}
                </div>

                <div className="mb-4">
                  <label
                    htmlFor="description"
                    className="block text-gray-700 font-medium mb-2"
                  >
                    Firma Açıklaması*
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    rows={4}
                    value={formData.description}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.description ? "border-red-500" : "border-gray-300"
                    }`}
                  ></textarea>
                  {errors.description && (
                    <p className="mt-1 text-red-500 text-sm">
                      {errors.description}
                    </p>
                  )}
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 font-medium mb-2">
                    Firma Logosu
                  </label>
                  <div className="flex items-center">
                    <div className="w-20 h-20 bg-gray-100 rounded-md overflow-hidden flex items-center justify-center mr-4">
                      {typeof formData.logo === "object" ? (
                        <img
                          src={URL.createObjectURL(formData.logo)}
                          alt="Logo önizleme"
                          className="w-full h-full object-cover"
                        />
                      ) : formData.logo ? (
                        <img
                          src={formData.logo}
                          alt="Logo"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Camera size={24} className="text-gray-400" />
                      )}
                    </div>
                    <label className="cursor-pointer bg-blue-50 text-blue-600 px-4 py-2 rounded-md hover:bg-blue-100 transition-colors flex items-center">
                      <Upload size={16} className="mr-2" />
                      Logo Yükle
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleFileChange(e, "logo")}
                      />
                    </label>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-xl font-bold text-gray-800 mb-4">
                  İletişim Bilgileri
                </h2>

                <div className="mb-4">
                  <label
                    htmlFor="address"
                    className="block text-gray-700 font-medium mb-2"
                  >
                    Adres*
                  </label>
                  <textarea
                    id="address"
                    name="address"
                    rows={3}
                    value={formData.address}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.address ? "border-red-500" : "border-gray-300"
                    }`}
                  ></textarea>
                  {errors.address && (
                    <p className="mt-1 text-red-500 text-sm">
                      {errors.address}
                    </p>
                  )}
                </div>

                <div className="mb-4">
                  <label
                    htmlFor="phone"
                    className="block text-gray-700 font-medium mb-2"
                  >
                    Telefon*
                  </label>
                  <input
                    type="text"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.phone ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors.phone && (
                    <p className="mt-1 text-red-500 text-sm">{errors.phone}</p>
                  )}
                </div>

                <div className="mb-4">
                  <label
                    htmlFor="fax"
                    className="block text-gray-700 font-medium mb-2"
                  >
                    Fax
                  </label>
                  <input
                    type="text"
                    id="fax"
                    name="fax"
                    value={formData.fax || ""}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="mb-4">
                  <label
                    htmlFor="email"
                    className="block text-gray-700 font-medium mb-2"
                  >
                    E-posta*
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.email ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors.email && (
                    <p className="mt-1 text-red-500 text-sm">{errors.email}</p>
                  )}
                </div>

                <div className="mb-4">
                  <label
                    htmlFor="website"
                    className="block text-gray-700 font-medium mb-2"
                  >
                    Web Sitesi
                  </label>
                  <input
                    type="text"
                    id="website"
                    name="website"
                    value={formData.website || ""}
                    onChange={handleChange}
                    placeholder="www.firmaniz.com"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Sosyal Medya
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="facebook"
                    className="block text-gray-700 font-medium mb-2"
                  >
                    Facebook
                  </label>
                  <input
                    type="text"
                    id="facebook"
                    name="facebook"
                    value={formData.facebook || ""}
                    onChange={handleChange}
                    placeholder="facebook kullanıcı adı"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor="instagram"
                    className="block text-gray-700 font-medium mb-2"
                  >
                    Instagram
                  </label>
                  <input
                    type="text"
                    id="instagram"
                    name="instagram"
                    value={formData.instagram || ""}
                    onChange={handleChange}
                    placeholder="instagram kullanıcı adı"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor="twitter"
                    className="block text-gray-700 font-medium mb-2"
                  >
                    Twitter
                  </label>
                  <input
                    type="text"
                    id="twitter"
                    name="twitter"
                    value={formData.twitter || ""}
                    onChange={handleChange}
                    placeholder="twitter kullanıcı adı"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor="linkedin"
                    className="block text-gray-700 font-medium mb-2"
                  >
                    LinkedIn
                  </label>
                  <input
                    type="text"
                    id="linkedin"
                    name="linkedin"
                    value={formData.linkedin || ""}
                    onChange={handleChange}
                    placeholder="linkedin kullanıcı adı veya sayfa adı"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Kategoriler
              </h2>

              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">
                  Ana Kategori*
                </label>
                <select
                  multiple
                  value={formData.categoryIds}
                  onChange={handleCategoryChange}
                  className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.categoryIds ? "border-red-500" : "border-gray-300"
                  }`}
                >
                  {allCategories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                <p className="mt-1 text-gray-500 text-sm">
                  Ctrl tuşuna basarak birden fazla kategori seçebilirsiniz.
                </p>
                {errors.categoryIds && (
                  <p className="mt-1 text-red-500 text-sm">
                    {errors.categoryIds}
                  </p>
                )}
              </div>

              {formData.categoryIds.length > 0 && (
                <div className="mb-4">
                  <label className="block text-gray-700 font-medium mb-2">
                    Alt Kategoriler*
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {getAvailableSubcategories().map((subcategory) => (
                      <div key={subcategory.id} className="flex items-center">
                        <input
                          type="checkbox"
                          id={`subcategory-${subcategory.id}`}
                          value={subcategory.id}
                          checked={formData.subcategoryIds.includes(
                            subcategory.id
                          )}
                          onChange={handleSubcategoryChange}
                          className="mr-2"
                        />
                        <label htmlFor={`subcategory-${subcategory.id}`}>
                          {subcategory.name}
                        </label>
                      </div>
                    ))}
                  </div>
                  {errors.subcategoryIds && (
                    <p className="mt-1 text-red-500 text-sm">
                      {errors.subcategoryIds}
                    </p>
                  )}
                </div>
              )}
            </div>

            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Görsel Galerisi
              </h2>

              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">
                  Tesis Görselleri
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                  {formData.images.map((image, index) => (
                    <div key={index} className="relative">
                      <div className="h-24 bg-gray-100 rounded-md overflow-hidden">
                        {typeof image === "string" ? (
                          <img
                            src={image}
                            alt={`Tesis görsel ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <img
                            src={URL.createObjectURL(image)}
                            alt={`Tesis görsel ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => removeImage(index, "images")}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                  <label className="h-24 border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors">
                    <div className="flex flex-col items-center">
                      <PlusCircle size={24} className="text-gray-400 mb-1" />
                      <span className="text-xs text-gray-500">Görsel Ekle</span>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={(e) => handleFileChange(e, "images")}
                    />
                  </label>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">
                  Ürün Görselleri
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                  {formData.productImages.map((image, index) => (
                    <div key={index} className="relative">
                      <div className="h-24 bg-gray-100 rounded-md overflow-hidden">
                        {typeof image === "string" ? (
                          <img
                            src={image}
                            alt={`Ürün görsel ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <img
                            src={URL.createObjectURL(image)}
                            alt={`Ürün görsel ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => removeImage(index, "productImages")}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                  <label className="h-24 border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors">
                    <div className="flex flex-col items-center">
                      <PlusCircle size={24} className="text-gray-400 mb-1" />
                      <span className="text-xs text-gray-500">Görsel Ekle</span>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={(e) => handleFileChange(e, "productImages")}
                    />
                  </label>
                </div>
              </div>
            </div>

            <div className="text-right">
              <button
                type="submit"
                disabled={isLoading}
                className={`bg-blue-600 text-white py-2 px-6 rounded-md font-medium ${
                  isLoading
                    ? "opacity-70 cursor-not-allowed"
                    : "hover:bg-blue-700"
                }`}
              >
                {isLoading ? "Kaydediliyor..." : "Kaydet"}
              </button>
            </div>

            <div className="mt-4 text-sm text-gray-500">
              * işaretli alanlar zorunludur. Değişiklikleriniz admin onayından
              sonra yayınlanacaktır.
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfileEditPage;
