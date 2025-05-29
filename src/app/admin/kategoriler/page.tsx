"use client";
import { useAuth } from "@/app/context/AuthContext";
import { Category, Subcategory } from "../../../../types";
import {
  ChevronLeft,
  Edit,
  Trash,
  Plus,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/app/lib/supabaseClient";

const AdminCategories: React.FC = () => {
  const router = useRouter();
  const { user } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [expandedCategories, setExpandedCategories] = useState<
    Record<string, boolean>
  >({});
  const [isAddCategoryModalOpen, setIsAddCategoryModalOpen] = useState(false);
  const [isAddSubcategoryModalOpen, setIsAddSubcategoryModalOpen] =
    useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null
  );
  const [newCategoryData, setNewCategoryData] = useState({
    name: "",
    description: "",
    type: "fason" as "fason" | "uretim",
  });

  const [newSubcategoryData, setNewSubcategoryData] = useState({
    name: "",
    description: "",
  });

  const [isEditCategoryModalOpen, setIsEditCategoryModalOpen] = useState(false);
  const [editCategoryData, setEditCategoryData] = useState<{
    id: string;
    name: string;
    description: string;
    type: "fason" | "uretim";
  } | null>(null);

  const [isEditSubcategoryModalOpen, setIsEditSubcategoryModalOpen] =
    useState(false);
  const [editSubcategoryData, setEditSubcategoryData] = useState<{
    id: string;
    name: string;
    description: string;
    category_id: string; // Alt kategori hangi kategoriye ait
  } | null>(null);

  useEffect(() => {
    if (!user) return;

    // Admin olmayan kullanıcıyı yönlendir
    if (user.user_metadata?.role !== "admin") {
      router.push("/");
      return;
    }

    const fetchCategories = async () => {
      const { data, error } = await supabase
        .from("categories")
        .select(
          `
      id,
      name,
      description,
      type,
      slug,
      subcategories:subcategories_category_id_fkey (
        id,
        name,
        description,
        slug
      )
    `
        )
        .eq("created_by", user.id); // sadece giriş yapan kullanıcının kategorileri

      if (error) {
        console.error("Kategori verisi alınamadı:", error.message);
      } else {
        setCategories(data || []);
      }
    };

    fetchCategories();
  }, [user, router]);

  const toggleCategoryExpand = (categoryId: string) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [categoryId]: !prev[categoryId],
    }));
  };

  const openAddCategoryModal = () => {
    setNewCategoryData({
      name: "",
      description: "",
      type: "fason",
    });
    setIsAddCategoryModalOpen(true);
  };

  const openAddSubcategoryModal = (categoryId: string) => {
    setSelectedCategoryId(categoryId);
    setNewSubcategoryData({
      name: "",
      description: "",
    });
    setIsAddSubcategoryModalOpen(true);
  };

  const handleAddCategory = async () => {
    if (!user) {
      alert("Lütfen giriş yapınız.");
      return;
    }

    const { error } = await supabase.from("categories").insert({
      name: newCategoryData.name,
      description: newCategoryData.description,
      type: newCategoryData.type,
      slug: newCategoryData.name.toLowerCase().replace(/\s+/g, "-"),
      created_by: user.id,
    });

    if (error) {
      alert("Kategori eklenemedi: " + error.message);
      return;
    }

    setIsAddCategoryModalOpen(false);

    // Kategorileri yeniden çek
    const { data: updatedData } = await supabase.from("categories").select(`
      id,
      name,
      description,
      type,
      slug,
      subcategories:subcategories_category_id_fkey (
        id,
        name,
        description,
        slug
      )
    `);
    setCategories(updatedData || []);
  };
  const handleAddSubcategory = async () => {
    if (!user) {
      alert("Lütfen giriş yapınız.");
      return;
    }
    if (!selectedCategoryId) return;

    const { error } = await supabase.from("subcategories").insert({
      name: newSubcategoryData.name,
      description: newSubcategoryData.description,
      slug: newSubcategoryData.name.toLowerCase().replace(/\s+/g, "-"),
      category_id: selectedCategoryId,
      created_by: user.id,
    });

    if (error) {
      alert("Alt kategori eklenemedi: " + error.message);
      return;
    }

    setIsAddSubcategoryModalOpen(false);
    // Kategorileri yeniden çek
    const { data: updatedData } = await supabase.from("categories").select(`
    id,
    name,
    description,
    type,
    slug,
    subcategories:subcategories_category_id_fkey (
      id,
      name,
      description,
      slug
    )
  `);
    setCategories(updatedData || []);
  };

  const deleteCategory = async (categoryId: string) => {
    if (window.confirm("Bu kategoriyi silmek istediğinizden emin misiniz?")) {
      const { error } = await supabase
        .from("categories")
        .delete()
        .eq("id", categoryId);

      if (error) {
        alert("Kategori silinemedi: " + error.message);
        return;
      }

      setCategories(
        categories.filter((category) => category.id !== categoryId)
      );
    }
  };

  const deleteSubcategory = async (
    categoryId: string,
    subcategoryId: string
  ) => {
    if (
      window.confirm("Bu alt kategoriyi silmek istediğinizden emin misiniz?")
    ) {
      const { error } = await supabase
        .from("subcategories")
        .delete()
        .eq("id", subcategoryId);

      if (error) {
        alert("Alt kategori silinemedi: " + error.message);
        return;
      }

      const updatedCategories = categories.map((category) => {
        if (category.id === categoryId) {
          return {
            ...category,
            subcategories: category.subcategories.filter(
              (subcategory) => subcategory.id !== subcategoryId
            ),
          };
        }
        return category;
      });

      setCategories(updatedCategories);
    }
  };
  const openEditCategoryModal = (category: Category) => {
    setEditCategoryData({
      id: category.id,
      name: category.name,
      description: category.description || "",
      type: category.type,
    });
    setIsEditCategoryModalOpen(true);
  };
  const handleEditCategory = async () => {
    if (!editCategoryData) return;

    const { error } = await supabase
      .from("categories")
      .update({
        name: editCategoryData.name,
        description: editCategoryData.description,
        type: editCategoryData.type,
        slug: editCategoryData.name.toLowerCase().replace(/\s+/g, "-"),
      })
      .eq("id", editCategoryData.id);

    if (error) {
      alert("Kategori güncellenemedi: " + error.message);
      return;
    }

    setIsEditCategoryModalOpen(false);

    // Kategorileri yeniden çek
    const { data: updatedData } = await supabase.from("categories").select(`
      id,
      name,
      description,
      type,
      slug,
      subcategories:subcategories_category_id_fkey (
        id,
        name,
        description,
        slug
      )
    `);
    setCategories(updatedData || []);
  };

  const openEditSubcategoryModal = (subcategory: Subcategory) => {
    setEditSubcategoryData({
      id: subcategory.id,
      name: subcategory.name,
      description: subcategory.description,
      category_id: subcategory.category_id || "",
    });
    setIsEditSubcategoryModalOpen(true);
  };
  const handleEditSubcategory = async () => {
    if (!editSubcategoryData) return;

    const { error } = await supabase
      .from("subcategories")
      .update({
        name: editSubcategoryData.name,
        description: newSubcategoryData.description,
        slug: editSubcategoryData.name.toLowerCase().replace(/\s+/g, "-"),
      })
      .eq("id", editSubcategoryData.id);

    if (error) {
      alert("Alt kategori güncellenemedi: " + error.message);
      return;
    }

    setIsEditSubcategoryModalOpen(false);

    // Kategorileri ve alt kategorileri tekrar çek
    const { data: updatedData } = await supabase.from("categories").select(`
      id,
      name,
      description,
      type,
      slug,
      subcategories:subcategories_category_id_fkey (
        id,
        name,
        description,
        slug,
        category_id
      )
    `);
    setCategories(updatedData || []);
  };
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Geri butonu */}
        <Link
          href="/admin"
          className="flex items-center text-blue-600 hover:text-blue-800 mb-4"
        >
          <ChevronLeft size={16} className="mr-1" />
          Admin Paneline Dön
        </Link>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-gradient-to-r from-blue-900 to-blue-700 px-6 py-8 text-white">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold">Kategori Yönetimi</h1>
                <p className="mt-2 text-blue-100">
                  Kategorileri ve alt kategorileri ekleyin, düzenleyin veya
                  silin
                </p>
              </div>
              <button
                onClick={openAddCategoryModal}
                className="bg-white text-blue-800 px-4 py-2 rounded-md font-medium hover:bg-blue-100 transition-colors flex items-center"
              >
                <Plus size={16} className="mr-1" />
                Kategori Ekle
              </button>
            </div>
          </div>

          <div className="p-6">
            {categories.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-2">
                  Henüz kategori bulunmamaktadır.
                </p>
                <button
                  onClick={openAddCategoryModal}
                  className="text-blue-600 hover:text-blue-800"
                >
                  İlk Kategoriyi Ekle
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {categories.map((category) => (
                  <div
                    key={category.id}
                    className="border border-gray-200 rounded-lg overflow-hidden"
                  >
                    <div
                      className="bg-gray-50 px-6 py-4 flex justify-between items-center cursor-pointer"
                      onClick={() => toggleCategoryExpand(category.id)}
                    >
                      <div className="flex items-center">
                        {expandedCategories[category.id] ? (
                          <ChevronDown
                            size={16}
                            className="text-gray-500 mr-2"
                          />
                        ) : (
                          <ChevronRight
                            size={16}
                            className="text-gray-500 mr-2"
                          />
                        )}
                        <div>
                          <h2 className="font-semibold text-gray-800">
                            {category.name}
                          </h2>
                          <span
                            className={`text-xs px-2 py-1 rounded-full ${
                              category.type === "fason"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-green-100 text-green-800"
                            }`}
                          >
                            {category.type === "fason"
                              ? "Fason Üretim"
                              : "Üretim Yapan"}
                          </span>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            openAddSubcategoryModal(category.id);
                          }}
                          className="text-blue-600 hover:text-blue-800 p-1"
                        >
                          <Plus size={16} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            // Kategori düzenleme
                            openEditCategoryModal(category);
                          }}
                          className="text-yellow-600 hover:text-yellow-800 p-1"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteCategory(category.id);
                          }}
                          className="text-red-600 hover:text-red-800 p-1"
                        >
                          <Trash size={16} />
                        </button>
                      </div>
                    </div>

                    {expandedCategories[category.id] && (
                      <div className="px-6 py-4 border-t border-gray-200">
                        {category.description && (
                          <p className="text-gray-600 mb-4">
                            {category.description}
                          </p>
                        )}

                        <h3 className="font-medium text-gray-700 mb-2">
                          Alt Kategoriler
                        </h3>

                        {category.subcategories.length === 0 ? (
                          <p className="text-gray-500 text-sm italic">
                            Alt kategori bulunmamaktadır.
                          </p>
                        ) : (
                          <div className="space-y-2">
                            {category.subcategories.map((subcategory) => (
                              <div
                                key={subcategory.id}
                                className="flex justify-between items-center bg-gray-50 p-3 rounded-md"
                              >
                                <span>{subcategory.name}</span>
                                <div className="flex space-x-2">
                                  <button  onClick={(e) => {
                            e.stopPropagation();
                            // Kategori düzenleme
                            openEditSubcategoryModal(subcategory);
                          
                          }}  className="text-yellow-600 hover:text-yellow-800 p-1">
                                     
                                    <Edit size={14} />
                                  </button>
                                  <button
                                    onClick={() =>
                                      deleteSubcategory(
                                        category.id,
                                        subcategory.id
                                      )
                                    }
                                    className="text-red-600 hover:text-red-800 p-1"
                                  >
                                    <Trash size={14} />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            openAddSubcategoryModal(category.id);
                          }}
                          className="mt-4 text-blue-600 hover:text-blue-800 text-sm flex items-center"
                        >
                          <Plus size={14} className="mr-1" />
                          Alt Kategori Ekle
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Kategori Ekleme Modalı */}
      {isAddCategoryModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-blue-900 to-blue-700 px-6 py-4 text-white">
              <h2 className="text-xl font-bold">Yeni Kategori Ekle</h2>
            </div>

            <div className="p-6">
              <div className="mb-4">
                <label
                  htmlFor="categoryName"
                  className="block text-gray-700 font-medium mb-2"
                >
                  Kategori Adı*
                </label>
                <input
                  type="text"
                  id="categoryName"
                  value={newCategoryData.name}
                  onChange={(e) =>
                    setNewCategoryData({
                      ...newCategoryData,
                      name: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Kategori adını girin"
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="categoryDescription"
                  className="block text-gray-700 font-medium mb-2"
                >
                  Açıklama
                </label>
                <textarea
                  id="categoryDescription"
                  value={newCategoryData.description}
                  onChange={(e) =>
                    setNewCategoryData({
                      ...newCategoryData,
                      description: e.target.value,
                    })
                  }
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Kategori açıklaması (isteğe bağlı)"
                ></textarea>
              </div>

              <div className="mb-6">
                <label className="block text-gray-700 font-medium mb-2">
                  Kategori Türü*
                </label>
                <div className="flex space-x-4">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="categoryType"
                      value="fason"
                      checked={newCategoryData.type === "fason"}
                      onChange={() =>
                        setNewCategoryData({
                          ...newCategoryData,
                          type: "fason",
                        })
                      }
                      className="text-blue-600"
                    />
                    <span className="ml-2">Fason Üretim</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="categoryType"
                      value="uretim"
                      checked={newCategoryData.type === "uretim"}
                      onChange={() =>
                        setNewCategoryData({
                          ...newCategoryData,
                          type: "uretim",
                        })
                      }
                      className="text-blue-600"
                    />
                    <span className="ml-2">Üretim Yapan</span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setIsAddCategoryModalOpen(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
                >
                  İptal
                </button>
                <button
                  onClick={handleAddCategory}
                  disabled={!newCategoryData.name}
                  className={`px-4 py-2 bg-blue-600 text-white rounded-md ${
                    !newCategoryData.name
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:bg-blue-700"
                  } transition-colors`}
                >
                  Ekle
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Alt Kategori Ekleme Modalı */}
      {isAddSubcategoryModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-blue-900 to-blue-700 px-6 py-4 text-white">
              <h2 className="text-xl font-bold">Yeni Alt Kategori Ekle</h2>
              <p className="text-sm text-blue-100">
                {selectedCategoryId &&
                  categories.find((c) => c.id === selectedCategoryId)
                    ?.name}{" "}
                kategorisine
              </p>
            </div>

            <div className="p-6">
              <div className="mb-4">
                <label
                  htmlFor="subcategoryName"
                  className="block text-gray-700 font-medium mb-2"
                >
                  Alt Kategori Adı*
                </label>
                <input
                  type="text"
                  id="subcategoryName"
                  value={newSubcategoryData.name}
                  onChange={(e) =>
                    setNewSubcategoryData({
                      ...newSubcategoryData,
                      name: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Alt kategori adını girin"
                />
              </div>

              <div className="mb-6">
                <label
                  htmlFor="subcategoryDescription"
                  className="block text-gray-700 font-medium mb-2"
                >
                  Açıklama
                </label>
                <textarea
                  id="subcategoryDescription"
                  value={newSubcategoryData.description}
                  onChange={(e) =>
                    setNewSubcategoryData({
                      ...newSubcategoryData,
                      description: e.target.value,
                    })
                  }
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Alt kategori açıklaması (isteğe bağlı)"
                ></textarea>
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setIsAddSubcategoryModalOpen(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
                >
                  İptal
                </button>
                <button
                  onClick={handleAddSubcategory}
                  disabled={!newSubcategoryData.name}
                  className={`px-4 py-2 bg-blue-600 text-white rounded-md ${
                    !newSubcategoryData.name
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:bg-blue-700"
                  } transition-colors`}
                >
                  Ekle
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Kategori Düzenleme Modali */}
      {isEditCategoryModalOpen && editCategoryData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-blue-900 to-blue-700 px-6 py-4 text-white">
              <h2 className="text-xl font-bold">Kategori Düzenle</h2>
            </div>

            <div className="p-6">
              <div className="mb-4">
                <label
                  htmlFor="editCategoryName"
                  className="block text-gray-700 font-medium mb-2"
                >
                  Kategori Adı*
                </label>
                <input
                  type="text"
                  id="editCategoryName"
                  value={editCategoryData.name}
                  onChange={(e) =>
                    setEditCategoryData({
                      ...editCategoryData,
                      name: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Kategori adını girin"
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="editCategoryDescription"
                  className="block text-gray-700 font-medium mb-2"
                >
                  Açıklama
                </label>
                <textarea
                  id="editCategoryDescription"
                  value={editCategoryData.description}
                  onChange={(e) =>
                    setEditCategoryData({
                      ...editCategoryData,
                      description: e.target.value,
                    })
                  }
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Kategori açıklaması (isteğe bağlı)"
                ></textarea>
              </div>

              <div className="mb-6">
                <label className="block text-gray-700 font-medium mb-2">
                  Kategori Türü*
                </label>
                <div className="flex space-x-4">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="editCategoryType"
                      value="fason"
                      checked={editCategoryData.type === "fason"}
                      onChange={() =>
                        setEditCategoryData({
                          ...editCategoryData,
                          type: "fason",
                        })
                      }
                      className="text-blue-600"
                    />
                    <span className="ml-2">Fason Üretim</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="editCategoryType"
                      value="uretim"
                      checked={editCategoryData.type === "uretim"}
                      onChange={() =>
                        setEditCategoryData({
                          ...editCategoryData,
                          type: "uretim",
                        })
                      }
                      className="text-blue-600"
                    />
                    <span className="ml-2">Üretim Yapan</span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setIsEditCategoryModalOpen(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
                >
                  İptal
                </button>
                <button
                  onClick={handleEditCategory}
                  disabled={!editCategoryData.name.trim()}
                  className={`px-4 py-2 bg-blue-600 text-white rounded-md ${
                    !editCategoryData.name.trim()
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:bg-blue-700"
                  } transition-colors`}
                >
                  Kaydet
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {isEditSubcategoryModalOpen && editSubcategoryData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-blue-900 to-blue-700 px-6 py-4 text-white">
              <h2 className="text-xl font-bold">Alt Kategori Düzenle</h2>
            </div>

            <div className="p-6">
              <div className="mb-4">
                <label
                  htmlFor="editSubcategoryName"
                  className="block text-gray-700 font-medium mb-2"
                >
                  Alt Kategori Adı*
                </label>
                <input
                  type="text"
                  id="editSubcategoryName"
                  value={editSubcategoryData.name}
                  onChange={(e) =>
                    setEditSubcategoryData({
                      ...editSubcategoryData,
                      name: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Alt kategori adını girin"
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="editSubcategoryDescription"
                  className="block text-gray-700 font-medium mb-2"
                >
                  Açıklama
                </label>
                <textarea
                  id="editSubcategoryDescription"
                  value={editSubcategoryData.description}
                  onChange={(e) =>
                    setEditSubcategoryData({
                      ...editSubcategoryData,
                      description: e.target.value,
                    })
                  }
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Alt kategori açıklaması (isteğe bağlı)"
                ></textarea>
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setIsEditSubcategoryModalOpen(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
                >
                  İptal
                </button>
                <button
                  onClick={handleEditSubcategory}
                  disabled={!editSubcategoryData.name.trim()}
                  className={`px-4 py-2 bg-blue-600 text-white rounded-md ${
                    !editSubcategoryData.name.trim()
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:bg-blue-700"
                  } transition-colors`}
                >
                  Kaydet
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCategories;
