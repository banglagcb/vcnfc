"use client";

import { useState, useEffect } from "react";
import { useProfileStore } from "@/lib/stores/profile-store";
import { useRealTimeProfileView } from "@/hooks/use-real-time-sync";
import { downloadVCard, shareProfile } from "@/lib/utils/vcard";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Globe,
  Briefcase,
  GraduationCap,
  Award,
  Calendar,
  Star,
  Download,
  Share2,
  Eye,
  Edit,
  Copy,
  ExternalLink,
  Building,
  MessageCircle,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Clock,
  BarChart3,
  FileText,
  Users,
  TrendingUp,
  Camera,
  Settings,
  Github,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";
import Link from "next/link";

export default function ProfileViewPage() {
  const { initializeProfile } = useProfileStore();
  const { profile, lastUpdateTime, isRecentlyUpdated } =
    useRealTimeProfileView();
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    setMounted(true);
    if (!profile) {
      initializeProfile();
    }
  }, [profile, initializeProfile]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        // Simple feedback - you could replace this with a toast notification
        console.log("Copied to clipboard:", text);
      })
      .catch((err) => {
        console.error("Failed to copy:", err);
        // Fallback for older browsers
        const textArea = document.createElement("textarea");
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
      });
  };

  const getSkillProgress = (level: string) => {
    switch (level.toLowerCase()) {
      case "expert":
        return 95;
      case "advanced":
        return 80;
      case "intermediate":
        return 65;
      case "beginner":
        return 40;
      default:
        return 50;
    }
  };

  const getSocialIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case "facebook":
        return <Facebook className="w-5 h-5" />;
      case "twitter":
        return <Twitter className="w-5 h-5" />;
      case "instagram":
        return <Instagram className="w-5 h-5" />;
      case "linkedin":
        return <Linkedin className="w-5 h-5" />;
      default:
        return <Globe className="w-5 h-5" />;
    }
  };

  if (!mounted || !profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <div className="flex items-center space-x-3">
                <h1 className="text-2xl font-bold text-gray-900">
                  Profile Information
                </h1>
                {profile && (
                  <div className="flex items-center space-x-2">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        isRecentlyUpdated
                          ? "bg-green-500 animate-pulse"
                          : "bg-gray-400"
                      }`}
                    ></div>
                    <span
                      className={`text-xs font-medium ${
                        isRecentlyUpdated ? "text-green-600" : "text-gray-500"
                      }`}
                    >
                      {isRecentlyUpdated ? "Live" : "Synced"}
                    </span>
                  </div>
                )}
              </div>
              <p className="text-sm text-gray-600">
                Complete profile overview and details
                {lastUpdateTime && (
                  <span className="ml-2 text-xs text-gray-400">
                    • Updated {lastUpdateTime}
                  </span>
                )}
              </p>
            </div>
            <div className="flex space-x-3">
              <Button variant="outline" size="sm" asChild>
                <Link href="/profile">
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Profile
                </Link>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <Link href="/preview" target="_blank">
                  <Eye className="w-4 h-4 mr-2" />
                  Business Card
                </Link>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => shareProfile(profile)}
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
              <Button size="sm" onClick={() => downloadVCard(profile)}>
                <Download className="w-4 h-4 mr-2" />
                Download vCard
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <Card className="mb-8">
          <CardContent className="p-8">
            <div className="flex flex-col lg:flex-row items-start lg:items-center space-y-6 lg:space-y-0 lg:space-x-8">
              {/* Profile Image */}
              <div className="flex-shrink-0">
                <div className="relative">
                  {profile.profileImage ? (
                    <Avatar className="w-32 h-32">
                      <AvatarImage
                        src={
                          typeof profile.profileImage === "string"
                            ? profile.profileImage
                            : profile.profileImage.url
                        }
                        alt={profile.name || "Profile"}
                      />
                      <AvatarFallback className="text-2xl">
                        {(profile.name || profile.firstName || "U").charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                  ) : (
                    <Avatar className="w-32 h-32">
                      <AvatarFallback className="text-2xl bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                        {(profile.name || profile.firstName || "U").charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <div className="absolute -bottom-2 -right-2 bg-green-500 w-8 h-8 rounded-full border-4 border-white flex items-center justify-center">
                    <div className="w-3 h-3 bg-white rounded-full"></div>
                  </div>
                </div>
              </div>

              {/* Profile Info */}
              <div className="flex-1">
                <div className="mb-4">
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">
                    {profile.name ||
                      `${profile.firstName || ""} ${profile.lastName || ""}`.trim()}
                  </h2>
                  <p className="text-xl text-gray-600 mb-2">{profile.title}</p>
                  {profile.company && (
                    <div className="flex items-center text-gray-500 mb-2">
                      <Building className="w-5 h-5 mr-2" />
                      <span>{profile.company}</span>
                      {profile.department && (
                        <span className="ml-2">• {profile.department}</span>
                      )}
                    </div>
                  )}
                  {profile.location && (
                    <div className="flex items-center text-gray-500">
                      <MapPin className="w-5 h-5 mr-2" />
                      <span>{profile.location}</span>
                    </div>
                  )}
                </div>

                {profile.bio && (
                  <p className="text-gray-700 leading-relaxed mb-6 max-w-3xl">
                    {profile.bio}
                  </p>
                )}

                {/* Quick Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {profile.skills?.length || 0}
                    </div>
                    <div className="text-sm text-gray-500">Skills</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {profile.workExperience?.length || 0}
                    </div>
                    <div className="text-sm text-gray-500">Experience</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {profile.portfolioItems?.length || 0}
                    </div>
                    <div className="text-sm text-gray-500">Projects</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">
                      {profile.testimonials?.length || 0}
                    </div>
                    <div className="text-sm text-gray-500">Reviews</div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs Navigation */}
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="contact">Contact</TabsTrigger>
            <TabsTrigger value="experience">Experience</TabsTrigger>
            <TabsTrigger value="skills">Skills</TabsTrigger>
            <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
            <TabsTrigger value="testimonials">Reviews</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Contact Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Phone className="w-5 h-5 mr-2" />
                    Contact Info
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {profile.email && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Mail className="w-4 h-4 mr-3 text-gray-400" />
                        <span className="text-sm">{profile.email}</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(profile.email)}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                  {profile.phone && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Phone className="w-4 h-4 mr-3 text-gray-400" />
                        <span className="text-sm">{profile.phone}</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(profile.phone)}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                  {profile.website && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Globe className="w-4 h-4 mr-3 text-gray-400" />
                        <span className="text-sm">{profile.website}</span>
                      </div>
                      <Button variant="ghost" size="sm" asChild>
                        <a
                          href={profile.website}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Clock className="w-5 h-5 mr-2" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center text-sm">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                    <span className="text-gray-600">Profile updated</span>
                    <span className="ml-auto text-gray-400">2 hours ago</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                    <span className="text-gray-600">New skill added</span>
                    <span className="ml-auto text-gray-400">1 day ago</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                    <span className="text-gray-600">Portfolio updated</span>
                    <span className="ml-auto text-gray-400">3 days ago</span>
                  </div>
                </CardContent>
              </Card>

              {/* Profile Completeness */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart3 className="w-5 h-5 mr-2" />
                    Profile Completeness
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Overall Progress</span>
                      <span>85%</span>
                    </div>
                    <Progress value={85} className="h-2" />
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center text-green-600">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                      Basic Info Complete
                    </div>
                    <div className="flex items-center text-green-600">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                      Contact Info Added
                    </div>
                    <div className="flex items-center text-green-600">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                      Skills Listed
                    </div>
                    <div className="flex items-center text-orange-500">
                      <div className="w-2 h-2 bg-orange-500 rounded-full mr-2"></div>
                      Add more portfolio items
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Social Links */}
            {profile.socialLinks && profile.socialLinks.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Social Media</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {profile.socialLinks.map((link, index) => (
                      <a
                        key={index}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        {getSocialIcon(link.platform)}
                        <span className="ml-3 font-medium">
                          {link.platform}
                        </span>
                      </a>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Contact Tab */}
          <TabsContent value="contact" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Primary Contact */}
              <Card>
                <CardHeader>
                  <CardTitle>Primary Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { icon: Mail, label: "Email", value: profile.email },
                    { icon: Phone, label: "Phone", value: profile.phone },
                    { icon: Globe, label: "Website", value: profile.website },
                    { icon: MapPin, label: "Address", value: profile.address },
                  ]
                    .filter((item) => item.value)
                    .map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center">
                          <item.icon className="w-5 h-5 mr-3 text-gray-500" />
                          <div>
                            <div className="font-medium text-sm text-gray-500">
                              {item.label}
                            </div>
                            <div className="text-gray-900">{item.value}</div>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(item.value!)}
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                </CardContent>
              </Card>

              {/* Additional Contact Fields */}
              {profile.contactFields && profile.contactFields.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Additional Contact Methods</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {profile.contactFields.map((field, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center">
                          <MessageCircle className="w-5 h-5 mr-3 text-gray-500" />
                          <div>
                            <div className="font-medium text-sm text-gray-500">
                              {field.label}
                            </div>
                            <div className="text-gray-900">{field.value}</div>
                          </div>
                        </div>
                        <Badge variant="secondary">{field.type}</Badge>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* Experience Tab */}
          <TabsContent value="experience" className="space-y-6">
            {profile.workExperience && profile.workExperience.length > 0 ? (
              <div className="space-y-6">
                {profile.workExperience.map((exp, index) => (
                  <Card key={index}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900">
                            {exp.position}
                          </h3>
                          <p className="text-lg text-gray-600">{exp.company}</p>
                          <div className="flex items-center text-gray-500 mt-1">
                            <Calendar className="w-4 h-4 mr-2" />
                            <span>
                              {exp.startDate} -{" "}
                              {exp.isCurrent
                                ? "Present"
                                : exp.endDate || "Present"}
                            </span>
                          </div>
                        </div>
                        {exp.isCurrent && (
                          <Badge className="bg-green-100 text-green-800">
                            Current
                          </Badge>
                        )}
                      </div>

                      {exp.description && (
                        <p className="text-gray-700 mb-4">{exp.description}</p>
                      )}

                      {exp.skills && exp.skills.length > 0 && (
                        <div className="mb-4">
                          <h4 className="font-medium text-gray-900 mb-2">
                            Technologies Used:
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {exp.skills.map((skill, skillIndex) => (
                              <Badge key={skillIndex} variant="outline">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {exp.achievements && exp.achievements.length > 0 && (
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">
                            Key Achievements:
                          </h4>
                          <ul className="list-disc list-inside space-y-1 text-gray-700">
                            {exp.achievements.map((achievement, achIndex) => (
                              <li key={achIndex}>{achievement}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No work experience added
                  </h3>
                  <p className="text-gray-600">
                    Add your professional experience to showcase your career
                    journey.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Skills Tab */}
          <TabsContent value="skills" className="space-y-6">
            {profile.skills && profile.skills.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {profile.skills.map((skill, index) => (
                  <Card key={index}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {skill.name}
                        </h3>
                        <Badge
                          variant={
                            skill.level === "Expert" ? "default" : "secondary"
                          }
                        >
                          {skill.level}
                        </Badge>
                      </div>

                      <div className="mb-3">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-600">Proficiency</span>
                          <span>{getSkillProgress(skill.level)}%</span>
                        </div>
                        <Progress
                          value={getSkillProgress(skill.level)}
                          className="h-2"
                        />
                      </div>

                      <div className="flex items-center justify-between text-sm text-gray-500">
                        {skill.category && (
                          <span className="bg-gray-100 px-2 py-1 rounded">
                            {skill.category}
                          </span>
                        )}
                        {skill.yearsOfExperience && (
                          <span>
                            {skill.yearsOfExperience} years experience
                          </span>
                        )}
                      </div>

                      {skill.isEndorsed && skill.endorsements && (
                        <div className="mt-3 flex items-center text-sm text-blue-600">
                          <Users className="w-4 h-4 mr-1" />
                          <span>{skill.endorsements} endorsements</span>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <GraduationCap className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No skills added
                  </h3>
                  <p className="text-gray-600">
                    Add your skills to showcase your expertise and capabilities.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Portfolio Tab */}
          <TabsContent value="portfolio" className="space-y-6">
            {profile.portfolioItems && profile.portfolioItems.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {profile.portfolioItems.map((item, index) => (
                  <Card key={index} className="overflow-hidden">
                    <div className="aspect-video bg-gradient-to-br from-blue-500 to-purple-600 relative">
                      {item.imageUrl ? (
                        <Image
                          src={item.imageUrl}
                          alt={item.title}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-white">
                          <span className="text-4xl font-bold">
                            {item.title.charAt(0)}
                          </span>
                        </div>
                      )}
                      {item.featured && (
                        <div className="absolute top-2 right-2">
                          <Badge className="bg-yellow-500 text-yellow-900">
                            Featured
                          </Badge>
                        </div>
                      )}
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-lg mb-2">
                        {item.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-3 line-clamp-3">
                        {item.description}
                      </p>

                      {item.technologies && item.technologies.length > 0 && (
                        <div className="mb-3">
                          <div className="flex flex-wrap gap-1">
                            {item.technologies
                              .slice(0, 3)
                              .map((tech, techIndex) => (
                                <Badge
                                  key={techIndex}
                                  variant="outline"
                                  className="text-xs"
                                >
                                  {tech}
                                </Badge>
                              ))}
                            {item.technologies.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{item.technologies.length - 3} more
                              </Badge>
                            )}
                          </div>
                        </div>
                      )}

                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">
                          {item.category}
                        </span>
                        <span className="text-sm text-gray-500">
                          {item.completedDate}
                        </span>
                      </div>

                      {(item.projectUrl || item.repositoryUrl) && (
                        <div className="flex gap-2 mt-3">
                          {item.projectUrl && (
                            <Button variant="outline" size="sm" asChild>
                              <a
                                href={item.projectUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <ExternalLink className="w-4 h-4 mr-1" />
                                View
                              </a>
                            </Button>
                          )}
                          {item.repositoryUrl && (
                            <Button variant="outline" size="sm" asChild>
                              <a
                                href={item.repositoryUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <Github className="w-4 h-4 mr-1" />
                                Code
                              </a>
                            </Button>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No portfolio items
                  </h3>
                  <p className="text-gray-600">
                    Add your projects and work samples to showcase your
                    portfolio.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Testimonials Tab */}
          <TabsContent value="testimonials" className="space-y-6">
            {profile.testimonials && profile.testimonials.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {profile.testimonials.map((testimonial, index) => (
                  <Card key={index}>
                    <CardContent className="p-6">
                      <div className="flex items-center mb-4">
                        <Avatar className="w-12 h-12 mr-4">
                          <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white">
                            {testimonial.clientName?.charAt(0) || "C"}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-semibold text-gray-900">
                            {testimonial.clientName}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {testimonial.clientTitle}
                          </p>
                        </div>
                      </div>

                      <div className="flex mb-3">
                        {Array.from({ length: 5 }, (_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < testimonial.rating
                                ? "text-yellow-400 fill-current"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>

                      <blockquote className="text-gray-700 italic mb-3">
                        "{testimonial.content}"
                      </blockquote>

                      <div className="text-sm text-gray-500">
                        {testimonial.dateReceived}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <Star className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No testimonials
                  </h3>
                  <p className="text-gray-600">
                    Collect testimonials from clients and colleagues to build
                    trust.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
