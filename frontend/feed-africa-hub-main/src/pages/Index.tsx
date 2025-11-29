// src/pages/Index.tsx (Example - ensure it does NOT render Header/Footer itself)
import React from 'react';
// ... other imports ...
import Hero from '@/components/Hero'; // Adjust import path if necessary
import Features from '@/components/Features'; // Adjust import path if necessary

const Index: React.FC = () => {
  return (
    <>
      {/* DO NOT include <Header /> here */}
      <Hero />
      <Features />
      {/* DO NOT include <Footer /> here */}
    </>
  );
};

export default Index;