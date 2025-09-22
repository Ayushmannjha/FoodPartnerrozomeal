import { Button } from "../ui/button";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { ArrowRight, Star, Users, TrendingUp, Heart, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useLanguage } from "./LanguageContext";
import { useState, useEffect } from "react";

export function Hero() {
  const { t } = useLanguage();
  const [currentSlide, setCurrentSlide] = useState(0);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const heroSlides = [
    {
      id: 1,
      backgroundImage: "https://images.unsplash.com/photo-1589216187072-e625562d7482?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjB3b21hbiUyMGNvb2tpbmclMjBraXRjaGVuJTIwaGFwcHl8ZW58MXx8fHwxNzU3MTcwNDc2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      title: "Transform Your Kitchen Skills",
      subtitle: "Into a Thriving Business",
      description: "Join Sunita from Mumbai who earns ₹45,000 monthly selling her famous dal makhani and rotis to 200+ regular families in her neighborhood.",
      partnerName: "Sunita Devi",
      location: "Mumbai",
      earnings: "₹45,000/month",
      orders: "200+ families",
      specialty: "North Indian Home Cooking"
    },
    {
      id: 2,
      backgroundImage: "https://images.unsplash.com/photo-1667382137969-a11fd256717d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjB3b21hbiUyMHRyYWRpdGlvbmFsJTIwY29va2luZyUyMHNtaWxpbmd8ZW58MXx8fHwxNzU3MTcwNDc5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      title: "Share Your Traditional Recipes",
      subtitle: "With Hungry Families",
      description: "Meet Rekha from Delhi, a mother of two who started with just samosas and now runs a successful snack business earning ₹32,000 monthly.",
      partnerName: "Rekha Sharma",
      location: "Delhi",
      earnings: "₹32,000/month",
      orders: "150+ families", 
      specialty: "Traditional Snacks & Chaat"
    },
    {
      id: 3,
      backgroundImage: "https://images.unsplash.com/photo-1680759112621-3c56f749eda4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjB3b21hbiUyMGNoZWYlMjBmb29kJTIwcHJlcGFyYXRpb258ZW58MXx8fHwxNzU3MTcwNDg1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      title: "Start Your Food Empire",
      subtitle: "From Home Kitchen",
      description: "Inspired by Meera from Bangalore who began with homemade sweets and now supplies to 300+ families, earning ₹52,000 monthly during festivals.",
      partnerName: "Meera Patel",
      location: "Bangalore",
      earnings: "₹52,000/month",
      orders: "300+ families",
      specialty: "Traditional Sweets & Desserts"
    },
    {
      id: 4,
      backgroundImage: "https://images.unsplash.com/photo-1623631140622-cca64af89fff?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjB3b21hbiUyMHN1Y2Nlc3NmdWwlMjBlbnRyZXByZW5ldXIlMjBidXNpbmVzc3xlbnwxfHx8fDE3NTcxNzA0ODd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      title: "Become Financially Independent",
      subtitle: "While Caring for Family",
      description: "Like Priya from Hyderabad, balance family time while building your own business. She now supports her children's education with her food income.",
      partnerName: "Priya Singh",
      location: "Hyderabad",
      earnings: "₹38,000/month",
      orders: "180+ families",
      specialty: "Healthy Home Meals"
    }
  ];

  // Auto-rotate slides
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  const currentSlideData = heroSlides[currentSlide];

  return (
    <section id="hero" className="relative min-h-screen overflow-hidden">
      {/* Background Carousel */}
      <div className="absolute inset-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute inset-0"
          >
            <ImageWithFallback
              src={currentSlideData.backgroundImage}
              alt={`${currentSlideData.partnerName} - RozoMeal Partner`}
              className="w-full h-full object-cover"
            />
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="text-white"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="flex items-center space-x-2 mb-6"
              >
                <div className="bg-gradient-to-r from-pink-500 to-orange-500 text-white px-4 py-2 rounded-full text-sm font-medium">
                  💕 {t('hero.badge')}
                </div>
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: 0.4 + i * 0.1 }}
                    >
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    </motion.div>
                  ))}
                  <span className="text-sm text-gray-200 ml-1">{t('hero.rating')}</span>
                </div>
              </motion.div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={currentSlide}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -30 }}
                  transition={{ duration: 0.6 }}
                >
                  <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
                    {currentSlideData.title}{" "}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-orange-400">
                      {currentSlideData.subtitle}
                    </span>
                  </h1>

                  <p className="text-xl text-gray-200 mb-8 leading-relaxed">
                    {currentSlideData.description}
                  </p>
                </motion.div>
              </AnimatePresence>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.7 }}
                className="flex flex-col sm:flex-row gap-4 mb-8"
              >
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button 
                    onClick={() => scrollToSection('contact')}
                    className="bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 text-white px-8 py-3 text-lg shadow-lg"
                    size="lg"
                  >
                    {t('hero.startBusiness')}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button 
                    onClick={() => scrollToSection('benefits')}
                    variant="outline" 
                    className="border-2 border-white text-white hover:bg-white/10 px-8 py-3 text-lg backdrop-blur-sm"
                    size="lg"
                  >
                    {t('hero.learnMore')}
                  </Button>
                </motion.div>
              </motion.div>

              {/* Stats */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.9 }}
                className="grid grid-cols-3 gap-6 pt-8 border-t border-white/20"
              >
                <div className="text-center">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className="flex items-center justify-center mb-2"
                  >
                    <Users className="h-5 w-5 text-pink-400 mr-2" />
                    <span className="text-2xl font-bold text-white">15K+</span>
                  </motion.div>
                  <p className="text-sm text-gray-300">{t('hero.womenPartners')}</p>
                </div>
                <div className="text-center">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className="flex items-center justify-center mb-2"
                  >
                    <TrendingUp className="h-5 w-5 text-pink-400 mr-2" />
                    <span className="text-2xl font-bold text-white">₹35K</span>
                  </motion.div>
                  <p className="text-sm text-gray-300">{t('hero.avgIncrease')}</p>
                </div>
                <div className="text-center">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className="flex items-center justify-center mb-2"
                  >
                    <Heart className="h-5 w-5 text-pink-400 mr-2" />
                    <span className="text-2xl font-bold text-white">2M+</span>
                  </motion.div>
                  <p className="text-sm text-gray-300">{t('hero.happyCustomers')}</p>
                </div>
              </motion.div>
            </motion.div>

            {/* Right Content - Partner Info Card */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="flex justify-center lg:justify-end"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentSlide}
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: -20 }}
                  transition={{ duration: 0.5 }}
                  className="bg-white/95 backdrop-blur-lg rounded-2xl p-8 shadow-2xl max-w-md w-full border border-white/20"
                >
                  <div className="text-center mb-6">
                    <div className="w-20 h-20 bg-gradient-to-r from-pink-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-3xl text-white">👩‍🍳</span>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-1">
                      {currentSlideData.partnerName}
                    </h3>
                    <p className="text-gray-600">{currentSlideData.location}</p>
                  </div>

                  <div className="space-y-4">
                    <div className="bg-green-50 rounded-lg p-4 text-center">
                      <p className="text-3xl font-bold text-green-600 mb-1">
                        {currentSlideData.earnings}
                      </p>
                      <p className="text-sm text-green-700">Monthly Earnings</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-blue-50 rounded-lg p-3 text-center">
                        <p className="text-lg font-bold text-blue-600">
                          {currentSlideData.orders.split(' ')[0]}
                        </p>
                        <p className="text-xs text-blue-700">Regular Families</p>
                      </div>
                      <div className="bg-purple-50 rounded-lg p-3 text-center">
                        <p className="text-lg font-bold text-purple-600">4.9★</p>
                        <p className="text-xs text-purple-700">Rating</p>
                      </div>
                    </div>

                    <div className="bg-orange-50 rounded-lg p-3">
                      <p className="text-sm font-medium text-orange-800 mb-1">Specialty:</p>
                      <p className="text-sm text-orange-700">{currentSlideData.specialty}</p>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
        <div className="flex items-center space-x-4">
          <button
            onClick={prevSlide}
            className="bg-white/20 backdrop-blur-sm text-white p-2 rounded-full hover:bg-white/30 transition-colors"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          
          <div className="flex space-x-2">
            {heroSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-colors duration-300 ${
                  index === currentSlide
                    ? 'bg-white'
                    : 'bg-white/40 hover:bg-white/60'
                }`}
              />
            ))}
          </div>
          
          <button
            onClick={nextSlide}
            className="bg-white/20 backdrop-blur-sm text-white p-2 rounded-full hover:bg-white/30 transition-colors"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </div>
      </div>

      {/* Floating elements */}
      <motion.div
        animate={{ 
          y: [0, -20, 0],
          rotate: [0, 5, -5, 0]
        }}
        transition={{ 
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute top-20 right-8 z-20 bg-gradient-to-r from-pink-500 to-orange-500 rounded-full p-4 shadow-lg"
      >
        <Star className="h-8 w-8 text-white" />
      </motion.div>

      <motion.div
        animate={{ 
          y: [0, 15, 0],
          rotate: [0, -5, 5, 0]
        }}
        transition={{ 
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1
        }}
        className="absolute bottom-32 right-12 z-20 bg-gradient-to-r from-yellow-400 to-pink-400 rounded-full p-3 shadow-lg"
      >
        <Heart className="h-6 w-6 text-white" />
      </motion.div>
    </section>
  );
}