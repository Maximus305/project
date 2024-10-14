"use client";

import React from 'react';
import { usePathname, useRouter } from 'next/navigation';

import './globals.css'; // Import global styles

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  // Determine if the current path is the home page
  const isHomePage = pathname === '/';

  return (
    <html lang="en">
      <head>
        {/* Add any head elements here, like meta tags or links to stylesheets */}
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