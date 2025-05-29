'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Search, MapPin } from 'lucide-react';

import { Company, Category, Subcategory } from '../../../types';
import { supabase } from '../lib/supabaseClient';

interface CategoryWithSubs extends Category {
  subcategories: Subcategory[];
}

const HomePage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState<string | null>(null);
  const [categories, setCategories] = useState<CategoryWithSubs[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);

  // Verileri çek
 useEffect(() => {
  const fetchData = async () => {
    const { data: cats, error: catErr } = await supabase.from('categories').select('*');
    const { data: subs, error: subErr } = await supabase.from('subcategories').select('*');

    // Burada approved = true ile filtreledik
    const { data: comps, error: compErr } = await supabase
      .from('companies')
      .select('*')
      .eq('approved', true);

    if (catErr || subErr || compErr) {
      console.error(catErr || subErr || compErr);
      return;
    }

    const categoriesWithSubs = cats!.map((cat) => ({
      ...cat,
      subcategories: subs!.filter((sub) => sub.category_id === cat.id),
    }));

    setCategories(categoriesWithSubs);
    setCompanies(comps || []);
  };

  fetchData();
}, []);

  // Filtreleme işlemi
  const filteredCompanies = companies.filter((company) => {
    const matchesSearch =
      searchTerm === '' ||
      company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.description?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategoryId === null || (company.categoryIds || []).includes(selectedCategoryId);

    const matchesSubcategory =
      selectedSubcategoryId === null || (company.subcategoryIds || []).includes(selectedSubcategoryId);

    return matchesSearch && matchesCategory && matchesSubcategory;
  });

  const selectedCategory = selectedCategoryId
    ? categories.find((cat) => cat.id === selectedCategoryId)
    : null;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Banner ve Arama */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-700 rounded-xl p-8 mb-8 text-white">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">
          Matbaa Sektörü Firma Rehberi
        </h1>
        <p className="text-lg mb-6">
          Sanayi sitesindeki matbaa firmalarını keşfedin ve ihtiyacınıza uygun hizmet sağlayıcıları bulun.
        </p>
        <div className="relative max-w-xl">
          <input
            type="text"
            placeholder="Firma veya hizmet ara..."
            className="w-full py-3 px-4 pr-12 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute right-4 top-3 text-gray-500" size={20} />
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Sol taraf - Kategoriler */}
        <div className="w-full md:w-1/4">
          <div className="bg-white rounded-lg shadow-md p-4 mb-6">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Kategoriler</h2>
            <ul>
              {categories.map((category) => (
                <li key={category.id} className="mb-4">
                  <button
                    className={`text-left w-full font-semibold ${
                      selectedCategoryId === category.id
                        ? 'text-blue-700'
                        : 'text-gray-700 hover:text-blue-600'
                    }`}
                    onClick={() => {
                      setSelectedCategoryId(
                        selectedCategoryId === category.id ? null : category.id
                      );
                      setSelectedSubcategoryId(null);
                    }}
                  >
                    {category.name}
                  </button>

                  {selectedCategoryId === category.id && (
                    <ul className="ml-4 mt-2 space-y-1">
                      {category.subcategories.map((subcategory) => (
                        <li key={subcategory.id}>
                          <button
                            className={`text-left w-full ${
                              selectedSubcategoryId === subcategory.id
                                ? 'text-blue-700 font-medium'
                                : 'text-gray-600 hover:text-blue-600'
                            }`}
                            onClick={() =>
                              setSelectedSubcategoryId(
                                selectedSubcategoryId === subcategory.id ? null : subcategory.id
                              )
                            }
                          >
                            {subcategory.name}
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Sağ taraf - Firma listesi */}
        <div className="w-full md:w-3/4">
          {(selectedCategoryId || selectedSubcategoryId || searchTerm) && (
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <span className="text-gray-700">Filtreler:</span>
              {selectedCategory && (
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center">
                  {selectedCategory.name}
                  <button
                    className="ml-2 text-blue-500 hover:text-blue-700"
                    onClick={() => {
                      setSelectedCategoryId(null);
                      setSelectedSubcategoryId(null);
                    }}
                  >
                    &times;
                  </button>
                </span>
              )}
              {selectedSubcategoryId && selectedCategory && (
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center">
                  {
                    selectedCategory.subcategories.find((s) => s.id === selectedSubcategoryId)
                      ?.name
                  }
                  <button
                    className="ml-2 text-blue-500 hover:text-blue-700"
                    onClick={() => setSelectedSubcategoryId(null)}
                  >
                    &times;
                  </button>
                </span>
              )}
              {searchTerm && (
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center">
                  {searchTerm}
                  <button className="ml-2 text-blue-500 hover:text-blue-700" onClick={() => setSearchTerm('')}>
                    &times;
                  </button>
                </span>
              )}
              <button
                className="text-blue-600 hover:text-blue-800 text-sm"
                onClick={() => {
                  setSelectedCategoryId(null);
                  setSelectedSubcategoryId(null);
                  setSearchTerm('');
                }}
              >
                Tümünü Temizle
              </button>
            </div>
          )}

          <p className="text-gray-600 mb-4">{filteredCompanies.length} firma bulundu</p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCompanies.map((company) => (
              <CompanyCard key={company.id} company={company} categories={categories} />
            ))}
          </div>

          {filteredCompanies.length === 0 && (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <p className="text-gray-600 mb-2">Arama kriterlerinize uygun firma bulunamadı.</p>
              <p className="text-gray-500">Farklı anahtar kelimeler deneyebilir veya filtreleri temizleyebilirsiniz.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const CompanyCard: React.FC<{ company: Company; categories: CategoryWithSubs[] }> = ({ company, categories }) => {
  const getCompanyCategories = () => {
    const result: string[] = [];

    categories.forEach((cat) => {
      if ((company.categoryIds || []).includes(cat.id)) {
        cat.subcategories.forEach((sub) => {
          if ((company.subcategoryIds || []).includes(sub.id)) {
            result.push(sub.name);
          }
        });
      }
    });

    return result;
  };

  const companyCategories = getCompanyCategories();

  return (
    <Link href={`/firma/${company.id}`} className="block">
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
        <div className="h-40 bg-gray-200 relative overflow-hidden">
          {company.logo ? (
            <img src={company.logo} alt={`${company.name} logosu`} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-blue-100 text-blue-800 font-bold text-xl">
              {company.name.charAt(0)}
            </div>
          )}
        </div>
        <div className="p-4">
          <h3 className="text-lg font-bold text-gray-800 mb-2">{company.name}</h3>
          <div className="mb-3 flex flex-wrap gap-1">
            {companyCategories.map((cat, i) => (
              <span key={i} className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded">
                {cat}
              </span>
            ))}
          </div>
          <div className="flex items-start text-gray-600 text-sm mb-3">
            <MapPin size={16} className="mr-1 mt-0.5 flex-shrink-0 text-gray-500" />
            <span>{company.address}</span>
          </div>
          <p className="text-gray-600 text-sm line-clamp-2 mb-3">{company.description}</p>
          <div className="text-right">
            <span className="text-blue-600 hover:text-blue-800 text-sm font-medium">Detayları Gör</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default HomePage;
