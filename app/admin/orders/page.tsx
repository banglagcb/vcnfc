"use client"

import { AdminLayout } from "@/components/admin-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import {
  Search,
  Filter,
  Eye,
  Edit,
  Truck,
  CheckCircle,
  Clock,
  AlertCircle,
  MoreHorizontal,
  Download,
  Package,
  CreditCard,
  MapPin,
} from "lucide-react"
import { useState } from "react"

export default function AdminOrders() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedOrder, setSelectedOrder] = useState<any>(null)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)

  const orders = [
    {
      id: "ORD-1234",
      customer: "Ahmed Hassan",
      email: "ahmed@example.com",
      phone: "+880 1712-345678",
      products: [
        { name: "Premium NFC Card", quantity: 2, price: 1699.15 },
        { name: "Custom Design", quantity: 1, price: 500.0 },
      ],
      total: 3898.3,
      status: "processing",
      paymentStatus: "paid",
      paymentMethod: "bKash",
      orderDate: "2024-01-27",
      shippingAddress: "123 Main St, Dhaka, Bangladesh",
      trackingNumber: "TRK123456789",
      notes: "Customer requested express delivery",
    },
    {
      id: "ORD-1235",
      customer: "Sarah Khan",
      email: "sarah@example.com",
      phone: "+880 1812-345678",
      products: [{ name: "Standard NFC Card", quantity: 1, price: 1274.15 }],
      total: 1274.15,
      status: "shipped",
      paymentStatus: "paid",
      paymentMethod: "Nagad",
      orderDate: "2024-01-26",
      shippingAddress: "456 Oak Ave, Chittagong, Bangladesh",
      trackingNumber: "TRK123456790",
      notes: "",
    },
    {
      id: "ORD-1236",
      customer: "Mohammad Ali",
      email: "ali@example.com",
      phone: "+880 1912-345678",
      products: [
        { name: "Premium NFC Card", quantity: 1, price: 1699.15 },
        { name: "QR Code Generation", quantity: 1, price: 299.0 },
      ],
      total: 1998.15,
      status: "pending",
      paymentStatus: "pending",
      paymentMethod: "Bank Transfer",
      orderDate: "2024-01-27",
      shippingAddress: "789 Pine St, Sylhet, Bangladesh",
      trackingNumber: "",
      notes: "Waiting for payment confirmation",
    },
    {
      id: "ORD-1237",
      customer: "Fatima Rahman",
      email: "fatima@example.com",
      phone: "+880 1612-345678",
      products: [
        { name: "Premium NFC Card", quantity: 3, price: 1699.15 },
        { name: "Custom Design", quantity: 2, price: 500.0 },
      ],
      total: 6097.45,
      status: "delivered",
      paymentStatus: "paid",
      paymentMethod: "Rocket",
      orderDate: "2024-01-25",
      shippingAddress: "321 Elm St, Rajshahi, Bangladesh",
      trackingNumber: "TRK123456791",
      notes: "Bulk order for company",
    },
  ]

  const filteredOrders = orders.filter(
    (order) =>
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "processing":
        return "bg-blue-100 text-blue-800"
      case "shipped":
        return "bg-purple-100 text-purple-800"
      case "delivered":
        return "bg-green-100 text-green-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "failed":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="w-4 h-4" />
      case "processing":
        return <Package className="w-4 h-4" />
      case "shipped":
        return <Truck className="w-4 h-4" />
      case "delivered":
        return <CheckCircle className="w-4 h-4" />
      case "cancelled":
        return <AlertCircle className="w-4 h-4" />
      default:
        return <Clock className="w-4 h-4" />
    }
  }

  const handleViewOrder = (order: any) => {
    setSelectedOrder(order)
    setIsViewDialogOpen(true)
  }

  const handleStatusUpdate = (orderId: string, newStatus: string) => {
    console.log("Update order status:", orderId, newStatus)
    // In real app, this would update the order status
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Order Management</h1>
            <p className="text-gray-600">Track and manage all customer orders</p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export Orders
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold">{orders.length}</p>
                <p className="text-sm text-gray-600">Total Orders</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-yellow-500">
                  {orders.filter((o) => o.status === "pending").length}
                </p>
                <p className="text-sm text-gray-600">Pending</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-500">
                  {orders.filter((o) => o.status === "processing").length}
                </p>
                <p className="text-sm text-gray-600">Processing</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-green-500">
                  {orders.filter((o) => o.status === "delivered").length}
                </p>
                <p className="text-sm text-gray-600">Delivered</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Orders Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>All Orders</CardTitle>
              <div className="flex space-x-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Search orders..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>
                <Button variant="outline">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Products</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">{order.id}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{order.customer}</p>
                        <p className="text-sm text-gray-500">{order.email}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        {order.products.map((product, index) => (
                          <div key={index} className="text-sm">
                            {product.name} x{product.quantity}
                          </div>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>৳{order.total.toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(order.status)}>
                        {getStatusIcon(order.status)}
                        <span className="ml-1 capitalize">{order.status}</span>
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <Badge className={getPaymentStatusColor(order.paymentStatus)}>
                          <CreditCard className="w-3 h-3 mr-1" />
                          {order.paymentStatus}
                        </Badge>
                        <p className="text-xs text-gray-500">{order.paymentMethod}</p>
                      </div>
                    </TableCell>
                    <TableCell>{order.orderDate}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleViewOrder(order)}>
                            <Eye className="w-4 h-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleStatusUpdate(order.id, "processing")}>
                            <Edit className="w-4 h-4 mr-2" />
                            Update Status
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Truck className="w-4 h-4 mr-2" />
                            Track Order
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* View Order Dialog */}
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Order Details - {selectedOrder?.id}</DialogTitle>
            </DialogHeader>
            {selectedOrder && (
              <div className="space-y-6">
                {/* Order Status */}
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Badge className={getStatusColor(selectedOrder.status)}>
                      {getStatusIcon(selectedOrder.status)}
                      <span className="ml-1 capitalize">{selectedOrder.status}</span>
                    </Badge>
                    <Badge className={getPaymentStatusColor(selectedOrder.paymentStatus)}>
                      <CreditCard className="w-3 h-3 mr-1" />
                      {selectedOrder.paymentStatus}
                    </Badge>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Order Date</p>
                    <p className="font-medium">{selectedOrder.orderDate}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Customer Information */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Customer Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <Label>Name</Label>
                        <p className="text-sm">{selectedOrder.customer}</p>
                      </div>
                      <div>
                        <Label>Email</Label>
                        <p className="text-sm">{selectedOrder.email}</p>
                      </div>
                      <div>
                        <Label>Phone</Label>
                        <p className="text-sm">{selectedOrder.phone}</p>
                      </div>
                      <div>
                        <Label>Shipping Address</Label>
                        <div className="flex items-start space-x-2">
                          <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                          <p className="text-sm">{selectedOrder.shippingAddress}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Order Summary */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Order Summary</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="space-y-2">
                        {selectedOrder.products.map((product: any, index: number) => (
                          <div key={index} className="flex justify-between items-center py-2 border-b">
                            <div>
                              <p className="font-medium">{product.name}</p>
                              <p className="text-sm text-gray-500">Quantity: {product.quantity}</p>
                            </div>
                            <p className="font-medium">৳{(product.price * product.quantity).toLocaleString()}</p>
                          </div>
                        ))}
                      </div>
                      <div className="pt-2 border-t">
                        <div className="flex justify-between items-center">
                          <p className="text-lg font-bold">Total</p>
                          <p className="text-lg font-bold">৳{selectedOrder.total.toLocaleString()}</p>
                        </div>
                      </div>
                      <div className="pt-2">
                        <Label>Payment Method</Label>
                        <p className="text-sm">{selectedOrder.paymentMethod}</p>
                      </div>
                      {selectedOrder.trackingNumber && (
                        <div>
                          <Label>Tracking Number</Label>
                          <p className="text-sm font-mono">{selectedOrder.trackingNumber}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>

                {/* Notes */}
                {selectedOrder.notes && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Order Notes</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm">{selectedOrder.notes}</p>
                    </CardContent>
                  </Card>
                )}

                {/* Action Buttons */}
                <div className="flex justify-end space-x-2">
                  <Button variant="outline">Print Invoice</Button>
                  <Button variant="outline">Send Email</Button>
                  <Button className="bg-orange-500 hover:bg-orange-600">Update Status</Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  )
}
