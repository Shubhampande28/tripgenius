import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Privacy Policy — TripGenius',
  description: 'Read the TripGenius privacy policy. Learn how we collect, use, and protect your personal data on tripgenius.in.',
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

export default function PrivacyPolicyPage() {
  return (
    <>
      <Navbar />
      <main className="bg-dark min-h-screen">

        <div className="relative overflow-hidden pt-28 pb-12 border-b border-border bg-surface">
          <div className="relative max-w-2xl mx-auto px-4 sm:px-6 text-center">
            <p className="text-xs font-bold uppercase tracking-widest text-accent mb-4">Legal</p>
            <h1 className="font-heading text-4xl sm:text-5xl font-semibold text-primary-text">Privacy Policy</h1>
            <p className="mt-3 text-muted text-sm">Last updated: {LAST_UPDATED}</p>
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-14">

          <p className="text-muted text-sm leading-relaxed mb-10">
            TripGenius (&ldquo;we&rdquo;, &ldquo;our&rdquo;, or &ldquo;us&rdquo;) operates the website <strong className="text-primary-text">tripgenius.in</strong>. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website. Please read this policy carefully.
          </p>

          <Section title="1. Information We Collect">
            <p><strong className="text-primary-text">Information you provide:</strong> When you subscribe to our newsletter or contact us, we collect your name and email address.</p>
            <p><strong className="text-primary-text">Automatically collected information:</strong> When you visit TripGenius, we may automatically collect certain information about your device, including your browser type, operating system, IP address, pages viewed, and time spent on those pages.</p>
            <p><strong className="text-primary-text">Cookies and tracking technologies:</strong> We use cookies and similar tracking technologies to track activity on our site and hold certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.</p>
          </Section>

          <Section title="2. How We Use Your Information">
            <p>We use the information we collect to:</p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Provide, operate, and improve the TripGenius website</li>
              <li>Send you our newsletter if you have subscribed (you may unsubscribe at any time)</li>
              <li>Respond to your enquiries and support requests</li>
              <li>Monitor and analyse usage patterns to improve user experience</li>
              <li>Comply with legal obligations</li>
            </ul>
          </Section>

          <Section title="3. Google AdSense and Advertising">
            <p>TripGenius uses <strong className="text-primary-text">Google AdSense</strong> to display advertisements on our website. Google AdSense uses cookies to serve ads based on a user&apos;s prior visits to our website and other sites on the internet.</p>
            <p>Google&apos;s use of advertising cookies enables it and its partners to serve ads to our users based on their visit to our site and/or other sites on the internet.</p>
            <p>You may opt out of personalised advertising by visiting <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">Google Ads Settings</a>. Alternatively, you can opt out of a third-party vendor&apos;s use of cookies by visiting <a href="http://www.networkadvertising.org/managing/opt_out.asp" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">Network Advertising Initiative opt-out page</a>.</p>
          </Section>

          <Section title="4. Third-Party Services">
            <p>Our website may contain links to third-party websites including hotels, airlines, and booking platforms. We have no control over the content or privacy practices of those sites and are not responsible for their privacy policies.</p>
            <p>We may use third-party service providers such as analytics providers (Google Analytics) to help us understand how our website is used. These third parties have their own privacy policies.</p>
          </Section>

          <Section title="5. Data Retention">
            <p>We retain your personal information only for as long as necessary to fulfil the purposes for which it was collected, including to satisfy legal, accounting, or reporting requirements. Newsletter subscribers&apos; email addresses are retained until you unsubscribe.</p>
          </Section>

          <Section title="6. Your Rights">
            <p>Depending on your location, you may have the following rights regarding your personal data:</p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>The right to access the personal data we hold about you</li>
              <li>The right to request correction of inaccurate data</li>
              <li>The right to request deletion of your data</li>
              <li>The right to opt out of marketing communications at any time</li>
              <li>The right to lodge a complaint with a data protection authority</li>
            </ul>
            <p>To exercise any of these rights, please contact us at <a href="mailto:hello@tripgenius.in" className="text-accent hover:underline">hello@tripgenius.in</a>.</p>
          </Section>

          <Section title="7. Children's Privacy">
            <p>TripGenius is not directed at children under the age of 13. We do not knowingly collect personal information from children. If you are a parent or guardian and believe your child has provided us with personal data, please contact us and we will take steps to delete such information.</p>
          </Section>

          <Section title="8. Changes to This Policy">
            <p>We may update this Privacy Policy from time to time. We will notify you of significant changes by updating the &ldquo;Last updated&rdquo; date at the top of this page. We encourage you to review this policy periodically.</p>
          </Section>

          <Section title="9. Contact Us">
            <p>If you have any questions about this Privacy Policy, please contact us:</p>
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
