import { Card, CardContent } from "../ui/card";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { motion } from "motion/react";
import { Star, Heart } from "lucide-react";
import { useState, useEffect } from "react";

export function FoodPartnersCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const partners = [
    {
      id: 1,
      name: "Sunita's Kitchen",
      chef: "Sunita Devi",
      location: "Mumbai",
      specialty: "North Indian Thali",
      rating: 4.9,
      orders: "500+ orders",
      image: "https://images.unsplash.com/photo-1723937188995-beac88d36998?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBmb29kJTIwdmFyaWV0aWVzJTIwdGhhbGl8ZW58MXx8fHwxNzU3MTY4MzE3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      earnings: "₹42,000/month"
    },
    {
      id: 2,
      name: "Mama's Snacks",
      chef: "Rekha Sharma",
      location: "Delhi",
      specialty: "Street Food & Chaat",
      rating: 4.8,
      orders: "300+ orders",
      image: "https://images.unsplash.com/photo-1743517894265-c86ab035adef?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBzdHJlZXQlMjBmb29kJTIwc25hY2tzfGVufDF8fHx8MTc1NzA5NDIwNXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      earnings: "₹28,000/month"
    },
    {
      id: 3,
      name: "Sweet Traditions",
      chef: "Meera Patel",
      location: "Bangalore",
      specialty: "Traditional Sweets",
      rating: 4.9,
      orders: "400+ orders",
      image: "https://images.unsplash.com/photo-1635564981692-857482d9325f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmFkaXRpb25hbCUyMHN3ZWV0cyUyMGRlc3NlcnRzfGVufDF8fHx8MTc1NzE2ODMyNHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      earnings: "₹38,000/month"
    },
    {
      id: 4,
      name: "Healthy Home Kitchen",
      chef: "Priya Singh",
      location: "Hyderabad",
      specialty: "Healthy Meals",
      rating: 4.7,
      orders: "250+ orders",
      image: "https://images.unsplash.com/photo-1612177434015-83ee396a236d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob21lbWFkZSUyMGZvb2QlMjBidXNpbmVzcyUyMHdvbWFufGVufDF8fHx8MTc1NzE2ODMxOXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      earnings: "₹32,000/month"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % partners.length);
    }, 4000);
    
    return () => clearInterval(timer);
  }, [partners.length]);

  return (
    <section className="py-16 bg-gradient-to-r from-pink-50 to-orange-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-block bg-pink-100 text-pink-600 px-4 py-2 rounded-full text-sm font-medium mb-4"
          >
            💕 Success Stories from Our Women Partners
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4"
          >
            Real Women, Real Success
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-gray-600 max-w-2xl mx-auto"
          >
            Meet amazing women who transformed their cooking passion into thriving businesses
          </motion.p>
        </div>

        {/* Carousel */}
        <div className="relative overflow-hidden">
          <motion.div
            className="flex transition-transform duration-500"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {partners.map((partner, index) => (
              <div key={partner.id} className="w-full flex-shrink-0 px-4">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="max-w-4xl mx-auto border-0 shadow-xl bg-white/80 backdrop-blur-sm">
                    <CardContent className="p-0">
                      <div className="grid lg:grid-cols-2 gap-0">
                        {/* Image */}
                        <div className="relative h-80 lg:h-96">
                          <ImageWithFallback
                            src={partner.image}
                            alt={partner.specialty}
                            className="w-full h-full object-cover rounded-l-lg"
                          />
                          <div className="absolute top-4 left-4">
                            <div className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center space-x-1">
                              <Heart className="h-4 w-4 text-red-500 fill-current" />
                              <span className="text-sm font-medium text-gray-900">
                                {partner.orders}
                              </span>
                            </div>
                          </div>
                          <div className="absolute bottom-4 right-4">
                            <div className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                              {partner.earnings}
                            </div>
                          </div>
                        </div>

                        {/* Content */}
                        <div className="p-8 flex flex-col justify-center">
                          <div className="flex items-center space-x-2 mb-4">
                            <div className="flex items-center space-x-1">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 ${
                                    i < Math.floor(partner.rating)
                                      ? 'text-yellow-400 fill-current'
                                      : 'text-gray-300'
                                  }`}
                                />
                              ))}
                              <span className="text-sm text-gray-600 ml-1">
                                {partner.rating}
                              </span>
                            </div>
                            <span className="text-sm text-gray-500">•</span>
                            <span className="text-sm text-gray-600">{partner.location}</span>
                          </div>

                          <h3 className="text-2xl font-bold text-gray-900 mb-2">
                            {partner.name}
                          </h3>
                          
                          <p className="text-gray-600 mb-4">
                            by <span className="font-semibold">{partner.chef}</span>
                          </p>

                          <div className="bg-orange-50 rounded-lg p-4 mb-6">
                            <p className="text-orange-800 font-medium mb-1">Specialty:</p>
                            <p className="text-orange-700">{partner.specialty}</p>
                          </div>

                          <div className="grid grid-cols-2 gap-4 text-center">
                            <div className="bg-pink-50 rounded-lg p-3">
                              <p className="text-2xl font-bold text-pink-600">
                                {partner.orders.split('+')[0]}+
                              </p>
                              <p className="text-sm text-pink-700">Happy Families</p>
                            </div>
                            <div className="bg-green-50 rounded-lg p-3">
                              <p className="text-2xl font-bold text-green-600">
                                {partner.earnings.split('/')[0]}
                              </p>
                              <p className="text-sm text-green-700">Monthly Income</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Indicators */}
        <div className="flex justify-center space-x-2 mt-8">
          {partners.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-3 h-3 rounded-full transition-colors duration-300 ${
                index === currentIndex
                  ? 'bg-orange-500'
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
            />
          ))}
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-12 max-w-4xl mx-auto"
        >
          <div className="text-center">
            <div className="text-3xl font-bold text-pink-600 mb-1">15,000+</div>
            <div className="text-sm text-gray-600">Women Partners</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-600 mb-1">₹35K</div>
            <div className="text-sm text-gray-600">Avg Monthly Income</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 mb-1">2M+</div>
            <div className="text-sm text-gray-600">Orders Delivered</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600 mb-1">4.8★</div>
            <div className="text-sm text-gray-600">Average Rating</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}