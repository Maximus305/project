import React from 'react';
import { GoKey, GoBook, GoPackage, GoComment } from 'react-icons/go';
import { GiMoebiusTriangle } from "react-icons/gi";

const HomePage = () => {
  return (
    <div className="flex h-screen bg-white">
      {/* Sidebar */}
      <div className="w-[260px] bg-white border-r border-[#E6EDF0] shadow-lg z-10 relative">
        {/* Sidebar content */}
        <div className="flex flex-col items-center h-auto pt-[58px]"> 
          <h1 className="font-['Avenir_Next'] text-[#5A6A75] text-2xl font-semibold mb-8 flex items-center">
            <GiMoebiusTriangle className="mr-2" size={24} style={{ strokeWidth: 1 }} />
            PDF2LLM
          </h1>
          <div className="flex flex-col items-center">
            <button className="font-['Avenir_Next'] text-[#5A6A75] mb-2 w-full text-left flex items-center font-medium pl-[10px]">
              <GoComment className="mr-2" size={13} style={{ strokeWidth: 1 }} />
              Chat
            </button>
            <button className="font-['Avenir_Next'] text-[#5A6A75] mb-2 w-full text-left flex items-center font-medium pl-[10px]">
              <GoPackage className="mr-2" size={13} style={{ strokeWidth: 1 }} />
              PDF Library
            </button>
            <button className="font-['Avenir_Next'] text-[#5A6A75] mb-2 w-full text-left flex items-center font-medium pl-[10px]">
              <GoKey className="mr-2" size={13} style={{ strokeWidth: 1 }} />
              API_Key
            </button>
            <button className="font-['Avenir_Next'] text-[#5A6A75] mb-2 w-full text-left flex items-center font-medium pl-[10px]">
              <GoBook className="mr-2" size={13} style={{ strokeWidth: 1 }} />
              About
            </button>
          </div>
        </div>
      </div> 
    
      {/* Main content */} 
      <div className="flex-1 bg-white">
        {/* Main content goes here */}
      </div>
    </div>
  );
};

export default HomePage;
