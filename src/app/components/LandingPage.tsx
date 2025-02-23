import React from 'react';

interface LandingPageProps {
  onConnect: () => void;
}

function LandingPage({ onConnect }: LandingPageProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white rounded-xl p-8 shadow-lg max-w-md w-full text-center">
        <h1 className="text-2xl font-bold mb-6">Welcome to Our Cool Project</h1>
        <p className="text-gray-600 mb-8">
          Connect to start a conversation with our AI assistant.
        </p>
        <button
          onClick={onConnect}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
        >
          Start Conversation
        </button>
      </div>
    </div>
  );
}

export default LandingPage; 