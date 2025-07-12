"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Users, Target, Award, Globe } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">About SHAREINFO</h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-200">
              Revolutionizing business networking with smart NFC technology
            </p>
            <p className="text-lg text-gray-300 leading-relaxed">
              We are pioneers in digital business card solutions, helping professionals and businesses create meaningful
              connections through innovative NFC technology.
            </p>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Our Story</h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Founded in 2020, SHAREINFO emerged from a simple yet powerful idea: to eliminate the limitations of
                traditional paper business cards and create a seamless, eco-friendly networking solution.
              </p>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Our journey began when our founders experienced the frustration of running out of business cards at a
                crucial networking event. This sparked the vision to create a digital solution that would never run out,
                never get lost, and always stay updated.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Today, we serve thousands of professionals across Bangladesh and beyond, helping them build stronger
                business relationships through our innovative NFC business cards.
              </p>
            </div>
            <div className="relative">
              <Image
                src="/placeholder.svg?height=400&width=500"
                alt="SHAREINFO team working"
                width={500}
                height={400}
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="p-8 text-center">
              <CardContent className="pt-0">
                <Target className="w-16 h-16 text-orange-500 mx-auto mb-6" />
                <h3 className="text-2xl font-bold mb-4">Our Mission</h3>
                <p className="text-gray-600 leading-relaxed">
                  To empower professionals and businesses with cutting-edge digital networking solutions that are
                  sustainable, efficient, and always accessible. We strive to make networking seamless and
                  environmentally responsible.
                </p>
              </CardContent>
            </Card>
            <Card className="p-8 text-center">
              <CardContent className="pt-0">
                <Globe className="w-16 h-16 text-orange-500 mx-auto mb-6" />
                <h3 className="text-2xl font-bold mb-4">Our Vision</h3>
                <p className="text-gray-600 leading-relaxed">
                  To become the leading digital business card platform globally, transforming how professionals connect
                  and share information while contributing to a paperless, sustainable future.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Our Values</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Award className="w-10 h-10 text-orange-500" />
              </div>
              <h3 className="text-xl font-bold mb-4">Innovation</h3>
              <p className="text-gray-600">
                We continuously innovate to provide cutting-edge solutions that meet evolving business needs.
              </p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="w-10 h-10 text-orange-500" />
              </div>
              <h3 className="text-xl font-bold mb-4">Customer Focus</h3>
              <p className="text-gray-600">
                Our customers are at the heart of everything we do. We listen, understand, and deliver.
              </p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Globe className="w-10 h-10 text-orange-500" />
              </div>
              <h3 className="text-xl font-bold mb-4">Sustainability</h3>
              <p className="text-gray-600">
                We're committed to environmental responsibility through paperless digital solutions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Meet Our Team</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center overflow-hidden">
              <Image
                src="/placeholder.svg?height=300&width=300"
                alt="CEO"
                width={300}
                height={300}
                className="w-full h-64 object-cover"
              />
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-2">Md. Rahman Ahmed</h3>
                <p className="text-orange-500 font-medium mb-3">CEO & Founder</p>
                <p className="text-gray-600 text-sm">
                  Visionary leader with 10+ years in tech innovation and business development.
                </p>
              </CardContent>
            </Card>
            <Card className="text-center overflow-hidden">
              <Image
                src="/placeholder.svg?height=300&width=300"
                alt="CTO"
                width={300}
                height={300}
                className="w-full h-64 object-cover"
              />
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-2">Sarah Khan</h3>
                <p className="text-orange-500 font-medium mb-3">CTO</p>
                <p className="text-gray-600 text-sm">
                  Technology expert specializing in NFC solutions and mobile app development.
                </p>
              </CardContent>
            </Card>
            <Card className="text-center overflow-hidden">
              <Image
                src="/placeholder.svg?height=300&width=300"
                alt="Head of Design"
                width={300}
                height={300}
                className="w-full h-64 object-cover"
              />
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-2">Karim Hassan</h3>
                <p className="text-orange-500 font-medium mb-3">Head of Design</p>
                <p className="text-gray-600 text-sm">
                  Creative designer focused on user experience and innovative card designs.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16 md:py-24 bg-orange-500 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Join the Digital Revolution?</h2>
          <p className="text-xl mb-8">Get your SHAREINFO NFC card today and transform your networking experience.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/products">
              <Button className="bg-white text-orange-500 hover:bg-gray-100 px-8 py-3 text-lg">Shop Now</Button>
            </Link>
            <Link href="/contact">
              <Button
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-orange-500 px-8 py-3 text-lg bg-transparent"
              >
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
