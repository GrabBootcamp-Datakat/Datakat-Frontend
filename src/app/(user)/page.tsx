import LayoutScroll from '@/components/common/LayoutScroll';
import IntroductionSection from '@/components/home/IntroductionSection';
import FeaturesSection from '@/components/home/FeaturesSection';

export default function HomePage() {
  return (
    <LayoutScroll>
      <IntroductionSection />
      <FeaturesSection />
    </LayoutScroll>
  );
}
