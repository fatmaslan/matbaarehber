"use client";

import {
  Phone,
  Mail,
  Globe,
  MapPin,
  ChevronLeft,
  ExternalLink,
} from "lucide-react";

import { Company } from "../../../../types";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/app/lib/supabaseClient";
import { LiaLinkedin } from "react-icons/lia";
import { FaInstagram, FaTwitter } from "react-icons/fa";
import { FaFacebook } from "react-icons/fa6";

const CompanyDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedTab, setSelectedTab] = useState<"facility" | "products">(
    "facility"
  );
  const [companyCategories, setCompanyCategories] = useState<
    { main: string; sub: string }[]
  >([]);

  useEffect(() => {
    const fetchCompany = async () => {
      setLoading(true);

      const { data, error } = await supabase
        .from("companies")
        .select(`*, categories(*), subcategories(*)`)
        .eq("id", id)
        .single();

      if (error || !data) {
        console.error(
          "Firma alınamadı:",
          error?.message || "Bilinmeyen hata",
          error
        );
        setCompany(null);
      } else {
        setCompany(data);
        if (data.images?.length > 0) {
          setSelectedImage(data.images[0]);
        }
      }
      console.log("useParams ile gelen ID:", id);
      setLoading(false);
    };

    if (id) {
      fetchCompany();
    }
  }, [id]);

  useEffect(() => {
    const getCompanyCategories = async (company: Company) => {
      const result: Array<{ main: string; sub: string }> = [];

      const { data: categoriesData, error } = await supabase
        .from("categories")
        .select("*, subcategories(*)")
        .in("id", company.categoryIds);

      if (error || !categoriesData) return result;

      categoriesData.forEach((category) => {
        category.subcategories?.forEach((sub) => {
          if (company.subcategoryIds.includes(sub.id)) {
            result.push({
              main: category.name,
              sub: sub.name,
            });
          }
        });
      });

      return result;
    };

    if (company) {
      getCompanyCategories(company).then(setCompanyCategories);
    }
  }, [company]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Firma Bulunamadı
          </h1>
          <p className="text-gray-600 mb-4">
            Aradığınız firma kaydına ulaşılamadı.
          </p>
          <Link
            href="/"
            className="flex items-center text-blue-600 hover:text-blue-800"
          >
            <ChevronLeft size={16} className="mr-1" />
            Ana Sayfaya Dön
          </Link>
        </div>
      </div>
    );
  }

  const renderTabContent = () => {
    const images =
      selectedTab === "facility" ? company.images : company.productimages;
    const title = selectedTab === "facility" ? "Üretim Tesisi" : "Ürünler";

    return (
      <div className="mt-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">{title}</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {images.map((image, index) => (
            <div
              key={index}
              className={`
                relative cursor-pointer overflow-hidden rounded-lg h-24 md:h-32
                ${selectedImage === image ? "ring-2 ring-blue-600" : ""}
              `}
              onClick={() => setSelectedImage(image)}
            >
              <img
                src={image}
                alt={`${company.name} ${title.toLowerCase()} ${index + 1}`}
                className="w-full h-full object-cover transition-transform hover:scale-110 duration-300"
              />
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Link
        href="/"
        className="flex items-center text-blue-600 hover:text-blue-800 mb-4"
      >
        <ChevronLeft size={16} className="mr-1" />
        Tüm Firmalara Dön
      </Link>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-blue-900 to-blue-700 px-6 py-4 flex flex-col md:flex-row items-center md:items-start gap-6">
          <div className="w-24 h-24 md:w-32 md:h-32 bg-white rounded-lg overflow-hidden flex-shrink-0 border-4 border-white shadow-lg">
            {company.logo ? (
              <img
                src={company.logo}
                alt={`${company.name} logosu`}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-blue-100 text-blue-800 font-bold text-3xl">
                {company.name.charAt(0)}
              </div>
            )}
          </div>

          <div className="text-center md:text-left text-white">
            <h1 className="text-2xl md:text-3xl font-bold mb-2">
              {company.name}
            </h1>
            <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-2">
              {companyCategories.map((category, index) => (
                <span
                  key={index}
                  className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm"
                >
                  {category.sub}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-800 mb-3">
                  Firma Hakkında
                </h2>
                <p className="text-gray-700">{company.description}</p>
              </div>

              <div className="mb-6">
                <div className="flex border-b mb-4">
                  <button
                    className={`py-2 px-4 font-medium ${
                      selectedTab === "facility"
                        ? "text-blue-600 border-b-2 border-blue-600"
                        : "text-gray-500 hover:text-blue-600"
                    }`}
                    onClick={() => {
                      setSelectedTab("facility");
                      if (company.images.length > 0) {
                        setSelectedImage(company.images[0]);
                      }
                    }}
                  >
                    Üretim Tesisi
                  </button>
                  <button
                    className={`py-2 px-4 font-medium ${
                      selectedTab === "products"
                        ? "text-blue-600 border-b-2 border-blue-600"
                        : "text-gray-500 hover:text-blue-600"
                    }`}
                    onClick={() => {
                      setSelectedTab("products");
                      if (company.productimages.length > 0) {
                        setSelectedImage(company.productimages[0]);
                      }
                    }}
                  >
                    Ürünler
                  </button>
                </div>

                {selectedImage && (
                  <div className="rounded-lg overflow-hidden mb-4 h-64 md:h-80">
                    <img
                      src={selectedImage}
                      alt={`${company.name} görseli`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                {renderTabContent()}
              </div>
            </div>

            <div>
              <div className="bg-gray-50 rounded-lg p-5">
                <h2 className="text-xl font-bold text-gray-800 mb-4">
                  İletişim Bilgileri
                </h2>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <Phone className="w-5 h-5 mr-3 mt-0.5 text-blue-600" />
                    <div>
                      <p className="text-sm text-gray-500">Telefon</p>
                      <a
                        href={`tel:${company.phone}`}
                        className="text-gray-800 hover:text-blue-600"
                      >
                        {company.phone}
                      </a>
                    </div>
                  </li>

                  {company.fax && (
                    <li className="flex items-start">
                      <Phone className="w-5 h-5 mr-3 mt-0.5 text-blue-600" />
                      <div>
                        <p className="text-sm text-gray-500">Fax</p>
                        <p className="text-gray-800">{company.fax}</p>
                      </div>
                    </li>
                  )}

                  <li className="flex items-start">
                    <Mail className="w-5 h-5 mr-3 mt-0.5 text-blue-600" />
                    <div>
                      <p className="text-sm text-gray-500">E-posta</p>
                      <a
                        href={`mailto:${company.email}`}
                        className="text-gray-800 hover:text-blue-600"
                      >
                        {company.email}
                      </a>
                    </div>
                  </li>

                  {company.website && (
                    <li className="flex items-start">
                      <Globe className="w-5 h-5 mr-3 mt-0.5 text-blue-600" />
                      <div>
                        <p className="text-sm text-gray-500">Web Sitesi</p>
                        <a
                          href={`https://${company.website}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-800 hover:text-blue-600 flex items-center"
                        >
                          {company.website}
                          <ExternalLink size={14} className="ml-1" />
                        </a>
                      </div>
                    </li>
                  )}

                  <li className="flex items-start">
                    <MapPin className="w-5 h-5 mr-3 mt-0.5 text-blue-600" />
                    <div>
                      <p className="text-sm text-gray-500">Adres</p>
                      <p className="text-gray-800">{company.address}</p>
                      {company.location && (
                        <a
                          href={`https://www.google.com/maps?q=${company.location.lat},${company.location.lng}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 text-sm mt-1 flex items-center"
                        >
                          Yol Tarifi Al
                          <ExternalLink size={14} className="ml-1" />
                        </a>
                      )}
                    </div>
                  </li>
                </ul>

                {(company.facebook ||
                  company.instagram ||
                  company.linkedin ||
                  company.twitter) && (
                  <div className="mt-6">
                    <h3 className="text-gray-800 font-semibold mb-2">
                      Sosyal Medya
                    </h3>
                    <div className="flex space-x-2">
                      {company.facebook && (
                        <a
                          href={`https://facebook.com/${company.facebook}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 bg-gray-100 rounded-full text-blue-600 hover:bg-blue-50 hover:text-blue-700 transition-colors"
                        >
                          <FaFacebook size={20} />
                        </a>
                      )}
                      {company.instagram && (
                        <a
                          href={`https://instagram.com/${company.instagram}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 bg-gray-100 rounded-full text-pink-600 hover:bg-pink-50 hover:text-pink-700 transition-colors"
                        >
                          <FaInstagram size={20} />
                        </a>
                      )}
                      {company.twitter && (
                        <a
                          href={`https://twitter.com/${company.twitter}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 bg-gray-100 rounded-full text-blue-400 hover:bg-blue-50 hover:text-blue-500 transition-colors"
                        >
                          <FaTwitter size={20} />
                        </a>
                      )}
                      {company.linkedin && (
                        <a
                          href={`https://linkedin.com/in/${company.linkedin}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 bg-gray-100 rounded-full text-blue-700 hover:bg-blue-50 hover:text-blue-800 transition-colors"
                        >
                          <LiaLinkedin size={20} />
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyDetailPage;
