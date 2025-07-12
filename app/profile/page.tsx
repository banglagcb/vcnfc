"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useStore } from "@/lib/store"
import { Edit, Save, Plus, Trash2, Eye, Share2, Download, QrCode, Camera } from "lucide-react"
import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"

interface SocialLink {
  id: string
  platform: string
  url: string
  icon: string
}

interface ContactField {
  id: string
  label: string
  value: string
  type: string
}

interface UserProfile {
  id: string
  name: string
  title: string
  company: string
  bio: string
  email: string
  phone: string
  website: string
  address: string
  profileImage: string
  coverImage: string
  socialLinks: SocialLink[]
  contactFields: ContactField[]
  isPublic: boolean
  customUrl: string
  theme: string // Added theme property
}

export default function ProfilePage() {
  const { user, isAuthenticated, setUser } = useStore()
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")
  const [showQrCodeModal, setShowQrCodeModal] = useState(false)

  const profileImageInputRef = useRef<HTMLInputElement>(null)
  const coverImageInputRef = useRef<HTMLInputElement>(null)

  const [profile, setProfile] = useState<UserProfile>({
    id: user?.id || "",
    name: user?.name || "",
    title: "Professional",
    company: "SHAREINFO",
    bio: "Digital networking enthusiast using NFC smart business cards.",
    email: user?.email || "",
    phone: user?.phone || "",
    website: "",
    address: user?.address?.street || "",
    profileImage: "/placeholder.svg?height=150&width=150",
    coverImage: "/placeholder.svg?height=200&width=600",
    socialLinks: [
      { id: "1", platform: "Facebook", url: "https://facebook.com/johndoe", icon: "facebook" },
      { id: "2", platform: "LinkedIn", url: "https://linkedin.com/in/johndoe", icon: "linkedin" },
      { id: "3", platform: "Instagram", url: "https://instagram.com/johndoe", icon: "instagram" },
    ],
    contactFields: [
      { id: "1", label: "WhatsApp", value: "+8801723128440", type: "phone" },
      { id: "2", label: "Telegram", value: "@johndoe", type: "text" },
    ],
    isPublic: true,
    customUrl: `shareinfo-${user?.name?.toLowerCase().replace(/\s+/g, "-") || "user"}`,
    theme: "modern", // Default theme
  })

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/")
    }
  }, [isAuthenticated, router])

  if (!isAuthenticated()) {
    return null
  }

  const handleSaveProfile = () => {
    // Update user in store
    setUser({
      ...user!,
      name: profile.name,
      email: profile.email,
      phone: profile.phone,
    })
    setIsEditing(false)
    // In a real app, this would call an API to save profile data
    alert("Profile saved successfully!")
  }

  const addSocialLink = () => {
    const newLink: SocialLink = {
      id: Date.now().toString(),
      platform: "Custom",
      url: "",
      icon: "link",
    }
    setProfile({
      ...profile,
      socialLinks: [...profile.socialLinks, newLink],
    })
  }

  const removeSocialLink = (id: string) => {
    setProfile({
      ...profile,
      socialLinks: profile.socialLinks.filter((link) => link.id !== id),
    })
  }

  const updateSocialLink = (id: string, field: string, value: string) => {
    setProfile({
      ...profile,
      socialLinks: profile.socialLinks.map((link) => (link.id === id ? { ...link, [field]: value } : link)),
    })
  }

  const addContactField = () => {
    const newField: ContactField = {
      id: Date.now().toString(),
      label: "Custom Field",
      value: "",
      type: "text",
    }
    setProfile({
      ...profile,
      contactFields: [...profile.contactFields, newField],
    })
  }

  const removeContactField = (id: string) => {
    setProfile({
      ...profile,
      contactFields: profile.contactFields.filter((field) => field.id !== id),
    })
  }

  const updateContactField = (id: string, field: string, value: string) => {
    setProfile({
      ...profile,
      contactFields: profile.contactFields.map((contact) =>
        contact.id === id ? { ...contact, [field]: value } : contact,
      ),
    })
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>, type: "profile" | "cover") => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        if (type === "profile") {
          setProfile({ ...profile, profileImage: reader.result as string })
        } else {
          setProfile({ ...profile, coverImage: reader.result as string })
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const generateVCard = () => {
    let vcard = `BEGIN:VCARD\nVERSION:3.0\n`
    vcard += `FN:${profile.name}\n`
    vcard += `ORG:${profile.company}\n`
    vcard += `TITLE:${profile.title}\n`
    vcard += `EMAIL;TYPE=INTERNET:${profile.email}\n`
    vcard += `TEL;TYPE=CELL:${profile.phone}\n`
    if (profile.website) vcard += `URL:${profile.website}\n`
    if (profile.address) vcard += `ADR;TYPE=WORK:;;${profile.address};;;;\n`
    if (profile.bio) vcard += `NOTE:${profile.bio}\n`

    profile.socialLinks.forEach((link) => {
      if (link.url) vcard += `X-SOCIAL-${link.platform.toUpperCase()}:${link.url}\n`
    })
    profile.contactFields.forEach((field) => {
      if (field.value) vcard += `X-${field.label.toUpperCase()}:${field.value}\n`
    })

    vcard += `END:VCARD\n`

    const blob = new Blob([vcard], { type: "text/vcard" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${profile.name.replace(/\s+/g, "_")}.vcf`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const getThemeClasses = (themeName: string) => {
    switch (themeName) {
      case "modern":
        return {
          headerBg: "bg-gradient-to-r from-blue-600 to-purple-600",
          buttonClass: "bg-orange-500 hover:bg-orange-600",
          accentText: "text-orange-500",
        }
      case "professional":
        return {
          headerBg: "bg-gradient-to-r from-gray-800 to-gray-900",
          buttonClass: "bg-blue-700 hover:bg-blue-800",
          accentText: "text-blue-700",
        }
      case "creative":
        return {
          headerBg: "bg-gradient-to-r from-pink-500 to-red-500",
          buttonClass: "bg-purple-600 hover:bg-purple-700",
          accentText: "text-purple-600",
        }
      default:
        return {
          headerBg: "bg-gradient-to-r from-blue-600 to-purple-600",
          buttonClass: "bg-orange-500 hover:bg-orange-600",
          accentText: "text-orange-500",
        }
    }
  }

  const currentTheme = getThemeClasses(profile.theme)

  // Simple QR Code generation (for demonstration, in a real app use a library)
  const generateQRCodeDataURL = (text: string) => {
    const size = 256 // QR code image size
    const qrCanvas = document.createElement("canvas")
    qrCanvas.width = size
    qrCanvas.height = size
    const ctx = qrCanvas.getContext("2d")

    if (ctx) {
      // Simple black and white squares for QR code pattern
      const cellSize = size / 20 // Approximate cell size for a simple pattern
      for (let i = 0; i < 20; i++) {
        for (let j = 0; j < 20; j++) {
          if ((i + j) % 2 === 0) {
            ctx.fillStyle = "black"
          } else {
            ctx.fillStyle = "white"
          }
          ctx.fillRect(i * cellSize, j * cellSize, cellSize, cellSize)
        }
      }
      // Add some text to make it unique, though not a real QR code
      ctx.fillStyle = "black"
      ctx.font = "12px Arial"
      ctx.fillText("QR Placeholder", 10, size / 2)
    }

    return qrCanvas.toDataURL("image/png")
  }

  const qrCodeDataUrl = generateQRCodeDataURL(`https://shareinfobd.com/user/${profile.customUrl}`)

  const downloadQRCodeImage = () => {
    const a = document.createElement("a")
    a.href = qrCodeDataUrl
    a.download = `${profile.name.replace(/\s+/g, "_")}_qrcode.png`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Profile Header */}
      <div className="relative mb-8">
        <div className={`h-48 ${currentTheme.headerBg} rounded-lg overflow-hidden`}>
          <Image
            src={profile.coverImage || "/placeholder.svg"}
            alt="Cover"
            width={1200}
            height={200}
            className="w-full h-full object-cover opacity-50"
          />
          {isEditing && (
            <>
              <input
                type="file"
                ref={coverImageInputRef}
                className="hidden"
                accept="image/*"
                onChange={(e) => handleImageUpload(e, "cover")}
              />
              <Button
                size="sm"
                className="absolute top-4 right-4 bg-white/80 hover:bg-white text-gray-800"
                onClick={() => coverImageInputRef.current?.click()}
              >
                <Camera className="w-4 h-4 mr-2" />
                Change Cover
              </Button>
            </>
          )}
        </div>
        <div className="absolute -bottom-16 left-8">
          <div className="relative">
            <Image
              src={profile.profileImage || "/placeholder.svg"}
              alt={profile.name}
              width={120}
              height={120}
              className="w-30 h-30 rounded-full border-4 border-white shadow-lg bg-white object-cover"
            />
            {isEditing && (
              <>
                <input
                  type="file"
                  ref={profileImageInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, "profile")}
                />
                <Button
                  size="sm"
                  className="absolute bottom-0 right-0 rounded-full w-8 h-8 p-0 bg-white/80 hover:bg-white text-gray-800"
                  onClick={() => profileImageInputRef.current?.click()}
                >
                  <Camera className="w-4 h-4" />
                </Button>
              </>
            )}
          </div>
        </div>
        <div className="pt-20 px-8 pb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">{profile.name}</h1>
              <p className="text-gray-600">
                {profile.title} at {profile.company}
              </p>
              <div className="flex items-center space-x-4 mt-2">
                <Badge variant={profile.isPublic ? "default" : "secondary"}>
                  {profile.isPublic ? "Public Profile" : "Private Profile"}
                </Badge>
                <span className="text-sm text-gray-500">shareinfobd.com/{profile.customUrl}</span>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" onClick={() => window.open(`/user/${profile.customUrl}`, "_blank")}>
                <Eye className="w-4 h-4 mr-2" />
                Preview
              </Button>
              <Button
                onClick={() => (isEditing ? handleSaveProfile() : setIsEditing(true))}
                className={currentTheme.buttonClass}
              >
                {isEditing ? <Save className="w-4 h-4 mr-2" /> : <Edit className="w-4 h-4 mr-2" />}
                {isEditing ? "Save" : "Edit"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="contact">Contact Info</TabsTrigger>
          <TabsTrigger value="social">Social Links</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={profile.name}
                        onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                        disabled={!isEditing}
                      />
                    </div>
                    <div>
                      <Label htmlFor="title">Job Title</Label>
                      <Input
                        id="title"
                        value={profile.title}
                        onChange={(e) => setProfile({ ...profile, title: e.target.value })}
                        disabled={!isEditing}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="company">Company</Label>
                    <Input
                      id="company"
                      value={profile.company}
                      onChange={(e) => setProfile({ ...profile, company: e.target.value })}
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      value={profile.bio}
                      onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                      disabled={!isEditing}
                      rows={3}
                    />
                  </div>
                  <div>
                    <Label htmlFor="customUrl">Custom URL</Label>
                    <div className="flex">
                      <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                        shareinfobd.com/
                      </span>
                      <Input
                        id="customUrl"
                        value={profile.customUrl}
                        onChange={(e) => setProfile({ ...profile, customUrl: e.target.value })}
                        disabled={!isEditing}
                        className="rounded-l-none"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full bg-transparent" variant="outline" onClick={() => setShowQrCodeModal(true)}>
                    <QrCode className="w-4 h-4 mr-2" />
                    Download QR Code
                  </Button>
                  <Button className="w-full bg-transparent" variant="outline" onClick={generateVCard}>
                    <Download className="w-4 h-4 mr-2" />
                    Export vCard
                  </Button>
                  <Button className="w-full bg-transparent" variant="outline">
                    <Share2 className="w-4 h-4 mr-2" />
                    Share Profile
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Profile Stats</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Profile Views</span>
                      <span className="font-semibold">127</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Card Taps</span>
                      <span className="font-semibold">89</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Contacts Saved</span>
                      <span className="font-semibold">45</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="contact">
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={profile.phone}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    disabled={!isEditing}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  value={profile.website}
                  onChange={(e) => setProfile({ ...profile, website: e.target.value })}
                  disabled={!isEditing}
                />
              </div>
              <div>
                <Label htmlFor="address">Address</Label>
                <Textarea
                  id="address"
                  value={profile.address}
                  onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                  disabled={!isEditing}
                  rows={3}
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-4">
                  <Label>Additional Contact Fields</Label>
                  {isEditing && (
                    <Button onClick={addContactField} size="sm" variant="outline">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Field
                    </Button>
                  )}
                </div>
                <div className="space-y-3">
                  {profile.contactFields.map((field) => (
                    <div key={field.id} className="flex items-center space-x-2">
                      <Input
                        placeholder="Label"
                        value={field.label}
                        onChange={(e) => updateContactField(field.id, "label", e.target.value)}
                        disabled={!isEditing}
                        className="w-1/3"
                      />
                      <Input
                        placeholder="Value"
                        value={field.value}
                        onChange={(e) => updateContactField(field.id, "value", e.target.value)}
                        disabled={!isEditing}
                        className="flex-1"
                      />
                      {isEditing && (
                        <Button
                          onClick={() => removeContactField(field.id)}
                          size="sm"
                          variant="ghost"
                          className="text-red-500"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="social">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Social Media Links</CardTitle>
                {isEditing && (
                  <Button onClick={addSocialLink} size="sm" variant="outline">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Link
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {profile.socialLinks.map((link) => (
                  <div key={link.id} className="flex items-center space-x-3">
                    <Input
                      placeholder="Platform"
                      value={link.platform}
                      onChange={(e) => updateSocialLink(link.id, "platform", e.target.value)}
                      disabled={!isEditing}
                      className="w-1/4"
                    />
                    <Input
                      placeholder="URL"
                      value={link.url}
                      onChange={(e) => updateSocialLink(link.id, "url", e.target.value)}
                      disabled={!isEditing}
                      className="flex-1"
                    />
                    {isEditing && (
                      <Button
                        onClick={() => removeSocialLink(link.id)}
                        size="sm"
                        variant="ghost"
                        className="text-red-500"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance">
          <Card>
            <CardHeader>
              <CardTitle>Profile Appearance</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label>Profile Theme</Label>
                <div className="grid grid-cols-3 gap-4 mt-2">
                  <div
                    className={`p-4 border rounded-lg cursor-pointer hover:border-orange-500 ${
                      profile.theme === "modern" ? "border-orange-500 ring-2 ring-orange-500" : ""
                    }`}
                    onClick={() => setProfile({ ...profile, theme: "modern" })}
                  >
                    <div className="h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded mb-2"></div>
                    <p className="text-sm text-center">Modern</p>
                  </div>
                  <div
                    className={`p-4 border rounded-lg cursor-pointer hover:border-orange-500 ${
                      profile.theme === "professional" ? "border-orange-500 ring-2 ring-orange-500" : ""
                    }`}
                    onClick={() => setProfile({ ...profile, theme: "professional" })}
                  >
                    <div className="h-20 bg-gradient-to-r from-gray-800 to-gray-900 rounded mb-2"></div>
                    <p className="text-sm text-center">Professional</p>
                  </div>
                  <div
                    className={`p-4 border rounded-lg cursor-pointer hover:border-orange-500 ${
                      profile.theme === "creative" ? "border-orange-500 ring-2 ring-orange-500" : ""
                    }`}
                    onClick={() => setProfile({ ...profile, theme: "creative" })}
                  >
                    <div className="h-20 bg-gradient-to-r from-pink-500 to-red-500 rounded mb-2"></div>
                    <p className="text-sm text-center">Creative</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Profile Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Public Profile</h3>
                  <p className="text-sm text-gray-600">Make your profile visible to everyone</p>
                </div>
                <input
                  type="checkbox"
                  checked={profile.isPublic}
                  onChange={(e) => setProfile({ ...profile, isPublic: e.target.checked })}
                  className="rounded"
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Analytics Tracking</h3>
                  <p className="text-sm text-gray-600">Track profile views and interactions</p>
                </div>
                <input type="checkbox" defaultChecked className="rounded" />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Contact Form</h3>
                  <p className="text-sm text-gray-600">Allow visitors to send you messages</p>
                </div>
                <input type="checkbox" defaultChecked className="rounded" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* QR Code Modal */}
      <Dialog open={showQrCodeModal} onOpenChange={setShowQrCodeModal}>
        <DialogContent className="sm:max-w-[425px] text-center">
          <DialogHeader>
            <DialogTitle>Your Profile QR Code</DialogTitle>
          </DialogHeader>
          <div className="flex justify-center my-4">
            <Image
              src={qrCodeDataUrl || "/placeholder.svg"}
              alt="QR Code"
              width={256}
              height={256}
              className="border p-2"
            />
          </div>
          <p className="text-sm text-gray-600 mb-4">Scan this QR code to instantly share your profile.</p>
          <Button onClick={downloadQRCodeImage} className={currentTheme.buttonClass}>
            <Download className="w-4 h-4 mr-2" />
            Download QR Code
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  )
}
