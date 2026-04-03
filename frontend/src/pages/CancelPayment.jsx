import React from "react";
import { XCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const CancelPayment = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-red-50 flex items-center justify-center px-4">
      <div className="bg-white shadow-xl rounded-2xl p-8 max-w-md w-full text-center">
        
        {/* Icon */}
        <div className="flex justify-center mb-4">
          <XCircle className="text-red-500 w-16 h-16" />
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Payment Cancelled ❌
        </h1>

        {/* Subtitle */}
        <p className="text-gray-600 mb-6">
          Your payment was not completed.  
          Don’t worry — you can try again anytime.
        </p>

        {/* Info Box */}
        <div className="bg-gray-100 rounded-lg p-4 mb-6 text-left">
          <p className="text-sm text-gray-700">
            <span className="font-semibold">Status:</span> Cancelled
          </p>
          <p className="text-sm text-gray-700">
            <span className="font-semibold">Reason:</span> Payment interrupted
          </p>
        </div>

        {/* Buttons */}
        <div className="flex flex-col gap-3">
          <button
            onClick={() => navigate("/checkout")}
            className="bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg transition"
          >
            Try Again
          </button>

          <button
            onClick={() => navigate("/")}
            className="border border-gray-300 hover:bg-gray-100 py-2 rounded-lg transition"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default CancelPayment;