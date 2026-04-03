import React from "react";
import { CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const SuccessPayment = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-green-50 flex items-center justify-center px-4">
      <div className="bg-white shadow-xl rounded-2xl p-8 max-w-md w-full text-center">
        
        {/* Icon */}
        <div className="flex justify-center mb-4">
          <CheckCircle className="text-green-500 w-16 h-16" />
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Payment Successful 🎉
        </h1>

        {/* Subtitle */}
        <p className="text-gray-600 mb-6">
          Your order has been placed successfully.  
          We’ll send you a confirmation email shortly.
        </p>

        {/* Buttons */}
        <div className="flex flex-col gap-3">
          <button
            onClick={() => navigate("/")}
            className="bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg transition"
          >
            Continue Shopping
          </button>

          <button
            onClick={() => navigate("/orders")}
            className="border border-gray-300 hover:bg-gray-100 py-2 rounded-lg transition"
          >
            View Orders
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuccessPayment;