"use client";

import React, { useEffect, useState, useRef } from "react";
import { TranscriptItem } from "../types";

interface SummaryProps {
  onClose: () => void;
  items: TranscriptItem[];
}

const Summary: React.FC<SummaryProps> = ({ onClose, items }) => {
  const [summaryData, setSummaryData] = useState<any>();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const initialized = useRef(false)

  useEffect(() => {
    if (!initialized.current) {
        initialized.current = true

    const fetchSummary = async () => {
      try {
        // const transcript = [
        //       {
        //         "role": "assistant",
        //         "content": "Hello! How are you today? What would you like to talk about? Maybe sports, music, or movies?"
        //       },
        //       {
        //         "role": "user",
        //         "content": "Ronaldo coolest swimmer. Brother of mine wants to be him"
        //       },
        //       {
        //         "role": "assistant",
        //         "content": "Did you mean: \"Ronaldo is the coolest football player. My brother wants to be like him.\"? Ronaldo is indeed a famous football (soccer) player! What does your brother admire about Ronaldo?"
        //       },
        //       {
        //         "role": "user",
        //         "content": "football not soccer"
        //       },
        //       {
        //         "role": "assistant",
        //         "content": "Got it! Football it is. Ronaldo is definitely a legendary football player. What qualities or skills of his does your brother find inspiring?"
        //       },
        //     ]
        const transcript = items
            .filter(item => item.type === "MESSAGE") // Filter only MESSAGE types
            .map(item => ({
              role: item.role,
              content: item.title
            })); 
          
        const response = await fetch("/api/summary", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify( transcript ),
        });
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to fetch summary");
        }

        setSummaryData(data.analysis);
        console.log(transcript);
        console.log(data);
        
        // console.log(items.filter());
        
        
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
    }
    
  }, []);


  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-xl shadow-lg w-full min-w-md max-w-5xl text-center max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-2">SUMMARY REPORT</h2>
  
        {loading ? (
          <p className="text-gray-600 b-6 py-10">Loading summary...</p>
        ) : error ? (
          <p className="text-red-400 mb-6">{error}</p>
        ) : (
          <>
            {/* Rating Emoji Display */}
            <div className="text-3xl mt-2 flex justify-center gap-4">
            <span className={summaryData.rating === "poor" ? "opacity-100" : "opacity-50"}>
                ☹️
            </span>
            <span className={summaryData.rating === "good" ? "opacity-100" : "opacity-50"}>
                😐
            </span>
            <span className={summaryData.rating === "excellent" ? "opacity-100" : "opacity-50"}>
                😊
            </span>
            </div>
  
            {/* Scrollable Main Content (No extra scroll for the small boxes) */}
            <div className="text-gray-600 text-left max-h-[70vh] overflow-y-auto px-4">
              <p className="text-center pb-5">{summaryData.overall_summary}</p>
  
              {/* Small Boxes: No overflow here */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Clarity Box */}
                <div className="border border-gray-300 rounded-xl shadow-md">
                  <h3 className="bg-gray-800 p-2 text-white font-bold text-lg text-center rounded-t-xl">
                    Clarity
                </h3>
                <div className="p-4">
                    {summaryData.correct_clarity ? 
                        <p className="text-green-600 mb-4">✅ {summaryData.correct_clarity}</p>
                        : <p></p>
                    }
                    {summaryData.incorrect_clarity ? 
                        <p className="text-red-500 mb-4">❌ {summaryData.incorrect_clarity}</p>
                        : <p></p>
                    }
                </div>
                </div>
  
                {/* Coherence Box */}
                <div className="border border-gray-300 rounded-xl shadow-md">
                  <h3 className="bg-gray-800 p-2 text-white font-bold text-lg text-center rounded-t-xl">
                    Coherence
                </h3>
                <div className="p-4">
                    {summaryData.correct_coherence ? 
                        <p className="text-green-600 mb-4">✅ {summaryData.correct_coherence}</p>
                        : <p></p>
                    }
                    {summaryData.incorrect_coherence ? 
                        <p className="text-red-500 mb-4">❌ {summaryData.incorrect_coherence}</p>
                        : <p></p>
                    }
                </div>
                </div>
  
                {/* Grammar Box */}
                <div className="border border-gray-300 rounded-xl shadow-md">
                  <h3 className="bg-gray-800 p-2 text-white font-bold text-lg text-center rounded-t-xl">
                    Grammar
                </h3>
                <div className="p-4">
                    {summaryData.correct_grammar ? 
                        <p className="text-green-600 mb-4">✅ {summaryData.correct_grammar}</p>
                        : <p></p>
                    }
                    {summaryData.incorrect_grammar ? 
                        <p className="text-red-500 mb-4">❌ {summaryData.incorrect_grammar}</p>
                        : <p></p>
                    }
                </div>
                </div>
              </div>
            </div>
          </>
        )}
  
        <button
          onClick={onClose}
          className="w-full py-2 px-4 mt-4 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition"
        >
          Close
        </button>
      </div>
    </div>
  );
  
};

export default Summary;
