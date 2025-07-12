"use client"

import { ProductCard } from "@/components/product-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useStore } from "@/lib/store"
import { Search, Filter } from "lucide-react"
import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"

export default function SearchPage() {
  const { products } = useStore()
  const [filteredProducts, setFilteredProducts] = useState(products)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("relevance")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const searchParams = useSearchParams()

  useEffect(() => {
    const query = searchParams.get("q")
    if (query) {
      setSearchTerm(query)
    }
  }, [searchParams])

  useEffect(() => {
    let filtered = products

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.features.some((feature) => feature.toLowerCase().includes(searchTerm.toLowerCase())),
      )
    }

    // Filter by category
    if (categoryFilter !== "all") {
      filtered = filtered.filter((product) => product.category === categoryFilter)
    }

    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price
        case "price-high":
          return b.price - a.price
        case "rating":
          return b.rating - a.rating
        case "name":
          return a.name.localeCompare(b.name)
        case "relevance":
        default:
          // Simple relevance scoring based on search term matches
          if (!searchTerm) return a.name.localeCompare(b.name)
          const aScore =
            (a.name.toLowerCase().includes(searchTerm.toLowerCase()) ? 2 : 0) +
            (a.description.toLowerCase().includes(searchTerm.toLowerCase()) ? 1 : 0)
          const bScore =
            (b.name.toLowerCase().includes(searchTerm.toLowerCase()) ? 2 : 0) +
            (b.description.toLowerCase().includes(searchTerm.toLowerCase()) ? 1 : 0)
          return bScore - aScore
      }
    })

    setFilteredProducts(filtered)
  }, [products, searchTerm, categoryFilter, sortBy])

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            {searchTerm ? `Search Results for "${searchTerm}"` : "Search Products"}
          </h1>
          <p className="text-gray-600">
            {filteredProducts.length} {filteredProducts.length === 1 ? "product" : "products"} found
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="md:col-span-2 relative">
              <Input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="classic">Classic</SelectItem>
                <SelectItem value="standard">Standard</SelectItem>
                <SelectItem value="premium">Premium</SelectItem>
                <SelectItem value="women">Women Professional</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="relevance">Relevance</SelectItem>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="rating">Rating</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="flex items-center space-x-2 bg-transparent">
              <Filter className="w-4 h-4" />
              <span>More Filters</span>
            </Button>
          </div>
        </div>

        {/* Search Results */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No products found</h3>
            <p className="text-gray-500 mb-6">
              {searchTerm
                ? `No products match your search for "${searchTerm}". Try different keywords or browse our categories.`
                : "Start typing to search for products."}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => {
                  setSearchTerm("")
                  setCategoryFilter("all")
                  setSortBy("relevance")
                }}
                className="bg-orange-500 hover:bg-orange-600"
              >
                Clear Search
              </Button>
              <Button variant="outline" onClick={() => (window.location.href = "/products")}>
                Browse All Products
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
