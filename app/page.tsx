import SmoothScrollProvider from '@/components/providers/SmoothScrollProvider';
import CinematicScroll from '@/components/providers/CinematicScroll';
import ScrollProgress from '@/components/ui/ScrollProgress';
import AudioFeedback from '@/components/ui/AudioFeedback';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import HeroSection from '@/components/sections/HeroSection';
import MarqueeTicker from '@/components/sections/MarqueeTicker';
import AboutSection from '@/components/sections/AboutSection';
import BusinessUnitsSection from '@/components/sections/BusinessUnitsSection';
import IndustriesSection from '@/components/sections/IndustriesSection';
import ProjectsSection from '@/components/sections/ProjectsSection';
import LeadershipSection from '@/components/sections/LeadershipSection';
import SustainabilitySection from '@/components/sections/SustainabilitySection';
import ContactSection from '@/components/sections/ContactSection';
import { CinematicWorld, MagneticCursor } from '@/components/canvas/LazyCanvases';

export default function Home() {
  return (
    <SmoothScrollProvider>
      <ScrollProgress />
      <MagneticCursor />
      <AudioFeedback />
      {/* Full-Screen Continuous 3D WebGL Universe */}
      <CinematicWorld />

      <Navbar />
      <main className="relative z-10">
        <HeroSection />
        <MarqueeTicker />
        <AboutSection />
        <BusinessUnitsSection />
        <IndustriesSection />
        <ProjectsSection />
        <LeadershipSection />
        <SustainabilitySection />
        <ContactSection />
      </main>
      <Footer />
      <CinematicScroll />

      {/* Film grain over the whole frame, DOM included */}
      <div className="cinematic-grain" aria-hidden />
    </SmoothScrollProvider>
  );
}
