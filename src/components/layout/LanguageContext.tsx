import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Language = 'en' | 'hi' | 'te' | 'ta' | 'bn';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

const translations = {
  en: {
    // Header
    'nav.benefits': 'Benefits',
    'nav.howItWorks': 'How it Works',
    'nav.earnings': 'Earnings',
    'nav.contact': 'Contact',
    'nav.joinPartner': 'Join as Partner',
    
    // Hero
    'hero.badge': 'Made for Women Entrepreneurs',
    'hero.rating': '5.0 rating',
    'hero.title': 'Turn Your Kitchen Magic into',
    'hero.titleHighlight': 'Monthly Income',
    'hero.subtitle': 'Join thousands of successful women entrepreneurs who are earning ₹15,000-₹50,000+ monthly from their home kitchens. Share your delicious recipes with hungry families in your neighborhood.',
    'hero.startBusiness': 'Start Your Food Business',
    'hero.learnMore': 'Learn More',
    'hero.womenPartners': '15K+ Women Partners',
    'hero.avgIncrease': '₹35K Avg Monthly Income',
    'hero.happyCustomers': '2M+ Happy Families',
    'hero.monthlyEarnings': 'Monthly Earnings',
    
    // Benefits
    'benefits.badge': 'Why Choose RozoMeal',
    'benefits.title': 'Perfect for Busy Moms & Homemakers',
    'benefits.subtitle': 'Start your food business from home with zero investment. Work flexible hours while taking care of your family and earn extra income doing what you love - cooking!',
    'benefits.flexibleHours.title': 'Work When You Want',
    'benefits.flexibleHours.desc': 'Cook and sell when it suits your schedule. Perfect for moms balancing family time.',
    'benefits.homeKitchen.title': 'Start from Home Kitchen',
    'benefits.homeKitchen.desc': 'No need for expensive restaurant setup. Use your own kitchen to start earning.',
    'benefits.noInvestment.title': 'Zero Investment',
    'benefits.noInvestment.desc': 'Start your food business without any upfront costs or monthly fees.',
    'benefits.familyIncome.title': 'Support Your Family',
    'benefits.familyIncome.desc': 'Earn extra income to support your children\'s education and family needs.',
    'benefits.easyApp.title': 'Simple to Use',
    'benefits.easyApp.desc': 'Easy mobile app designed for homemakers. No technical knowledge required.',
    'benefits.womenSupport.title': 'Women Support Community',
    'benefits.womenSupport.desc': 'Join a supportive community of women entrepreneurs helping each other succeed.',
    'benefits.quickPayment.title': 'Weekly Payments',
    'benefits.quickPayment.desc': 'Get paid directly to your bank account every week. No waiting for months.',
    'benefits.localCustomers.title': 'Serve Your Neighbors',
    'benefits.localCustomers.desc': 'Build relationships with families in your area who love homemade food.',
    'benefits.testimonial': '"RozoMeal helped me become financially independent while staying home with my kids!"',
    'benefits.testimonialName': 'Priya Sharma',
    'benefits.testimonialRole': 'Mother & Home Chef, Delhi',
    'benefits.revenueIncrease': '250% Income Increase',
    'benefits.newCustomers': '150+ Regular Families',
    'benefits.rating': '4.9★ Customer Rating',
    'benefits.months': '8 Months Success',
    
    // How it Works
    'howItWorks.badge': 'Simple 3-Step Process',
    'howItWorks.title': 'Start Your Home Food Business',
    'howItWorks.subtitle': 'Getting started is easy! Follow these simple steps and begin earning from your kitchen skills within 24 hours.',
    'howItWorks.step1.title': 'Register & Set Menu',
    'howItWorks.step1.desc': 'Sign up with your phone number and add your special dishes with photos.',
    'howItWorks.step1.icon': '📱',
    'howItWorks.step2.title': 'Receive Orders',
    'howItWorks.step2.desc': 'Get order notifications and cook fresh meals for hungry families nearby.',
    'howItWorks.step2.icon': '👩‍🍳',
    'howItWorks.step3.title': 'Deliver & Earn',
    'howItWorks.step3.desc': 'Deliver to customers or let our delivery partners handle it. Get paid weekly.',
    'howItWorks.step3.icon': '💰',
    'howItWorks.requirements.title': 'What You Need to Start',
    'howItWorks.requirements.desc': 'We welcome all homemakers who love cooking! Here\'s what you need to start your food business journey.',
    'howItWorks.req1': 'Clean home kitchen and basic cooking skills',
    'howItWorks.req2': 'Smartphone to receive orders and update menu',
    'howItWorks.req3': 'Passion for cooking and serving families',
    'howItWorks.req4': '2-3 hours daily for cooking and orders',
    'howItWorks.req5': 'Basic packaging materials (we help you get started)',
    'howItWorks.startApplication': 'Start Your Journey',
    'howItWorks.appFeatures': 'Simple App Features',
    'howItWorks.feature1': 'Voice order notifications in your language',
    'howItWorks.feature2': 'Easy menu updates with photo guide',
    'howItWorks.feature3': 'Customer feedback and ratings',
    'howItWorks.feature4': 'Weekly earnings tracker',
    'howItWorks.feature5': 'Community support chat',
    
    // Earnings
    'earnings.badge': 'Income Potential',
    'earnings.title': 'See How Much You Can Earn',
    'earnings.subtitle': 'Our women partners are earning substantial monthly income from their home kitchens. Here\'s what homemakers like you are making with RozoMeal.',
    'earnings.beginner': 'Beginner (1-2 months)',
    'earnings.experienced': 'Experienced (3-6 months)',
    'earnings.expert': 'Expert (6+ months)',
    'earnings.orders': 'orders',
    'earnings.avgOrder': 'Average Order',
    'earnings.monthly': 'Monthly Earnings',
    'earnings.weeklyPayouts.title': 'Weekly Bank Transfer',
    'earnings.weeklyPayouts.desc': 'Money directly deposited to your account every Friday',
    'earnings.bonuses.title': 'Festival Bonuses',
    'earnings.bonuses.desc': 'Earn extra during festivals and special occasions',
    'earnings.peakHours.title': 'Lunch & Dinner Rush',
    'earnings.peakHours.desc': 'Higher earnings during meal times when demand is high',
    'earnings.loyalty.title': 'Regular Customer Bonus',
    'earnings.loyalty.desc': 'Get extra income for every repeat customer you serve',
    'earnings.calculator': 'Earnings Calculator',
    'earnings.ordersMonth': 'Orders/month',
    'earnings.avgOrderValue': 'Avg order value',
    'earnings.estimated': 'Estimated Monthly Income',
    'earnings.calculate': 'Calculate Your Income',
    'earnings.readyEarn.title': 'Ready to Start Earning?',
    'earnings.readyEarn.desc': 'Join thousands of successful women entrepreneurs and start growing your family income today.',
    'earnings.registerNow': 'Register Now',
    
    // Contact Form
    'contact.badge': 'Start Today',
    'contact.title': 'Ready to Start Your Food Business?',
    'contact.subtitle': 'Fill out this simple form and our women support team will call you within 2 hours to help you get started with your home food business.',
    'contact.formTitle': 'Home Chef Registration',
    'contact.formDesc': 'Tell us about yourself and we\'ll help you start earning.',
    'contact.yourName': 'Your Name',
    'contact.yourNamePlaceholder': 'Enter your full name',
    'contact.whatsapp': 'WhatsApp Number',
    'contact.whatsappPlaceholder': '+91 98765 43210',
    'contact.email': 'Email (Optional)',
    'contact.emailPlaceholder': 'your@email.com',
    'contact.city': 'Your City',
    'contact.selectCity': 'Select your city',
    'contact.mumbai': 'Mumbai',
    'contact.delhi': 'Delhi',
    'contact.bangalore': 'Bangalore',
    'contact.hyderabad': 'Hyderabad',
    'contact.pune': 'Pune',
    'contact.chennai': 'Chennai',
    'contact.kolkata': 'Kolkata',
    'contact.other': 'Other',
    'contact.cookingExp': 'Cooking Experience',
    'contact.selectExp': 'Select experience',
    'contact.beginner': 'Beginner (Love cooking for family)',
    'contact.intermediate': 'Good (Friends praise my cooking)',
    'contact.expert': 'Expert (Have catering experience)',
    'contact.speciality': 'Your Specialty Dishes',
    'contact.specialityPlaceholder': 'Tell us about your best dishes - North Indian, South Indian, Snacks, Sweets, etc.',
    'contact.timeAvailable': 'Time Available Daily',
    'contact.selectTime': 'Select time',
    'contact.time1': '2-3 hours',
    'contact.time2': '4-5 hours', 
    'contact.time3': '6+ hours',
    'contact.additionalInfo': 'Any Questions?',
    'contact.additionalInfoPlaceholder': 'Ask us anything about starting your food business from home...',
    'contact.submitApp': 'Start My Food Business',
    'contact.agreement': 'By submitting, you agree to receive calls/WhatsApp from our team.',
    'contact.getInTouch': 'Get Support',
    'contact.phone': 'Phone',
    'contact.email2': 'Email',
    'contact.address': 'Address',
    'contact.supportHours': 'Support Hours',
    'contact.womensHelpline': 'Women\'s Helpline',
    'contact.support247': '10 AM - 8 PM (Mon-Sat)',
    'contact.joinWomen': 'Join 15,000+ Women',
    'contact.joinDesc': 'Start your success story with RozoMeal today',
    
    // Footer
    'footer.stayUpdated': 'Stay Updated',
    'footer.newsletter': 'Get tips for growing your home food business and success stories from women entrepreneurs.',
    'footer.subscribe': 'Subscribe',
    'footer.emailPlaceholder': 'Enter your email',
    'footer.resources': 'Resources for Women',
    'footer.womenGuide': 'Women Entrepreneur Guide',
    'footer.homeKitchen': 'Home Kitchen Setup',
    'footer.recipeIdeas': 'Popular Recipe Ideas',
    'footer.pricing': 'Pricing & Earnings',
    'footer.success': 'Success Stories',
    'footer.tips': 'Business Tips',
    'footer.support': 'Support',
    'footer.helpCenter': 'Help Center',
    'footer.womenSupport': 'Women Support Team',
    'footer.technical': 'Technical Help',
    'footer.payment': 'Payment Support',
    'footer.training': 'Free Training',
    'footer.contactUs': 'Contact Us',
    'footer.contactInfo': 'Contact Information',
    'footer.womenHelpline': 'Women Helpline',
    'footer.emailSupport': 'Email Support',
    'footer.headquarters': 'Headquarters',
    'footer.mumbaiIndia': 'Mumbai, India',
    'footer.copyright': '© 2024 RozoMeal. Empowering women entrepreneurs.',
    'footer.privacy': 'Privacy Policy',
    'footer.terms': 'Terms of Service',
    'footer.women': 'Women Safety',
    'footer.agreement': 'Partner Agreement'
  },
  
  hi: {
    // Header
    'nav.benefits': 'फायदे',
    'nav.howItWorks': 'कैसे काम करता है',
    'nav.earnings': 'कमाई',
    'nav.contact': 'संपर्क',
    'nav.joinPartner': 'पार्टनर बनें',
    
    // Hero
    'hero.badge': 'महिला उद्यमियों के लिए बनाया गया',
    'hero.rating': '5.0 रेटिंग',
    'hero.title': 'अपनी रसोई के जादू को बनाएं',
    'hero.titleHighlight': 'मासिक आय',
    'hero.subtitle': 'हजारों सफल महिला उद्यमियों से जुड़ें जो अपनी घरेलू रसोई से ₹15,000-₹50,000+ मासिक कमा रही हैं। अपने पड़ोस के भूखे परिवारों के साथ अपनी स्वादिष्ट रेसिपी साझा करें।',
    'hero.startBusiness': 'अपना फूड बिजनेस शुरू करें',
    'hero.learnMore': 'और जानें',
    'hero.womenPartners': '15हजार+ महिला पार्टनर',
    'hero.avgIncrease': '₹35हजार औसत मासिक आय',
    'hero.happyCustomers': '20लाख+ खुश परिवार',
    'hero.monthlyEarnings': 'मासिक कमाई',
    
    // Benefits
    'benefits.badge': 'रोज़ोमील क्यों चुनें',
    'benefits.title': 'व्यस्त माताओं और गृहिणियों के लिए परफेक्ट',
    'benefits.subtitle': 'बिना किसी निवेश के घर से अपना फूड बिजनेस शुरू करें। अपने परिवार की देखभाल करते हुए लचीले घंटों में काम करें और अपने पसंदीदा काम - खाना बनाने से अतिरिक्त आय अर्जित करें!',
    'benefits.flexibleHours.title': 'जब चाहें काम करें',
    'benefits.flexibleHours.desc': 'अपनी सुविधा के अनुसार खाना बनाएं और बेचें। परिवारिक समय को संतुलित करने वाली माताओं के लिए परफेक्ट।',
    'benefits.homeKitchen.title': 'घर की रसोई से शुरुआत',
    'benefits.homeKitchen.desc': 'महंगे रेस्टोरेंट सेटअप की जरूरत नहीं। कमाई शुरू करने के लिए अपनी रसोई का उपयोग करें।',
    'benefits.noInvestment.title': 'जीरो निवेश',
    'benefits.noInvestment.desc': 'बिना किसी अग्रिम लागत या मासिक फीस के अपना फूड बिजनेस शुरू करें।',
    'benefits.familyIncome.title': 'अपने परिवार का सहारा बनें',
    'benefits.familyIncome.desc': 'अपने बच्चों की शिक्षा और पारिवारिक जरूरतों के लिए अतिरिक्त आय अर्जित करें।',
    'benefits.easyApp.title': 'इस्तेमाल में आसान',
    'benefits.easyApp.desc': 'गृहिणियों के लिए डिजाइन किया गया आसान मोबाइल ऐप। कोई तकनीकी ज्ञान की आवश्यकता नहीं।',
    'benefits.womenSupport.title': 'महिला सहायता समुदाय',
    'benefits.womenSupport.desc': 'महिला उद्यमियों के सहायक समुदाय से जुड़ें जो एक-दूसरे की सफलता में मदद करती हैं।',
    'benefits.quickPayment.title': 'साप्ताहिक भुगतान',
    'benefits.quickPayment.desc': 'हर सप्ताह सीधे अपने बैंक खाते में पैसा पाएं। महीनों इंतजार की जरूरत नहीं।',
    'benefits.localCustomers.title': 'अपने पड़ोसियों की सेवा करें',
    'benefits.localCustomers.desc': 'अपने क्षेत्र के उन परिवारों के साथ रिश्ते बनाएं जो घर का खाना पसंद करते हैं।',
    'benefits.testimonial': '"रोज़ोमील ने मुझे अपने बच्चों के साथ घर रहते हुए आर्थिक रूप से स्वतंत्र बनने में मदद की!"',
    'benefits.testimonialName': 'प्रिया शर्मा',
    'benefits.testimonialRole': 'माता और होम शेफ, दिल्ली',
    'benefits.revenueIncrease': '250% आय वृ���्धि',
    'benefits.newCustomers': '150+ नियमित परिवार',
    'benefits.rating': '4.9★ कस्टमर रेटिंग',
    'benefits.months': '8 महीने की सफलता'
  },
  
  te: {
    // Basic Telugu translations
    'nav.benefits': 'ప్రయోజనాలు',
    'nav.howItWorks': 'ఎలా పనిచేస్తుంది',
    'nav.earnings': 'ఆదాయం',
    'nav.contact': 'సంప్రదించండి',
    'nav.joinPartner': 'భాగస్వామిగా చేరండి',
    'hero.title': 'మీ వంటగది మాయాన్ని మార్చండి',
    'hero.titleHighlight': 'నెలవారీ ఆదాయం',
    'hero.startBusiness': 'మీ ఆహార వ్యాపారం ప్రారంభించండి'
  },
  
  ta: {
    // Basic Tamil translations  
    'nav.benefits': 'பலன்கள்',
    'nav.howItWorks': 'எப்படி வேலை செய்கிறது',
    'nav.earnings': 'வருமானம்',
    'nav.contact': 'தொடர்பு',
    'nav.joinPartner': 'பங்குதாரராக சேரவும்',
    'hero.title': 'உங்கள் சமையலறை மந்திரத்தை மாற்றுங்கள்',
    'hero.titleHighlight': 'மாதாந்திர வருமானம்',
    'hero.startBusiness': 'உங்கள் உணவு வணிகத்தைத் தொடங்குங்கள்'
  },
  
  bn: {
    // Basic Bengali translations
    'nav.benefits': 'সুবিধা',
    'nav.howItWorks': 'কিভাবে কাজ করে',
    'nav.earnings': 'আয়',
    'nav.contact': 'যোগাযোগ',
    'nav.joinPartner': 'পার্টনার হিসেবে যোগ দিন',
    'hero.title': 'আপনার রান্নাঘরের জাদু পরিণত করুন',
    'hero.titleHighlight': 'মাসিক আয়ে',
    'hero.startBusiness': 'আপনার খাদ্য ব্যবসা শুরু করুন'
  }
};

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations.en] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};