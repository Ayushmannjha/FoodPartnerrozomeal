import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { 
  TrendingUp, 
  DollarSign, 
  Clock, 
  Target,
  Calculator,
  ArrowRight,
  Gift
} from "lucide-react";
import { motion } from "motion/react";
import { useLanguage } from "./LanguageContext";
import { useState } from "react";

export function Earnings() {
  const { t } = useLanguage();
  const [calculatorOrders, setCalculatorOrders] = useState(120);
  const [calculatorOrderValue, setCalculatorOrderValue] = useState(280);
  
  const earningsData = [
    {
      category: t('earnings.beginner'),
      orders: "30-60",
      avgOrder: "₹220",
      monthly: "₹18,000",
      commission: "18%",
      color: "bg-pink-500"
    },
    {
      category: t('earnings.experienced'), 
      orders: "80-150",
      avgOrder: "₹280",
      monthly: "₹32,000",
      commission: "15%",
      color: "bg-orange-500"
    },
    {
      category: t('earnings.expert'),
      orders: "180-300",
      avgOrder: "₹350",
      monthly: "₹55,000",
      commission: "12%",
      color: "bg-green-500"
    }
  ];

  const benefits = [
    {
      icon: DollarSign,
      title: t('earnings.weeklyPayouts.title'),
      description: t('earnings.weeklyPayouts.desc')
    },
    {
      icon: Gift,
      title: t('earnings.bonuses.title'),
      description: t('earnings.bonuses.desc')
    },
    {
      icon: Clock,
      title: t('earnings.peakHours.title'),
      description: t('earnings.peakHours.desc')
    },
    {
      icon: Target,
      title: t('earnings.loyalty.title'),
      description: t('earnings.loyalty.desc')
    }
  ];

  const calculateEarnings = () => {
    const monthlyRevenue = calculatorOrders * calculatorOrderValue;
    const commission = 0.15; // 15% average commission
    return Math.round(monthlyRevenue * (1 - commission));
  };

  const scrollToContact = () => {
    const element = document.getElementById('contact');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="earnings" className="py-20 bg-gradient-to-br from-green-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-block bg-green-100 text-green-600 px-4 py-2 rounded-full text-sm font-medium mb-4">
            💰 {t('earnings.badge')}
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            {t('earnings.title')}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t('earnings.subtitle')}
          </p>
        </motion.div>

        {/* Earnings Tiers */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {earningsData.map((tier, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              whileHover={{ y: -5 }}
            >
              <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm">
                <CardHeader className="text-center pb-4">
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 10 }}
                    className={`${tier.color} w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg`}
                  >
                    <Calculator className="h-8 w-8 text-white" />
                  </motion.div>
                  <CardTitle className="text-xl">{tier.category}</CardTitle>
                  <p className="text-sm text-gray-600">{tier.orders} {t('earnings.orders')}</p>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-600">{t('earnings.avgOrder')}</p>
                      <p className="text-2xl font-bold text-gray-900">{tier.avgOrder}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">{t('earnings.monthly')}</p>
                      <motion.p
                        whileHover={{ scale: 1.1 }}
                        className="text-3xl font-bold text-green-600"
                      >
                        {tier.monthly}
                      </motion.p>
                    </div>
                
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Additional Benefits */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="text-3xl font-bold text-gray-900 mb-6">
              More Ways to Earn
            </h3>
            <p className="text-lg text-gray-600 mb-8">
              Beyond regular orders, we offer multiple opportunities for homemakers 
              to boost their earnings and grow their family income.
            </p>

            <div className="space-y-6">
              {benefits.map((benefit, index) => {
                const IconComponent = benefit.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    whileHover={{ x: 5 }}
                    className="flex items-start space-x-4"
                  >
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      className="bg-gradient-to-r from-pink-100 to-orange-100 text-pink-600 w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
                    >
                      <IconComponent className="h-6 w-6" />
                    </motion.div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">
                        {benefit.title}
                      </h4>
                      <p className="text-gray-600">{benefit.description}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-gradient-to-br from-pink-500 via-orange-500 to-green-500 rounded-2xl p-8 text-white shadow-2xl"
          >
            <div className="text-center">
              <motion.h4
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="text-2xl font-bold mb-6"
              >
                {t('earnings.calculator')}
              </motion.h4>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-6">
                <div className="grid grid-cols-2 gap-4 text-center mb-4">
                  <div>
                    <input
                      type="range"
                      min="50"
                      max="300"
                      value={calculatorOrders}
                      onChange={(e) => setCalculatorOrders(Number(e.target.value))}
                      className="w-full mb-2"
                    />
                    <motion.p
                      key={calculatorOrders}
                      initial={{ scale: 1.2 }}
                      animate={{ scale: 1 }}
                      className="text-2xl font-bold"
                    >
                      {calculatorOrders}
                    </motion.p>
                    <p className="text-sm opacity-80">{t('earnings.ordersMonth')}</p>
                  </div>
                  <div>
                    <input
                      type="range"
                      min="150"
                      max="500"
                      value={calculatorOrderValue}
                      onChange={(e) => setCalculatorOrderValue(Number(e.target.value))}
                      className="w-full mb-2"
                    />
                    <motion.p
                      key={calculatorOrderValue}
                      initial={{ scale: 1.2 }}
                      animate={{ scale: 1 }}
                      className="text-2xl font-bold"
                    >
                      ₹{calculatorOrderValue}
                    </motion.p>
                    <p className="text-sm opacity-80">{t('earnings.avgOrderValue')}</p>
                  </div>
                </div>
                
                <div className="border-t border-white/20 mt-4 pt-4">
                  <p className="text-sm opacity-80">{t('earnings.estimated')}</p>
                  <motion.p
                    key={calculateEarnings()}
                    initial={{ scale: 1.3, color: '#FFF' }}
                    animate={{ scale: 1, color: '#FFF' }}
                    transition={{ duration: 0.3 }}
                    className="text-4xl font-bold"
                  >
                    ₹{calculateEarnings().toLocaleString()}
                  </motion.p>
                </div>
              </div>

              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  onClick={scrollToContact}
                  className="bg-white text-pink-600 hover:bg-gray-100 w-full shadow-lg"
                >
                  {t('earnings.calculate')}
                  <Calculator className="ml-2 h-5 w-5" />
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mt-16"
        >
          <div className="bg-gradient-to-r from-pink-50 via-orange-50 to-yellow-50 rounded-2xl p-8 shadow-lg">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              {t('earnings.readyEarn.title')}
            </h3>
            <p className="text-lg text-gray-600 mb-6">
              {t('earnings.readyEarn.desc')}
            </p>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={scrollToContact}
                className="bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 text-white px-8 py-3 shadow-lg"
              >
                {t('earnings.registerNow')}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}