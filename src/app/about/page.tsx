import Navbar from "@/components/nav/Navbar";
import Footer from "@/components/ui/Footer";
import PageTransition from "@/components/ui/PageTransition";
import AboutCard from "@/components/about/AboutCard";

export default function About() {
  return (
    <PageTransition>
      <main>
        <Navbar />
        <AboutCard />
        <Footer />
      </main>
    </PageTransition>
  );
}
