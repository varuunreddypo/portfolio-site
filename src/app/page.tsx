import Navbar from "@/components/nav/Navbar";
import PokemonWorld from "@/components/pokemon/PokemonWorld";
import Hero from "@/components/hero/Hero";
import WorkSection from "@/components/work/WorkSection";
import VisitorGallery from "@/components/gallery/VisitorGallery";
import Footer from "@/components/ui/Footer";
import PageTransition from "@/components/ui/PageTransition";

export default function Home() {
  return (
    <PageTransition>
      <main>
        <Navbar />
        <Hero />
        <WorkSection />
        <PokemonWorld />
        <VisitorGallery />
        <Footer />
      </main>
    </PageTransition>
  );
}
