/* eslint-disable react/no-unescaped-entities */
import Link from "next/link";

export default function RestaurantNotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100 flex items-center justify-center p-4">
      <div className="text-center max-w-md w-full">
        {/* Restaurant Not Found Animation */}
        <div className="mb-8">
          <div className="w-24 h-24 mx-auto bg-gradient-to-br from-gray-400 to-gray-500 rounded-full flex items-center justify-center shadow-lg opacity-50">
            <svg
              className="w-12 h-12 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </div>
          <div className="text-6xl font-bold text-gray-300 mt-4">🍽️</div>
        </div>

        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Restaurant Not Found
        </h1>
        <p className="text-gray-600 mb-8 leading-relaxed">
          This restaurant or table doesn't exist in our system. Please check
          your QR code or contact the restaurant staff.
        </p>

        {/* Action Buttons */}
        <div className="space-y-4">
          <Link
            href="/"
            className="inline-block w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            Find Another Restaurant
          </Link>

          <div className="text-sm text-gray-500 mt-6">
            <p>Need help? Contact support:</p>
            <p className="font-semibold text-orange-600">
              support@dineease.com
            </p>
          </div>
        </div>

        {/* Company Footer */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <div className="w-6 h-6 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center">
              <svg
                className="w-3 h-3 text-white"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
              </svg>
            </div>
            <span className="text-sm font-semibold text-gray-700">
              DineEase
            </span>
          </div>
          <p className="text-xs text-gray-500">
            Digital Restaurant Experience Platform
          </p>
        </div>
      </div>
    </div>
  );
}
