import React from 'react';

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Welcome to My App</h1>
      <p className="text-lg mb-4">This is the home page that anyone can access without logging in.</p>
      <div className="bg-gray-100 p-4 rounded-lg">
        <h2 className="text-xl font-semibold mb-2">Features:</h2>
        <ul className="list-disc list-inside">
          <li>Browse all content</li>
          <li>Learn about our services</li>
          <li>Contact us for more information</li>
          <li>Access all features without signing up</li>
        </ul>
      </div>
      <div className="mt-8">
        <p className="text-lg">Ready to explore?</p>
        <button className="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
          Get Started
        </button>
        <button className="mt-4 ml-4 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded">
          Learn More
        </button>
      </div>
    </div>
  );
}
