"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
  Phone,
  Mail,
  MapPin,
  Globe,
  MessageSquare,
  QrCode,
  Share2,
  Facebook,
  Instagram,
  ExternalLink,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { useParams } from "next/navigation"

export default function UserProfilePage() {
  const params = useParams()
  const username = params.username as string
  const [showContactForm, setShowContactForm] = useState(false)
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    message: "",
  })

  // Mock user data - in real app, fetch based on username
  const userProfile = {
    name: "WR RUKU BISWAS",
    title: "Managing Director & CEO",
    company: "SHAREINFO",
    bio: "Hello, I am the Managing Director & CEO of SHAREINFO. Working with new technology NFC smart business card.",
    phone: "+8801723-128440",
    email: "wr.biswas21@gmail.com",
    website: "www.sales.shareinfobd.com",
    address: "764, 5th Floor, West Shewrapara, Mirpur, Dhaka-1216 (Metro Rail Pillar No 304)",
    profileImage: "/placeholder.svg?height=200&width=200",
    coverImage: "/placeholder.svg?height=300&width=800",
    socialLinks: [
      { platform: "Facebook", url: "https://facebook.com/shareinfo", icon: "facebook" },
      { platform: "Instagram", url: "https://instagram.com/shareinfo", icon: "instagram" },
      { platform: "TikTok", url: "https://tiktok.com/@shareinfo", icon: "tiktok" },
      { platform: "WhatsApp", url: "https://wa.me/8801723128440", icon: "whatsapp" },
      { platform: "Telegram", url: "https://t.me/shareinfo", icon: "telegram" },
    ],
    gallery: [
      "/placeholder.svg?height=200&width=300",
      "/placeholder.svg?height=200&width=300",
      "/placeholder.svg?height=200&width=300",
      "/placeholder.svg?height=200&width=300",
      "/placeholder.svg?height=200&width=300",
      "/placeholder.svg?height=200&width=300",
    ],
    testimonials: [
      {
        name: "Ahmed Hassan",
        company: "Tech Solutions Ltd",
        message: "SHAREINFO NFC cards have revolutionized our networking. Highly professional and efficient!",
        rating: 5,
      },
      {
        name: "Sarah Khan",
        company: "Digital Marketing Agency",
        message: "Amazing quality and customer service. The NFC technology works flawlessly.",
        rating: 5,
      },
      {
        name: "Mohammad Ali",
        company: "Business Consultant",
        message: "Best investment for modern networking. The customization options are excellent.",
        rating: 5,
      },
    ],
  }

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    alert("Thank you for your message! We'll get back to you soon.")
    setContactForm({ name: "", email: "", message: "" })
    setShowContactForm(false)
  }

  const downloadQRCode = () => {
    // Generate and download QR code
    alert("QR Code downloaded!")
  }

  const shareProfile = () => {
    if (navigator.share) {
      navigator.share({
        title: `${userProfile.name} - ${userProfile.title}`,
        text: userProfile.bio,
        url: window.location.href,
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      alert("Profile link copied to clipboard!")
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header/Cover Section */}
      <div className="relative">
        <div className="h-64 bg-gradient-to-r from-blue-600 via-purple-600 to-orange-500 overflow-hidden">
          <Image
            src={userProfile.coverImage || "/placeholder.svg"}
            alt="Cover"
            width={800}
            height={300}
            className="w-full h-full object-cover opacity-30"
          />
        </div>
        <div className="absolute -bottom-20 left-1/2 transform -translate-x-1/2">
          <Image
            src={userProfile.profileImage || "/placeholder.svg"}
            alt={userProfile.name}
            width={160}
            height={160}
            className="w-40 h-40 rounded-full border-4 border-white shadow-lg bg-white"
          />
        </div>
      </div>

      <div className="container mx-auto px-4 pt-24 pb-8">
        {/* Profile Info */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">{userProfile.name}</h1>
          <p className="text-xl text-gray-600 mb-2">{userProfile.title}</p>
          <p className="text-lg text-orange-500 font-semibold mb-4">{userProfile.company}</p>
          <p className="text-gray-700 max-w-2xl mx-auto leading-relaxed">{userProfile.bio}</p>
        </div>

        {/* Contact Actions */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          <Link href={`tel:${userProfile.phone}`}>
            <Button className="bg-green-500 hover:bg-green-600 text-white">
              <Phone className="w-4 h-4 mr-2" />
              Call Me
            </Button>
          </Link>
          <Link href={`https://wa.me/${userProfile.phone.replace(/[^0-9]/g, "")}`} target="_blank">
            <Button className="bg-green-600 hover:bg-green-700 text-white">
              <MessageSquare className="w-4 h-4 mr-2" />
              Connect WhatsApp
            </Button>
          </Link>
          <Link href="https://t.me/shareinfo" target="_blank">
            <Button className="bg-blue-500 hover:bg-blue-600 text-white">
              <MessageSquare className="w-4 h-4 mr-2" />
              Telegram
            </Button>
          </Link>
          <Link href={`mailto:${userProfile.email}`}>
            <Button className="bg-red-500 hover:bg-red-600 text-white">
              <Mail className="w-4 h-4 mr-2" />
              Email
            </Button>
          </Link>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-orange-500" />
                  <span>{userProfile.phone}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-orange-500" />
                  <span>{userProfile.email}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Globe className="w-5 h-5 text-orange-500" />
                  <Link
                    href={`https://${userProfile.website}`}
                    target="_blank"
                    className="text-blue-500 hover:underline"
                  >
                    {userProfile.website}
                  </Link>
                </div>
                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-orange-500 mt-1" />
                  <span>{userProfile.address}</span>
                </div>
              </CardContent>
            </Card>

            {/* Social Links */}
            <Card>
              <CardHeader>
                <CardTitle>My Card Links</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <Link href="https://facebook.com/shareinfo" target="_blank">
                    <Button variant="outline" className="w-full justify-start bg-transparent">
                      <Facebook className="w-4 h-4 mr-2 text-blue-600" />
                      View Facebook Profile
                    </Button>
                  </Link>
                  <Link href="https://facebook.com/shareinfo" target="_blank">
                    <Button variant="outline" className="w-full justify-start bg-transparent">
                      <Facebook className="w-4 h-4 mr-2 text-blue-600" />
                      Follow Shareinfo FB Page
                    </Button>
                  </Link>
                  <Link href="https://instagram.com/shareinfo" target="_blank">
                    <Button variant="outline" className="w-full justify-start bg-transparent">
                      <Instagram className="w-4 h-4 mr-2 text-pink-600" />
                      Follow Instagram
                    </Button>
                  </Link>
                  <Link href="https://tiktok.com/@shareinfo" target="_blank">
                    <Button variant="outline" className="w-full justify-start bg-transparent">
                      <ExternalLink className="w-4 h-4 mr-2 text-black" />
                      Follow TikTok
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Image Gallery */}
            <Card>
              <CardHeader>
                <CardTitle>Image Gallery</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {userProfile.gallery.map((image, index) => (
                    <div key={index} className="aspect-square rounded-lg overflow-hidden">
                      <Image
                        src={image || "/placeholder.svg"}
                        alt={`Gallery ${index + 1}`}
                        width={200}
                        height={200}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300 cursor-pointer"
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Testimonials */}
            <Card>
              <CardHeader>
                <CardTitle>Testimonials</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {userProfile.testimonials.map((testimonial, index) => (
                    <div key={index} className="border-l-4 border-orange-500 pl-4">
                      <p className="text-gray-700 mb-2">"{testimonial.message}"</p>
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold">{testimonial.name}</span>
                        <span className="text-gray-500">-</span>
                        <span className="text-gray-600">{testimonial.company}</span>
                      </div>
                      <div className="flex items-center mt-1">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <span key={i} className="text-yellow-400">
                            ★
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button onClick={downloadQRCode} className="w-full bg-orange-500 hover:bg-orange-600">
                  <QrCode className="w-4 h-4 mr-2" />
                  Download My QR Code
                </Button>
                <Button onClick={shareProfile} variant="outline" className="w-full bg-transparent">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share Profile
                </Button>
                <Button
                  onClick={() => setShowContactForm(!showContactForm)}
                  variant="outline"
                  className="w-full bg-transparent"
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Send Message
                </Button>
              </CardContent>
            </Card>

            {/* Contact Form */}
            {showContactForm && (
              <Card>
                <CardHeader>
                  <CardTitle>Enquiry Form</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleContactSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        value={contactForm.name}
                        onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={contactForm.email}
                        onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="message">Message</Label>
                      <Textarea
                        id="message"
                        value={contactForm.message}
                        onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                        rows={4}
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full bg-orange-500 hover:bg-orange-600">
                      Send Message
                    </Button>
                  </form>
                </CardContent>
              </Card>
            )}

            {/* Profile Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Profile Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Profile Views</span>
                    <Badge variant="secondary">1,247</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Card Taps</span>
                    <Badge variant="secondary">892</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Contacts Saved</span>
                    <Badge variant="secondary">456</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 pt-8 border-t border-gray-200">
          <p className="text-gray-600">Copyright © 2023, SHAREINFO.</p>
        </div>
      </div>
    </div>
  )
}
