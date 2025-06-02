'use client';

import {useEffect, useRef, useState} from 'react';

import {Search} from 'lucide-react';

import {Company} from '../../../types';
import {supabase} from '../lib/supabaseClient';
import {CategoryWithSubs} from "@/app/components/types";
import CompanyCard from "@/app/components/CompanyCard";


const HomePage: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
    const [selectedSubcategoryId, setSelectedSubcategoryId] = useState<string | null>(null);
    const [categories, setCategories] = useState<CategoryWithSubs[]>([]);
    const [companies, setCompanies] = useState<Company[]>([]);
    const fetchedOnce = useRef(false); // 👈
    // Verileri çek
    useEffect(() => {
        if (fetchedOnce.current) return;
        fetchedOnce.current = true;

        const fetchInitialData = async () => {
            const { data: cats, error: catErr } = await supabase.from('categories').select('*');
            const { data: subs, error: subErr } = await supabase.from('subcategories').select('*');

            if (catErr || subErr) {
                console.error(catErr || subErr);
                return;
            }

            const categoriesWithSubs = cats!.map((cat) => ({
                ...cat,
                subcategories: subs!.filter((sub) => sub.category_id === cat.id),
            }));

            setCategories(categoriesWithSubs);
            await fetchCompanies(null); // sadece onaylı tüm firmaları getir
        };

        fetchInitialData();
    }, []);

    

    // Filtreleme işlemi
    const filteredCompanies = companies.filter((company) => {
        return (
            searchTerm === '' ||
            company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            company.description?.toLowerCase().includes(searchTerm.toLowerCase())
        );
    });


    const selectedCategory = selectedCategoryId
        ? categories.find((cat) => cat.id === selectedCategoryId)
        : null;

    const handleCategoryClick = async (categoryId: string) => {
        const newId = selectedCategoryId === categoryId ? null : categoryId;
        setSelectedCategoryId(newId);
        setSelectedSubcategoryId(null);

        await fetchCompanies(newId);
    };


    const fetchCompanies = async (categoryId: string | null) => {
        let query = supabase.from('companies').select('*').eq('approved', true);

        if (categoryId) {
            query = query.contains('categoryids', [categoryId]);
        }

        const { data, error } = await query;
        if (error) {
            console.error("Firma verisi alınamadı", error);
        } else {
            setCompanies(data || []);
        }
    };

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
                    <Search className="absolute right-4 top-3 text-gray-500" size={20}/>
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
                                        onClick={() => handleCategoryClick(category.id)}
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
                                <span
                                    className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center">
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
                                <span
                                    className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center">
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
                                <span
                                    className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center">
                  {searchTerm}
                                    <button className="ml-2 text-blue-500 hover:text-blue-700"
                                            onClick={() => setSearchTerm('')}>
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
                            <CompanyCard key={company.id} company={company} categories={categories}/>
                        ))}
                    </div>

                    {filteredCompanies.length === 0 && (
                        <div className="bg-white rounded-lg shadow-md p-8 text-center">
                            <p className="text-gray-600 mb-2">Arama kriterlerinize uygun firma bulunamadı.</p>
                            <p className="text-gray-500">Farklı anahtar kelimeler deneyebilir veya filtreleri
                                temizleyebilirsiniz.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};


export default HomePage;
