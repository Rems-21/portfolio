import React from 'react';
import Navigation from './components/Navigation';
import Hero from './components/Hero';
import About from './components/About';
import Parcours from './components/Parcours';
import Projects from './components/Projects';
import Realisations from './components/Realisations';
import Testimonials from './components/Testimonials';
import Contact from './components/Contact';
import Footer from './components/Footer';
import RemsBot from './components/RemsBot';

const MainLayout = () => (
  <>
    <Navigation />
    <main>
      <Hero />
      <About />
      <Parcours />
      <Projects />
      <Realisations />
      <Testimonials />
      <Contact />
    </main>
    <Footer />
    <RemsBot />
  </>
);

export default MainLayout; 