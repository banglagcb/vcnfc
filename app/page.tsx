"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Phone, Users, Settings, Share2, Mail, Globe, Camera, Star, Check, ChevronDown, Menu, Bell } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { SearchBar } from "@/components/search-bar"
import { CartSidebar } from "@/components/cart-sidebar"
import { AuthDialog } from "@/components/auth-dialog"
import { ProductCard } from "@/components/product-card"
import { VideoShowcase } from "@/components/video-showcase" // Import the new component
import { useStore } from "@/lib/store"

export default function ShareinfoLanding() {
  const { products } = useStore()
  const featuredProducts = products.slice(0, 3)

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white text-slate-800 border-b border-gray-200">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
              <span className="font-bold text-white text-lg">∞</span>
            </div>
            <span className="font-bold text-lg">SHAREINFO</span>
          </Link>
          <SearchBar />
          <div className="flex items-center space-x-6">
            <Bell className="w-5 h-5 text-gray-600 cursor-pointer hidden md:block" />
            <AuthDialog />
            <CartSidebar />
            {/* Mobile Menu Trigger */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="md:hidden">
                  <Menu className="w-5 h-5 text-gray-600" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[250px] sm:w-[300px] p-4">
                <nav className="flex flex-col space-y-4 mt-8">
                  <Link href="/" className="text-lg font-medium hover:text-orange-500">
                    Home
                  </Link>
                  <Link href="/products" className="text-lg font-medium hover:text-orange-500">
                    Products
                  </Link>
                  <Link href="/categories" className="text-lg font-medium hover:text-orange-500">
                    Categories
                  </Link>
                  <Link href="/about" className="text-lg font-medium hover:text-orange-500">
                    About us
                  </Link>
                  <Link href="/contact" className="text-lg font-medium hover:text-orange-500">
                    Contact us
                  </Link>
                  <div className="pt-4 border-t border-gray-200">
                    <h3 className="font-semibold mb-2">Product Categories</h3>
                    <ul className="space-y-2">
                      <li>
                        <Link
                          href="/products?category=classic"
                          className="flex items-center space-x-2 text-gray-700 hover:text-orange-500"
                        >
                          <Image src="/placeholder.svg?height=20&width=20" alt="Classic" width={20} height={20} />
                          <span>SHAREINFO Classic</span>
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/products?category=standard"
                          className="flex items-center space-x-2 text-gray-700 hover:text-orange-500"
                        >
                          <Image src="/placeholder.svg?height=20&width=20" alt="Standard" width={20} height={20} />
                          <span>SHAREINFO Standard</span>
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/products?category=premium"
                          className="flex items-center space-x-2 text-gray-700 hover:text-orange-500"
                        >
                          <Image src="/placeholder.svg?height=20&width=20" alt="Premium" width={20} height={20} />
                          <span>SHAREINFO Premium</span>
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/products?category=women"
                          className="flex items-center space-x-2 text-gray-700 hover:text-orange-500"
                        >
                          <Image src="/placeholder.svg?height=20&width=20" alt="Women Profile" width={20} height={20} />
                          <span>SHAREINFO Women Profile</span>
                        </Link>
                      </li>
                    </ul>
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
        <div className="bg-slate-800 px-4 py-2">
          <div className="container mx-auto flex items-center justify-between md:justify-start md:space-x-6">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-md flex items-center space-x-2">
                  <span>Product Categories</span>
                  <ChevronDown className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-white shadow-lg rounded-md py-1">
                <DropdownMenuItem asChild>
                  <Link
                    href="/products?category=classic"
                    className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  >
                    <Image src="/placeholder.svg?height=20&width=20" alt="Classic" width={20} height={20} />
                    <span>SHAREINFO Classic</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    href="/products?category=standard"
                    className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  >
                    <Image src="/placeholder.svg?height=20&width=20" alt="Standard" width={20} height={20} />
                    <span>SHAREINFO Standard</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    href="/products?category=premium"
                    className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  >
                    <Image src="/placeholder.svg?height=20&width=20" alt="Premium" width={20} height={20} />
                    <span>SHAREINFO Premium</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    href="/products?category=women"
                    className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  >
                    <Image src="/placeholder.svg?height=20&width=20" alt="Women Profile" width={20} height={20} />
                    <span>SHAREINFO Women Profile</span>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <nav className="hidden md:flex items-center space-x-6 text-white">
              <Link href="/" className="hover:text-orange-400 transition-colors duration-200">
                Home
              </Link>
              <Link href="/products" className="hover:text-orange-400 transition-colors duration-200">
                Products
              </Link>
              <Link href="/categories" className="hover:text-orange-400 transition-colors duration-200">
                Categories
              </Link>
              <Link href="/about" className="hover:text-orange-400 transition-colors duration-200">
                About us
              </Link>
              <Link href="/contact" className="hover:text-orange-400 transition-colors duration-200">
                Contact us
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-slate-800 to-slate-700 text-white py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Your flexible friend
                <br />
                <span className="text-orange-400">NFC Cards</span>
              </h1>
              <p className="text-lg md:text-xl mb-6 text-gray-300">Access NFC Cards in Smartphone</p>
              <p className="text-base md:text-lg mb-8 text-gray-300">Use the QR - & Share Your Link Like a Magic !</p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/products">
                  <Button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 text-lg transition-colors duration-200">
                    Shop Now
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  className="text-white border-white hover:bg-white hover:text-slate-800 px-8 py-3 text-lg bg-transparent"
                >
                  Learn More
                </Button>
              </div>
            </div>
            <div className="relative flex justify-center lg:justify-end">
              <div className="relative z-10 w-full max-w-md lg:max-w-none">
                <Image
                  src="/placeholder.svg?height=400&width=600"
                  alt="NFC Cards on phones"
                  width={600}
                  height={400}
                  className="w-full h-auto object-contain"
                  priority
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-orange-400/20 to-blue-500/20 rounded-lg blur-3xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center p-6 transition-transform duration-300 hover:scale-105">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <div className="w-8 h-8 bg-orange-500 rounded"></div>
                </div>
                <h3 className="font-semibold mb-2 text-lg">Get Your SHAREINFO Card</h3>
                <p className="text-gray-600 text-sm">
                  Get your first free request card from us and start your digital business card journey.
                </p>
              </CardContent>
            </Card>
            <Card className="text-center p-6 transition-transform duration-300 hover:scale-105">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Phone className="w-8 h-8 text-orange-500" />
                </div>
                <h3 className="font-semibold mb-2 text-lg">Tap or Scan SHAREINFO Card</h3>
                <p className="text-gray-600 text-sm">
                  Whenever you tap or scan your card, your contact information will be shared instantly.
                </p>
              </CardContent>
            </Card>
            <Card className="text-center p-6 transition-transform duration-300 hover:scale-105">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-orange-500" />
                </div>
                <h3 className="font-semibold mb-2 text-lg">Customize SHAREINFO Card</h3>
                <p className="text-gray-600 text-sm">
                  Customize your card according to your business needs and make it unique.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Video Showcase Section */}
      <VideoShowcase
        videoUrl="https://www.youtube.com/embed/dQw4w9WgXcQ?si=1234567890" // Placeholder YouTube URL
        title="SHAREINFO NFC SMART BUSINESS CARD"
        description="Your Flexible friend NFC Cards. Watch how it works!"
      />

      {/* Featured Products */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold">Featured Products</h2>
            <Link href="/products">
              <Button variant="outline" className="hover:bg-orange-500 hover:text-white bg-transparent">
                View All Products
              </Button>
            </Link>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Product Showcase (Original, now after Featured Products) */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative flex justify-center lg:justify-start">
              <Image
                src="/placeholder.svg?height=500&width=400"
                alt="SHAREINFO app on phones"
                width={400}
                height={500}
                className="w-full max-w-sm h-auto object-contain"
              />
            </div>
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                SHAREINFO
                <br />
                NFC SMART
                <br />
                BUSINESS CARD
              </h2>
              <p className="text-lg md:text-xl text-gray-600 mb-8">
                Your Flexible
                <br />
                friend NFC Cards
              </p>
              <div className="bg-gradient-to-r from-orange-400 to-yellow-400 p-6 rounded-lg shadow-lg">
                <Image
                  src="/placeholder.svg?height=200&width=300"
                  alt="Business card sample"
                  width={300}
                  height={200}
                  className="w-full h-auto rounded"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Card Features */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Card Features</h2>
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="bg-gradient-to-br from-blue-600 to-purple-700 p-8 rounded-lg text-white shadow-xl">
              <Badge className="bg-white text-blue-600 mb-4 text-sm px-3 py-1 rounded-full">FREE SHIPPING</Badge>
              <h3 className="text-3xl md:text-4xl font-bold mb-4">
                Seamless Touch
                <br />
                UNLIMITED POSSIBILITIES
              </h3>
              <p className="mb-6 text-gray-200">
                Transform the way you network and share your professional information with our cutting-edge NFC business
                cards.
              </p>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <Image
                  src="/placeholder.svg?height=100&width=100"
                  alt="Feature 1"
                  width={100}
                  height={100}
                  className="rounded-lg object-cover"
                />
                <Image
                  src="/placeholder.svg?height=100&width=100"
                  alt="Feature 2"
                  width={100}
                  height={100}
                  className="rounded-lg object-cover"
                />
              </div>
              <Link href="/products">
                <Button className="bg-orange-500 hover:bg-orange-600 transition-colors duration-200">Shop Now</Button>
              </Link>
            </div>
            <div>
              <h3 className="text-2xl md:text-3xl font-bold mb-6">Tap or Scan SHAREINFO Card</h3>
              <p className="text-gray-600 mb-6">
                By using SHAREINFO NFC Smart Business Card, you can share your contact information instantly like a
                magic!
              </p>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Check className="w-5 h-5 text-green-500" />
                  <span>Available phone support</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Check className="w-5 h-5 text-green-500" />
                  <span>Customizable design</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Check className="w-5 h-5 text-green-500" />
                  <span>Virtual Profile</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Check className="w-5 h-5 text-green-500" />
                  <span>Analytics Dashboard</span>
                </div>
              </div>
              <Link href="/products">
                <Button className="bg-orange-500 hover:bg-orange-600 mt-6 transition-colors duration-200">
                  Order Now
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* SHAREINFO Card Sections */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">SHAREINFO Card Sections</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="p-6 transition-transform duration-300 hover:scale-105">
              <CardContent className="pt-0">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                  <Mail className="w-6 h-6 text-orange-500" />
                </div>
                <h3 className="font-semibold mb-2 text-lg">Contact Information</h3>
                <p className="text-gray-600 text-sm">
                  Share your contact information instantly with anyone who taps your card.
                </p>
              </CardContent>
            </Card>
            <Card className="p-6 transition-transform duration-300 hover:scale-105">
              <CardContent className="pt-0">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                  <Share2 className="w-6 h-6 text-orange-500" />
                </div>
                <h3 className="font-semibold mb-2 text-lg">Unlimited Social Links</h3>
                <p className="text-gray-600 text-sm">
                  Add all your social media profiles and let people connect with you everywhere.
                </p>
              </CardContent>
            </Card>
            <Card className="p-6 transition-transform duration-300 hover:scale-105">
              <CardContent className="pt-0">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                  <Camera className="w-6 h-6 text-orange-500" />
                </div>
                <h3 className="font-semibold mb-2 text-lg">Image Gallery</h3>
                <p className="text-gray-600 text-sm">
                  Showcase your work and achievements with a beautiful image gallery.
                </p>
              </CardContent>
            </Card>
            <Card className="p-6 transition-transform duration-300 hover:scale-105">
              <CardContent className="pt-0">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                  <Settings className="w-6 h-6 text-orange-500" />
                </div>
                <h3 className="font-semibold mb-2 text-lg">Products & Services</h3>
                <p className="text-gray-600 text-sm">Display your products and services with detailed descriptions.</p>
              </CardContent>
            </Card>
            <Card className="p-6 transition-transform duration-300 hover:scale-105">
              <CardContent className="pt-0">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                  <Globe className="w-6 h-6 text-orange-500" />
                </div>
                <h3 className="font-semibold mb-2 text-lg">Portfolio Showcase</h3>
                <p className="text-gray-600 text-sm">
                  Present your best work and projects in a professional portfolio format.
                </p>
              </CardContent>
            </Card>
            <Card className="p-6 transition-transform duration-300 hover:scale-105">
              <CardContent className="pt-0">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                  <Star className="w-6 h-6 text-orange-500" />
                </div>
                <h3 className="font-semibold mb-2 text-lg">Customer Reviews</h3>
                <p className="text-gray-600 text-sm">Build trust with authentic customer reviews and testimonials.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Free Trial CTA */}
      <section className="py-16 md:py-24 bg-slate-800 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Get Your Free Trial Account</h2>
          <p className="text-lg md:text-xl mb-8 text-gray-300">
            Create your account & access it free for 3 days. After trial you can order
          </p>
          <Button className="bg-orange-500 hover:bg-orange-600 px-8 py-3 text-lg transition-colors duration-200">
            Create Free Account Now
          </Button>
        </div>
      </section>

      {/* Features List */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-8">Features of SHAREINFO Card</h2>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Check className="w-5 h-5 text-green-500" />
                  <span>Full Custom Design NFC Card</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Check className="w-5 h-5 text-green-500" />
                  <span>Unlimited Contact/Custom Fields</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Check className="w-5 h-5 text-green-500" />
                  <span>Gallery Image Section</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Check className="w-5 h-5 text-green-500" />
                  <span>QR Code Printed & Downloadable</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Check className="w-5 h-5 text-green-500" />
                  <span>Customizable Card URL</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Check className="w-5 h-5 text-green-500" />
                  <span>Multiple Profile theme support</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Check className="w-5 h-5 text-green-500" />
                  <span>Product & Service Show-Casing</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Check className="w-5 h-5 text-green-500" />
                  <span>Display Portfolio</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Check className="w-5 h-5 text-green-500" />
                  <span>Show Your Customer Testimonials</span>
                </div>
              </div>
              <Link href="/products">
                <Button className="bg-orange-500 hover:bg-orange-600 mt-8 px-8 py-3 text-lg transition-colors duration-200">
                  BUY CARD NOW
                </Button>
              </Link>
            </div>
            <div className="relative flex justify-center lg:justify-end">
              <Image
                src="/placeholder.svg?height=400&width=300"
                alt="NFC Smart Business Card"
                width={300}
                height={400}
                className="w-full max-w-sm h-auto rounded-lg object-contain"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Corporate CTA */}
      <section className="py-16 md:py-24 bg-slate-800 text-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Need Corporate Business Card?</h2>
              <p className="text-gray-300 mb-6">If you are interested for corporate use then feel free to contact us</p>
            </div>
            <div className="text-left lg:text-right">
              <Link href="/contact">
                <Button className="bg-orange-500 hover:bg-orange-600 px-8 py-3 text-lg transition-colors duration-200">
                  Contact Us Now
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Frequently Ask Questions</h2>
          <Accordion type="single" collapsible className="max-w-3xl mx-auto space-y-4">
            <AccordionItem value="item-1" className="border rounded-lg shadow-sm">
              <AccordionTrigger className="px-6 py-4 text-lg font-semibold hover:no-underline">
                Where is your delivery location?
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-4 text-gray-700">
                We usually deliver all over the country. Specially Dhaka and Chittagong city.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2" className="border rounded-lg shadow-sm">
              <AccordionTrigger className="px-6 py-4 text-lg font-semibold hover:no-underline">
                What is NFC?
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-4 text-gray-700">
                Near-field communication is a set of communication protocols that enables communication between two
                electronic devices over a distance of 4 cm or less. NFC offers a low-speed connection with simple setup
                that can be used to bootstrap more capable wireless connections.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3" className="border rounded-lg shadow-sm">
              <AccordionTrigger className="px-6 py-4 text-lg font-semibold hover:no-underline">
                How it Works?
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-4 text-gray-700">
                It works by simply tapping your NFC card to a compatible smartphone or scanning the QR code. Your
                digital profile will instantly appear.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-4" className="border rounded-lg shadow-sm">
              <AccordionTrigger className="px-6 py-4 text-lg font-semibold hover:no-underline">
                Onetime payment or subscription?
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-4 text-gray-700">
                Our NFC cards are a one-time purchase. There are no recurring subscription fees for the basic features.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-center md:text-left">
            <div>
              <h3 className="font-bold mb-4">IMPORTANT LINKS</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/return-policy" className="hover:text-orange-400 transition-colors duration-200">
                    Return Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-orange-400 transition-colors duration-200">
                    Term Conditions
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="hover:text-orange-400 transition-colors duration-200">
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">CONTACTS</h3>
              <ul className="space-y-2 text-sm">
                <li>Address : Box Culvert Road, Panthopath, Dhaka</li>
                <li>Phone : 01723128440</li>
                <li>Email : support@shareinfobd.com</li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">MY ACCOUNT</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/account" className="hover:text-orange-400 transition-colors duration-200">
                    My Account
                  </Link>
                </li>
                <li>
                  <Link href="/orders" className="hover:text-orange-400 transition-colors duration-200">
                    Order History
                  </Link>
                </li>
                <li>
                  <Link href="/wishlist" className="hover:text-orange-400 transition-colors duration-200">
                    Wishlist
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">FOLLOW US</h3>
              <div className="flex justify-center md:justify-start space-x-4">
                <Link
                  href="#"
                  className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center hover:bg-blue-700 transition-colors duration-200"
                  aria-label="Facebook"
                >
                  <span className="text-xs font-bold">f</span>
                </Link>
                <Link
                  href="#"
                  className="w-8 h-8 bg-pink-600 rounded flex items-center justify-center hover:bg-pink-700 transition-colors duration-200"
                  aria-label="Instagram"
                >
                  <span className="text-xs font-bold">i</span>
                </Link>
                <Link
                  href="#"
                  className="w-8 h-8 bg-red-600 rounded flex items-center justify-center hover:bg-red-700 transition-colors duration-200"
                  aria-label="YouTube"
                >
                  <span className="text-xs font-bold">y</span>
                </Link>
                <Link
                  href="#"
                  className="w-8 h-8 bg-blue-400 rounded flex items-center justify-center hover:bg-blue-500 transition-colors duration-200"
                  aria-label="LinkedIn"
                >
                  <span className="text-xs font-bold">in</span>
                </Link>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm">
            <p>&copy;2023, SHAREINFO, All right reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
