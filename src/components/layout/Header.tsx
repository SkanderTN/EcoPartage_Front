// src/components/layout/Header.tsx

import React from 'react';
import { Button } from '../ui/button';
import { ShoppingBag, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Logo from '../../assets/LOGO_BLACK.png';
 

const Header: React.FC = () => {
  const navigate = useNavigate();

  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div 
            className="flex items-center cursor-pointer" 
            onClick={() => navigate('/')}
          >
            <img src={Logo} alt="EcoPartage" className="h-10 w-10 mr-3" />
            
            <span className="font-bold text-xl text-gray-900">ÉcoPartage</span>
          </div>

          {/* Navigation centrale */}
          <nav className="hidden md:flex items-center space-x-12">
            <a 
              href="/" 
              className="text-gray-700 hover:text-gray-900 font-medium text-lg transition-colors"
              style={{ fontFamily: 'Crimson Text, serif' }} 
              
            >
              Accueil
            </a>
            <a 
              href="/about" 
              className="text-gray-700 hover:text-gray-900 font-medium text-lg transition-colors"
              style={{ fontFamily: 'Crimson Text, serif' }}
            >
              À propos
            </a>
          </nav>

          {/* Actions à droite */}
          <div className="flex items-center space-x-6">
            <Button 
              variant="ghost" 
              size="icon"
              className="hover:bg-gray-100"
            >
              <ShoppingBag className="h-6 w-6 text-gray-700" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon"
              className="hover:bg-gray-100"
            >
              <User className="h-6 w-6 text-gray-700" />
            </Button>
          </div>
        </div>
      </div>
      <div className="mt-3 border-t border-gray-800 text-center text-gray-400"></div>

    </header>
  );
};

export default Header;