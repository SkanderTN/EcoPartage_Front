import React from 'react';
import Logo from '../../assets/LOGO_WHITE.png'; 

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white py-10 mt-16">
      <div className="container mx-auto px-4">
        {/* Top section */}
        <div className="flex flex-col md:flex-row justify-between items-center md:items-start text-center md:text-left gap-8">
          
          {/* Left: Logo + slogan */}
          <div className="flex flex-col items-center md:items-start">
            <div className="flex items-center space-x-3 mb-2">
              <img src={Logo} alt="EcoPartage" className="h-10 w-10" />
              <span className="font-semibold text-xl">ÉcoPartage</span>
            </div>
            <p className="text-gray-400 text-sm ">
              Réduisez le gaspillage. <br />
              Valorisez vos surplus
            </p>
          </div>

          {/* Center: Links + contact */}
          <div className="flex flex-col items-center md:items-center space-y-2 md:space-y-1">
            <div className="flex space-x-6">
              <a href="/" className="text-gray-400 hover:text-white">Accueil</a>
              <a href="/about" className="text-gray-400 hover:text-white">À propos</a>
            </div>
            <div className="text-gray-400 text-sm mt-8">
              Contact: <a href="mailto:contact@ecopartage.fr" className="underline">contact@ecopartage.fr</a>
            </div>
          </div>

          {/* Right: Copyright */}
          <div className="text-gray-400 text-sm">
            © 2025 ÉcoPartage.
          </div>
        </div>

        {/* Divider */}
        <div className="mt-10 border-t border-gray-800"></div>
      </div>
    </footer>
  );
};

export default Footer;
