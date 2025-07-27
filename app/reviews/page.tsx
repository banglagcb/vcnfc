"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, ThumbsUp, MessageSquare } from "lucide-react"
import { useState } from "react"
import Image from "next/image"

export default function ReviewsPage() {
  const [filter, setFilter] = useState("all")

  const reviews = [
    {
      id: "1",
      name: "Ahmed Hassan",
      company: "Tech Solutions Ltd",
      rating: 5,
      date: "2024-01-15",
      verified: true,
      product: "SHAREINFO Premium",
      review:
        "Absolutely amazing! The NFC card works flawlessly and the design is very professional. I've received so many compliments and it's made networking much easier. The analytics feature is a great bonus.",
      helpful: 24,
      avatar: "/placeholder.svg?height=50&width=50",
    },
    {
      id: "2",
      name: "Sarah Khan",
      company: "Digital Marketing Agency",
      rating: 5,
      date: "2024-01-12",
      verified: true,
      product: "SHAREINFO Standard",
      review:
        "Great quality and excellent customer service. The card arrived quickly and setup was very easy. Love how I can update my information anytime without needing new cards.",
      helpful: 18,
      avatar: "/placeholder.svg?height=50&width=50",
    },
    {
      id: "3",
      name: "Mohammad Ali",
      company: "Business Consultant",
      rating: 4,
      date: "2024-01-10",
      verified: true,
      product: "SHAREINFO Classic",
      review:
        "Good value for money. The basic features work well and it's perfect for someone just starting with digital business cards. Would recommend for beginners.",
      helpful: 12,
      avatar: "/placeholder.svg?height=50&width=50",
    },
    {
      id: "4",
      name: "Fatima Rahman",
      company: "Creative Designer",
      rating: 5,
      date: "2024-01-08",
      verified: true,
      product: "SHAREINFO Women Professional",
      review:
        "Love the elegant design options! As a female professional, I appreciate the thoughtful design choices. The card quality is excellent and the NFC technology works perfectly.",
      helpful: 31,
      avatar: "/placeholder.svg?height=50&width=50",
    },
    {
      id: "5",
      name: "Karim Hassan",
      company: "Startup Founder",
      rating: 5,
      date: "2024-01-05",
      verified: true,
      product: "SHAREINFO Premium",
      review:
        "Best investment for my business! The premium features are worth every penny. The portfolio showcase and analytics have helped me track my networking effectiveness.",
      helpful: 27,
      avatar: "/placeholder.svg?height=50&width=50",
    },
  ]

  const stats = {
    totalReviews: 1247,
    averageRating: 4.8,
    fiveStars: 89,
    fourStars: 8,
    threeStars: 2,
    twoStars: 1,
    oneStars: 0,
  }

  const filteredReviews =
    filter === "all" ? reviews : reviews.filter((review) => review.rating === Number.parseInt(filter))

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Customer Reviews</h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-200">
              See what our customers say about SHAREINFO NFC cards
            </p>
            <div className="flex items-center justify-center space-x-4">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-6 h-6 text-yellow-400 fill-current" />
                ))}
              </div>
              <span className="text-2xl font-bold">{stats.averageRating}</span>
              <span className="text-gray-300">({stats.totalReviews} reviews)</span>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16">
        {/* Review Stats */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle>Review Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <div className="text-center mb-6">
                  <div className="text-4xl font-bold mb-2">{stats.averageRating}</div>
                  <div className="flex items-center justify-center mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <div className="text-gray-600">{stats.totalReviews} total reviews</div>
                </div>
              </div>
              <div className="space-y-3">
                {[5, 4, 3, 2, 1].map((rating) => (
                  <div key={rating} className="flex items-center space-x-3">
                    <span className="text-sm w-8">{rating} ★</span>
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-yellow-400 h-2 rounded-full"
                        style={{
                          width: `${
                            rating === 5
                              ? stats.fiveStars
                              : rating === 4
                                ? stats.fourStars
                                : rating === 3
                                  ? stats.threeStars
                                  : rating === 2
                                    ? stats.twoStars
                                    : stats.oneStars
                          }%`,
                        }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-600 w-12">
                      {rating === 5
                        ? stats.fiveStars
                        : rating === 4
                          ? stats.fourStars
                          : rating === 3
                            ? stats.threeStars
                            : rating === 2
                              ? stats.twoStars
                              : stats.oneStars}
                      %
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-2 mb-8">
          <Button
            variant={filter === "all" ? "default" : "outline"}
            onClick={() => setFilter("all")}
            className={filter === "all" ? "bg-orange-500 hover:bg-orange-600" : "bg-transparent"}
          >
            All Reviews
          </Button>
          {[5, 4, 3, 2, 1].map((rating) => (
            <Button
              key={rating}
              variant={filter === rating.toString() ? "default" : "outline"}
              onClick={() => setFilter(rating.toString())}
              className={filter === rating.toString() ? "bg-orange-500 hover:bg-orange-600" : "bg-transparent"}
            >
              {rating} Stars
            </Button>
          ))}
        </div>

        {/* Reviews List */}
        <div className="space-y-6">
          {filteredReviews.map((review) => (
            <Card key={review.id}>
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <Image
                    src={review.avatar || "/placeholder.svg"}
                    alt={review.name}
                    width={50}
                    height={50}
                    className="rounded-full"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h3 className="font-semibold">{review.name}</h3>
                        <p className="text-sm text-gray-600">{review.company}</p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center space-x-1 mb-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < review.rating ? "text-yellow-400 fill-current" : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                        <p className="text-sm text-gray-500">{review.date}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 mb-3">
                      <Badge variant="secondary">{review.product}</Badge>
                      {review.verified && <Badge className="bg-green-100 text-green-800">Verified Purchase</Badge>}
                    </div>

                    <p className="text-gray-700 mb-4">{review.review}</p>

                    <div className="flex items-center space-x-4">
                      <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-800">
                        <ThumbsUp className="w-4 h-4 mr-1" />
                        Helpful ({review.helpful})
                      </Button>
                      <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-800">
                        <MessageSquare className="w-4 h-4 mr-1" />
                        Reply
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Write Review CTA */}
        <Card className="mt-12 bg-gradient-to-r from-orange-500 to-red-500 text-white">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Share Your Experience</h2>
            <p className="mb-6">Have you used SHAREINFO NFC cards? We'd love to hear about your experience!</p>
            <Button className="bg-white text-orange-500 hover:bg-gray-100">Write a Review</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
