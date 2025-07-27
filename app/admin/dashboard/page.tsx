"use client"

import { AdminLayout } from "@/components/admin-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Users, Package, ShoppingCart, DollarSign, TrendingUp, TrendingDown, Eye } from "lucide-react"

// Mock data for dashboard
const stats = [
  {
    title: "Total Users",
    value: "2,543",
    change: "+12%",
    trend: "up",
    icon: Users,
    color: "text-blue-600",
  },
  {
    title: "Total Products",
    value: "1,234",
    change: "+5%",
    trend: "up",
    icon: Package,
    color: "text-green-600",
  },
  {
    title: "Total Orders",
    value: "8,765",
    change: "+23%",
    trend: "up",
    icon: ShoppingCart,
    color: "text-purple-600",
  },
  {
    title: "Revenue",
    value: "$45,678",
    change: "-2%",
    trend: "down",
    icon: DollarSign,
    color: "text-orange-600",
  },
]

const recentOrders = [
  { id: "#12345", customer: "John Doe", amount: "$299", status: "completed", date: "2024-01-15" },
  { id: "#12346", customer: "Jane Smith", amount: "$199", status: "pending", date: "2024-01-15" },
  { id: "#12347", customer: "Bob Johnson", amount: "$399", status: "processing", date: "2024-01-14" },
  { id: "#12348", customer: "Alice Brown", amount: "$149", status: "completed", date: "2024-01-14" },
  { id: "#12349", customer: "Charlie Wilson", amount: "$249", status: "cancelled", date: "2024-01-13" },
]

const actionItems = [
  {
    title: "Low Stock Alert",
    description: "5 products are running low on stock",
    type: "warning",
    action: "View Products",
  },
  { title: "Pending Orders", description: "12 orders are waiting for processing", type: "info", action: "View Orders" },
  { title: "Customer Reviews", description: "8 new reviews need moderation", type: "info", action: "View Reviews" },
  { title: "System Update", description: "New system update available", type: "success", action: "Update Now" },
]

function getStatusColor(status: string) {
  switch (status) {
    case "completed":
      return "bg-green-100 text-green-800"
    case "pending":
      return "bg-yellow-100 text-yellow-800"
    case "processing":
      return "bg-blue-100 text-blue-800"
    case "cancelled":
      return "bg-red-100 text-red-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

function getActionColor(type: string) {
  switch (type) {
    case "warning":
      return "border-orange-200 bg-orange-50"
    case "info":
      return "border-blue-200 bg-blue-50"
    case "success":
      return "border-green-200 bg-green-50"
    default:
      return "border-gray-200 bg-gray-50"
  }
}

export default function AdminDashboard() {
  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here's what's happening with your store today.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="flex items-center text-xs text-muted-foreground">
                  {stat.trend === "up" ? (
                    <TrendingUp className="mr-1 h-3 w-3 text-green-600" />
                  ) : (
                    <TrendingDown className="mr-1 h-3 w-3 text-red-600" />
                  )}
                  <span className={stat.trend === "up" ? "text-green-600" : "text-red-600"}>{stat.change}</span>
                  <span className="ml-1">from last month</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Recent Orders */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
              <CardDescription>Latest orders from your customers</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-medium">{order.id}</p>
                      <p className="text-sm text-muted-foreground">{order.customer}</p>
                    </div>
                    <div className="text-right space-y-1">
                      <p className="text-sm font-medium">{order.amount}</p>
                      <Badge className={getStatusColor(order.status)} variant="secondary">
                        {order.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-4 bg-transparent">
                <Eye className="mr-2 h-4 w-4" />
                View All Orders
              </Button>
            </CardContent>
          </Card>

          {/* Action Items */}
          <Card>
            <CardHeader>
              <CardTitle>Action Items</CardTitle>
              <CardDescription>Things that need your attention</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {actionItems.map((item, index) => (
                  <div key={index} className={`p-3 rounded-lg border ${getActionColor(item.type)}`}>
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <p className="text-sm font-medium">{item.title}</p>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                      </div>
                      <Button variant="outline" size="sm">
                        {item.action}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Performance Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Performance Overview</CardTitle>
            <CardDescription>Key metrics for this month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Sales Target</span>
                  <span className="text-sm text-muted-foreground">75%</span>
                </div>
                <Progress value={75} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Customer Satisfaction</span>
                  <span className="text-sm text-muted-foreground">92%</span>
                </div>
                <Progress value={92} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Order Fulfillment</span>
                  <span className="text-sm text-muted-foreground">88%</span>
                </div>
                <Progress value={88} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}
