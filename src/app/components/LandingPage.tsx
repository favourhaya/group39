import React from 'react';
import { Tooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css';


interface LandingPageProps {
  onConnect: () => void;
}

function LandingPage({ onConnect }: LandingPageProps) {
  return (
    <div>
      <div className="flex flex-col items-center justify-center min-h-screen py-4 px-40 gradient-background">
        <h1 className="text-5xl text-blue-600 font-bold">ConvoAI</h1>
        <p className="text-gray-600 mb-8 font-sourGummy text-[48pt] text-center leading-[1.2]">
          Get instant <strong>feedback</strong> on your language learning skills
        </p>
        <button
          onClick={onConnect}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-4 px-8 text-lg rounded-lg transition-colors shadow-lg hover:shadow-xl transition-shadow"
        >
          Start Practicing Now
        </button>
        
        {/* Tooltip Button for How it works */}
        <button 
          data-tooltip-id="howToUseTooltip"
          className="mt-4 text-gray-600 hover:text-gray-800 underline text-lg"
        >
          How it works
        </button>
      </div>

      {/* Tooltip for How it works */}
      <Tooltip 
        id="howToUseTooltip" 
        place="right" 
        className="!bg-white !text-gray-800 !p-4 !rounded-xl !shadow-lg !max-w-md !opacity-100"
        style={{ 
          fontSize: '1rem', 
          lineHeight: '1.5',
          backgroundColor: 'white',
        }}
      >
        <div className="space-y-3 bg-white">
          <h3 className="font-bold text-blue-600 mb-2">How to Use ConvoAI</h3>
          <ol className="list-decimal list-inside space-y-2">
            <li>Start a conversation with our AI</li>
            <li>Speak naturally—our AI transcribes and analyzes your speech</li>
            <li>Get instant feedback and improvement tips after each session</li>
          </ol>
        </div>
      </Tooltip>
    </div>
  );
}

export default LandingPage; 