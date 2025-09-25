import { Button } from "../ui/button";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { ArrowRight, Users, TrendingUp, Heart, ChevronLeft, ChevronRight, Phone,} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useLanguage } from "./LanguageContext";
import { useState, useEffect } from "react";
// import { Header } from "./Header";

export function Hero() {
  const { t } = useLanguage();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  // Check if device is mobile
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Simplified success stories for mobile
  const heroSlides = [
    {
      id: 1,
      backgroundImage: "https://images.unsplash.com/photo-1589216187072-e625562d7482?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjB3b21hbiUyMGNvb2tpbmclMjBraXRjaGVuJTIwaGFwcHl8ZW58MXx8fHwxNzU3MTcwNDc2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      title: "Turn Your Cooking",
      subtitle: "Into Income",
      mobileTitle: "Cook & Earn",
      description: "Join Sunita from Mumbai who earns ₹45,000 monthly selling her famous dal makhani and rotis to 200+ regular families in her neighborhood.",
      mobileDescription: "Sunita earns ₹45,000/month selling homemade meals while caring for her family",
      partnerName: "Sunita Devi",
      location: "Mumbai",
      earnings: "₹45,000/month",
      orders: "200+ families",
      specialty: "North Indian Home Cooking"
    },
    {
      id: 2,
      backgroundImage: "https://images.unsplash.com/photo-1667382137969-a11fd256717d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjB3b21hbiUyMHRyYWRpdGlvbmFsJTIwY29va2luZyUyMHNtaWxpbmd8ZW58MXx8fHwxNzU3MTcwNDc5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      title: "Share Your Recipes",
      subtitle: "With Customers",
      mobileTitle: "Recipes to Riches",
      description: "Meet Rekha from Delhi, a mother of two who started with just samosas and now runs a successful snack business earning ₹32,000 monthly.",
      mobileDescription: "Mother of two Rekha earns ₹32,000/month from her homemade snacks business",
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
      mobileTitle: "Your Kitchen Business",
      description: "Inspired by Meera from Bangalore who began with homemade sweets and now supplies to 300+ families, earning ₹52,000 monthly during festivals.",
      mobileDescription: "Meera earns ₹52,000/month making sweets from her home kitchen",
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
      mobileTitle: "Earn & Care for Family",
      description: "Like Priya from Hyderabad, balance family time while building your own business. She now supports her children's education with her food income.",
      mobileDescription: "Priya supports her children's education with ₹38,000/month from home cooking",
      partnerName: "Priya Singh",
      location: "Hyderabad",
      earnings: "₹38,000/month",
      orders: "180+ families",
      specialty: "Healthy Home Meals"
    }
  ];

  // Auto-rotate slides (slower on mobile for better readability)
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, isMobile ? 6000 : 5000); // Slightly longer on mobile
    return () => clearInterval(timer);
  }, [heroSlides.length, isMobile]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  const currentSlideData = heroSlides[currentSlide];

  return (<div>
    {/* <Header/> */}
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
              className="w-full h-full object-cover object-center"
            />
            {/* Overlay - darker on mobile for better readability */}
            <div className={`absolute inset-0 ${isMobile 
              ? 'bg-gradient-to-r from-black/80 via-black/70 to-black/50' 
              : 'bg-gradient-to-r from-black/70 via-black/50 to-transparent'}`} 
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
          <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="text-white"
            >
              {/* Quick action buttons for mobile */}
         

              <AnimatePresence mode="wait">
                <motion.div
                  key={currentSlide}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -30 }}
                  transition={{ duration: 0.6 }}
                >
                  {/* Responsive heading - simplified on mobile */}
                  <h1 className="text-3xl md:text-4xl lg:text-6xl font-bold mb-4 md:mb-6 leading-tight text-center md:text-left">
                    {isMobile ? currentSlideData.mobileTitle : currentSlideData.title}{" "}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-orange-400">
                      {isMobile ? "" : currentSlideData.subtitle}
                    </span>
                  </h1>

                  <p className="text-lg md:text-xl text-gray-200 mb-6 md:mb-8 leading-relaxed text-center md:text-left">
                    {isMobile ? currentSlideData.mobileDescription : currentSlideData.description}
                  </p>
                </motion.div>
              </AnimatePresence>

              {/* CTA Buttons - Stack on mobile */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.7 }}
                className="flex flex-col sm:flex-row gap-4 mb-8 justify-center md:justify-start"
              >
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-full sm:w-auto">
                  <Button 
                    onClick={() => scrollToSection('contact')}
                    className="bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 text-white px-6 md:px-8 py-3 text-lg shadow-lg w-full sm:w-auto"
                    size="lg"
                  >
                    {isMobile ? 'Start Earning Today' : t('hero.startBusiness')}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-full sm:w-auto">
                  <Button 
                    onClick={() => scrollToSection('benefits')}
                    variant="outline" 
                    className="bg-black-100 border-2 border-black text-black hover:bg-gray-200 px-6 md:px-8 py-3 text-lg backdrop-blur-sm w-full sm:w-auto rounded-xl shadow-sm transition-all duration-200"
                    size="lg"
                  >
                    {isMobile ? 'How It Works' : t('hero.learnMore')}
                  </Button>
                </motion.div>
              </motion.div>

              {/* Stats - Simplified for mobile */}
              {!isMobile ? (
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
              ) : (
                // Mobile compact stats bar
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.9 }}
                  className="flex justify-around items-center bg-black/30 backdrop-blur-sm py-3 px-4 rounded-lg mt-4"
                >
                  <div className="text-center">
                    <p className="text-xl font-bold text-white">15K+</p>
                    <p className="text-xs text-gray-300">Women</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xl font-bold text-white">₹35K</p>
                    <p className="text-xs text-gray-300">Monthly</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xl font-bold text-white">2M+</p>
                    <p className="text-xs text-gray-300">Customers</p>
                  </div>
                </motion.div>
              )}
            </motion.div>

            {/* Right Content - Partner Info Card */}
            {/* On mobile, we'll make this more compact and focused */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="hidden md:flex justify-center lg:justify-end"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentSlide}
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: -20 }}
                  transition={{ duration: 0.5 }}
                  className="bg-transparent/95 backdrop-blur-lg-none rounded-2xl p-8 shadow-2xl max-w-md w-full border /20"
                >
                  <div className="text-center mb-6">
                    <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-white-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <ImageWithFallback
                        src={currentSlideData.backgroundImage}
                        alt={currentSlideData.partnerName}
                        className="w-16 h-16 rounded-full object-cover border-2 border-white"
                      />
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

            {/* Mobile Success Card - Simplified version */}
            {isMobile && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-lg mx-auto max-w-xs"
              >
                <div className="flex items-center mb-3">
                  <div className="mr-3">
                    <ImageWithFallback
                      src={currentSlideData.backgroundImage}
                      alt={currentSlideData.partnerName}
                      className="w-12 h-12 rounded-full object-cover border-2 border-orange-400"
                    />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">
                      {currentSlideData.partnerName}
                    </h3>
                    <p className="text-sm text-gray-600">{currentSlideData.location}</p>
                  </div>
                </div>

                <div className="bg-green-50 rounded-lg p-2 text-center mb-3">
                  <p className="text-2xl font-bold text-green-600">
                    {currentSlideData.earnings}
                  </p>
                  <p className="text-xs text-green-700">Earns Monthly From Home</p>
                </div>

                <div className="flex justify-between gap-2 mb-3">
                  <div className="flex-1 bg-blue-50 rounded-lg p-2 text-center">
                    <p className="text-sm font-bold text-blue-600">
                      {currentSlideData.orders.split(' ')[0]}
                    </p>
                    <p className="text-xs text-blue-700">Customers</p>
                  </div>
                  <div className="flex-1 bg-purple-50 rounded-lg p-2 text-center">
                    <p className="text-sm font-bold text-purple-600">4.9★</p>
                    <p className="text-xs text-purple-700">Rating</p>
                  </div>
                </div>

                <p className="text-sm text-center text-gray-600 italic">
                  "I can earn while taking care of my family"
                </p>
              </motion.div>
            )}
          </div>

          {/* Additional Call-to-Action for Mobile */}
          {isMobile && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="mt-8 text-center"
            >
              <p className="text-white text-sm mb-4">Join 15,000+ women earning from home</p>
              <Button
                onClick={() => scrollToSection('contact')}
                className="bg-white text-orange-500 hover:bg-orange-100 px-8 py-2 rounded-full shadow-lg text-lg font-medium"
              >
                Start Today - It's Free
              </Button>
            </motion.div>
          )}
        </div>
      </div>

      {/* Navigation Controls - Made larger on mobile for easier tapping */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
        <div className="flex items-center space-x-4">
          <button
            onClick={prevSlide}
            className={`bg-white/20 backdrop-blur-sm text-white ${isMobile ? 'p-3' : 'p-2'} rounded-full hover:bg-white/30 transition-colors`}
            aria-label="Previous slide"
          >
            <ChevronLeft className={`${isMobile ? 'h-7 w-7' : 'h-6 w-6'}`} />
          </button>
          
          {!isMobile && (
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
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          )}
          
          <button
            onClick={nextSlide}
            className={`bg-white/20 backdrop-blur-sm text-white ${isMobile ? 'p-3' : 'p-2'} rounded-full hover:bg-white/30 transition-colors`}
            aria-label="Next slide"
          >
            <ChevronRight className={`${isMobile ? 'h-7 w-7' : 'h-6 w-6'}`} />
          </button>
        </div>
      </div>
    </section></div>
  );
}