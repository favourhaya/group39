import React from 'react';

interface LandingPageProps {
  onConnect: () => void;
}

function LandingPage({ onConnect }: LandingPageProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-4 px-40 gradient-background">
    
      {/* <div className="bg-white rounded-xl p-8 shadow-lg max-w-md w-full text-center"> */}
        <h1 className="text-5xl text-blue-600 font-bold">ConvoAI</h1>
        <p className="text-gray-600 mb-8 font-sourGummy text-[48pt] text-center leading-[1.2]">
            Get <em>instant</em> feedback on your Language Learning skills
        </p>
        <button
          onClick={onConnect}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-4 px-8 text-lg rounded-lg transition-colors shadow-lg hover:shadow-xl transition-shadow"
        >
          Start Practicing Now
        </button>
      {/* </div> */}
    </div>
  );
}

export default LandingPage; 