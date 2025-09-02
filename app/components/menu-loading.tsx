import { Utensils, Clock } from "lucide-react"

export default function MenuLoading() {
    return (
        <div className="min-h-screen bg-slate-50 pb-24">
            {/* Header Skeleton */}
            <header className="bg-white border-b p-4 text-center">
                <div className="animate-pulse">
                    <div className="h-8 bg-gray-200 rounded-lg w-48 mx-auto mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-32 mx-auto"></div>
                </div>
            </header>

            {/* Search Bar Skeleton */}
            <div className="sticky top-0 z-40 bg-white border-b px-4 py-3">
                <div className="relative max-w-md mx-auto">
                    <div className="animate-pulse h-10 bg-gray-200 rounded-lg"></div>
                </div>
            </div>

            {/* Category Navigation Skeleton */}
            <div className="sticky top-14 z-30 bg-white border-b px-4 py-3">
                <div className="flex gap-1 bg-gray-50 rounded-lg p-1 max-w-2xl mx-auto">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="flex-1 animate-pulse">
                            <div className="h-8 bg-gray-200 rounded"></div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Loading Animation with Restaurant Theme */}
            <div className="flex flex-col items-center justify-center py-20">
                <div className="relative mb-8">
                    {/* Animated plate */}
                    <div className="w-24 h-24 border-4 border-gray-200 border-t-orange-400 rounded-full animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Utensils className="w-8 h-8 text-orange-400 animate-pulse" />
                    </div>
                </div>

                <div className="text-center space-y-2">
                    <h3 className="text-lg font-semibold text-gray-700 flex items-center gap-2 justify-center">
                        <Clock className="w-5 h-5 animate-pulse" />
                        Preparing your menu...
                    </h3>
                    <p className="text-sm text-gray-500">Fresh ingredients loading</p>
                </div>

                {/* Animated dots */}
                <div className="flex space-x-1 mt-4">
                    {[0, 1, 2].map((i) => (
                        <div
                            key={i}
                            className="w-2 h-2 bg-orange-400 rounded-full animate-bounce"
                            style={{ animationDelay: `${i * 0.2}s` }}
                        ></div>
                    ))}
                </div>
            </div>

            {/* Menu Items Skeleton */}
            <main className="px-3 md:px-6 py-6 max-w-7xl mx-auto">
                <div className="space-y-8">
                    {[1, 2].map((section) => (
                        <section key={section} className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="animate-pulse h-6 bg-gray-200 rounded w-32"></div>
                                <div className="flex-1 h-px bg-gray-200"></div>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
                                {[1, 2, 3, 4, 5, 6].map((item) => (
                                    <div key={item} className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-xl pb-2">
                                        <div className="p-2">
                                            <div className="animate-pulse">
                                                <div className="w-full h-38 md:h-40 bg-gray-200 rounded mb-2"></div>
                                                <div className="space-y-2 pt-3">
                                                    <div className="flex justify-between items-start gap-2">
                                                        <div className="h-4 bg-gray-200 rounded flex-1"></div>
                                                        <div className="h-4 bg-gray-200 rounded w-16"></div>
                                                    </div>
                                                    <div className="h-3 bg-gray-200 rounded w-full"></div>
                                                    <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    ))}
                </div>
            </main>

            {/* Bottom Action Bar Skeleton */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg p-4">
                <div className="flex gap-3 max-w-md mx-auto">
                    <div className="flex-1 animate-pulse h-12 bg-gray-200 rounded-lg"></div>
                    <div className="flex-1 animate-pulse h-12 bg-gray-200 rounded-lg"></div>
                </div>
            </div>
        </div>
    )
}
