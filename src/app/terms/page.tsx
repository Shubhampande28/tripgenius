import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Terms of Service — TripGenius',
  description: 'Read the TripGenius terms of service. By using tripgenius.in, you agree to these terms.',
};

const LAST_UPDATED = 'May 30, 2025';

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-10">
      <h2 className="font-heading text-xl font-semibold text-primary-text mb-3">{title}</h2>
      <div className="text-muted text-sm leading-relaxed space-y-3">{children}</div>
    </section>
  );
}

export default function TermsPage() {
  return (
    <>
      <Navbar />
      <main className="bg-dark min-h-screen">

        <div className="relative overflow-hidden pt-28 pb-12 border-b border-border bg-surface">
          <div className="relative max-w-2xl mx-auto px-4 sm:px-6 text-center">
            <p className="text-xs font-bold uppercase tracking-widest text-accent mb-4">Legal</p>
            <h1 className="font-heading text-4xl sm:text-5xl font-semibold text-primary-text">Terms of Service</h1>
            <p className="mt-3 text-muted text-sm">Last updated: {LAST_UPDATED}</p>
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-14">

          <p className="text-muted text-sm leading-relaxed mb-10">
            Please read these Terms of Service (&ldquo;Terms&rdquo;) carefully before using <strong className="text-primary-text">tripgenius.in</strong> (the &ldquo;Service&rdquo;) operated by TripGenius (&ldquo;we&rdquo;, &ldquo;our&rdquo;, or &ldquo;us&rdquo;). By accessing or using the Service, you agree to be bound by these Terms.
          </p>

          <Section title="1. Acceptance of Terms">
            <p>By accessing and using TripGenius, you accept and agree to be bound by these Terms of Service and our Privacy Policy. If you do not agree to these terms, please do not use our website.</p>
          </Section>

          <Section title="2. Use of the Service">
            <p>TripGenius provides free travel guides and information for personal, non-commercial use. You may:</p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Browse and read our travel guides</li>
              <li>Share links to our content</li>
              <li>Subscribe to our newsletter</li>
            </ul>
            <p className="mt-3">You may not:</p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Reproduce, distribute, or republish our content without written permission</li>
              <li>Use the Service for any unlawful purpose</li>
              <li>Attempt to interfere with the proper functioning of the website</li>
              <li>Scrape, crawl, or systematically download content from the website</li>
            </ul>
          </Section>

          <Section title="3. Content Accuracy">
            <p>TripGenius strives to provide accurate and up-to-date travel information. However, travel conditions, prices, visa requirements, and local regulations change frequently. We strongly recommend verifying all critical information (including visa requirements, entry conditions, and costs) with official government and local sources before travelling.</p>
            <p>We are not liable for any loss, damage, or inconvenience caused by reliance on information published on TripGenius.</p>
          </Section>

          <Section title="4. Affiliate Links and Advertising">
            <p>TripGenius may contain affiliate links to hotels, tours, and other travel services. If you click on an affiliate link and make a purchase, we may receive a small commission at no extra cost to you. This helps us keep the website free.</p>
            <p>We also display advertisements through Google AdSense and other advertising networks. The presence of an advertisement does not constitute an endorsement of the product or service advertised.</p>
            <p>All affiliate relationships and sponsored content are disclosed in accordance with applicable regulations.</p>
          </Section>

          <Section title="5. Third-Party Links">
            <p>Our Service may contain links to third-party websites. These links are provided for your convenience only. We have no control over the content of those sites and accept no responsibility for them or for any loss or damage that may arise from your use of them.</p>
          </Section>

          <Section title="6. Intellectual Property">
            <p>The TripGenius name, logo, website design, and original content are the intellectual property of TripGenius and are protected by applicable copyright and trademark laws. You may not use our brand or content without our express written permission.</p>
            <p>City photographs are sourced from Unsplash and are used in accordance with the Unsplash License.</p>
          </Section>

          <Section title="7. Disclaimer of Warranties">
            <p>The Service is provided on an &ldquo;as is&rdquo; and &ldquo;as available&rdquo; basis without any warranties of any kind, either express or implied, including but not limited to implied warranties of merchantability, fitness for a particular purpose, or non-infringement.</p>
          </Section>

          <Section title="8. Limitation of Liability">
            <p>To the fullest extent permitted by law, TripGenius shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of, or inability to use, the Service — including but not limited to travel disruptions, financial losses, or personal injury arising from reliance on our content.</p>
          </Section>

          <Section title="9. Changes to These Terms">
            <p>We reserve the right to modify these Terms at any time. We will indicate the date of the most recent revision at the top of this page. Your continued use of the Service after any changes constitutes your acceptance of the new Terms.</p>
          </Section>

          <Section title="10. Governing Law">
            <p>These Terms shall be governed by and construed in accordance with the laws of India. Any disputes arising in connection with these Terms shall be subject to the exclusive jurisdiction of the courts of India.</p>
          </Section>

          <Section title="11. Contact Us">
            <p>If you have any questions about these Terms, please contact us:</p>
            <ul className="list-none space-y-1 ml-2">
              <li><strong className="text-primary-text">Email:</strong> <a href="mailto:hello@tripgenius.in" className="text-accent hover:underline">hello@tripgenius.in</a></li>
              <li><strong className="text-primary-text">Website:</strong> <a href="https://tripgenius.in/contact" className="text-accent hover:underline">tripgenius.in/contact</a></li>
            </ul>
          </Section>

        </div>
      </main>
      <Footer />
    </>
  );
}
