export default function RestaurantLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100 flex items-center justify-center p-4">
      <div className="text-center max-w-md w-full">
        {/* Restaurant Loading Animation */}
        <div className="mb-8">
          <div className="w-20 h-20 mx-auto bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center shadow-lg">
            <svg
              className="w-10 h-10 text-white animate-spin"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 7v10c0 2.21 3.79 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.79 4 8 4s8-1.79 8-4M4 7c0-2.21 3.79-4 8-4s8 1.79 8 4"
              />
            </svg>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Preparing Your Menu
        </h2>
        <p className="text-gray-600 mb-8">
          Loading fresh ingredients and delicious options...
        </p>

        {/* Animated Food Icons */}
        <div className="flex justify-center space-x-4 mb-8">
          {["🍽️", "🥗", "🍕", "🍰"].map((emoji, i) => (
            <div
              key={i}
              className="text-2xl animate-bounce"
              style={{
                animationDelay: `${i * 0.3}s`,
                animationDuration: "1.5s",
              }}
            >
              {emoji}
            </div>
          ))}
        </div>

        {/* Loading Dots */}
        <div className="flex justify-center space-x-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-3 h-3 bg-orange-500 rounded-full animate-pulse"
              style={{
                animationDelay: `${i * 0.4}s`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
