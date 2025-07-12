"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { useStore } from "@/lib/store"
import { Package, Search, Eye, Download, Truck } from "lucide-react"
import { useState } from "react"
import Link from "next/link"

export default function OrdersPage() {
  const { isAuthenticated } = useStore()
  const [searchTerm, setSearchTerm] = useState("")

  // Mock order data
  const orders = [
    {
      id: "ORD-2024-001",
      date: "2024-01-15",
      status: "Delivered",
      total: 1699.15,
      items: [
        {
          name: "SHAREINFO Premium - Full Customized Card",
          quantity: 1,
          price: 1699.15,
          image: "/placeholder.svg?height=80&width=80",
        },
      ],
      shipping: {
        address: "123 Main St, Dhaka, Bangladesh",
        method: "Standard Delivery",
        tracking: "TRK123456789",
      },
      payment: {
        method: "Credit Card",
        status: "Paid",
      },
    },
    {
      id: "ORD-2024-002",
      date: "2024-01-10",
      status: "Processing",
      total: 2548.3,
      items: [
        {
          name: "SHAREINFO Standard - Semi Customized Card",
          quantity: 2,
          price: 1274.15,
          image: "/placeholder.svg?height=80&width=80",
        },
      ],
      shipping: {
        address: "456 Business Ave, Chittagong, Bangladesh",
        method: "Express Delivery",
        tracking: "TRK987654321",
      },
      payment: {
        method: "bKash",
        status: "Paid",
      },
    },
    {
      id: "ORD-2024-003",
      date: "2024-01-05",
      status: "Shipped",
      total: 849.15,
      items: [
        {
          name: "SHAREINFO Classic Card",
          quantity: 1,
          price: 849.15,
          image: "/placeholder.svg?height=80&width=80",
        },
      ],
      shipping: {
        address: "789 Tech Park, Sylhet, Bangladesh",
        method: "Standard Delivery",
        tracking: "TRK456789123",
      },
      payment: {
        method: "Cash on Delivery",
        status: "Pending",
      },
    },
  ]

  if (!isAuthenticated()) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-4">Please Login</h2>
            <p className="text-gray-600 mb-6">You need to login to view your orders.</p>
            <Link href="/">
              <Button className="bg-orange-500 hover:bg-orange-600">Go to Homepage</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  const filteredOrders = orders.filter(
    (order) =>
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.items.some((item) => item.name.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Delivered":
        return "bg-green-500"
      case "Shipped":
        return "bg-blue-500"
      case "Processing":
        return "bg-yellow-500"
      case "Cancelled":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">My Orders</h1>
          <p className="text-gray-600">Track and manage your SHAREINFO orders</p>
        </div>

        {/* Search */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search orders by ID or product name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Orders List */}
        <div className="space-y-6">
          {filteredOrders.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No orders found</h3>
                <p className="text-gray-600 mb-6">
                  {searchTerm ? "No orders match your search criteria." : "You haven't placed any orders yet."}
                </p>
                <Link href="/products">
                  <Button className="bg-orange-500 hover:bg-orange-600">Start Shopping</Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            filteredOrders.map((order) => (
              <Card key={order.id} className="overflow-hidden">
                <CardHeader className="bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">Order {order.id}</CardTitle>
                      <p className="text-sm text-gray-600">Placed on {order.date}</p>
                    </div>
                    <div className="text-right">
                      <Badge className={`${getStatusColor(order.status)} text-white`}>{order.status}</Badge>
                      <p className="text-lg font-bold mt-1">৳{order.total}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  {/* Order Items */}
                  <div className="space-y-4 mb-6">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex items-center space-x-4">
                        <img
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          className="w-16 h-16 rounded-lg object-cover bg-gray-100"
                        />
                        <div className="flex-1">
                          <h4 className="font-medium">{item.name}</h4>
                          <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">৳{item.price}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Order Details */}
                  <div className="grid md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <h4 className="font-semibold mb-2">Shipping Information</h4>
                      <p className="text-sm text-gray-600 mb-1">{order.shipping.address}</p>
                      <p className="text-sm text-gray-600 mb-1">Method: {order.shipping.method}</p>
                      {order.shipping.tracking && (
                        <p className="text-sm text-gray-600">Tracking: {order.shipping.tracking}</p>
                      )}
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Payment Information</h4>
                      <p className="text-sm text-gray-600 mb-1">Method: {order.payment.method}</p>
                      <p className="text-sm text-gray-600">Status: {order.payment.status}</p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap gap-3">
                    <Button variant="outline" size="sm" className="flex items-center space-x-2 bg-transparent">
                      <Eye className="w-4 h-4" />
                      <span>View Details</span>
                    </Button>
                    {order.status === "Shipped" || order.status === "Delivered" ? (
                      <Button variant="outline" size="sm" className="flex items-center space-x-2 bg-transparent">
                        <Truck className="w-4 h-4" />
                        <span>Track Package</span>
                      </Button>
                    ) : null}
                    <Button variant="outline" size="sm" className="flex items-center space-x-2 bg-transparent">
                      <Download className="w-4 h-4" />
                      <span>Download Invoice</span>
                    </Button>
                    {order.status === "Delivered" && (
                      <Button className="bg-orange-500 hover:bg-orange-600" size="sm">
                        Reorder
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
