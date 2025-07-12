"use client";

import type React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import {
  ProfileHeaderSkeleton,
  ProfileTabsSkeleton,
  SocialLinkSkeleton,
  ContactFieldSkeleton,
  SkillSkeleton,
  PortfolioItemSkeleton,
  TestimonialSkeleton,
  AnalyticsCardSkeleton,
} from "@/components/ui/skeleton";
import { useStore } from "@/lib/store";
import {
  Edit,
  Save,
  Plus,
  Trash2,
  Eye,
  Share2,
  Download,
  QrCode,
  Camera,
  Upload,
  CheckCircle,
  AlertCircle,
  Loader2,
  Star,
  Award,
  Briefcase,
  MapPin,
  Mail,
  Phone,
  Globe,
  Calendar,
  TrendingUp,
  Users,
  Target,
  ExternalLink,
  Github,
  Linkedin,
  Twitter,
  Instagram,
  Facebook,
  Heart,
  MessageCircle,
  Send,
  Settings,
  Smartphone,
  Monitor,
  Tablet,
  Clock,
  Zap,
  Shield,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  useProfile,
  useProfileSocialLinks,
  useProfileAnalytics,
  useProfileImageUpload,
  useProfileValidation,
} from "@/hooks/use-profile";
import { useProfileStore } from "@/lib/stores/profile-store";
import { cn } from "@/lib/utils";

