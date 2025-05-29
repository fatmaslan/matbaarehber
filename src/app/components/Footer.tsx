import React from 'react';
import Link from 'next/link'
import { Printer, Mail, Phone, MapPin } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Printer size={24} />
              <h3 className="text-lg font-bold">Matbaa Rehberi</h3>
            </div>
            <p className="text-gray-400 mb-4">
              Matbaa sektöründe hizmet veren firmaların bir araya geldiği sanayi sitesi rehberi.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4">Hızlı Erişim</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-400 hover:text-white transition-colors">
                  Ana Sayfa
                </Link>
              </li>
              <li>
                <Link href="/kayit" className="text-gray-400 hover:text-white transition-colors">
                  Firma Kaydı
                </Link>
              </li>
              <li>
                <Link href="/giris" className="text-gray-400 hover:text-white transition-colors">
                  Giriş Yap
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4">İletişim</h3>
            <ul className="space-y-2">
              <li className="flex items-center space-x-2">
                <Phone size={16} className="text-gray-400" />
                <span className="text-gray-400">+90 555 123 4567</span>
              </li>
              <li className="flex items-center space-x-2">
                <Mail size={16} className="text-gray-400" />
                <a href="mailto:info@matbaarehberi.com" className="text-gray-400 hover:text-white transition-colors">
                  info@matbaarehberi.com
                </a>
              </li>
              <li className="flex items-center space-x-2">
                <MapPin size={16} className="text-gray-400" />
                <span className="text-gray-400">Matbaacılar Sanayi Sitesi</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-6 text-center text-gray-500">
          <p>&copy; {new Date().getFullYear()} Matbaa Rehberi. Tüm hakları saklıdır.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;