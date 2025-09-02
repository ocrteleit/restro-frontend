"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Search, Phone, Receipt, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { MenuItem } from "@/lib/api"

function Card({ className, ...props }: React.ComponentProps<"div">) {
    return <div className={`bg-white border border-gray-200 rounded-lg ${className || ""}`} {...props} />
}

interface RestaurantMenuClientProps {
    initialMenuData: { [key: string]: MenuItem[] }
    initialCategories: Array<{ id: string; name: string }>
    initialTableNumber: string
}

export default function RestaurantMenuClient({
    initialMenuData,
    initialCategories,
    initialTableNumber,
}: RestaurantMenuClientProps) {
    const [tableNumber] = useState<string>(initialTableNumber)
    const [searchTerm, setSearchTerm] = useState("")
    const [activeCategory, setActiveCategory] = useState(initialCategories[0]?.id || "")
    const sectionRefs = useRef<{ [key: string]: HTMLElement | null }>({})
    const observerRef = useRef<IntersectionObserver | null>(null)

    useEffect(() => {
        const observerOptions = {
            root: null,
            rootMargin: "-120px 0px -60% 0px",
            threshold: 0.3,
        }

        observerRef.current = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const categoryId = entry.target.getAttribute("data-category")
                    if (categoryId) {
                        setActiveCategory(categoryId)
                    }
                }
            })
        }, observerOptions)

        const timer = setTimeout(() => {
            Object.values(sectionRefs.current).forEach((section) => {
                if (section && observerRef.current) {
                    observerRef.current.observe(section)
                }
            })
        }, 100)

        return () => {
            clearTimeout(timer)
            if (observerRef.current) {
                observerRef.current.disconnect()
            }
        }
    }, [])

    const filteredMenu = Object.entries(initialMenuData).reduce(
        (acc: { [key: string]: MenuItem[] }, [category, items]) => {
            const filtered = items.filter(
                (item) =>
                    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase())),
            )
            if (filtered.length > 0) {
                acc[category] = filtered
            }
            return acc
        },
        {} as { [key: string]: MenuItem[] },
    )

    const handleCallWaiter = () => {
        alert(`Waiter has been called for Table ${tableNumber}! They will be with you shortly.`)
    }

    const handleAskForBill = () => {
        alert(`Bill request sent for Table ${tableNumber}! Your bill will be prepared shortly.`)
    }

    const handleCategoryClick = (categoryId: string) => {
        setActiveCategory(categoryId)
        const section = sectionRefs.current[categoryId]
        if (section) {
            const headerHeight = 140
            const elementPosition = section.offsetTop - headerHeight
            window.scrollTo({
                top: elementPosition,
                behavior: "smooth",
            })
        }
    }

    return (
        <div className="min-h-screen bg-slate-50 pb-24">
            {/* Header */}
            <header className="bg-white border-b p-4 text-center">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">Dakshinkali Restaurant</h1>
                <p className="text-sm text-gray-600">Authentic flavors, fresh ingredients</p>
                {tableNumber != "Unknown" && (
                    <div className="mt-2 inline-flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-full text-xs text-gray-600">
                        <MapPin className="w-3 h-3" />
                        Table {tableNumber}
                    </div>
                )}

            </header>

            {/* Search Bar */}
            <div className="sticky top-0 z-40 bg-white border-b px-4 py-3">
                <div className="relative max-w-md mx-auto">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                        type="text"
                        placeholder="Search menu items..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 bg-gray-50 border-gray-200 focus:border-gray-400 focus:ring-gray-400/20"
                    />
                </div>
            </div>

            {/* Category Navigation */}
            <div className="sticky top-14 z-30 bg-white border-b px-4 py-3">
                <div className="flex gap-1 bg-gray-50 rounded-lg p-1 max-w-2xl mx-auto">
                    {initialCategories.map((category) => (
                        <button
                            key={category.id}
                            onClick={() => handleCategoryClick(category.id)}
                            className={`flex-1 px-2 py-2 text-xs md:text-sm font-medium rounded transition-colors duration-200 ${activeCategory === category.id
                                ? "bg-gray-900 text-white"
                                : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                                }`}
                        >
                            {category.name}
                        </button>
                    ))}
                </div>
            </div>

            {/* Menu Content */}
            <main className="px-3 md:px-6 py-6 max-w-7xl mx-auto">
                <div className="space-y-8">
                    {initialCategories.map((category) => {
                        const items = filteredMenu[category.id]
                        if (!items || items.length === 0) return null

                        return (
                            <section
                                key={category.id}
                                ref={(el) => {
                                    sectionRefs.current[category.id] = el
                                }}
                                data-category={category.id}
                                className="space-y-4"
                            >
                                <div className="flex items-center gap-3">
                                    <h2 className="text-xl md:text-2xl font-bold text-gray-900 capitalize">{category.name}</h2>
                                    <div className="flex-1 h-px bg-gradient-to-r from-orange-200 to-transparent"></div>
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
                                    {items.map((item) => (
                                        <Card
                                            key={item.id}
                                            className="group overflow-hidden hover:border-gray-300 transition-colors duration-200 shadow-xl pb-2"
                                        >
                                            <div className="p-2">
                                                <div className="relative mb-2">
                                                    <img
                                                        src={item.image || "/placeholder.svg?height=160&width=200&query=food item"}
                                                        alt={item.name}
                                                        className="w-full h-38 md:h-40 rounded object-cover"
                                                    />
                                                </div>

                                                <div className="space-y-1 pt-3">
                                                    <div className="flex justify-between items-start gap-2">
                                                        <h3 className="font-semibold text-black text-sm leading-tight line-clamp-1">{item.name}</h3>
                                                        <span className="text-gray-900 font-semibold text-sm whitespace-nowrap">
                                                            {item.price ? `Rs. ${item.price}` : "Price N/A"}
                                                        </span>
                                                    </div>
                                                    {item.description && <p className="text-xs text-gray-600 line-clamp-2">{item.description}</p>}
                                                </div>
                                            </div>
                                        </Card>
                                    ))}
                                </div>
                            </section>
                        )
                    })}
                </div>

                {Object.keys(filteredMenu).length === 0 && (
                    <div className="text-center py-12">
                        <div className="text-gray-400 mb-3">
                            <Search className="w-12 h-12 mx-auto" />
                        </div>
                        <p className="text-gray-600 text-lg">No items found matching your search</p>
                        <p className="text-gray-500 text-sm mt-1">Try searching for something else</p>
                    </div>
                )}
            </main>

            {/* Bottom Action Bar */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg p-4">
                <div className="flex gap-3 max-w-md mx-auto">
                    <Button
                        onClick={handleCallWaiter}
                        className="flex-1 text-white shadow-md hover:shadow-lg transition-all duration-200"
                        size="lg"
                    >
                        <Phone className="w-4 h-4 mr-2" />
                        Call Waiter
                    </Button>
                    <Button
                        onClick={handleAskForBill}
                        variant="outline"
                        className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 bg-transparent"
                        size="lg"
                    >
                        <Receipt className="w-4 h-4 mr-2" />
                        Ask for Bill
                    </Button>
                </div>
            </div>
        </div>
    )
}
