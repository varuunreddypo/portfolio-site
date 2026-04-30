import Navbar from "@/components/nav/Navbar";
import PokemonWorld from "@/components/pokemon/PokemonWorld";
import Hero from "@/components/hero/Hero";
import WorkSection from "@/components/work/WorkSection";
import VisitorGallery from "@/components/gallery/VisitorGallery";
import Footer from "@/components/ui/Footer";

export default function Home() {
  return (
    <main>
      <Navbar />
      <PokemonWorld />
      <Hero />
      <WorkSection />
      <VisitorGallery />
      <Footer />
    </main>
  );
}
