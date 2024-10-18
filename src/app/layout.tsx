"use client";

import React from 'react';


import './globals.css'; // Import global styles

export default function RootLayout({ children }: { children: React.ReactNode }) {
  

  // Determine if the current path is the home page
  

  return (
    <html lang="en">
      <head>
        <title>PDF2LLM</title>
      </head>
      <body>
        <div>
          <main className="">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}