"use client";

import React from 'react';
import { ArrowRight } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100 text-black">
    
      <main className="flex-grow flex items-center justify-center">
        <div className="text-center px-4">
          <h2 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Transform PDFs with <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500">AI Precision</span>
          </h2>
          <p className="text-xl md:text-2xl mb-12 max-w-2xl mx-auto">
            Experience the world&apos;s most accurate PDF to Markdown conversion, powered by ChatGPT.
          </p>
          <button className="px-8 py-4 text-xl font-bold rounded-full relative overflow-hidden group text-white">
            <span className="absolute inset-0 bg-gradient-to-r from-red-500 to-orange-500 animate-gradient-x"></span>
            <span className="relative flex items-center text-white">
              Get Started Now <ArrowRight className="ml-2" />
            </span>
          </button>
        </div>
      </main>

      <footer className="container mx-auto py-6 px-4 text-center">
        <p>&copy; 2024 PDF2LLM Converter. All rights reserved.</p>
      </footer>
      
      <style jsx>{`
        @keyframes gradientAnimation {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradient-x {
          background-size: 300% 100%; /* Making the animation stronger and changing direction */
          animation: gradientAnimation 1s ease infinite alternate; /* Making the animation flip back and forth really fast */
        }
      `}</style>
    </div>
  );
}