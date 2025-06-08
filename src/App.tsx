import React from 'react';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Hero from './components/sections/Hero';
import HowItWorks from './components/sections/HowItWorks';
import InputSimulator from './components/sections/InputSimulator';
import Pricing from './components/sections/Pricing';

function App() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <main>
        <Hero />
        <HowItWorks />
        <InputSimulator />
        <Pricing />
      </main>
      <Footer />
    </div>
  );
}

export default App;