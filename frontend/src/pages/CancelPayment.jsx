import React from "react";
import { XCircle, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const CancelPayment = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-cream-100 flex items-center justify-center px-4">
      <div className="card p-8 max-w-md w-full text-center">
        <div className="flex justify-center mb-5">
          <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center">
            <XCircle className="text-muted-red w-10 h-10" />
          </div>
        </div>

        <h1 className="text-2xl font-display font-bold text-sage-900 mb-2">
          Payment Cancelled
        </h1>
        <p className="text-sage-500 mb-8 text-sm">
          Your payment was not completed. You can try again anytime.
        </p>

        <div className="flex flex-col gap-3">
          <button
            onClick={() => navigate("/cart")}
            className="btn-primary flex items-center justify-center gap-2"
          >
            Try Again
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => navigate("/")}
            className="btn-secondary"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default CancelPayment;
