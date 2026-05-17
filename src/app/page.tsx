import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Hero from '@/components/home/Hero';
import FeaturedCities from '@/components/home/FeaturedCities';
import HowItWorks from '@/components/home/HowItWorks';
import Testimonials from '@/components/home/Testimonials';
import EmailWaitlist from '@/components/home/EmailWaitlist';

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <FeaturedCities />
        <HowItWorks />
        <Testimonials />
        <div id="waitlist">
          <EmailWaitlist />
        </div>
      </main>
      <Footer />
    </>
  );
}
