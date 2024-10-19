"use client";

import { Sidebar } from '@/components/ui/sidebar';

export default function Home() {
  return (
    <div className="flex h-screen bg-white">
      <Sidebar className="w-[220px] bg-white border-r" />
      <main className="flex-1 p-6">
        {/* Main content goes here */}
        <h1 className="text-2xl font-bold">Welcome to Our App</h1>
        <p className="mt-4">Explore our features and get started!</p>
        {/* Add more content as needed */}
      </main>
    </div>
  );
}
