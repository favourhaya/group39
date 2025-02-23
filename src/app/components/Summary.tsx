"use client";

import React, { useEffect, useState, useRef } from "react";
import { TranscriptItem } from "../types";

interface SummaryProps {
  onClose: () => void;
  items: TranscriptItem[];
}

const Summary: React.FC<SummaryProps> = ({ onClose, items }) => {
  const [summaryData, setSummaryData] = useState<string>("Loading summary...");
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
        //         "role": "user",
        //         "content": "Hello! How are you today?"
        //       },
        //       {
        //         "role": "assistant",
        //         "content": "I'm great! How can I assist you?"
        //       },
        //       {
        //         "role": "user",
        //         "content": "I need help with some coding questions."
        //       }
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

        setSummaryData(data.analysis.overall_summary);
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
      <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md text-center">
        <h2 className="text-2xl font-semibold mb-2">SUMMARY</h2>
        <h3 className="text-lg text-gray-600 mb-4">Heading 1</h3>
        
        {loading ? (
          <p className="text-gray-700 mb-6">Loading summary...</p>
        ) : error ? (
          <p className="text-red-600 mb-6">{error}</p>
        ) : (
          <p className="text-gray-700 mb-6">{summaryData}</p>
        )}

        <button
          onClick={onClose}
          className="w-full py-2 px-4 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default Summary;
