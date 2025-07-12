"use client";

import { useState, useEffect } from "react";
import { useProfile } from "@/hooks/use-profile";
import {
  Phone,
  Mail,
  MapPin,
  Globe,
  MessageCircle,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Star,
  Download,
  QrCode,
  Share2,
  ExternalLink,
  UserPlus,
  Send,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  downloadVCard,
  shareProfile,
  createContactActions,
} from "@/lib/utils/vcard";
import Image from "next/image";

export default function PreviewPage() {
  const { profile, loading } = useProfile();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            No Profile Found
          </h2>
          <p className="text-gray-600">Please create a profile first.</p>
        </div>
      </div>
    );
  }

  const generateQRCode = () => {
    const profileUrl = `${window.location.origin}/preview`;
    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(profileUrl)}`;
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                <span className="text-orange-500 font-bold text-lg">∞</span>
              </div>
              <h1 className="text-2xl font-bold">SHAREINFO</h1>
            </div>
            <div className="hidden sm:flex items-center space-x-4">
              <span className="text-sm opacity-90">Professional Profile</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Profile Section */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white pb-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-start space-y-6 md:space-y-0 md:space-x-8">
            {/* Profile Image */}
            <div className="flex-shrink-0">
              {profile.profileImage ? (
                <Image
                  src={profile.profileImage}
                  alt={profile.name}
                  width={120}
                  height={120}
                  className="rounded-lg border-4 border-white/20"
                />
              ) : (
                <div className="w-[120px] h-[120px] bg-white/20 rounded-lg border-4 border-white/20 flex items-center justify-center">
                  <span className="text-3xl font-bold">
                    {profile.name ? profile.name.charAt(0) : "U"}
                  </span>
                </div>
              )}
            </div>

            {/* Profile Info */}
            <div className="flex-1">
              <h2 className="text-3xl font-bold mb-2">{profile.name}</h2>
              <p className="text-xl mb-2 opacity-90">{profile.title}</p>
              <p className="text-lg mb-4 opacity-80">{profile.location}</p>
              <p className="text-base opacity-90 leading-relaxed max-w-2xl">
                {profile.bio}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 mt-6">
                <Button
                  onClick={() => downloadVCard(profile)}
                  size="sm"
                  className="bg-orange-600 text-white hover:bg-orange-700 border-0"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Save to Phone
                </Button>
                <Button
                  onClick={() => shareProfile(profile)}
                  variant="outline"
                  size="sm"
                  className="border-white text-white hover:bg-white/10 bg-slate-600 hover:bg-slate-700"
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Share to Friend
                </Button>
              </div>
            </div>

            {/* Products/Services Preview */}
            <div className="flex-shrink-0">
              <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                <h3 className="font-semibold mb-3">Services</h3>
                <div className="grid grid-cols-2 gap-2">
                  {profile.skills?.slice(0, 4).map((skill, index) => (
                    <div
                      key={index}
                      className="bg-white/20 rounded p-2 text-center text-sm"
                    >
                      {skill.name}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-8 text-gray-900">
            Contact Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {profile.contactFields?.map((field, index) => {
              const getIcon = (type: string) => {
                switch (type.toLowerCase()) {
                  case "phone":
                    return <Phone className="w-5 h-5" />;
                  case "email":
                    return <Mail className="w-5 h-5" />;
                  case "website":
                    return <Globe className="w-5 h-5" />;
                  case "address":
                    return <MapPin className="w-5 h-5" />;
                  default:
                    return <MessageCircle className="w-5 h-5" />;
                }
              };

              return (
                <Card key={index} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <div className="text-orange-500">
                        {getIcon(field.type)}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {field.label}
                        </p>
                        <p className="text-gray-600 text-sm">{field.value}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}

            {/* Social Links */}
            {profile.socialLinks?.map((link, index) => {
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

              return (
                <Card
                  key={`social-${index}`}
                  className="hover:shadow-md transition-shadow"
                >
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <div className="text-orange-500">
                        {getSocialIcon(link.platform)}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {link.platform}
                        </p>
                        <p className="text-gray-600 text-sm">
                          Follow {link.platform} Profile
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>

      {/* Video/Media Section */}
      <div className="py-8">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-8 text-gray-900">
            Introduction Video
          </h2>
          <div className="max-w-2xl mx-auto">
            <div className="bg-gray-100 rounded-lg p-8 text-center">
              <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="w-0 h-0 border-l-[6px] border-l-white border-y-[4px] border-y-transparent ml-1"></div>
              </div>
              <p className="text-gray-600">
                Watch our introduction video to learn more about our services
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Analytics/Stats Section */}
      <div className="bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-8 text-gray-900">
            Professional Stats
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">👥</span>
                </div>
                <h3 className="font-semibold mb-2">Satisfied Clients</h3>
                <div className="text-2xl font-bold text-orange-600 mb-2">
                  98%
                </div>
                <Progress value={98} className="h-2" />
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🎯</span>
                </div>
                <h3 className="font-semibold mb-2">Project Success</h3>
                <div className="text-2xl font-bold text-blue-600 mb-2">95%</div>
                <Progress value={95} className="h-2" />
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">⚡</span>
                </div>
                <h3 className="font-semibold mb-2">On-Time Delivery</h3>
                <div className="text-2xl font-bold text-green-600 mb-2">
                  99%
                </div>
                <Progress value={99} className="h-2" />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Products & Services */}
      <div className="py-8">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-8 text-gray-900">
            Our Products & Services
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {profile.skills
              ?.filter((skill) => skill && skill.name)
              .map((skill, index) => (
                <Card
                  key={index}
                  className="hover:shadow-lg transition-shadow group"
                >
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-600 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                      <span className="text-white text-xl font-bold">
                        {skill.name ? skill.name.charAt(0) : "S"}
                      </span>
                    </div>
                    <h3 className="font-semibold mb-2">{skill.name}</h3>
                    <div className="text-sm text-gray-600 mb-2">
                      Level: {skill.level}
                    </div>
                    <Progress
                      value={
                        skill.level === "Expert"
                          ? 95
                          : skill.level === "Advanced"
                            ? 80
                            : skill.level === "Intermediate"
                              ? 65
                              : 45
                      }
                      className="h-2"
                    />
                  </CardContent>
                </Card>
              ))}
          </div>
        </div>
      </div>

      {/* Portfolio */}
      <div className="bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-8 text-gray-900">
            Portfolio
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {profile.portfolioItems
              ?.filter((item) => item && item.title)
              .map((item, index) => (
                <Card
                  key={index}
                  className="overflow-hidden hover:shadow-lg transition-shadow group"
                >
                  <div className="aspect-video bg-gradient-to-br from-blue-400 to-blue-600 relative overflow-hidden">
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white">
                        <span className="text-4xl font-bold">
                          {item.title ? item.title.charAt(0) : "P"}
                        </span>
                      </div>
                    )}
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-2">{item.title}</h3>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {item.description}
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {item.technologies?.slice(0, 3).map((tech, techIndex) => (
                        <Badge
                          key={techIndex}
                          variant="secondary"
                          className="text-xs"
                        >
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </div>
      </div>

      {/* Image Gallery */}
      <div className="py-8">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-8 text-gray-900">
            Image Gallery
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-6xl mx-auto">
            {/* Sample gallery images */}
            {Array.from({ length: 8 }, (_, index) => (
              <div
                key={index}
                className="aspect-square bg-gradient-to-br from-purple-400 to-pink-600 rounded-lg overflow-hidden group cursor-pointer"
              >
                <div className="w-full h-full flex items-center justify-center text-white group-hover:scale-105 transition-transform">
                  <span className="text-2xl font-bold">#{index + 1}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-8 text-gray-900">
            Testimonials
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {profile.testimonials
              ?.filter((testimonial) => testimonial && testimonial.clientName)
              .map((testimonial, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-white font-bold mr-3">
                        {testimonial.clientName
                          ? testimonial.clientName.charAt(0)
                          : "C"}
                      </div>
                      <div>
                        <h4 className="font-semibold">
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

                    <p className="text-gray-700 italic">
                      &ldquo;{testimonial.content}&rdquo;
                    </p>
                  </CardContent>
                </Card>
              ))}
          </div>
        </div>
      </div>

      {/* Contact Form */}
      <div className="py-8">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-8 text-gray-900">
            Enquiry Form
          </h2>

          <Card className="max-w-2xl mx-auto">
            <CardContent className="p-6">
              <form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Name
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message
                  </label>
                  <textarea
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="Send your message..."
                  ></textarea>
                </div>

                <Button className="w-full bg-orange-500 hover:bg-orange-600">
                  Send Message
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* QR Code Section */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-4">Download My QR Code</h2>
          <p className="mb-6 opacity-90">
            Scan to quickly access my profile information
          </p>

          <div className="bg-white rounded-lg p-6 inline-block">
            <Image
              src={generateQRCode()}
              alt="Profile QR Code"
              width={200}
              height={200}
              className="mx-auto"
            />
          </div>

          <div className="mt-6">
            <Button
              variant="secondary"
              className="bg-white text-orange-600 hover:bg-gray-100"
            >
              <Download className="w-4 h-4 mr-2" />
              Download QR Code
            </Button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-900 text-white py-6">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">∞</span>
            </div>
            <span className="font-bold">SHAREINFO</span>
          </div>
          <p className="text-gray-400 text-sm">
            Powered by ShareInfo • Professional Profile System
          </p>
        </div>
      </div>
    </div>
  );
}
