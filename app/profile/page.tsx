"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Phone,
  Mail,
  Globe,
  MapPin,
  Camera,
  Download,
  Share2,
  QrCode,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  Eye,
  Palette,
  Settings,
  Upload,
  Save,
} from "lucide-react"
import { generateQRCode, generateVCard, downloadQRCode, downloadVCard } from "@/lib/qr-generator"

export default function ProfilePage() {
  const [profile, setProfile] = useState({
    name: "আহমেদ হাসান",
    title: "সিনিয়র সফটওয়্যার ইঞ্জিনিয়ার",
    company: "টেক সলিউশন বিডি",
    phone: "+৮৮০১৭১২৩৪৫৬৭৮",
    email: "ahmed.hasan@techsolution.bd",
    website: "https://ahmedhasan.dev",
    bio: "একজন অভিজ্ঞ সফটওয়্যার ইঞ্জিনিয়ার যিনি ওয়েব ডেভেলপমেন্ট এবং মোবাইল অ্যাপ ডেভেলপমেন্টে বিশেষজ্ঞ।",
    address: "ঢাকা, বাংলাদেশ",
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
    services: ["ওয়েব ডেভেলপমেন্ট", "মোবাইল অ্যাপ ডেভেলপমেন্ট", "UI/UX ডিজাইন", "কনসালটিং"],
    gallery: [
      "/placeholder.svg?height=200&width=200",
      "/placeholder.svg?height=200&width=200",
      "/placeholder.svg?height=200&width=200",
      "/placeholder.svg?height=200&width=200",
    ],
  })

  const [analytics] = useState({
    totalViews: 1247,
    totalTaps: 89,
    totalContacts: 23,
    monthlyGrowth: 15.2,
  })

  const fileInputRef = useRef<HTMLInputElement>(null)
  const coverInputRef = useRef<HTMLInputElement>(null)

  const themes = [
    { id: "gradient-blue", name: "নীল গ্রেডিয়েন্ট", colors: "from-blue-500 to-purple-600" },
    { id: "gradient-green", name: "সবুজ গ্রেডিয়েন্ট", colors: "from-green-500 to-teal-600" },
    { id: "gradient-orange", name: "কমলা গ্রেডিয়েন্ট", colors: "from-orange-500 to-red-600" },
    { id: "gradient-purple", name: "বেগুনি গ্রেডিয়েন্ট", colors: "from-purple-500 to-pink-600" },
  ]

  const handleInputChange = (field: string, value: string) => {
    setProfile((prev) => ({ ...prev, [field]: value }))
  }

  const handleSocialLinkChange = (platform: string, value: string) => {
    setProfile((prev) => ({
      ...prev,
      socialLinks: { ...prev.socialLinks, [platform]: value },
    }))
  }

  const handleImageUpload = (type: "profile" | "cover") => {
    const input = type === "profile" ? fileInputRef.current : coverInputRef.current
    if (input) {
      input.click()
    }
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, type: "profile" | "cover") => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        if (type === "profile") {
          setProfile((prev) => ({ ...prev, profileImage: result }))
        } else {
          setProfile((prev) => ({ ...prev, coverImage: result }))
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const generateAndDownloadQR = () => {
    const profileUrl = `${window.location.origin}/user/${profile.name.toLowerCase().replace(/\s+/g, "-")}`
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
    const profileUrl = `${window.location.origin}/user/${profile.name.toLowerCase().replace(/\s+/g, "-")}`

    if (navigator.share) {
      try {
        await navigator.share({
          title: profile.name,
          text: profile.bio,
          url: profileUrl,
        })
      } catch (error) {
        console.log("Error sharing:", error)
      }
    } else {
      navigator.clipboard.writeText(profileUrl)
      alert("প্রোফাইল লিংক কপি হয়েছে!")
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">প্রোফাইল এডিট</h1>
          <p className="text-gray-600">আপনার ডিজিটাল বিজনেস কার্ড কাস্টমাইজ করুন</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Sidebar - Live Preview */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  লাইভ প্রিভিউ
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Profile Preview */}
                <div
                  className={`relative rounded-lg overflow-hidden bg-gradient-to-br ${themes.find((t) => t.id === profile.theme)?.colors} p-6 text-white`}
                >
                  <div className="text-center">
                    <Avatar className="h-20 w-20 mx-auto mb-4 border-4 border-white">
                      <AvatarImage src={profile.profileImage || "/placeholder.svg"} />
                      <AvatarFallback>{profile.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <h3 className="font-bold text-lg">{profile.name}</h3>
                    <p className="text-sm opacity-90">{profile.title}</p>
                    <p className="text-xs opacity-75">{profile.company}</p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-2">
                  <Button onClick={generateAndDownloadQR} className="w-full bg-transparent" variant="outline">
                    <QrCode className="h-4 w-4 mr-2" />
                    QR কোড ডাউনলোড
                  </Button>
                  <Button onClick={generateAndDownloadVCard} className="w-full bg-transparent" variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    vCard ডাউনলোড
                  </Button>
                  <Button onClick={shareProfile} className="w-full bg-transparent" variant="outline">
                    <Share2 className="h-4 w-4 mr-2" />
                    প্রোফাইল শেয়ার
                  </Button>
                </div>

                {/* Analytics */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">অ্যানালিটিক্স</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">মোট ভিউ</span>
                      <span className="font-semibold">{analytics.totalViews}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">মোট ট্যাপ</span>
                      <span className="font-semibold">{analytics.totalTaps}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">কন্ট্যাক্ট</span>
                      <span className="font-semibold">{analytics.totalContacts}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">মাসিক বৃদ্ধি</span>
                      <span className="font-semibold text-green-600">+{analytics.monthlyGrowth}%</span>
                    </div>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>
          </div>

          {/* Right Content - Edit Form */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList className="grid w-full grid-cols-6">
                <TabsTrigger value="overview">ওভারভিউ</TabsTrigger>
                <TabsTrigger value="contact">যোগাযোগ</TabsTrigger>
                <TabsTrigger value="social">সোশ্যাল</TabsTrigger>
                <TabsTrigger value="gallery">গ্যালারি</TabsTrigger>
                <TabsTrigger value="theme">থিম</TabsTrigger>
                <TabsTrigger value="settings">সেটিংস</TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview">
                <Card>
                  <CardHeader>
                    <CardTitle>মূল তথ্য</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Cover Image */}
                    <div>
                      <Label>কভার ইমেজ</Label>
                      <div className="mt-2 relative">
                        <div
                          className="h-32 bg-gray-200 rounded-lg bg-cover bg-center cursor-pointer hover:opacity-80 transition-opacity"
                          style={{ backgroundImage: `url(${profile.coverImage})` }}
                          onClick={() => handleImageUpload("cover")}
                        >
                          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-lg">
                            <Camera className="h-8 w-8 text-white" />
                          </div>
                        </div>
                        <input
                          ref={coverInputRef}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleFileChange(e, "cover")}
                        />
                      </div>
                    </div>

                    {/* Profile Image */}
                    <div>
                      <Label>প্রোফাইল ছবি</Label>
                      <div className="mt-2 flex items-center gap-4">
                        <Avatar
                          className="h-20 w-20 cursor-pointer hover:opacity-80 transition-opacity"
                          onClick={() => handleImageUpload("profile")}
                        >
                          <AvatarImage src={profile.profileImage || "/placeholder.svg"} />
                          <AvatarFallback>{profile.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <Button variant="outline" onClick={() => handleImageUpload("profile")}>
                          <Upload className="h-4 w-4 mr-2" />
                          ছবি আপলোড
                        </Button>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleFileChange(e, "profile")}
                        />
                      </div>
                    </div>

                    {/* Basic Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">নাম *</Label>
                        <Input
                          id="name"
                          value={profile.name}
                          onChange={(e) => handleInputChange("name", e.target.value)}
                          placeholder="আপনার নাম লিখুন"
                        />
                      </div>
                      <div>
                        <Label htmlFor="title">পদবী</Label>
                        <Input
                          id="title"
                          value={profile.title}
                          onChange={(e) => handleInputChange("title", e.target.value)}
                          placeholder="আপনার পদবী লিখুন"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="company">কোম্পানি</Label>
                      <Input
                        id="company"
                        value={profile.company}
                        onChange={(e) => handleInputChange("company", e.target.value)}
                        placeholder="কোম্পানির নাম লিখুন"
                      />
                    </div>

                    <div>
                      <Label htmlFor="bio">বায়ো</Label>
                      <Textarea
                        id="bio"
                        value={profile.bio}
                        onChange={(e) => handleInputChange("bio", e.target.value)}
                        placeholder="আপনার সম্পর্কে লিখুন"
                        rows={4}
                      />
                    </div>

                    {/* Services */}
                    <div>
                      <Label>সেবাসমূহ</Label>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {profile.services.map((service, index) => (
                          <Badge key={index} variant="secondary">
                            {service}
                          </Badge>
                        ))}
                      </div>
                      <Button variant="outline" size="sm" className="mt-2 bg-transparent">
                        সেবা যোগ করুন
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Contact Tab */}
              <TabsContent value="contact">
                <Card>
                  <CardHeader>
                    <CardTitle>যোগাযোগের তথ্য</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="phone">ফোন নম্বর</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="phone"
                          value={profile.phone}
                          onChange={(e) => handleInputChange("phone", e.target.value)}
                          placeholder="+৮৮০১৭xxxxxxxx"
                          className="pl-10"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="email">ইমেইল</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="email"
                          type="email"
                          value={profile.email}
                          onChange={(e) => handleInputChange("email", e.target.value)}
                          placeholder="your@email.com"
                          className="pl-10"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="website">ওয়েবসাইট</Label>
                      <div className="relative">
                        <Globe className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="website"
                          value={profile.website}
                          onChange={(e) => handleInputChange("website", e.target.value)}
                          placeholder="https://yourwebsite.com"
                          className="pl-10"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="address">ঠিকানা</Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Textarea
                          id="address"
                          value={profile.address}
                          onChange={(e) => handleInputChange("address", e.target.value)}
                          placeholder="আপনার সম্পূর্ণ ঠিকানা লিখুন"
                          className="pl-10"
                          rows={3}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Social Tab */}
              <TabsContent value="social">
                <Card>
                  <CardHeader>
                    <CardTitle>সোশ্যাল মিডিয়া লিংক</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="facebook">Facebook</Label>
                      <div className="relative">
                        <Facebook className="absolute left-3 top-3 h-4 w-4 text-blue-600" />
                        <Input
                          id="facebook"
                          value={profile.socialLinks.facebook}
                          onChange={(e) => handleSocialLinkChange("facebook", e.target.value)}
                          placeholder="https://facebook.com/yourprofile"
                          className="pl-10"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="linkedin">LinkedIn</Label>
                      <div className="relative">
                        <Linkedin className="absolute left-3 top-3 h-4 w-4 text-blue-700" />
                        <Input
                          id="linkedin"
                          value={profile.socialLinks.linkedin}
                          onChange={(e) => handleSocialLinkChange("linkedin", e.target.value)}
                          placeholder="https://linkedin.com/in/yourprofile"
                          className="pl-10"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="twitter">Twitter</Label>
                      <div className="relative">
                        <Twitter className="absolute left-3 top-3 h-4 w-4 text-blue-400" />
                        <Input
                          id="twitter"
                          value={profile.socialLinks.twitter}
                          onChange={(e) => handleSocialLinkChange("twitter", e.target.value)}
                          placeholder="https://twitter.com/yourprofile"
                          className="pl-10"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="instagram">Instagram</Label>
                      <div className="relative">
                        <Instagram className="absolute left-3 top-3 h-4 w-4 text-pink-600" />
                        <Input
                          id="instagram"
                          value={profile.socialLinks.instagram}
                          onChange={(e) => handleSocialLinkChange("instagram", e.target.value)}
                          placeholder="https://instagram.com/yourprofile"
                          className="pl-10"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="youtube">YouTube</Label>
                      <div className="relative">
                        <Youtube className="absolute left-3 top-3 h-4 w-4 text-red-600" />
                        <Input
                          id="youtube"
                          value={profile.socialLinks.youtube}
                          onChange={(e) => handleSocialLinkChange("youtube", e.target.value)}
                          placeholder="https://youtube.com/@yourprofile"
                          className="pl-10"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Gallery Tab */}
              <TabsContent value="gallery">
                <Card>
                  <CardHeader>
                    <CardTitle>ইমেজ গ্যালারি</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {profile.gallery.map((image, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={image || "/placeholder.svg"}
                            alt={`Gallery ${index + 1}`}
                            className="w-full h-32 object-cover rounded-lg"
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                            <Button size="sm" variant="secondary">
                              পরিবর্তন
                            </Button>
                          </div>
                        </div>
                      ))}
                      <div className="border-2 border-dashed border-gray-300 rounded-lg h-32 flex items-center justify-center cursor-pointer hover:border-gray-400 transition-colors">
                        <div className="text-center">
                          <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                          <p className="text-sm text-gray-500">ছবি যোগ করুন</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Theme Tab */}
              <TabsContent value="theme">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Palette className="h-5 w-5" />
                      থিম নির্বাচন
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {themes.map((theme) => (
                        <div
                          key={theme.id}
                          className={`relative cursor-pointer rounded-lg p-4 border-2 transition-all ${
                            profile.theme === theme.id
                              ? "border-blue-500 ring-2 ring-blue-200"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                          onClick={() => handleInputChange("theme", theme.id)}
                        >
                          <div className={`h-20 rounded-lg bg-gradient-to-br ${theme.colors} mb-3`}></div>
                          <h3 className="font-medium">{theme.name}</h3>
                          {profile.theme === theme.id && (
                            <div className="absolute top-2 right-2 bg-blue-500 text-white rounded-full p-1">
                              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                                <path
                                  fillRule="evenodd"
                                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Settings Tab */}
              <TabsContent value="settings">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Settings className="h-5 w-5" />
                      সেটিংস
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">প্রোফাইল দৃশ্যমানতা</h3>
                        <p className="text-sm text-gray-500">আপনার প্রোফাইল সবার জন্য দৃশ্যমান করুন</p>
                      </div>
                      <Button variant="outline">সক্রিয়</Button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">অ্যানালিটিক্স ট্র্যাকিং</h3>
                        <p className="text-sm text-gray-500">ভিউ এবং ইন্টারঅ্যাকশন ট্র্যাক করুন</p>
                      </div>
                      <Button variant="outline">সক্রিয়</Button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">যোগাযোগের অনুমতি</h3>
                        <p className="text-sm text-gray-500">অন্যরা আপনার সাথে যোগাযোগ করতে পারবে</p>
                      </div>
                      <Button variant="outline">সক্রিয়</Button>
                    </div>

                    <div className="pt-4 border-t">
                      <Button className="w-full">
                        <Save className="h-4 w-4 mr-2" />
                        সব পরিবর্তন সেভ করুন
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}
