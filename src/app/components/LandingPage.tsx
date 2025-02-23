import React from 'react';

interface LandingPageProps {
  onConnect: () => void;
}

function LandingPage({ onConnect }: LandingPageProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 py-4 px-40">
      {/* <div className="bg-white rounded-xl p-8 shadow-lg max-w-md w-full text-center"> */}
        <h1 className="text-2xl font-bold">ConvoAI</h1>
        <p className="text-gray-600 mb-8 font-sourGummy text-[64pt] text-center leading-[1.2]">
            Get <em>instant</em> feedback on you Language Learning skills
        </p>
        <button
          onClick={onConnect}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
        >
          Start Conversation
        </button>
      {/* </div> */}
    </div>
  );
}

export default LandingPage; 