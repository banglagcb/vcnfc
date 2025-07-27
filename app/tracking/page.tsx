"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Package, Truck, CheckCircle, Clock } from "lucide-react"
import { useState } from "react"

export default function TrackingPage() {
  const [trackingNumber, setTrackingNumber] = useState("")
  const [trackingResult, setTrackingResult] = useState<any>(null)

  // Mock tracking data
  const mockTrackingData = {
    TRK123456789: {
      orderNumber: "ORD-2024-001",
      status: "In Transit",
      estimatedDelivery: "2024-01-20",
      currentLocation: "Dhaka Distribution Center",
      timeline: [
        {
          status: "Order Placed",
          date: "2024-01-15 10:30 AM",
          location: "Online",
          completed: true,
        },
        {
          status: "Order Confirmed",
          date: "2024-01-15 11:00 AM",
          location: "SHAREINFO Office",
          completed: true,
        },
        {
          status: "In Production",
          date: "2024-01-16 09:00 AM",
          location: "Production Facility",
          completed: true,
        },
        {
          status: "Quality Check",
          date: "2024-01-17 02:00 PM",
          location: "Quality Control",
          completed: true,
        },
        {
          status: "Shipped",
          date: "2024-01-18 10:00 AM",
          location: "Dhaka Warehouse",
          completed: true,
        },
        {
          status: "In Transit",
          date: "2024-01-18 03:00 PM",
          location: "Dhaka Distribution Center",
          completed: true,
        },
        {
          status: "Out for Delivery",
          date: "Expected: 2024-01-20 09:00 AM",
          location: "Local Delivery Hub",
          completed: false,
        },
        {
          status: "Delivered",
          date: "Expected: 2024-01-20 05:00 PM",
          location: "Customer Address",
          completed: false,
        },
      ],
    },
  }

  const handleTrack = () => {
    if (trackingNumber in mockTrackingData) {
      setTrackingResult(mockTrackingData[trackingNumber as keyof typeof mockTrackingData])
    } else {
      setTrackingResult("not_found")
    }
  }

  const getStatusIcon = (status: string, completed: boolean) => {
    if (completed) {
      return <CheckCircle className="w-5 h-5 text-green-500" />
    } else {
      switch (status) {
        case "In Transit":
          return <Truck className="w-5 h-5 text-blue-500" />
        case "Out for Delivery":
          return <Package className="w-5 h-5 text-orange-500" />
        default:
          return <Clock className="w-5 h-5 text-gray-400" />
      }
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Order Tracking</h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-200">Track your SHAREINFO NFC card order in real-time</p>
            <p className="text-lg text-gray-300">
              Enter your tracking number to see the current status and location of your order.
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16">
        {/* Tracking Input */}
        <Card className="max-w-2xl mx-auto mb-12">
          <CardHeader>
            <CardTitle className="text-center">Track Your Order</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex space-x-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Enter tracking number (e.g., TRK123456789)"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button onClick={handleTrack} className="bg-orange-500 hover:bg-orange-600">
                Track Order
              </Button>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              You can find your tracking number in the order confirmation email.
            </p>
          </CardContent>
        </Card>

        {/* Tracking Results */}
        {trackingResult && trackingResult !== "not_found" && (
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Order Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <h3 className="font-semibold mb-2">Order Number</h3>
                    <p className="text-gray-600">{trackingResult.orderNumber}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Current Status</h3>
                    <Badge className="bg-blue-500">{trackingResult.status}</Badge>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Estimated Delivery</h3>
                    <p className="text-gray-600">{trackingResult.estimatedDelivery}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tracking Timeline */}
            <Card>
              <CardHeader>
                <CardTitle>Tracking Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {trackingResult.timeline.map((event: any, index: number) => (
                    <div key={index} className="flex items-start space-x-4">
                      <div className="flex-shrink-0 mt-1">{getStatusIcon(event.status, event.completed)}</div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className={`font-semibold ${event.completed ? "text-gray-900" : "text-gray-500"}`}>
                            {event.status}
                          </h3>
                          <span className={`text-sm ${event.completed ? "text-gray-600" : "text-gray-400"}`}>
                            {event.date}
                          </span>
                        </div>
                        <p className={`text-sm ${event.completed ? "text-gray-600" : "text-gray-400"}`}>
                          {event.location}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Delivery Information */}
            <Card>
              <CardHeader>
                <CardTitle>Delivery Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-2">Shipping Address</h3>
                    <p className="text-gray-600">
                      123 Main Street
                      <br />
                      Dhaka 1000
                      <br />
                      Bangladesh
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Delivery Instructions</h3>
                    <p className="text-gray-600">Please call upon arrival. Leave with security if not available.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {trackingResult === "not_found" && (
          <Card className="max-w-2xl mx-auto">
            <CardContent className="p-8 text-center">
              <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Tracking Number Not Found</h3>
              <p className="text-gray-600 mb-6">
                We couldn't find any order with this tracking number. Please check the number and try again.
              </p>
              <div className="space-y-2 text-sm text-gray-600">
                <p>• Make sure you've entered the complete tracking number</p>
                <p>• Check your order confirmation email for the correct tracking number</p>
                <p>• It may take up to 24 hours for tracking information to appear</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Help Section */}
        <Card className="max-w-4xl mx-auto mt-12">
          <CardHeader>
            <CardTitle>Need Help?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <h3 className="font-semibold mb-2">Can't find your tracking number?</h3>
                <p className="text-gray-600 mb-4">Check your order confirmation email or account dashboard.</p>
                <Button variant="outline" className="bg-transparent">
                  View Orders
                </Button>
              </div>
              <div className="text-center">
                <h3 className="font-semibold mb-2">Delivery issues?</h3>
                <p className="text-gray-600 mb-4">Contact our support team for assistance with delivery problems.</p>
                <Button variant="outline" className="bg-transparent">
                  Contact Support
                </Button>
              </div>
              <div className="text-center">
                <h3 className="font-semibold mb-2">Update delivery address?</h3>
                <p className="text-gray-600 mb-4">Need to change your delivery address? We can help before shipping.</p>
                <Button variant="outline" className="bg-transparent">
                  Update Address
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
