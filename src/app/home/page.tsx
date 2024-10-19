"use client";

import { useAuth } from '@/lib/useAuth';
import { Sidebar } from '@/components/ui/sidebar';

export default function Home() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    // Redirect to login or show a message
    return <div>Please log in to access this page.</div>;
  }

  return (
    <div className="flex h-screen bg-white">
      <Sidebar className="w-[220px] bg-white border-r" />
      <main className="flex-1 p-6">
        {/* Main content goes here */}
        <h1 className="text-2xl font-bold">Welcome, {user.name}</h1>
        {/* Add more content as needed */}
      </main>
    </div>
  );
}
