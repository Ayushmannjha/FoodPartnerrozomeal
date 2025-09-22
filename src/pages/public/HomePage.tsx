import { Header } from '../../components/layout/Header';
import { Hero } from '../../components/layout/Hero';
import { Benefits } from '../../components/layout/Benefits';
import { Earnings } from '../../components/layout/Earnings';
import { HowItWorks } from '../../components/layout/HowItWorks';
import { FoodPartnersCarousel } from '../../components/layout/FoodPartnersCarousel';
import { ContactForm } from '../../components/layout/ContactForm';
import { Footer } from '../../components/layout/Footer';

export function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <Hero />
      <Benefits />
      <Earnings />
      <HowItWorks />
      <FoodPartnersCarousel />
      <ContactForm />
      <Footer />
    </div>
  );
}
