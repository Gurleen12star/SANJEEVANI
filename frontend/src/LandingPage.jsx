import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, ShieldCheck, Camera, Activity, Globe, ChevronRight } from 'lucide-react';
import heroImage from './assets/hero_graphic.jpg';
import bgImage from './assets/bg-image.png';

const LandingPage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 overflow-x-hidden">
      {/* 1. Navigation Bar */}
      <nav className="fixed top-0 w-full z-50 glass-card transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center gap-3 cursor-pointer group">
              <div className="w-10 h-10 bg-gradient-to-br from-sanjeevani-lightGreen to-sanjeevani-green rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all">
                <span className="text-white font-extrabold text-xl">S</span>
              </div>
              <span className="font-extrabold text-2xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-sanjeevani-darkGreen to-sanjeevani-green">
                SANJEEVANI
              </span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#how-it-works" className="text-sm font-semibold text-slate-600 hover:text-sanjeevani-green transition-colors">How it Works</a>
              <a href="#banks" className="text-sm font-semibold text-slate-600 hover:text-sanjeevani-blue transition-colors">For Banks</a>
              <a href="#fpos" className="text-sm font-semibold text-slate-600 hover:text-sanjeevani-green transition-colors">For FPOs</a>
              
              <div className="h-6 w-px bg-slate-300"></div>
              
              <button className="flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-full">
                <Globe className="w-4 h-4" />
                <span>EN</span>
              </button>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-slate-600 hover:text-slate-900 focus:outline-none p-2 rounded-lg bg-slate-100"
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-slate-100 shadow-2xl absolute w-full animate-in slide-in-from-top-2 duration-200">
            <div className="px-4 pt-4 pb-8 space-y-2">
              <a href="#how-it-works" className="block px-4 py-3 text-base font-semibold text-slate-700 hover:bg-sanjeevani-green/10 hover:text-sanjeevani-green rounded-xl transition-colors">How it Works</a>
              <a href="#banks" className="block px-4 py-3 text-base font-semibold text-slate-700 hover:bg-sanjeevani-blue/10 hover:text-sanjeevani-blue rounded-xl transition-colors">For Banks</a>
              <a href="#fpos" className="block px-4 py-3 text-base font-semibold text-slate-700 hover:bg-sanjeevani-green/10 hover:text-sanjeevani-green rounded-xl transition-colors">For FPOs</a>
              <div className="pt-4 mt-4 border-t border-slate-100">
                <button className="flex items-center justify-center gap-2 w-full px-4 py-3 text-base font-semibold text-slate-700 bg-slate-100 rounded-xl">
                  <Globe className="w-5 h-5" />
                  <span>Language (English)</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* 2. Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-24 overflow-hidden">
        {/* User's Custom Background Image */}
        <div className="absolute inset-0 w-full h-full z-0 overflow-hidden">
          <img src={bgImage} alt="Sanjeevani Background" className="w-full h-full object-cover opacity-80" />
        </div>
        
        {/* White Wash Overlay for Text Readability */}
        <div className="absolute inset-0 w-full h-full bg-white/50 z-10 pointer-events-none"></div>

        {/* Rich Gradient Backgrounds */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-transparent via-sanjeevani-lightGreen/10 to-sanjeevani-blue/10 z-10 pointer-events-none"></div>
        <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-sanjeevani-lightGreen/20 blur-[120px] rounded-full z-10 pointer-events-none"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-sanjeevani-blue/15 blur-[100px] rounded-full z-10 pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
            
            {/* Left Column: Text & CTAs */}
            <div className="text-center lg:text-left flex flex-col items-center lg:items-start pt-10">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm border border-sanjeevani-green/20 shadow-sm mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <span className="flex h-2.5 w-2.5 rounded-full bg-sanjeevani-green animate-pulse"></span>
                <span className="text-xs font-bold text-sanjeevani-darkGreen uppercase tracking-widest">Problem Statement 2 — PS2</span>
              </div>
              
              <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-slate-900 mb-6 leading-[1.1] animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">
                Protecting Farmers.<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-sanjeevani-blue to-sanjeevani-green">
                  Empowering Lenders.
                </span>
              </h1>
              
              <p className="mt-4 text-lg sm:text-xl text-slate-600 max-w-xl leading-relaxed font-medium animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
                The automated agronomic credit and debt-safety protocol turning verified farm data into instant, uncollateralized capital.
              </p>
              
              <div className="mt-10 flex flex-col sm:flex-row gap-4 w-full sm:w-auto animate-in fade-in slide-in-from-bottom-10 duration-700 delay-300">
                <Link to="/login" className="group relative w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 bg-sanjeevani-green hover:bg-sanjeevani-darkGreen text-white rounded-2xl font-bold text-lg transition-all shadow-xl shadow-sanjeevani-green/20 hover:shadow-2xl hover:shadow-sanjeevani-green/30 hover:-translate-y-1">
                  FPO / Farmer Login
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <button className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-white/90 backdrop-blur-sm border-2 border-sanjeevani-blue/20 hover:border-sanjeevani-blue text-slate-700 hover:text-sanjeevani-blue rounded-2xl font-bold text-lg transition-all shadow-sm hover:shadow-md hover:-translate-y-1">
                  Bank Underwriter Portal
                </button>
              </div>
            </div>

            {/* Right Column: Generated Graphic */}
            <div className="relative w-full flex justify-center lg:justify-end animate-in fade-in zoom-in-95 duration-1000 delay-300">
              <div className="relative w-full max-w-lg aspect-square lg:aspect-[4/3] flex items-center justify-center transform hover:scale-105 transition-transform duration-500">
                <img 
                  src={heroImage} 
                  alt="Farmer and Banker collaborating" 
                  className="w-full h-full object-contain mix-blend-multiply"
                />
                
                {/* Floating UI Elements over the graphic */}
                <div className="absolute top-0 right-0 lg:-right-8 glass-card px-4 py-3 rounded-2xl animate-bounce shadow-xl" style={{animationDuration: '3s'}}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-sanjeevani-lightGreen/20 flex items-center justify-center text-sanjeevani-green">
                      <ShieldCheck className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-500">Sanjeevani Trust Score</p>
                      <p className="text-lg font-extrabold text-slate-900">78 / 100</p>
                    </div>
                  </div>
                </div>

                <div className="absolute bottom-4 left-0 lg:-left-4 glass-card px-4 py-3 rounded-2xl animate-bounce shadow-xl" style={{animationDuration: '4s', animationDelay: '1s'}}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-sanjeevani-blue/10 flex items-center justify-center text-sanjeevani-blue">
                      <Activity className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-500">Crop Health API</p>
                      <p className="text-lg font-extrabold text-sanjeevani-green">Verified 99%</p>
                    </div>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. How It Works (Value Proposition) */}
      <section id="how-it-works" className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">How Sanjeevani Works</h2>
            <p className="mt-6 text-xl text-slate-600 max-w-2xl mx-auto">Bridging the trust gap with transparent, community-backed intelligence.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
            
            {/* Feature 1 */}
            <div className="bg-slate-50 rounded-[2rem] p-10 border border-slate-100 hover:border-sanjeevani-lightGreen/50 hover:bg-white transition-all duration-300 shadow-sm hover:shadow-2xl hover:shadow-sanjeevani-green/5 group hover:-translate-y-2">
              <div className="w-16 h-16 bg-white border border-slate-100 text-sanjeevani-green rounded-2xl flex items-center justify-center mb-8 shadow-sm group-hover:scale-110 group-hover:bg-sanjeevani-green group-hover:text-white group-hover:border-transparent transition-all duration-300">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Verify via Government Data</h3>
              <p className="text-slate-600 text-lg leading-relaxed">
                Direct integration with AGMARKNET and NHB creates a sovereign, verifiable yield and market history for every farmer without paperwork.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-slate-50 rounded-[2rem] p-10 border border-slate-100 hover:border-sanjeevani-lightGreen/50 hover:bg-white transition-all duration-300 shadow-sm hover:shadow-2xl hover:shadow-sanjeevani-green/5 group hover:-translate-y-2">
              <div className="w-16 h-16 bg-white border border-slate-100 text-sanjeevani-green rounded-2xl flex items-center justify-center mb-8 shadow-sm group-hover:scale-110 group-hover:bg-sanjeevani-green group-hover:text-white group-hover:border-transparent transition-all duration-300">
                <Camera className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">AI Crop Health Scans</h3>
              <p className="text-slate-600 text-lg leading-relaxed">
                Our lightweight, on-device ICAR computer vision models instantly score crop health from a single smartphone photo directly in the field.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-slate-50 rounded-[2rem] p-10 border border-slate-100 hover:border-sanjeevani-blue/30 hover:bg-white transition-all duration-300 shadow-sm hover:shadow-2xl hover:shadow-sanjeevani-blue/5 group hover:-translate-y-2">
              <div className="w-16 h-16 bg-white border border-slate-100 text-sanjeevani-blue rounded-2xl flex items-center justify-center mb-8 shadow-sm group-hover:scale-110 group-hover:bg-sanjeevani-blue group-hover:text-white group-hover:border-transparent transition-all duration-300">
                <Activity className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Sanjeevani Safety Net</h3>
              <p className="text-slate-600 text-lg leading-relaxed">
                Automated loan restructuring during climate or market shocks. We automatically file PMFBY claims to freeze EMIs and save livelihoods.
              </p>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
