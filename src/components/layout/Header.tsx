import { Link } from 'react-router-dom';
import { Button } from "../ui/button";
import { Menu } from "lucide-react";
import { useState } from "react";
import { motion } from "motion/react";
import { useLanguage } from "./LanguageContext";
import { LanguageSelector } from "./LanguageSelector";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { t } = useLanguage();

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  const handleJoinClick = () => {
    scrollToSection('contact');
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-transparent/95 backdrop-blur-sm border-b sticky top-0 z-50 shadow-sm"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center cursor-pointer"
            onClick={() => scrollToSection('hero')}
          >
            <div className="bg-gradient-to-r from-pink-500 to-orange-500 text-white px-3 py-2 rounded-lg mr-2">
              <span>👩‍🍳</span>
            </div>
            
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <motion.button
              whileHover={{ y: -2 }}
              onClick={() => scrollToSection('benefits')}
              className="text-gray-700 hover:text-pink-500 transition-colors"
            >
              {t('nav.benefits')}
            </motion.button>
            <motion.button
              whileHover={{ y: -2 }}
              onClick={() => scrollToSection('how-it-works')}
              className="text-gray-700 hover:text-pink-500 transition-colors"
            >
              {t('nav.howItWorks')}
            </motion.button>
            <motion.button
              whileHover={{ y: -2 }}
              onClick={() => scrollToSection('earnings')}
              className="text-gray-700 hover:text-pink-500 transition-colors"
            >
              {t('nav.earnings')}
            </motion.button>
            <motion.button
              whileHover={{ y: -2 }}
              onClick={() => scrollToSection('contact')}
              className="text-gray-700 hover:text-pink-500 transition-colors"
            >
              {t('nav.contact')}
            </motion.button>
          </nav>

          {/* Language Selector & CTA Button */}
          <div className="hidden md:flex items-center space-x-4">
            <LanguageSelector />
            <Link to="/login">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="outline"
                  className="border-pink-500 text-pink-500 hover:bg-pink-50"
                >
                  Login
                </Button>
              </motion.div>
            </Link>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={handleJoinClick}
                className="bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 text-white shadow-lg"
              >
                {t('nav.joinPartner')}
              </Button>
            </motion.div>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t bg-white"
          >
            <div className="px-2 pt-2 pb-3 space-y-1">
              <button
                onClick={() => scrollToSection('benefits')}
                className="block px-3 py-2 text-gray-700 hover:text-pink-500 w-full text-left"
              >
                {t('nav.benefits')}
              </button>
              <button
                onClick={() => scrollToSection('how-it-works')}
                className="block px-3 py-2 text-gray-700 hover:text-pink-500 w-full text-left"
              >
                {t('nav.howItWorks')}
              </button>
              <button
                onClick={() => scrollToSection('earnings')}
                className="block px-3 py-2 text-gray-700 hover:text-pink-500 w-full text-left"
              >
                {t('nav.earnings')}
              </button>
              <button
                onClick={() => scrollToSection('contact')}
                className="block px-3 py-2 text-gray-700 hover:text-pink-500 w-full text-left"
              >
                {t('nav.contact')}
              </button>
              <div className="px-3 py-2 space-y-2">
                <LanguageSelector />
                <Link to="/login" className="block">
                  <Button
                    variant="outline"
                    className="w-full border-pink-500 text-pink-500 hover:bg-pink-50"
                  >
                    Login
                  </Button>
                </Link>
                <Button
                  onClick={handleJoinClick}
                  className="w-full bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 text-white"
                >
                  {t('nav.joinPartner')}
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.header>
  );
}