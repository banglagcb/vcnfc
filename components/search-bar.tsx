"use client"

import type React from "react"

import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { useStore } from "@/lib/store"
import { useEffect } from "react"
import { useRouter } from "next/navigation"

export function SearchBar() {
  const { searchQuery, setSearchQuery, products, setSearchResults } = useStore()
  const router = useRouter()

  useEffect(() => {
    if (searchQuery.trim()) {
      const results = products.filter(
        (product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.category.toLowerCase().includes(searchQuery.toLowerCase()),
      )
      setSearchResults(results)
    } else {
      setSearchResults([])
    }
  }, [searchQuery, products, setSearchResults])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`)
    }
  }

  return (
    <form onSubmit={handleSearch} className="flex-1 max-w-md mx-4 relative hidden md:block">
      <Input
        type="text"
        placeholder="I am searching for..."
        className="pl-10 pr-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-1 focus:ring-orange-500"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
    </form>
  )
}
