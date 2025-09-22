import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { CheckCircle, ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import { useLanguage } from "./LanguageContext";

export function HowItWorks() {
  const { t } = useLanguage();
  
  const steps = [
    {
      step: "01",
      title: t('howItWorks.step1.title'),
      description: t('howItWorks.step1.desc'),
      icon: t('howItWorks.step1.icon')
    },
    {
      step: "02", 
      title: t('howItWorks.step2.title'),
      description: t('howItWorks.step2.desc'),
      icon: t('howItWorks.step2.icon')
    },
    {
      step: "03",
      title: t('howItWorks.step3.title'),
      description: t('howItWorks.step3.desc'),
      icon: t('howItWorks.step3.icon')
    }
  ];

  const requirements = [
    t('howItWorks.req1'),
    t('howItWorks.req2'),
    t('howItWorks.req3'),
    t('howItWorks.req4'),
    t('howItWorks.req5')
  ];

  const appFeatures = [
    t('howItWorks.feature1'),
    t('howItWorks.feature2'),
    t('howItWorks.feature3'),
    t('howItWorks.feature4'),
    t('howItWorks.feature5')
  ];

  const scrollToContact = () => {
    const element = document.getElementById('contact');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="how-it-works" className="py-20 bg-gradient-to-br from-pink-50 to-orange-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-block bg-pink-100 text-pink-600 px-4 py-2 rounded-full text-sm font-medium mb-4">
            💫 {t('howItWorks.badge')}
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            {t('howItWorks.title')}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t('howItWorks.subtitle')}
          </p>
        </motion.div>

        {/* Steps */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className="relative"
            >
              <motion.div whileHover={{ y: -5 }}>
                <Card className="border-0 shadow-lg h-full bg-white/80 backdrop-blur-sm">
                  <CardContent className="p-8 text-center">
                    <motion.div
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: index * 0.2 + 0.3 }}
                      className="text-6xl mb-6"
                    >
                      {step.icon}
                    </motion.div>
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      className="bg-gradient-to-r from-pink-500 to-orange-500 text-white rounded-full w-10 h-10 flex items-center justify-center text-sm font-bold mx-auto mb-4"
                    >
                      {step.step}
                    </motion.div>
                    <h3 className="font-semibold text-gray-900 mb-3 text-lg">
                      {step.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {step.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
              
              {/* Arrow for desktop */}
              {index < steps.length - 1 && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.2 + 0.5 }}
                  className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10"
                >
                  <div className="bg-white rounded-full p-2 shadow-lg">
                    <ArrowRight className="h-6 w-6 text-pink-500" />
                  </div>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Requirements Section */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="text-3xl font-bold text-gray-900 mb-6">
              {t('howItWorks.requirements.title')}
            </h3>
            <p className="text-lg text-gray-600 mb-8">
              {t('howItWorks.requirements.desc')}
            </p>
            
            <div className="space-y-4 mb-8">
              {requirements.map((requirement, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="flex items-start space-x-3"
                >
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">{requirement}</span>
                </motion.div>
              ))}
            </div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={scrollToContact}
                className="bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 text-white px-8 py-3 shadow-lg"
              >
                {t('howItWorks.startApplication')}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-gradient-to-br from-pink-100 via-orange-100 to-yellow-100 rounded-2xl p-8 shadow-xl"
            >
              <div className="text-center">
                <motion.div
                  animate={{ 
                    rotate: [0, 10, -10, 0],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    repeatDelay: 3
                  }}
                  className="text-6xl mb-6"
                >
                  📱
                </motion.div>
                <h4 className="text-2xl font-bold text-gray-900 mb-4">
                  {t('howItWorks.appFeatures')}
                </h4>
                <div className="space-y-3 text-left">
                  {appFeatures.map((feature, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      className="flex items-center space-x-3"
                    >
                      <motion.div
                        whileHover={{ scale: 1.2 }}
                        className="w-3 h-3 bg-gradient-to-r from-pink-500 to-orange-500 rounded-full"
                      />
                      <span className="text-gray-700">{feature}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Floating elements */}
            <motion.div
              animate={{ 
                y: [0, -10, 0],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ 
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute -top-4 -right-4 bg-pink-400 rounded-full p-3 shadow-lg"
            >
              <span className="text-white text-xl">👩‍🍳</span>
            </motion.div>
            <motion.div
              animate={{ 
                y: [0, 10, 0],
                rotate: [0, -5, 5, 0]
              }}
              transition={{ 
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1
              }}
              className="absolute -bottom-4 -left-4 bg-orange-400 rounded-full p-3 shadow-lg"
            >
              <span className="text-white text-xl">💰</span>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}