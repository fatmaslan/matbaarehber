import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

const NotFoundPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-gradient-to-r from-blue-900 to-blue-700 px-6 py-8 text-white text-center">
          <h1 className="text-4xl font-bold mb-2">404</h1>
          <p className="text-xl">Sayfa Bulunamadı</p>
        </div>
        
        <div className="p-6 text-center">
          <p className="text-gray-700 mb-6">
            Aradığınız sayfa bulunamadı veya taşınmış olabilir.
          </p>
          
          <Link 
            to="/" 
            className="inline-flex items-center justify-center bg-blue-600 text-white py-2 px-6 rounded-md font-medium hover:bg-blue-700 transition-colors"
          >
            <ChevronLeft size={16} className="mr-1" />
            Ana Sayfaya Dön
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;