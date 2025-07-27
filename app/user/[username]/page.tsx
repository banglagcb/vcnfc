"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Phone,
  Mail,
  Globe,
  MapPin,
  Download,
  Share2,
  QrCode,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  Clock,
  Star,
  MessageCircle,
  ExternalLink,
  Eye,
  Users,
} from "lucide-react"
import { generateQRCode, generateVCard, downloadQRCode, downloadVCard } from "@/lib/qr-generator"

interface ProfileData {
  name: string
  title: string
  company: string
  phone: string
  email: string
  website: string
  bio: string
  address: string
  profileImage: string
  coverImage: string
  theme: string
  socialLinks: {
    facebook: string
    linkedin: string
    twitter: string
    instagram: string
    youtube: string
  }
  services: string[]
  gallery: string[]
  businessHours: {
    [key: string]: string
  }
  testimonials: Array<{
    name: string
    text: string
    rating: number
    image: string
  }>
  stats: {
    views: number
    connections: number
    rating: number
  }
}

export default function UserProfilePage({ params }: { params: { username: string } }) {
  const [profile, setProfile] = useState<ProfileData>({
    name: "আহমেদ হাসান",
    title: "সিনিয়র সফটওয়্যার ইঞ্জিনিয়ার",
    company: "টেক সলিউশন বিডি",
    phone: "+৮৮০১৭১২৩৪৫৬৭৮",
    email: "ahmed.hasan@techsolution.bd",
    website: "https://ahmedhasan.dev",
    bio: "একজন অভিজ্ঞ সফটওয়্যার ইঞ্জিনিয়ার যিনি ওয়েব ডেভেলপমেন্ট এবং মোবাইল অ্যাপ ডেভেলপমেন্টে বিশেষজ্ঞ। ১০+ বছরের অভিজ্ঞতা নিয়ে বিভিন্ন আন্তর্জাতিক প্রজেক্টে কাজ করেছি।",
    address: "গুলশান-২, ঢাকা-১২১২, বাংলাদেশ",
    profileImage: "/placeholder.svg?height=150&width=150",
    coverImage: "/placeholder.svg?height=300&width=800",
    theme: "gradient-blue",
    socialLinks: {
      facebook: "https://facebook.com/ahmedhasan",
      linkedin: "https://linkedin.com/in/ahmedhasan",
      twitter: "https://twitter.com/ahmedhasan",
      instagram: "https://instagram.com/ahmedhasan",
      youtube: "https://youtube.com/@ahmedhasan",
    },
    services: [
      "ওয়েব ডেভেলপমেন্ট",
      "মোবাইল অ্যাপ ডেভেলপমেন্ট",
      "UI/UX ডিজাইন",
      "টেকনিক্যাল কনসালটিং",
      "ডিজিটাল ট্রান্সফরমেশন",
      "ই-কমার্স সলিউশন",
    ],
    gallery: [
      "/placeholder.svg?height=300&width=400",
      "/placeholder.svg?height=300&width=400",
      "/placeholder.svg?height=300&width=400",
      "/placeholder.svg?height=300&width=400",
      "/placeholder.svg?height=300&width=400",
      "/placeholder.svg?height=300&width=400",
    ],
    businessHours: {
      রবিবার: "৯:০০ - ৬:০০",
      সোমবার: "৯:০০ - ৬:০০",
      মঙ্গলবার: "৯:০০ - ৬:০০",
      বুধবার: "৯:০০ - ৬:০০",
      বৃহস্পতিবার: "৯:০০ - ৬:০০",
      শুক্রবার: "বন্ধ",
      শনিবার: "১০:০০ - ৪:০০",
    },
    testimonials: [
      {
        name: "রহিম উদ্দিন",
        text: "আহমেদ ভাইয়ের কাজের মান অসাধারণ। আমাদের কোম্পানির ওয়েবসাইট তৈরি করে দিয়েছেন খুবই দক্ষতার সাথে।",
        rating: 5,
        image: "/placeholder.svg?height=50&width=50",
      },
      {
        name: "ফাতেমা খাতুন",
        text: "প্রফেশনাল এবং সময়মতো কাজ ডেলিভারি। অ্যাপ ডেভেলপমেন্টে তার দক্ষতা প্রশংসনীয়।",
        rating: 5,
        image: "/placeholder.svg?height=50&width=50",
      },
      {
        name: "করিম আহমেদ",
        text: "UI/UX ডিজাইনে তার সৃজনশীলতা এবং টেকনিক্যাল জ্ঞান দুটোই চমৎকার।",
        rating: 4,
        image: "/placeholder.svg?height=50&width=50",
      },
    ],
    stats: {
      views: 2847,
      connections: 156,
      rating: 4.9,
    },
  })

  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading profile data
    setTimeout(() => {
      setIsLoading(false)
    }, 1000)
  }, [])

  const themes = {
    "gradient-blue": "from-blue-500 to-purple-600",
    "gradient-green": "from-green-500 to-teal-600",
    "gradient-orange": "from-orange-500 to-red-600",
    "gradient-purple": "from-purple-500 to-pink-600",
  }

  const handleCall = () => {
    window.open(`tel:${profile.phone}`, "_self")
  }

  const handleEmail = () => {
    window.open(`mailto:${profile.email}`, "_self")
  }

  const handleWhatsApp = () => {
    const whatsappNumber = profile.phone.replace(/[^0-9]/g, "")
    window.open(`https://wa.me/${whatsappNumber}`, "_blank")
  }

  const handleSocialLink = (url: string) => {
    if (url) {
      window.open(url, "_blank")
    }
  }

  const generateAndDownloadQR = () => {
    const profileUrl = window.location.href
    const qrCode = generateQRCode(profileUrl, {
      size: 512,
      color: "#1f2937",
      backgroundColor: "#ffffff",
    })
    downloadQRCode(qrCode, `${profile.name}-qr-code.png`)
  }

  const generateAndDownloadVCard = () => {
    const vcard = generateVCard(profile)
    downloadVCard(vcard, `${profile.name}-contact.vcf`)
  }

  const shareProfile = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: profile.name,
          text: profile.bio,
          url: window.location.href,
        })
      } catch (error) {
        console.log("Error sharing:", error)
      }
    } else {
      navigator.clipboard.writeText(window.location.href)
      alert("প্রোফাইল লিংক কপি হয়েছে!")
    }
  }

  const saveContact = () => {
    generateAndDownloadVCard()
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">প্রোফাইল লোড হচ্ছে...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Cover Section */}
      <div className="relative">
        <div className="h-64 md:h-80 bg-cover bg-center" style={{ backgroundImage: `url(${profile.coverImage})` }}>
          <div
            className={`absolute inset-0 bg-gradient-to-br ${themes[profile.theme as keyof typeof themes]} opacity-80`}
          ></div>
        </div>

        {/* Profile Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row items-center md:items-end gap-6">
              <Avatar className="h-32 w-32 border-4 border-white shadow-lg">
                <AvatarImage src={profile.profileImage || "/placeholder.svg"} />
                <AvatarFallback className="text-2xl">{profile.name.charAt(0)}</AvatarFallback>
              </Avatar>

              <div className="text-center md:text-left text-white flex-1">
                <h1 className="text-3xl md:text-4xl font-bold mb-2">{profile.name}</h1>
                <p className="text-xl opacity-90 mb-1">{profile.title}</p>
                <p className="text-lg opacity-75">{profile.company}</p>

                {/* Stats */}
                <div className="flex justify-center md:justify-start gap-6 mt-4">
                  <div className="text-center">
                    <div className="flex items-center gap-1">
                      <Eye className="h-4 w-4" />
                      <span className="font-semibold">{profile.stats.views}</span>
                    </div>
                    <span className="text-sm opacity-75">ভিউ</span>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      <span className="font-semibold">{profile.stats.connections}</span>
                    </div>
                    <span className="text-sm opacity-75">কানেকশন</span>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-current" />
                      <span className="font-semibold">{profile.stats.rating}</span>
                    </div>
                    <span className="text-sm opacity-75">রেটিং</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* About Section */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-4">আমার সম্পর্কে</h2>
                <p className="text-gray-700 leading-relaxed">{profile.bio}</p>
              </CardContent>
            </Card>

            {/* Services Section */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-4">আমার সেবাসমূহ</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {profile.services.map((service, index) => (
                    <Badge key={index} variant="secondary" className="p-2 text-center justify-center">
                      {service}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Gallery Section */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-4">পোর্টফোলিও গ্যালারি</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {profile.gallery.map((image, index) => (
                    <div key={index} className="relative group cursor-pointer">
                      <img
                        src={image || "/placeholder.svg"}
                        alt={`Portfolio ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg transition-transform group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                        <ExternalLink className="h-6 w-6 text-white" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Testimonials Section */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-4">ক্লায়েন্ট রিভিউ</h2>
                <div className="space-y-4">
                  {profile.testimonials.map((testimonial, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-start gap-4">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={testimonial.image || "/placeholder.svg"} />
                          <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-semibold">{testimonial.name}</h4>
                            <div className="flex">
                              {[...Array(testimonial.rating)].map((_, i) => (
                                <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                              ))}
                            </div>
                          </div>
                          <p className="text-gray-700">{testimonial.text}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Contact Actions */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-4">যোগাযোগ করুন</h3>
                <div className="space-y-3">
                  <Button onClick={handleCall} className="w-full" size="lg">
                    <Phone className="h-4 w-4 mr-2" />
                    কল করুন
                  </Button>
                  <Button onClick={handleEmail} variant="outline" className="w-full bg-transparent" size="lg">
                    <Mail className="h-4 w-4 mr-2" />
                    ইমেইল পাঠান
                  </Button>
                  <Button onClick={handleWhatsApp} variant="outline" className="w-full bg-transparent" size="lg">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    হোয়াটসঅ্যাপ
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Contact Info */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-4">যোগাযোগের তথ্য</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">{profile.phone}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">{profile.email}</span>
                  </div>
                  {profile.website && (
                    <div className="flex items-center gap-3">
                      <Globe className="h-4 w-4 text-gray-500" />
                      <a
                        href={profile.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:underline"
                      >
                        ওয়েবসাইট দেখুন
                      </a>
                    </div>
                  )}
                  <div className="flex items-start gap-3">
                    <MapPin className="h-4 w-4 text-gray-500 mt-1" />
                    <span className="text-sm">{profile.address}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Business Hours */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  কাজের সময়
                </h3>
                <div className="space-y-2">
                  {Object.entries(profile.businessHours).map(([day, hours]) => (
                    <div key={day} className="flex justify-between text-sm">
                      <span className="font-medium">{day}</span>
                      <span className={hours === "বন্ধ" ? "text-red-600" : "text-green-600"}>{hours}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Social Links */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-4">সোশ্যাল মিডিয়া</h3>
                <div className="grid grid-cols-3 gap-3">
                  {profile.socialLinks.facebook && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSocialLink(profile.socialLinks.facebook)}
                      className="p-2"
                    >
                      <Facebook className="h-4 w-4 text-blue-600" />
                    </Button>
                  )}
                  {profile.socialLinks.linkedin && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSocialLink(profile.socialLinks.linkedin)}
                      className="p-2"
                    >
                      <Linkedin className="h-4 w-4 text-blue-700" />
                    </Button>
                  )}
                  {profile.socialLinks.twitter && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSocialLink(profile.socialLinks.twitter)}
                      className="p-2"
                    >
                      <Twitter className="h-4 w-4 text-blue-400" />
                    </Button>
                  )}
                  {profile.socialLinks.instagram && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSocialLink(profile.socialLinks.instagram)}
                      className="p-2"
                    >
                      <Instagram className="h-4 w-4 text-pink-600" />
                    </Button>
                  )}
                  {profile.socialLinks.youtube && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSocialLink(profile.socialLinks.youtube)}
                      className="p-2"
                    >
                      <Youtube className="h-4 w-4 text-red-600" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-4">অ্যাকশন</h3>
                <div className="space-y-3">
                  <Button onClick={saveContact} variant="outline" className="w-full bg-transparent">
                    <Download className="h-4 w-4 mr-2" />
                    কন্ট্যাক্ট সেভ করুন
                  </Button>
                  <Button onClick={generateAndDownloadQR} variant="outline" className="w-full bg-transparent">
                    <QrCode className="h-4 w-4 mr-2" />
                    QR কোড ডাউনলোড
                  </Button>
                  <Button onClick={shareProfile} variant="outline" className="w-full bg-transparent">
                    <Share2 className="h-4 w-4 mr-2" />
                    প্রোফাইল শেয়ার
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
