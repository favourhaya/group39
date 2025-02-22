"use client";

import React from "react";

interface SummaryProps {
  onClose: () => void;
}

const Summary: React.FC<SummaryProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md text-center">
        <h2 className="text-2xl font-semibold mb-2">SUMMARY</h2>
        <h3 className="text-lg text-gray-600 mb-4">Heading 1</h3>
        <p className="text-gray-700 mb-6">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque
          nec nulla at nisi feugiat imperdiet. Curabitur eu turpis ut nunc
          malesuada eleifend in eu sapien.
        </p>
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
