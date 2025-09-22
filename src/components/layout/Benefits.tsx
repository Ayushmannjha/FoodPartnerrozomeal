import { Card, CardContent } from "../ui/card";
import { 
  Clock, 
  Home, 
  DollarSign, 
  Heart, 
  Smartphone, 
  Users,
  Zap,
  MapPin
} from "lucide-react";
import { motion } from "motion/react";
import { useLanguage } from "./LanguageContext";

export function Benefits() {
  const { t } = useLanguage();
  
  const benefits = [
    {
      icon: Clock,
      title: t('benefits.flexibleHours.title'),
      description: t('benefits.flexibleHours.desc'),
      color: "text-pink-600",
      bgColor: "bg-pink-100"
    },
    {
      icon: Home,
      title: t('benefits.homeKitchen.title'),
      description: t('benefits.homeKitchen.desc'),
      color: "text-purple-600",
      bgColor: "bg-purple-100"
    },
    {
      icon: DollarSign,
      title: t('benefits.noInvestment.title'),
      description: t('benefits.noInvestment.desc'),
      color: "text-green-600",
      bgColor: "bg-green-100"
    },
    {
      icon: Heart,
      title: t('benefits.familyIncome.title'),
      description: t('benefits.familyIncome.desc'),
      color: "text-red-600",
      bgColor: "bg-red-100"
    },
    {
      icon: Smartphone,
      title: t('benefits.easyApp.title'),
      description: t('benefits.easyApp.desc'),
      color: "text-blue-600",
      bgColor: "bg-blue-100"
    },
    {
      icon: Users,
      title: t('benefits.womenSupport.title'),
      description: t('benefits.womenSupport.desc'),
      color: "text-orange-600",
      bgColor: "bg-orange-100"
    },
    {
      icon: Zap,
      title: t('benefits.quickPayment.title'),
      description: t('benefits.quickPayment.desc'),
      color: "text-yellow-600",
      bgColor: "bg-yellow-100"
    },
    {
      icon: MapPin,
      title: t('benefits.localCustomers.title'),
      description: t('benefits.localCustomers.desc'),
      color: "text-indigo-600",
      bgColor: "bg-indigo-100"
    }
  ];

  return (
    <section id="benefits" className="py-20 bg-gradient-to-br from-white to-pink-50">
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
            💕 {t('benefits.badge')}
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            {t('benefits.title')}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t('benefits.subtitle')}
          </p>
        </motion.div>

        {/* Benefits Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {benefits.map((benefit, index) => {
            const IconComponent = benefit.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 h-full bg-white/80 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ duration: 0.3 }}
                      className={`${benefit.bgColor} ${benefit.color} w-12 h-12 rounded-lg flex items-center justify-center mb-4`}
                    >
                      <IconComponent className="h-6 w-6" />
                    </motion.div>
                    <h3 className="font-semibold text-gray-900 mb-2">
                      {benefit.title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {benefit.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Success Story */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-gradient-to-r from-pink-500 via-orange-500 to-red-500 rounded-2xl p-8 text-white shadow-2xl"
        >
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h3 className="text-2xl font-bold mb-4">
                {t('benefits.testimonial')}
              </h3>
              <p className="text-lg opacity-90 mb-6">
                "घर से काम करते हुए मैं अपने बच्चों का ध्यान रख सकती हूं और साथ ही अच्छी कमाई भी कर रही हूं। रोज़ोमील ने मेरी जिंदगी बदल दी!"
              </p>
              <div className="flex items-center space-x-4">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center"
                >
                  <span className="text-white font-bold">PS</span>
                </motion.div>
                <div>
                  <p className="font-semibold">{t('benefits.testimonialName')}</p>
                  <p className="text-sm opacity-80">{t('benefits.testimonialRole')}</p>
                </div>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="grid grid-cols-2 gap-4 text-center"
            >
              <motion.div whileHover={{ scale: 1.05 }}>
                <p className="text-3xl font-bold">{t('benefits.revenueIncrease')}</p>
                <p className="text-sm opacity-80">{t('benefits.revenueIncrease')}</p>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }}>
                <p className="text-3xl font-bold">{t('benefits.newCustomers')}</p>
                <p className="text-sm opacity-80">{t('benefits.newCustomers')}</p>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }}>
                <p className="text-3xl font-bold">{t('benefits.rating')}</p>
                <p className="text-sm opacity-80">{t('benefits.rating')}</p>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }}>
                <p className="text-3xl font-bold">{t('benefits.months')}</p>
                <p className="text-sm opacity-80">{t('benefits.months')}</p>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}