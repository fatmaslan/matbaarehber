import React from 'react';
import {Category, Company, Subcategory} from "../../../types";
import Link from "next/link";
import {MapPin} from "lucide-react";
import {CategoryWithSubs} from "@/app/components/types";


const CompanyCard: React.FC<{ company: Company; categories: CategoryWithSubs[] }> = ({company, categories}) => {
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
            <div
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <div className="h-40 bg-gray-200 relative overflow-hidden">
                    {company.logo ? (
                        <img src={company.logo} alt={`${company.name} logosu`} className="w-full h-full object-cover"/>
                    ) : (
                        <div
                            className="w-full h-full flex items-center justify-center bg-blue-100 text-blue-800 font-bold text-xl">
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
                        <MapPin size={16} className="mr-1 mt-0.5 flex-shrink-0 text-gray-500"/>
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

export default CompanyCard;