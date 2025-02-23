import React from 'react';

interface LandingPageProps {
  onConnect: () => void;
}

function LandingPage({ onConnect }: LandingPageProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-orange-200 via-orange-10 to-purple-300 py-4 px-40"
    style={{
        backgroundSize: '100% 100%',
        backgroundPosition: '0px 0px,0px 0px,0px 0px,0px 0px,0px 0px,0px 0px,0px 0px,0px 0px,0px 0px,0px 0px,0px 0px',
        backgroundImage: `
          radial-gradient(18% 28% at 24% 50%, #CEFAFFFF 7%, #073AFF00 100%),
          radial-gradient(18% 28% at 18% 71%, #FFFFFF59 6%, #073AFF00 100%),
          radial-gradient(70% 53% at 36% 76%, #73F2FFFF 0%, #073AFF00 100%),
          radial-gradient(42% 53% at 15% 94%, #FFFFFFFF 7%, #073AFF00 100%),
          radial-gradient(42% 53% at 34% 72%, #FFFFFFFF 7%, #073AFF00 100%),
          radial-gradient(18% 28% at 35% 87%, #FFFFFFFF 7%, #073AFF00 100%),
          radial-gradient(31% 43% at 7% 98%, #FFFFFFFF 24%, #073AFF00 100%),
          radial-gradient(21% 37% at 72% 23%, #D3FF6D9C 24%, #073AFF00 100%),
          radial-gradient(35% 56% at 91% 74%, #8A4FFFF5 9%, #073AFF00 100%),
          radial-gradient(74% 86% at 67% 38%, #6DFFAEF5 24%, #073AFF00 100%),
          linear-gradient(125deg, #4EB5FFFF 1%, #4C00FCFF 100%)
        `
      }}>
    
      {/* <div className="bg-white rounded-xl p-8 shadow-lg max-w-md w-full text-center"> */}
        <h1 className="text-5xl text-blue-600 font-bold">ConvoAI</h1>
        <p className="text-gray-600 mb-8 font-sourGummy text-[48pt] text-center leading-[1.2]">
            Get <em>instant</em> feedback on your Language Learning skills
        </p>
        <button
          onClick={onConnect}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-4 px-8 text-lg rounded-lg transition-colors"
        >
          Start Practicing Now
        </button>
      {/* </div> */}
    </div>
  );
}

export default LandingPage; 