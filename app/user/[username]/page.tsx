"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
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
  Calendar,
  Award,
  Briefcase,
  Heart,
  Send,
  Copy,
  CheckCircle,
} from "lucide-react"
import { generateQRCode, generateVCard, downloadQRCode, downloadVCard, shareProfile } from "@/lib/qr-generator"
import Image from "next/image"
import Link from "next/link"

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
    [key: string]: string
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
    company: string
    date: string
  }>
  stats: {
    views: number
    connections: number
    rating: number
    experience: string
    projects: number
  }
  achievements: Array<{
    title: string
    description: string
    date: string
    icon: string
  }>
}

export default function UserProfilePage({ params }: { params: { username: string } }) {
  const [profile, setProfile] = useState<ProfileData>({
    name: "আহমেদ হাসান",
    title: "সিনিয়র সফটওয়্যার ইঞ্জিনিয়ার",
    company: "টেক সলিউশন বিডি",
    phone: "+৮৮০১৭১২৩৪৫৬৭৮",
    email: "ahmed.hasan@techsolution.bd",
    website: "https://ahmedhasan.dev",
    bio: "একজন অভিজ্ঞ সফটওয়্যার ইঞ্জিনিয়ার যিনি ওয়েব ডেভেলপমেন্ট এবং মোবাইল অ্যাপ ডেভেলপমেন্টে বিশেষজ্ঞ। ১০+ বছরের অভিজ্ঞতা নিয়ে বিভিন্ন আন্তর্জাতিক প্রজেক্টে কাজ করেছি। আমার লক্ষ্য হলো প্রযুক্তির মাধ্যমে মানুষের জীবনকে সহজ করা।",
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
        text: "আহমেদ ভাইয়ের কাজের মান অসাধারণ। আমাদের কোম্পানির ওয়েবসাইট তৈরি করে দিয়েছেন খুবই দক্ষতার সাথে। সময়মতো ডেলিভারি এবং চমৎকার সাপোর্ট।",
        rating: 5,
        image: "/placeholder.svg?height=50&width=50",
        company: "ডিজিটাল এজেন্সি লিমিটেড",
        date: "২০২৩-১২-১৫",
      },
      {
        name: "ফাতেমা খাতুন",
        text: "প্রফেশনাল এবং সময়মতো কাজ ডেলিভারি। অ্যাপ ডেভেলপমেন্টে তার দক্ষতা প্রশংসনীয়। আমাদের ব্যবসার জন্য একটি দুর্দান্ত মোবাইল অ্যাপ তৈরি করেছেন।",
        rating: 5,
        image: "/placeholder.svg?height=50&width=50",
        company: "ই-কমার্স বিজনেস",
        date: "২০২৩-১১-২৮",
      },
      {
        name: "করিম আহমেদ",
        text: "UI/UX ডিজাইনে তার সৃজনশীলতা এবং টেকনিক্যাল জ্ঞান দুটোই চমৎকার। ক্লায়েন্টের চাহিদা বুঝে কাজ করেন এবং সর্বদা সাহায্য করতে প্রস্তুত।",
        rating: 4,
        image: "/placeholder.svg?height=50&width=50",
        company: "স্টার্টআপ কোম্পানি",
        date: "২০২৩-১০-১০",
      },
    ],
    stats: {
      views: 2847,
      connections: 156,
      rating: 4.9,
      experience: "১০+ বছর",
      projects: 85,
    },
    achievements: [
      {
        title: "বেস্ট ডেভেলপার অ্যাওয়ার্ড",
        description: "টেক কনফারেন্স ২০২৩ এ সেরা ডেভেলপার হিসেবে পুরস্কৃত",
        date: "২০২ৃ-০৯-১৫",
        icon: "award",
      },
      {
        title: "১০০+ প্রজেক্ট সম্পন্ন",
        description: "সফলভাবে ১০০টিরও বেশি প্রজেক্ট সম্পন্ন করেছি",
        date: "২০২৩-০৮-০১",
        icon: "briefcase",
      },
    ],
  })

  const [isLoading, setIsLoading] = useState(true)
  const [showContactForm, setShowContactForm] = useState(false)
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)

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

  const handleShareProfile = async () => {
    await shareProfile(profile, window.location.href)
  }

  const copyProfileLink = () => {
    navigator.clipboard.writeText(window.location.href)
    alert("প্রোফাইল লিংক কপি হয়েছে!")
  }

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false)
      setSubmitSuccess(true)
      setContactForm({ name: "", email: "", message: "" })
      setTimeout(() => {
        setSubmitSuccess(false)
        setShowContactForm(false)
      }, 2000)
    }, 1000)
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
          <div className="max-w-6xl mx-auto">
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
                  <div className="text-center">
                    <div className="flex items-center gap-1">
                      <Briefcase className="h-4 w-4" />
                      <span className="font-semibold">{profile.stats.projects}</span>
                    </div>
                    <span className="text-sm opacity-75">প্রজেক্ট</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Contact Actions */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          <Button onClick={handleCall} className="bg-green-500 hover:bg-green-600 text-white">
            <Phone className="w-4 h-4 mr-2" />
            কল করুন
          </Button>
          <Button onClick={handleWhatsApp} className="bg-green-600 hover:bg-green-700 text-white">
            <MessageCircle className="w-4 h-4 mr-2" />
            হোয়াটসঅ্যাপ
          </Button>
          <Button onClick={handleEmail} className="bg-red-500 hover:bg-red-600 text-white">
            <Mail className="w-4 h-4 mr-2" />
            ইমেইল
          </Button>
          <Button
            onClick={() => setShowContactForm(!showContactForm)}
            className="bg-blue-500 hover:bg-blue-600 text-white"
          >
            <Send className="w-4 h-4 mr-2" />
            মেসেজ পাঠান
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* About Section */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <Users className="h-6 w-6 text-blue-600" />
                  আমার সম্পর্কে
                </h2>
                <p className="text-gray-700 leading-relaxed mb-4">{profile.bio}</p>

                {/* Key Stats */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <Calendar className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                    <div className="font-bold text-blue-600">{profile.stats.experience}</div>
                    <div className="text-sm text-gray-600">অভিজ্ঞতা</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <Briefcase className="h-8 w-8 text-green-600 mx-auto mb-2" />
                    <div className="font-bold text-green-600">{profile.stats.projects}+</div>
                    <div className="text-sm text-gray-600">প্রজেক্ট</div>
                  </div>
                  <div className="text-center p-4 bg-yellow-50 rounded-lg">
                    <Star className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
                    <div className="font-bold text-yellow-600">{profile.stats.rating}/৫</div>
                    <div className="text-sm text-gray-600">রেটিং</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Services Section */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <Briefcase className="h-6 w-6 text-orange-600" />
                  আমার সেবাসমূহ
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {profile.services.map((service, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="p-3 text-center justify-center hover:bg-orange-100 transition-colors"
                    >
                      {service}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Achievements Section */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <Award className="h-6 w-6 text-purple-600" />
                  অর্জনসমূহ
                </h2>
                <div className="space-y-4">
                  {profile.achievements.map((achievement, index) => (
                    <div key={index} className="flex items-start gap-4 p-4 bg-purple-50 rounded-lg">
                      <div className="p-2 bg-purple-100 rounded-full">
                        <Award className="h-6 w-6 text-purple-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-purple-900">{achievement.title}</h3>
                        <p className="text-gray-700 text-sm mt-1">{achievement.description}</p>
                        <p className="text-xs text-gray-500 mt-2">{achievement.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Gallery Section */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <ExternalLink className="h-6 w-6 text-green-600" />
                  পোর্টফোলিও গ্যালারি
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {profile.gallery.map((image, index) => (
                    <div key={index} className="relative group cursor-pointer">
                      <Image
                        src={image || "/placeholder.svg"}
                        alt={`Portfolio ${index + 1}`}
                        width={300}
                        height={200}
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
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <MessageCircle className="h-6 w-6 text-pink-600" />
                  ক্লায়েন্ট রিভিউ
                </h2>
                <div className="space-y-6">
                  {profile.testimonials.map((testimonial, index) => (
                    <div key={index} className="border rounded-lg p-6 bg-white shadow-sm">
                      <div className="flex items-start gap-4">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={testimonial.image || "/placeholder.svg"} />
                          <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <h4 className="font-semibold">{testimonial.name}</h4>
                              <p className="text-sm text-gray-600">{testimonial.company}</p>
                            </div>
                            <div className="flex items-center gap-1">
                              {[...Array(testimonial.rating)].map((_, i) => (
                                <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                              ))}
                            </div>
                          </div>
                          <p className="text-gray-700 mb-2">"{testimonial.message}"</p>
                          <p className="text-xs text-gray-500">{testimonial.date}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Contact Info */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Phone className="h-5 w-5 text-blue-600" />
                  যোগাযোগের তথ্য
                </h3>
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
                      <Link
                        href={profile.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:underline"
                      >
                        ওয়েবসাইট দেখুন
                      </Link>
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
                  <Clock className="h-5 w-5 text-green-600" />
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
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Share2 className="h-5 w-5 text-purple-600" />
                  সোশ্যাল মিডিয়া
                </h3>
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
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Download className="h-5 w-5 text-orange-600" />
                  অ্যাকশন
                </h3>
                <div className="space-y-3">
                  <Button onClick={generateAndDownloadVCard} variant="outline" className="w-full bg-transparent">
                    <Download className="h-4 w-4 mr-2" />
                    কন্ট্যাক্ট সেভ করুন
                  </Button>
                  <Button onClick={generateAndDownloadQR} variant="outline" className="w-full bg-transparent">
                    <QrCode className="h-4 w-4 mr-2" />
                    QR কোড ডাউনলোড
                  </Button>
                  <Button onClick={handleShareProfile} variant="outline" className="w-full bg-transparent">
                    <Share2 className="h-4 w-4 mr-2" />
                    প্রোফাইল শেয়ার
                  </Button>
                  <Button onClick={copyProfileLink} variant="outline" className="w-full bg-transparent">
                    <Copy className="h-4 w-4 mr-2" />
                    লিংক কপি
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Contact Form */}
            {showContactForm && (
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <Send className="h-5 w-5 text-blue-600" />
                    যোগাযোগ ফর্ম
                  </h3>
                  {submitSuccess ? (
                    <div className="text-center py-8">
                      <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                      <p className="text-green-600 font-semibold">আপনার মেসেজ সফলভাবে পাঠানো হয়েছে!</p>
                      <p className="text-sm text-gray-600 mt-2">শীঘ্রই আমরা আপনার সাথে যোগাযোগ করব।</p>
                    </div>
                  ) : (
                    <form onSubmit={handleContactSubmit} className="space-y-4">
                      <div>
                        <Label htmlFor="name">নাম *</Label>
                        <Input
                          id="name"
                          value={contactForm.name}
                          onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                          required
                          disabled={isSubmitting}
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">ইমেইল *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={contactForm.email}
                          onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                          required
                          disabled={isSubmitting}
                        />
                      </div>
                      <div>
                        <Label htmlFor="message">মেসেজ *</Label>
                        <Textarea
                          id="message"
                          value={contactForm.message}
                          onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                          rows={4}
                          required
                          disabled={isSubmitting}
                        />
                      </div>
                      <Button type="submit" className="w-full bg-blue-500 hover:bg-blue-600" disabled={isSubmitting}>
                        {isSubmitting ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            পাঠানো হচ্ছে...
                          </>
                        ) : (
                          <>
                            <Send className="h-4 w-4 mr-2" />
                            মেসেজ পাঠান
                          </>
                        )}
                      </Button>
                    </form>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 pt-8 border-t border-gray-200">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Heart className="h-4 w-4 text-red-500" />
            <span className="text-gray-600">Powered by SHAREINFO</span>
          </div>
          <p className="text-gray-500 text-sm">© ২০২৪ {profile.name}. সকল অধিকার সংরক্ষিত।</p>
        </div>
      </div>
    </div>
  )
}
