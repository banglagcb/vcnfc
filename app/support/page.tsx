"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { MessageSquare, Phone, Mail, Clock, Search, BookOpen, Video, ExternalLink } from "lucide-react"
import { useState } from "react"

export default function SupportPage() {
  const [ticketForm, setTicketForm] = useState({
    name: "",
    email: "",
    subject: "",
    priority: "medium",
    message: "",
  })

  const [searchTerm, setSearchTerm] = useState("")

  const faqs = [
    {
      question: "How do NFC business cards work?",
      answer:
        "NFC business cards use Near Field Communication technology. When someone taps their smartphone to your card, it instantly opens your digital profile with all your contact information, social links, and more.",
    },
    {
      question: "Are NFC cards compatible with all smartphones?",
      answer:
        "Yes, NFC cards work with all modern smartphones (iPhone and Android) that have NFC capability, which includes most phones made after 2014.",
    },
    {
      question: "Can I update my information after receiving the card?",
      answer:
        "That's one of the main advantages. You can update your information anytime through your profile dashboard, and the changes will be reflected immediately.",
    },
    {
      question: "How long does delivery take?",
      answer:
        "Standard delivery within Dhaka takes 2-3 business days. Outside Dhaka takes 3-5 business days. Express delivery options are available.",
    },
    {
      question: "What if my NFC card stops working?",
      answer:
        "NFC cards are very durable, but if you experience any issues, contact our support team for a free replacement within the warranty period.",
    },
    {
      question: "Can I order cards for my entire team?",
      answer:
        "Yes! We offer bulk orders with special pricing for teams and corporations. Contact our sales team for a custom quote.",
    },
  ]

  const tutorials = [
    {
      title: "Setting Up Your NFC Card Profile",
      description: "Learn how to create and customize your digital profile",
      type: "video",
      duration: "5 min",
    },
    {
      title: "Sharing Your NFC Card",
      description: "Different ways to share your digital business card",
      type: "article",
      duration: "3 min read",
    },
    {
      title: "Analytics Dashboard Guide",
      description: "Understanding your profile analytics and insights",
      type: "video",
      duration: "7 min",
    },
    {
      title: "Troubleshooting Common Issues",
      description: "Solutions to frequently encountered problems",
      type: "article",
      duration: "5 min read",
    },
  ]

  const filteredFaqs = faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleTicketSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    alert("Support ticket submitted successfully! We'll get back to you within 24 hours.")
    setTicketForm({
      name: "",
      email: "",
      subject: "",
      priority: "medium",
      message: "",
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Support Center</h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-200">
              We're here to help you get the most out of your SHAREINFO experience
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-white text-blue-600 hover:bg-gray-100">
                <MessageSquare className="w-4 h-4 mr-2" />
                Start Live Chat
              </Button>
              <Button
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-blue-600 bg-transparent"
              >
                <Phone className="w-4 h-4 mr-2" />
                Call Support
              </Button>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16">
        {/* Quick Contact Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          <Card className="text-center">
            <CardContent className="p-6">
              <MessageSquare className="w-12 h-12 text-blue-500 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Live Chat</h3>
              <p className="text-gray-600 mb-4">Get instant help from our support team</p>
              <Button className="bg-blue-500 hover:bg-blue-600">Start Chat</Button>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-6">
              <Phone className="w-12 h-12 text-green-500 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Phone Support</h3>
              <p className="text-gray-600 mb-4">Call us at +880 1723128440</p>
              <Button className="bg-green-500 hover:bg-green-600">Call Now</Button>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-6">
              <Mail className="w-12 h-12 text-orange-500 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Email Support</h3>
              <p className="text-gray-600 mb-4">support@shareinfobd.com</p>
              <Button className="bg-orange-500 hover:bg-orange-600">Send Email</Button>
            </CardContent>
          </Card>
        </div>

        {/* Support Tabs */}
        <Tabs defaultValue="faq" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="faq">FAQ</TabsTrigger>
            <TabsTrigger value="tutorials">Tutorials</TabsTrigger>
            <TabsTrigger value="ticket">Submit Ticket</TabsTrigger>
            <TabsTrigger value="status">System Status</TabsTrigger>
          </TabsList>

          <TabsContent value="faq">
            <Card>
              <CardHeader>
                <CardTitle>Frequently Asked Questions</CardTitle>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Search FAQs..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="space-y-4">
                  {filteredFaqs.map((faq, index) => (
                    <AccordionItem key={index} value={`item-${index}`} className="border rounded-lg">
                      <AccordionTrigger className="px-6 py-4 text-left hover:no-underline">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="px-6 pb-4 text-gray-700">{faq.answer}</AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tutorials">
            <Card>
              <CardHeader>
                <CardTitle>Tutorials & Guides</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  {tutorials.map((tutorial, index) => (
                    <div key={index} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          {tutorial.type === "video" ? (
                            <Video className="w-5 h-5 text-red-500" />
                          ) : (
                            <BookOpen className="w-5 h-5 text-blue-500" />
                          )}
                          <span className="text-sm text-gray-500">{tutorial.duration}</span>
                        </div>
                        <ExternalLink className="w-4 h-4 text-gray-400" />
                      </div>
                      <h3 className="font-semibold mb-2">{tutorial.title}</h3>
                      <p className="text-gray-600 text-sm mb-4">{tutorial.description}</p>
                      <Button variant="outline" size="sm" className="bg-transparent">
                        {tutorial.type === "video" ? "Watch Video" : "Read Article"}
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ticket">
            <Card>
              <CardHeader>
                <CardTitle>Submit Support Ticket</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleTicketSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={ticketForm.name}
                        onChange={(e) => setTicketForm({ ...ticketForm, name: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        value={ticketForm.email}
                        onChange={(e) => setTicketForm({ ...ticketForm, email: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="subject">Subject</Label>
                    <Input
                      id="subject"
                      value={ticketForm.subject}
                      onChange={(e) => setTicketForm({ ...ticketForm, subject: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="priority">Priority</Label>
                    <select
                      id="priority"
                      value={ticketForm.priority}
                      onChange={(e) => setTicketForm({ ...ticketForm, priority: e.target.value })}
                      className="w-full p-2 border rounded-md"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      rows={5}
                      value={ticketForm.message}
                      onChange={(e) => setTicketForm({ ...ticketForm, message: e.target.value })}
                      required
                    />
                  </div>
                  <Button type="submit" className="bg-orange-500 hover:bg-orange-600">
                    Submit Ticket
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="status">
            <Card>
              <CardHeader>
                <CardTitle>System Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-semibold">Website</h3>
                      <p className="text-sm text-gray-600">Main website and dashboard</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-green-600 font-medium">Operational</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-semibold">NFC Card Services</h3>
                      <p className="text-sm text-gray-600">Card activation and profile updates</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-green-600 font-medium">Operational</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-semibold">Payment Processing</h3>
                      <p className="text-sm text-gray-600">Order processing and payments</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-green-600 font-medium">Operational</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Support Hours */}
        <Card className="mt-16">
          <CardContent className="p-8 text-center">
            <Clock className="w-12 h-12 text-blue-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-4">Support Hours</h2>
            <div className="grid md:grid-cols-3 gap-6 text-left max-w-2xl mx-auto">
              <div>
                <h3 className="font-semibold mb-2">Live Chat</h3>
                <p className="text-gray-600">24/7 Available</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Phone Support</h3>
                <p className="text-gray-600">
                  Mon-Fri: 9AM-6PM
                  <br />
                  Sat: 10AM-4PM
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Email Support</h3>
                <p className="text-gray-600">Response within 24 hours</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
