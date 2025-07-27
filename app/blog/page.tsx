"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Calendar, User, ArrowRight } from "lucide-react"
import { useState } from "react"
import Image from "next/image"
import Link from "next/link"

export default function BlogPage() {
  const [searchTerm, setSearchTerm] = useState("")

  const blogPosts = [
    {
      id: "1",
      title: "NFC Technology: The Future of Business Networking",
      excerpt:
        "Discover how NFC smart business cards are revolutionizing the way professionals connect and share information.",
      author: "WR Ruku Biswas",
      date: "2024-01-15",
      category: "Technology",
      image: "/placeholder.svg?height=200&width=300",
      readTime: "5 min read",
    },
    {
      id: "2",
      title: "Digital Business Cards vs Traditional Cards: A Complete Comparison",
      excerpt:
        "Learn about the advantages of digital business cards over traditional paper cards in today's digital world.",
      author: "Sarah Khan",
      date: "2024-01-12",
      category: "Business",
      image: "/placeholder.svg?height=200&width=300",
      readTime: "7 min read",
    },
    {
      id: "3",
      title: "How to Design the Perfect NFC Business Card",
      excerpt: "Tips and best practices for creating an effective and professional NFC business card design.",
      author: "Ahmed Hassan",
      date: "2024-01-10",
      category: "Design",
      image: "/placeholder.svg?height=200&width=300",
      readTime: "6 min read",
    },
    {
      id: "4",
      title: "Sustainability in Business: Going Paperless with NFC Cards",
      excerpt: "How NFC business cards contribute to environmental sustainability and reduce paper waste.",
      author: "Mohammad Ali",
      date: "2024-01-08",
      category: "Sustainability",
      image: "/placeholder.svg?height=200&width=300",
      readTime: "4 min read",
    },
    {
      id: "5",
      title: "Networking in the Digital Age: Best Practices",
      excerpt: "Modern networking strategies and how digital tools can enhance your professional connections.",
      author: "Fatima Rahman",
      date: "2024-01-05",
      category: "Networking",
      image: "/placeholder.svg?height=200&width=300",
      readTime: "8 min read",
    },
    {
      id: "6",
      title: "SHAREINFO Success Stories: Customer Testimonials",
      excerpt: "Real stories from our customers about how SHAREINFO NFC cards transformed their business networking.",
      author: "Customer Success Team",
      date: "2024-01-03",
      category: "Success Stories",
      image: "/placeholder.svg?height=200&width=300",
      readTime: "10 min read",
    },
  ]

  const categories = ["All", "Technology", "Business", "Design", "Sustainability", "Networking", "Success Stories"]
  const [selectedCategory, setSelectedCategory] = useState("All")

  const filteredPosts = blogPosts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "All" || post.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">SHAREINFO Blog</h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-200">
              Insights, tips, and stories about NFC technology and digital networking
            </p>
            <p className="text-lg text-gray-300">
              Stay updated with the latest trends in digital business cards and networking technology.
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16">
        {/* Search and Filter */}
        <div className="mb-12">
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className={selectedCategory === category ? "bg-orange-500 hover:bg-orange-600" : "bg-transparent"}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Blog Posts Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map((post) => (
            <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <div className="relative">
                <Image
                  src={post.image || "/placeholder.svg"}
                  alt={post.title}
                  width={300}
                  height={200}
                  className="w-full h-48 object-cover"
                />
                <Badge className="absolute top-4 left-4 bg-orange-500 text-white">{post.category}</Badge>
              </div>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-3 line-clamp-2">{post.title}</h3>
                <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>

                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <User className="w-4 h-4" />
                      <span>{post.author}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>{post.date}</span>
                    </div>
                  </div>
                  <span>{post.readTime}</span>
                </div>

                <Link href={`/blog/${post.id}`}>
                  <Button variant="outline" className="w-full group bg-transparent">
                    Read More
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredPosts.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold mb-2">No articles found</h3>
            <p className="text-gray-600 mb-6">Try adjusting your search terms or category filter.</p>
            <Button
              onClick={() => {
                setSearchTerm("")
                setSelectedCategory("All")
              }}
              className="bg-orange-500 hover:bg-orange-600"
            >
              Clear Filters
            </Button>
          </div>
        )}

        {/* Newsletter Signup */}
        <Card className="mt-16 bg-gradient-to-r from-orange-500 to-red-500 text-white">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Stay Updated</h2>
            <p className="mb-6">Subscribe to our newsletter for the latest insights and updates.</p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <Input type="email" placeholder="Enter your email" className="bg-white text-gray-900" />
              <Button className="bg-white text-orange-500 hover:bg-gray-100">Subscribe</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
