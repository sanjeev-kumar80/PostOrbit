
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

import Hero from '../sections/Hero';
import Features from '../sections/Features';
import About from '../sections/About';
import Team from '../sections/Team';
import Contact from '../sections/Contact';

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Features />
        <About />
        <Team />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
