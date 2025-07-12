"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"

export default function CategoriesPage() {
  const categories = [
    {
      id: "classic",
      name: "SHAREINFO Classic",
      description: "Perfect for professionals starting their digital networking journey",
      features: ["Basic NFC Technology", "Essential Contact Fields", "Standard Templates", "Community Support"],
      priceRange: "৳849 - ৳999",
      image: "/placeholder.svg?height=300&width=400",
      popular: false,
    },
    {
      id: "standard",
      name: "SHAREINFO Standard",
      description: "Enhanced features for growing businesses and professionals",
      features: ["Advanced NFC Technology", "Custom Fields", "Semi-Custom Design", "Email Support", "Basic Analytics"],
      priceRange: "৳1,274 - ৳1,499",
      image: "/placeholder.svg?height=300&width=400",
      popular: true,
    },
    {
      id: "premium",
      name: "SHAREINFO Premium",
      description: "Full-featured solution for established professionals and enterprises",
      features: [
        "Premium NFC Technology",
        "Unlimited Custom Fields",
        "Full Custom Design",
        "Priority Support",
        "Advanced Analytics",
        "Portfolio Integration",
      ],
      priceRange: "৳1,699 - ৳1,999",
      image: "/placeholder.svg?height=300&width=400",
      popular: false,
    },
    {
      id: "women",
      name: "SHAREINFO Women Professional",
      description: "Specially designed for professional women with elegant aesthetics",
      features: [
        "Elegant Women-Focused Designs",
        "Premium Materials",
        "Social Media Integration",
        "Portfolio Showcase",
        "Priority Support",
      ],
      priceRange: "৳1,399 - ৳1,649",
      image: "/placeholder.svg?height=300&width=400",
      popular: false,
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Product Categories</h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-200">
              Choose the perfect NFC business card solution for your needs
            </p>
            <p className="text-lg text-gray-300">
              From basic networking to enterprise solutions, we have the right card for every professional.
            </p>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-8">
            {categories.map((category) => (
              <Card
                key={category.id}
                className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <div className="relative">
                  {category.popular && (
                    <Badge className="absolute top-4 left-4 bg-orange-500 text-white z-10">Most Popular</Badge>
                  )}
                  <Image
                    src={category.image || "/placeholder.svg"}
                    alt={category.name}
                    width={400}
                    height={300}
                    className="w-full h-64 object-cover"
                  />
                </div>
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold mb-3">{category.name}</h3>
                  <p className="text-gray-600 mb-4">{category.description}</p>
                  <div className="mb-6">
                    <h4 className="font-semibold mb-3">Key Features:</h4>
                    <ul className="space-y-2">
                      {category.features.map((feature, index) => (
                        <li key={index} className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                          <span className="text-sm text-gray-600">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Starting from</p>
                      <p className="text-2xl font-bold text-orange-500">{category.priceRange}</p>
                    </div>
                    <Link href={`/products?category=${category.id}`}>
                      <Button className="bg-orange-500 hover:bg-orange-600">View Products</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Compare Categories</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse bg-white rounded-lg shadow-lg overflow-hidden">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-4 text-left font-semibold">Features</th>
                  <th className="p-4 text-center font-semibold">Classic</th>
                  <th className="p-4 text-center font-semibold">Standard</th>
                  <th className="p-4 text-center font-semibold">Premium</th>
                  <th className="p-4 text-center font-semibold">Women Pro</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t">
                  <td className="p-4 font-medium">NFC Technology</td>
                  <td className="p-4 text-center">Basic</td>
                  <td className="p-4 text-center">Advanced</td>
                  <td className="p-4 text-center">Premium</td>
                  <td className="p-4 text-center">Premium</td>
                </tr>
                <tr className="border-t bg-gray-50">
                  <td className="p-4 font-medium">Custom Design</td>
                  <td className="p-4 text-center">Templates</td>
                  <td className="p-4 text-center">Semi-Custom</td>
                  <td className="p-4 text-center">Full Custom</td>
                  <td className="p-4 text-center">Elegant Custom</td>
                </tr>
                <tr className="border-t">
                  <td className="p-4 font-medium">Contact Fields</td>
                  <td className="p-4 text-center">Essential</td>
                  <td className="p-4 text-center">Extended</td>
                  <td className="p-4 text-center">Unlimited</td>
                  <td className="p-4 text-center">Extended</td>
                </tr>
                <tr className="border-t bg-gray-50">
                  <td className="p-4 font-medium">Analytics</td>
                  <td className="p-4 text-center">-</td>
                  <td className="p-4 text-center">Basic</td>
                  <td className="p-4 text-center">Advanced</td>
                  <td className="p-4 text-center">Basic</td>
                </tr>
                <tr className="border-t">
                  <td className="p-4 font-medium">Support</td>
                  <td className="p-4 text-center">Community</td>
                  <td className="p-4 text-center">Email</td>
                  <td className="p-4 text-center">Priority</td>
                  <td className="p-4 text-center">Priority</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-orange-500 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Not Sure Which Category is Right for You?</h2>
          <p className="text-xl mb-8">Our experts can help you choose the perfect NFC business card solution.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <Button className="bg-white text-orange-500 hover:bg-gray-100 px-8 py-3 text-lg">
                Get Expert Advice
              </Button>
            </Link>
            <Link href="/products">
              <Button
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-orange-500 px-8 py-3 text-lg bg-transparent"
              >
                Browse All Products
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
