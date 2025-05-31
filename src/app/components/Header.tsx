"use client";
import { useEffect, useRef, useState } from "react";

import { Menu, X, ChevronDown, Printer } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import Link from "next/link";
import { useRouter } from "next/navigation";

const Header: React.FC = () => {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    signOut();
    router.push("/");
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="bg-gradient-to-r from-blue-900 to-blue-700 text-white shadow-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-2">
            <Printer size={28} />
            <span className="text-xl font-bold">Matbaa Rehberi</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/" className="hover:text-blue-200 transition-colors">
              Ana Sayfa
            </Link>

            {user ? (
              <div className="relative group" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen((prev) => !prev)}
                  className="flex items-center hover:text-blue-200 transition-colors"
                >
                  <span>Hesabım</span>
                  <ChevronDown size={16} className="ml-1" />
                </button>
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                    <Link
                      href="/profil-duzenle"
                      className="block px-4 py-2 text-gray-800 hover:bg-blue-100"
                    >
                      Firmanı Düzenle
                    </Link>
                    {user.user_metadata?.role === 'admin'  && (
                      <Link
                        href="/admin"
                        className="block px-4 py-2 text-gray-800 hover:bg-blue-100"
                      >
                        Admin Paneli
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-blue-100"
                    >
                      Çıkış Yap
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  href="/giris"
                  className="hover:text-blue-200 transition-colors"
                >
                  Giriş Yap
                </Link>
                <Link
                  href="/kayit"
                  className="bg-white text-blue-800 px-4 py-2 rounded-md font-medium hover:bg-blue-100 transition-colors"
                >
                  Firma Kaydı
                </Link>
              </>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button className="md:hidden text-white" onClick={toggleMenu}>
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden mt-4 pb-2">
            <Link
              href="/"
              className="block py-2 hover:text-blue-200"
              onClick={() => setIsMenuOpen(false)}
            >
              Ana Sayfa
            </Link>

            {user ? (
              <>
                <Link
                  href="/profil-duzenle"
                  className="block py-2 hover:text-blue-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Profil Düzenle
                </Link>
                {user.user_metadata?.role === 'admin' && (
                  <Link
                    href="/admin"
                    className="block py-2 pl-6 hover:text-blue-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Admin Paneli
                  </Link>
                )}
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="block w-full text-left py-2 hover:text-blue-200"
                >
                  Çıkış Yap
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/giris"
                  className="block py-2 hover:text-blue-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Giriş Yap
                </Link>
                <Link
                  href="/kayit"
                  className="block py-2 mt-2 bg-white text-blue-800 px-4 rounded-md font-medium hover:bg-blue-100 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Firma Kaydı
                </Link>
              </>
            )}
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
