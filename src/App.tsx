import React from 'react';
import './App.css';
import Navbar from './components/Navbar/NavBar';
import Hero from './components/Hero/Hero';
import Banner from './components/Banner/Banner';
import Footer from './components/Footer/Footer';

function App() {
  return (
    <>
      <Navbar />
      <Hero />
      <div className="max-centered">
        <Banner />
        <hr role="separator" />
        <Footer />
      </div>
    </>
  );
}

export default App;
