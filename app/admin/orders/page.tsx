"use client"

import { AdminLayout } from "@/components/admin-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  Edit,
  Truck,
  Package,
  CheckCircle,
  XCircle,
  Clock,
  Download,
  Printer,
} from "lucide-react"
import { useState } from "react"

export default function AdminOrders() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedOrder, setSelectedOrder] = useState<any>(null)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)

  const orders = [
    {
      id: "ORD-001",
      customer: "Ahmed Hassan",
      email: "ahmed@example.com",
      phone: "+880 1712-345678",
      products: [{ name: "SHAREINFO Premium Card", quantity: 2, price: 1699.15 }],
      total: 3398.3,
      status: "processing",
      paymentStatus: "paid",
      shippingAddress: "House 123, Road 456, Dhaka-1000",
      orderDate: "2024-01-27",
      estimatedDelivery: "2024-02-03",
      trackingNumber: "TRK-001234567",
    },
    {
      id: "ORD-002",
      customer: "Sarah Khan",
      email: "sarah@example.com",
      phone: "+880 1812-345678",
      products: [{ name: "SHAREINFO Standard Card", quantity: 1, price: 1274.15 }],
      total: 1274.15,
      status: "shipped",
      paymentStatus: "paid",
      shippingAddress: "Flat 789, Building ABC, Chittagong-4000",
      orderDate: "2024-01-26",
      estimatedDelivery: "2024-02-02",
      trackingNumber: "TRK-001234568",
    },
    {
      id: "ORD-003",
      customer: "Mohammad Ali",
      email: "ali@example.com",
      phone: "+880 1912-345678",
      products: [{ name: "SHAREINFO Classic Card", quantity: 3, price: 849.15 }],
      total: 2547.45,
      status: "delivered",
      paymentStatus: "paid",
      shippingAddress: "Village XYZ, Sylhet-3100",
      orderDate: "2024-01-25",
      estimatedDelivery: "2024-02-01",
      trackingNumber: "TRK-001234569",
    },
    {
      id: "ORD-004",
      customer: "Fatima Rahman",
      email: "fatima@example.com",
      phone: "+880 1612-345678",
      products: [{ name: "SHAREINFO Women Professional Card", quantity: 1, price: 1399.15 }],
      total: 1399.15,
      status: "pending",
      paymentStatus: "pending",
      shippingAddress: "House 456, Rajshahi-6000",
      orderDate: "2024-01-27",
      estimatedDelivery: "2024-02-05",
      trackingNumber: null,
    },
  ]

  const filteredOrders = orders.filter(
    (order) =>
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchTerm.toLowerCase()),
  )

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
        return <XCircle className="w-4 h-4" />
      default:
        return <Clock className="w-4 h-4" />
    }
  }

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

  const handleViewOrder = (order: any) => {
    setSelectedOrder(order)
    setIsViewDialogOpen(true)
  }

  const handleUpdateStatus = (orderId: string, newStatus: string) => {
    console.log("Update order status:", orderId, newStatus)
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
            <Button variant="outline">
              <Printer className="w-4 h-4 mr-2" />
              Print Labels
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
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
                <p className="text-2xl font-bold text-purple-500">
                  {orders.filter((o) => o.status === "shipped").length}
                </p>
                <p className="text-sm text-gray-600">Shipped</p>
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
                      <div>
                        {order.products.map((product, index) => (
                          <p key={index} className="text-sm">
                            {product.name} x{product.quantity}
                          </p>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>৳{order.total.toLocaleString()}</TableCell>
                    <TableCell>
                      <div
                        className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}
                      >
                        {getStatusIcon(order.status)}
                        <span className="capitalize">{order.status}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={order.paymentStatus === "paid" ? "default" : "secondary"}>
                        {order.paymentStatus}
                      </Badge>
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
                          <DropdownMenuItem onClick={() => handleUpdateStatus(order.id, "processing")}>
                            <Edit className="w-4 h-4 mr-2" />
                            Update Status
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Truck className="w-4 h-4 mr-2" />
                            Track Order
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Printer className="w-4 h-4 mr-2" />
                            Print Invoice
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

        {/* Order Details Dialog */}
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Order Details - {selectedOrder?.id}</DialogTitle>
            </DialogHeader>
            {selectedOrder && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  {/* Customer Info */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Customer Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <p>
                        <strong>Name:</strong> {selectedOrder.customer}
                      </p>
                      <p>
                        <strong>Email:</strong> {selectedOrder.email}
                      </p>
                      <p>
                        <strong>Phone:</strong> {selectedOrder.phone}
                      </p>
                      <p>
                        <strong>Address:</strong> {selectedOrder.shippingAddress}
                      </p>
                    </CardContent>
                  </Card>

                  {/* Order Info */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Order Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <p>
                        <strong>Order Date:</strong> {selectedOrder.orderDate}
                      </p>
                      <p>
                        <strong>Status:</strong>
                        <Badge className={`ml-2 ${getStatusColor(selectedOrder.status)}`}>{selectedOrder.status}</Badge>
                      </p>
                      <p>
                        <strong>Payment:</strong>
                        <Badge
                          className="ml-2"
                          variant={selectedOrder.paymentStatus === "paid" ? "default" : "secondary"}
                        >
                          {selectedOrder.paymentStatus}
                        </Badge>
                      </p>
                      <p>
                        <strong>Tracking:</strong> {selectedOrder.trackingNumber || "Not assigned"}
                      </p>
                      <p>
                        <strong>Estimated Delivery:</strong> {selectedOrder.estimatedDelivery}
                      </p>
                    </CardContent>
                  </Card>
                </div>

                {/* Products */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Order Items</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Product</TableHead>
                          <TableHead>Quantity</TableHead>
                          <TableHead>Price</TableHead>
                          <TableHead>Total</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedOrder.products.map((product: any, index: number) => (
                          <TableRow key={index}>
                            <TableCell>{product.name}</TableCell>
                            <TableCell>{product.quantity}</TableCell>
                            <TableCell>৳{product.price.toLocaleString()}</TableCell>
                            <TableCell>৳{(product.price * product.quantity).toLocaleString()}</TableCell>
                          </TableRow>
                        ))}
                        <TableRow>
                          <TableCell colSpan={3} className="font-bold">
                            Total
                          </TableCell>
                          <TableCell className="font-bold">৳{selectedOrder.total.toLocaleString()}</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>

                {/* Action Buttons */}
                <div className="flex justify-end space-x-2">
                  <Button variant="outline">
                    <Printer className="w-4 h-4 mr-2" />
                    Print Invoice
                  </Button>
                  <Button variant="outline">
                    <Truck className="w-4 h-4 mr-2" />
                    Update Tracking
                  </Button>
                  <Button className="bg-orange-500 hover:bg-orange-600">
                    <Edit className="w-4 h-4 mr-2" />
                    Update Status
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  )
}