export default function ProfilePage() {
  const { user, isAuthenticated } = useStore();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [showQrCodeModal, setShowQrCodeModal] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Profile hooks
  const {
    profile,
    status,
    saveStatus,
    errors,
    isDirty,
    updateField,
    saveProfile,
    refreshProfile,
    isLoading,
    isError,
    isSaving,
    isSaved,
  } = useProfile(user?.id);

  // Profile store for real-time sync with preview page
  const { setProfile: setStoreProfile, updateProfile: updateStoreProfile } =
    useProfileStore();

  const { socialLinks, addSocialLink, updateSocialLink, deleteSocialLink } =
    useProfileSocialLinks(profile?.id);
  const {
    analytics,
    isLoading: analyticsLoading,
    refreshAnalytics,
  } = useProfileAnalytics(profile?.id);
  const {
    uploadImage,
    isUploading,
    uploadProgress,
    error: uploadError,
  } = useProfileImageUpload(profile?.id);
  const { validateProfile } = useProfileValidation();

  const profileImageInputRef = useRef<HTMLInputElement>(null);
  const coverImageInputRef = useRef<HTMLInputElement>(null);

  // Hydration detection
  useEffect(() => {
    setMounted(true);
  }, []);

  // Authentication check
  useEffect(() => {
    if (mounted && !isAuthenticated()) {
      router.push("/");
    }
  }, [mounted, isAuthenticated, router]);

  // Sync profile changes to store for real-time preview updates
  useEffect(() => {
    if (profile && mounted) {
      setStoreProfile(profile);
    }
  }, [profile, mounted, setStoreProfile]);

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <ProfileHeaderSkeleton />
          <ProfileTabsSkeleton />
        </div>
      </div>
    );
  }

  if (!isAuthenticated()) {
    return null;
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <ProfileHeaderSkeleton />
          <ProfileTabsSkeleton />
        </div>
      </div>
    );
  }

  // Error state
  if (isError || !profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-lg font-semibold mb-2">
              Failed to Load Profile
            </h2>
            <p className="text-gray-600 mb-4">
              We couldn't load your profile. Please try again.
            </p>
            <Button onClick={refreshProfile} className="w-full">
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleSaveProfile = async () => {
    const validationErrors = validateProfile(profile);
    if (validationErrors.length > 0) {
      return;
    }

    const result = await saveProfile(profile);
    if (result?.success) {
      setIsEditing(false);
    }
  };

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
    type: "profile" | "cover",
  ) => {
    const file = event.target.files?.[0];
    if (file && profile) {
      const uploadedImage = await uploadImage(file, type);
      if (uploadedImage) {
        if (type === "profile") {
          updateField("profileImage", uploadedImage);
        } else {
          updateField("coverImage", uploadedImage);
        }
      }
    }
  };

  const getThemeClasses = (themeName: string) => {
    switch (themeName) {
      case "modern":
        return {
          headerBg:
            "bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600",
          buttonClass: "bg-orange-500 hover:bg-orange-600",
          accentText: "text-orange-500",
          cardBorder: "border-orange-200",
        };
      case "professional":
        return {
          headerBg: "bg-gradient-to-r from-gray-800 via-gray-900 to-slate-800",
          buttonClass: "bg-blue-700 hover:bg-blue-800",
          accentText: "text-blue-700",
          cardBorder: "border-blue-200",
        };
      case "creative":
        return {
          headerBg: "bg-gradient-to-r from-pink-500 via-red-500 to-purple-600",
          buttonClass: "bg-purple-600 hover:bg-purple-700",
          accentText: "text-purple-600",
          cardBorder: "border-purple-200",
        };
      default:
        return {
          headerBg:
            "bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600",
          buttonClass: "bg-orange-500 hover:bg-orange-600",
          accentText: "text-orange-500",
          cardBorder: "border-orange-200",
        };
    }
  };

  const currentTheme = getThemeClasses(profile.settings?.theme || "modern");

  const generateQRCodeDataURL = (text: string) => {
    const size = 256;
    const qrCanvas = document.createElement("canvas");
    qrCanvas.width = size;
    qrCanvas.height = size;
    const ctx = qrCanvas.getContext("2d");

    if (ctx) {
      const cellSize = size / 20;
      for (let i = 0; i < 20; i++) {
        for (let j = 0; j < 20; j++) {
          ctx.fillStyle = (i + j) % 2 === 0 ? "black" : "white";
          ctx.fillRect(i * cellSize, j * cellSize, cellSize, cellSize);
        }
      }
      ctx.fillStyle = "black";
      ctx.font = "12px Arial";
      ctx.fillText("QR Code", 10, size / 2);
    }

    return qrCanvas.toDataURL("image/png");
  };

  const qrCodeDataUrl = generateQRCodeDataURL(
    `https://shareinfobd.com/user/${profile.customUrl}`,
  );

  const downloadQRCodeImage = () => {
    const a = document.createElement("a");
    a.href = qrCodeDataUrl;
    a.download = `${profile.firstName}_${profile.lastName}_qrcode.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const generateVCard = () => {
    let vcard = `BEGIN:VCARD\nVERSION:3.0\n`;
    vcard += `FN:${profile.firstName} ${profile.lastName}\n`;
    vcard += `ORG:${profile.company}\n`;
    vcard += `TITLE:${profile.title}\n`;
    vcard += `EMAIL;TYPE=INTERNET:${profile.email}\n`;
    if (profile.phone) vcard += `TEL;TYPE=CELL:${profile.phone}\n`;
    if (profile.website) vcard += `URL:${profile.website}\n`;
    if (profile.address) vcard += `ADR;TYPE=WORK:;;${profile.address};;;;\n`;
    if (profile.bio) vcard += `NOTE:${profile.bio}\n`;
    vcard += `END:VCARD\n`;

    const blob = new Blob([vcard], { type: "text/vcard" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${profile.firstName}_${profile.lastName}.vcf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Enhanced Header with Responsive Design */}
      <div className="relative mb-4 sm:mb-6 lg:mb-8">
        <div
          className={`h-32 sm:h-40 lg:h-48 ${currentTheme.headerBg} rounded-lg overflow-hidden relative`}
        >
          {profile.coverImage && (
            <Image
              src={profile.coverImage.url || "/placeholder.svg"}
              alt="Cover"
              fill
              className="object-cover opacity-50"
            />
          )}

          {/* Upload Progress Overlay */}
          {isUploading && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <div className="bg-white rounded-lg p-4 min-w-[200px]">
                <div className="flex items-center space-x-2 mb-2">
                  <Upload className="w-4 h-4" />
                  <span className="text-sm font-medium">Uploading...</span>
                </div>
                <Progress value={uploadProgress} className="h-2" />
              </div>
            </div>
          )}

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
                className="absolute top-2 right-2 sm:top-4 sm:right-4 bg-white/90 hover:bg-white text-gray-800"
                onClick={() => coverImageInputRef.current?.click()}
                disabled={isUploading}
              >
                <Camera className="w-4 h-4 mr-2" />
                <span className="sm:hidden">Cover</span>
                <span className="hidden sm:inline">Change Cover</span>
              </Button>
            </>
          )}
        </div>

        {/* Profile Avatar - Responsive positioning */}
        <div className="absolute -bottom-8 sm:-bottom-12 lg:-bottom-16 left-4 sm:left-6 lg:left-8">
          <div className="relative">
            <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-30 lg:h-30 rounded-full border-2 sm:border-4 border-white shadow-lg bg-white overflow-hidden">
              {profile.profileImage ? (
                <Image
                  src={profile.profileImage.url || "/placeholder.svg"}
                  alt={`${profile.firstName} ${profile.lastName}`}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-500 text-lg sm:text-xl lg:text-2xl font-semibold">
                    {profile.firstName.charAt(0)}
                    {profile.lastName.charAt(0)}
                  </span>
                </div>
              )}
            </div>
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
                  className="absolute -bottom-1 -right-1 sm:bottom-0 sm:right-0 rounded-full w-6 h-6 sm:w-8 sm:h-8 p-0 bg-white/90 hover:bg-white text-gray-800"
                  onClick={() => profileImageInputRef.current?.click()}
                  disabled={isUploading}
                >
                  <Camera className="w-3 h-3 sm:w-4 sm:h-4" />
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Profile Info - Responsive layout */}
        <div className="pt-10 sm:pt-16 lg:pt-20 px-4 sm:px-6 lg:px-8 pb-4 sm:pb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex-1 min-w-0">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold truncate">
                {profile.firstName} {profile.lastName}
              </h1>
              <p className="text-sm sm:text-base text-gray-600 truncate">
                {profile.title} at {profile.company}
              </p>
              <div className="flex flex-wrap items-center gap-2 sm:gap-4 mt-2">
                <Badge
                  variant={profile.settings?.isPublic ? "default" : "secondary"}
                  className="text-xs"
                >
                  {profile.settings?.isPublic ? "Public" : "Private"}
                </Badge>
                {profile.isVerified && (
                  <Badge
                    variant="outline"
                    className="text-xs text-green-600 border-green-200"
                  >
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Verified
                  </Badge>
                )}
                {profile.isPremium && (
                  <Badge
                    variant="outline"
                    className="text-xs text-purple-600 border-purple-200"
                  >
                    <Star className="w-3 h-3 mr-1" />
                    Premium
                  </Badge>
                )}
                <span className="text-xs sm:text-sm text-gray-500 truncate">
                  shareinfobd.com/{profile.customUrl}
                </span>
              </div>
            </div>

            {/* Action Buttons - Responsive */}
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                className="sm:h-10 sm:px-4 sm:py-2"
                onClick={() => window.open("/preview", "_blank")}
              >
                <Eye className="w-4 h-4 mr-2" />
                Preview
              </Button>
              <Button
                onClick={() =>
                  isEditing ? handleSaveProfile() : setIsEditing(true)
                }
                className={cn(
                  currentTheme.buttonClass,
                  "relative h-8 px-3 py-1 sm:h-10 sm:px-4 sm:py-2",
                )}
                disabled={isSaving}
              >
                {isSaving ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : isEditing ? (
                  <Save className="w-4 h-4 mr-2" />
                ) : (
                  <Edit className="w-4 h-4 mr-2" />
                )}
                {isSaving ? "Saving..." : isEditing ? "Save" : "Edit"}
                {isDirty && !isSaving && (
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
                )}
              </Button>
            </div>
          </div>

          {/* Save Status Indicator */}
          {(isSaved || saveStatus === "error") && (
            <div className="mt-2">
              <Alert
                className={cn(
                  "border-l-4 py-2",
                  isSaved
                    ? "border-green-500 bg-green-50"
                    : "border-red-500 bg-red-50",
                )}
              >
                <div className="flex items-center">
                  {isSaved ? (
                    <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-red-600 mr-2" />
                  )}
                  <AlertDescription className="text-sm">
                    {isSaved
                      ? "Changes saved successfully"
                      : "Failed to save changes"}
                  </AlertDescription>
                </div>
              </Alert>
            </div>
          )}

          {/* Error Messages */}
          {errors.length > 0 && (
            <div className="mt-2">
              <Alert className="border-red-500 bg-red-50">
                <AlertCircle className="w-4 h-4 text-red-600" />
                <AlertDescription>
                  <ul className="list-disc list-inside text-sm">
                    {errors.map((error, index) => (
                      <li key={index}>{error.message}</li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            </div>
          )}
        </div>
      </div>

      {/* Enhanced Responsive Tabs */}
      <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-4 sm:space-y-6"
        >
          {/* Primary Tabs - Always show all tabs but adjust layout */}
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-5 h-auto sm:h-10">
            <TabsTrigger value="overview" className="text-xs sm:text-sm">
              Overview
            </TabsTrigger>
            <TabsTrigger value="contact" className="text-xs sm:text-sm">
              <span className="sm:hidden">Contact</span>
              <span className="hidden sm:inline">Contact Info</span>
            </TabsTrigger>
            <TabsTrigger value="social" className="text-xs sm:text-sm">
              <span className="sm:hidden">Social</span>
              <span className="hidden sm:inline">Social Links</span>
            </TabsTrigger>
            <TabsTrigger value="appearance" className="text-xs sm:text-sm">
              <span className="sm:hidden">Theme</span>
              <span className="hidden sm:inline">Appearance</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="text-xs sm:text-sm">
              Settings
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview">
            <div className="grid lg:grid-cols-3 gap-4 sm:gap-6">
              <div className="lg:col-span-2 space-y-4 sm:space-y-6">
                {/* Basic Information */}
                <Card className={cn("border", currentTheme.cardBorder)}>
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center">
                      <Briefcase className="w-5 h-5 mr-2" />
                      Basic Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                          id="firstName"
                          value={profile.firstName}
                          onChange={(e) =>
                            updateField("firstName", e.target.value)
                          }
                          disabled={!isEditing}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                          id="lastName"
                          value={profile.lastName}
                          onChange={(e) =>
                            updateField("lastName", e.target.value)
                          }
                          disabled={!isEditing}
                          className="mt-1"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="title">Job Title</Label>
                        <Input
                          id="title"
                          value={profile.title}
                          onChange={(e) => updateField("title", e.target.value)}
                          disabled={!isEditing}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="company">Company</Label>
                        <Input
                          id="company"
                          value={profile.company}
                          onChange={(e) =>
                            updateField("company", e.target.value)
                          }
                          disabled={!isEditing}
                          className="mt-1"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea
                        id="bio"
                        value={profile.bio}
                        onChange={(e) => updateField("bio", e.target.value)}
                        disabled={!isEditing}
                        rows={3}
                        className="mt-1 resize-none"
                      />
                    </div>
                    <div>
                      <Label htmlFor="location">Location</Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                        <Input
                          id="location"
                          value={profile.location}
                          onChange={(e) =>
                            updateField("location", e.target.value)
                          }
                          disabled={!isEditing}
                          className="pl-10 mt-1"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="customUrl">Custom URL</Label>
                      <div className="flex mt-1">
                        <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                          shareinfobd.com/
                        </span>
                        <Input
                          id="customUrl"
                          value={profile.customUrl}
                          onChange={(e) =>
                            updateField("customUrl", e.target.value)
                          }
                          disabled={!isEditing}
                          className="rounded-l-none"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Skills Section */}
                <Card className={cn("border", currentTheme.cardBorder)}>
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center">
                        <Award className="w-5 h-5 mr-2" />
                        Skills & Expertise
                      </CardTitle>
                      {isEditing && (
                        <Button size="sm" variant="outline">
                          <Plus className="w-4 h-4 mr-2" />
                          Add Skill
                        </Button>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {profile.skills?.length > 0 ? (
                        profile.skills.map((skill) => (
                          <div
                            key={skill.id}
                            className="flex items-center justify-between p-3 border rounded-lg"
                          >
                            <div className="flex items-center space-x-3">
                              <div
                                className={cn(
                                  "w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-semibold",
                                  {
                                    "bg-green-500": skill.level === "expert",
                                    "bg-blue-500": skill.level === "advanced",
                                    "bg-yellow-500":
                                      skill.level === "intermediate",
                                    "bg-gray-500": skill.level === "beginner",
                                  },
                                )}
                              >
                                {skill.name.charAt(0)}
                              </div>
                              <div>
                                <p className="font-medium">{skill.name}</p>
                                <p className="text-sm text-gray-500 capitalize">
                                  {skill.level}
                                </p>
                              </div>
                            </div>
                            <Badge variant="outline" className="capitalize">
                              {skill.level}
                            </Badge>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-8 text-gray-500">
                          <Award className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                          <p>No skills added yet</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-4 sm:space-y-6">
                {/* Quick Actions */}
                <Card>
                  <CardHeader className="pb-4">
                    <CardTitle>Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button
                      className="w-full"
                      variant="outline"
                      onClick={() => setShowQrCodeModal(true)}
                    >
                      <QrCode className="w-4 h-4 mr-2" />
                      QR Code
                    </Button>
                    <Button
                      className="w-full"
                      variant="outline"
                      onClick={generateVCard}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Export vCard
                    </Button>
                    <Button className="w-full" variant="outline">
                      <Share2 className="w-4 h-4 mr-2" />
                      Share Profile
                    </Button>
                  </CardContent>
                </Card>

                {/* Analytics */}
                <Card>
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center">
                      <TrendingUp className="w-5 h-5 mr-2" />
                      Analytics
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {analyticsLoading ? (
                      <div className="space-y-3">
                        {Array.from({ length: 4 }).map((_, i) => (
                          <div key={i} className="flex justify-between">
                            <div className="h-4 bg-gray-200 rounded w-24"></div>
                            <div className="h-4 bg-gray-200 rounded w-8"></div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">
                            Profile Views
                          </span>
                          <span className="font-semibold">
                            {analytics?.analytics?.views || 0}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">
                            Card Taps
                          </span>
                          <span className="font-semibold">
                            {analytics?.analytics?.cardTaps || 0}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">
                            Contacts Saved
                          </span>
                          <span className="font-semibold">
                            {analytics?.analytics?.contacts || 0}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Shares</span>
                          <span className="font-semibold">
                            {analytics?.analytics?.shares || 0}
                          </span>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Device Preview */}
                <Card>
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center">
                      <Smartphone className="w-5 h-5 mr-2" />
                      Preview
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-center space-x-2">
                      <Button size="sm" variant="outline" className="p-2">
                        <Smartphone className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline" className="p-2">
                        <Tablet className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline" className="p-2">
                        <Monitor className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Contact Info Tab */}
          <TabsContent value="contact">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Mail className="w-5 h-5 mr-2" />
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                      <Input
                        id="email"
                        type="email"
                        value={profile.email}
                        onChange={(e) => updateField("email", e.target.value)}
                        disabled={!isEditing}
                        className="pl-10 mt-1"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                      <Input
                        id="phone"
                        value={profile.phone || ""}
                        onChange={(e) => updateField("phone", e.target.value)}
                        disabled={!isEditing}
                        className="pl-10 mt-1"
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <Label htmlFor="website">Website</Label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <Input
                      id="website"
                      value={profile.website || ""}
                      onChange={(e) => updateField("website", e.target.value)}
                      disabled={!isEditing}
                      className="pl-10 mt-1"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="address">Address</Label>
                  <Textarea
                    id="address"
                    value={profile.address || ""}
                    onChange={(e) => updateField("address", e.target.value)}
                    disabled={!isEditing}
                    rows={3}
                    className="mt-1 resize-none"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <Label>Additional Contact Fields</Label>
                    {isEditing && (
                      <Button size="sm" variant="outline">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Field
                      </Button>
                    )}
                  </div>
                  <div className="space-y-3">
                    {profile.contactFields?.length > 0 ? (
                      profile.contactFields.map((field) => (
                        <div
                          key={field.id}
                          className="flex items-center space-x-2"
                        >
                          <Input
                            placeholder="Label"
                            value={field.label}
                            onChange={(e) => {
                              if (isEditing) {
                                const updatedFields =
                                  profile.contactFields?.map((f) =>
                                    f.id === field.id
                                      ? { ...f, label: e.target.value }
                                      : f,
                                  ) || [];
                                updateField("contactFields", updatedFields);
                              }
                            }}
                            disabled={!isEditing}
                            className="w-1/3"
                          />
                          <Input
                            placeholder="Value"
                            value={field.value}
                            onChange={(e) => {
                              if (isEditing) {
                                const updatedFields =
                                  profile.contactFields?.map((f) =>
                                    f.id === field.id
                                      ? { ...f, value: e.target.value }
                                      : f,
                                  ) || [];
                                updateField("contactFields", updatedFields);
                              }
                            }}
                            disabled={!isEditing}
                            className="flex-1"
                          />
                          {isEditing && (
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-red-500 p-2"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <Phone className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                        <p>No additional contact fields</p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Social Links Tab */}
          <TabsContent value="social">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center">
                    <Share2 className="w-5 h-5 mr-2" />
                    Social Media Links
                  </CardTitle>
                  {isEditing && (
                    <Button size="sm" variant="outline">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Link
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {profile.socialLinks?.length > 0 ? (
                    profile.socialLinks.map((link) => (
                      <div
                        key={link.id}
                        className="flex items-center space-x-3 p-4 border rounded-lg"
                      >
                        <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                          {link.platform.toLowerCase() === "linkedin" && (
                            <Linkedin className="w-5 h-5 text-blue-600" />
                          )}
                          {link.platform.toLowerCase() === "github" && (
                            <Github className="w-5 h-5 text-gray-900" />
                          )}
                          {link.platform.toLowerCase() === "twitter" && (
                            <Twitter className="w-5 h-5 text-blue-400" />
                          )}
                          {link.platform.toLowerCase() === "instagram" && (
                            <Instagram className="w-5 h-5 text-pink-600" />
                          )}
                          {link.platform.toLowerCase() === "facebook" && (
                            <Facebook className="w-5 h-5 text-blue-600" />
                          )}
                          {![
                            "linkedin",
                            "github",
                            "twitter",
                            "instagram",
                            "facebook",
                          ].includes(link.platform.toLowerCase()) && (
                            <ExternalLink className="w-5 h-5 text-gray-600" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">
                            {link.platform}
                          </p>
                          <p className="text-sm text-gray-500 truncate">
                            {link.url}
                          </p>
                        </div>
                        {isEditing && (
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-red-500 p-2"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <Share2 className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                      <p>No social links added yet</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Appearance Tab */}
          <TabsContent value="appearance">
            <Card>
              <CardHeader>
                <CardTitle>Profile Appearance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label>Profile Theme</Label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-3">
                    {[
                      {
                        key: "modern",
                        name: "Modern",
                        gradient: "from-blue-500 to-purple-500",
                      },
                      {
                        key: "professional",
                        name: "Professional",
                        gradient: "from-gray-800 to-gray-900",
                      },
                      {
                        key: "creative",
                        name: "Creative",
                        gradient: "from-pink-500 to-red-500",
                      },
                    ].map((theme) => (
                      <div
                        key={theme.key}
                        className={cn(
                          "p-4 border rounded-lg cursor-pointer transition-all hover:border-orange-500",
                          profile.settings?.theme === theme.key
                            ? "border-orange-500 ring-2 ring-orange-500"
                            : "",
                        )}
                        onClick={() =>
                          updateField("settings", {
                            ...profile.settings,
                            theme: theme.key,
                          })
                        }
                      >
                        <div
                          className={`h-16 sm:h-20 bg-gradient-to-r ${theme.gradient} rounded mb-3`}
                        ></div>
                        <p className="text-sm text-center font-medium">
                          {theme.name}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="w-5 h-5 mr-2" />
                  Profile Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {[
                  {
                    title: "Public Profile",
                    description: "Make your profile visible to everyone",
                    key: "isPublic",
                    icon: Globe,
                  },
                  {
                    title: "Analytics Tracking",
                    description: "Track profile views and interactions",
                    key: "showAnalytics",
                    icon: TrendingUp,
                  },
                  {
                    title: "Contact Form",
                    description: "Allow visitors to send you messages",
                    key: "allowContact",
                    icon: Mail,
                  },
                  {
                    title: "Download Access",
                    description: "Allow visitors to download your vCard",
                    key: "allowDownload",
                    icon: Download,
                  },
                ].map((setting) => (
                  <div
                    key={setting.key}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                        <setting.icon className="w-5 h-5 text-gray-600" />
                      </div>
                      <div>
                        <h3 className="font-medium">{setting.title}</h3>
                        <p className="text-sm text-gray-600">
                          {setting.description}
                        </p>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={
                        profile.settings?.[
                          setting.key as keyof typeof profile.settings
                        ] || false
                      }
                      onChange={(e) =>
                        updateField("settings", {
                          ...profile.settings,
                          [setting.key]: e.target.checked,
                        })
                      }
                      className="rounded"
                      disabled={!isEditing}
                    />
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

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
              className="border p-2 rounded-lg"
            />
          </div>
          <p className="text-sm text-gray-600 mb-4">
            Scan this QR code to instantly share your profile.
          </p>
          <Button
            onClick={downloadQRCodeImage}
            className={currentTheme.buttonClass}
          >
            <Download className="w-4 h-4 mr-2" />
            Download QR Code
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
