/* eslint-disable react/no-unescaped-entities */
"use client";

import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100 flex items-center justify-center p-4">
      <div className="text-center max-w-md w-full">
        {/* 404 Animation */}
        <div className="mb-8">
          <div className="text-8xl font-bold text-orange-200 mb-4 animate-bounce">
            404
          </div>
          <div className="w-24 h-24 mx-auto bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center shadow-lg">
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
                d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.47-.881-6.08-2.33"
              />
            </svg>
          </div>
        </div>

        {/* Error Message */}
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Oops! Page Not Found
        </h1>
        <p className="text-gray-600 mb-8 leading-relaxed">
          The page you&rsquo;re looking for seems to have wandered off the menu.
          Don't worry, let's get you back to delicious discoveries!
        </p>

        {/* Action Buttons */}
        <div className="space-y-4">
          <Link
            href="/"
            className="inline-block w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            Back to Home
          </Link>

          <button
            onClick={() => window.history.back()}
            className="inline-block w-full bg-white text-orange-600 font-semibold py-3 px-6 rounded-lg border-2 border-orange-200 hover:border-orange-300 hover:bg-orange-50 transition-all duration-300"
          >
            Go Back
          </button>
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
          <p className="text-xs text-gray-400 mt-1">
            © 2024 DineEase Technologies. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
