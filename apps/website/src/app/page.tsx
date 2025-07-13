import { Metadata } from 'next';
import { HeroSection } from '@/components/home/hero-section';
import { FeaturesSection } from '@/components/home/features-section';
import { StatsSection } from '@/components/home/stats-section';
import { RecentlyAddedSection } from '@/components/home/recently-added-section';
import { TestimonialsSection } from '@/components/home/testimonials-section';

export const metadata: Metadata = {
  title: 'EGW Writings - Digital Research Platform',
  description: 'Search, study, and research Ellen G. White writings with advanced tools. Access the complete digital library with powerful search, PDF generation, and scholarly research features.',
  openGraph: {
    title: 'EGW Writings - Digital Research Platform',
    description: 'Search, study, and research Ellen G. White writings with advanced tools.',
    images: ['/og-home.jpg'],
  },
};

export default function HomePage() {
  return (
    <div className="space-y-0">
      <HeroSection />
      <FeaturesSection />
      <StatsSection />
      <RecentlyAddedSection />
      <TestimonialsSection />
    </div>
  );
}