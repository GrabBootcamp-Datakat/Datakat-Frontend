import { LayoutScroll } from '@/components/common';
import { IntroductionSection, FeaturesSection } from '@/components/home';

export const metadata = {
  title: 'Log Metrics Home',
  description: 'A home page for Log Metrics',
};

export default function HomePage() {
  return (
    <LayoutScroll>
      <IntroductionSection />
      <FeaturesSection />
    </LayoutScroll>
  );
}
