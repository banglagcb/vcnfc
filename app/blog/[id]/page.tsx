"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, User, Clock, Share2, ArrowLeft } from "lucide-react"
import { useParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"

export default function BlogPostPage() {
  const params = useParams()
  const postId = params.id as string

  // Mock blog post data
  const blogPost = {
    id: postId,
    title: "NFC Technology: The Future of Business Networking",
    content: `
      <p>Near Field Communication (NFC) technology has revolutionized the way we share information and connect with others. In the business world, NFC smart business cards are becoming the new standard for professional networking.</p>
      
      <h2>What is NFC Technology?</h2>
      <p>NFC is a short-range wireless communication technology that enables devices to exchange data when they are brought close together, typically within 4 centimeters. This technology has found numerous applications, from contactless payments to smart business cards.</p>
      
      <h2>Benefits of NFC Business Cards</h2>
      <ul>
        <li><strong>Instant Information Sharing:</strong> Share your contact information with just a tap</li>
        <li><strong>Always Updated:</strong> Update your information anytime without reprinting cards</li>
        <li><strong>Eco-Friendly:</strong> Reduce paper waste and contribute to sustainability</li>
        <li><strong>Professional Image:</strong> Stand out with cutting-edge technology</li>
        <li><strong>Analytics:</strong> Track how many people viewed your information</li>
      </ul>
      
      <h2>How SHAREINFO is Leading the Revolution</h2>
      <p>At SHAREINFO, we're at the forefront of this technological revolution. Our NFC smart business cards combine elegant design with powerful functionality, helping professionals make lasting connections in the digital age.</p>
      
      <p>Our cards support multiple contact methods, social media links, portfolio showcases, and much more. With customizable designs and themes, each card reflects your unique professional identity.</p>
      
      <h2>The Future of Networking</h2>
      <p>As we move towards an increasingly digital world, traditional paper business cards are becoming obsolete. NFC technology represents the future of professional networking, offering convenience, sustainability, and enhanced functionality that paper cards simply cannot match.</p>
      
      <p>Join thousands of professionals who have already made the switch to SHAREINFO NFC smart business cards and experience the future of networking today.</p>
    `,
    author: "WR Ruku Biswas",
    date: "2024-01-15",
    category: "Technology",
    image: "/placeholder.svg?height=400&width=800",
    readTime: "5 min read",
    tags: ["NFC", "Technology", "Business Cards", "Networking", "Digital"],
  }

  const relatedPosts = [
    {
      id: "2",
      title: "Digital Business Cards vs Traditional Cards",
      image: "/placeholder.svg?height=150&width=200",
      date: "2024-01-12",
    },
    {
      id: "3",
      title: "How to Design the Perfect NFC Business Card",
      image: "/placeholder.svg?height=150&width=200",
      date: "2024-01-10",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Link href="/blog">
          <Button variant="outline" className="mb-8 bg-transparent">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Blog
          </Button>
        </Link>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <Card>
              <div className="relative">
                <Image
                  src={blogPost.image || "/placeholder.svg"}
                  alt={blogPost.title}
                  width={800}
                  height={400}
                  className="w-full h-64 md:h-80 object-cover rounded-t-lg"
                />
                <Badge className="absolute top-4 left-4 bg-orange-500 text-white">{blogPost.category}</Badge>
              </div>

              <CardContent className="p-8">
                <h1 className="text-3xl md:text-4xl font-bold mb-6">{blogPost.title}</h1>

                <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600 mb-8">
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4" />
                    <span>{blogPost.author}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4" />
                    <span>{blogPost.date}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4" />
                    <span>{blogPost.readTime}</span>
                  </div>
                  <Button size="sm" variant="outline" className="bg-transparent">
                    <Share2 className="w-4 h-4 mr-2" />
                    Share
                  </Button>
                </div>

                <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: blogPost.content }} />

                {/* Tags */}
                <div className="mt-8 pt-8 border-t">
                  <h3 className="font-semibold mb-4">Tags:</h3>
                  <div className="flex flex-wrap gap-2">
                    {blogPost.tags.map((tag) => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Author Info */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">About the Author</h3>
                <div className="flex items-center space-x-3 mb-3">
                  <Image
                    src="/placeholder.svg?height=50&width=50"
                    alt={blogPost.author}
                    width={50}
                    height={50}
                    className="rounded-full"
                  />
                  <div>
                    <p className="font-medium">{blogPost.author}</p>
                    <p className="text-sm text-gray-600">CEO, SHAREINFO</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600">
                  Technology enthusiast and business leader passionate about digital innovation and networking
                  solutions.
                </p>
              </CardContent>
            </Card>

            {/* Related Posts */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Related Articles</h3>
                <div className="space-y-4">
                  {relatedPosts.map((post) => (
                    <Link key={post.id} href={`/blog/${post.id}`}>
                      <div className="flex space-x-3 hover:bg-gray-50 p-2 rounded-lg transition-colors">
                        <Image
                          src={post.image || "/placeholder.svg"}
                          alt={post.title}
                          width={60}
                          height={60}
                          className="rounded object-cover"
                        />
                        <div>
                          <p className="font-medium text-sm line-clamp-2">{post.title}</p>
                          <p className="text-xs text-gray-500 mt-1">{post.date}</p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Newsletter */}
            <Card className="bg-orange-500 text-white">
              <CardContent className="p-6 text-center">
                <h3 className="font-semibold mb-2">Stay Updated</h3>
                <p className="text-sm mb-4">Get the latest articles delivered to your inbox.</p>
                <Button className="w-full bg-white text-orange-500 hover:bg-gray-100">Subscribe Now</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
