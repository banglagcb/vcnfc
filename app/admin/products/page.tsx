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
import { Textarea } from "@/components/ui/textarea"
import {
  Search,
  Filter,
  Plus,
  Eye,
  Edit,
  Trash2,
  MoreHorizontal,
  Package,
  AlertTriangle,
  TrendingUp,
  Download,
  ImageIcon,
} from "lucide-react"
import { useState } from "react"

export default function AdminProducts() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedProduct, setSelectedProduct] = useState<any>(null)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

  const products = [
    {
      id: "PRD-001",
      name: "Premium NFC Card",
      description: "High-quality NFC card with custom design and premium materials",
      category: "NFC Cards",
      price: 1699.15,
      stock: 45,
      lowStockThreshold: 10,
      sold: 127,
      revenue: 215853.05,
      status: "active",
      image: "/placeholder.svg?height=60&width=60",
      sku: "NFC-PREM-001",
      weight: "5g",
      dimensions: "85.6 × 53.98 × 0.76 mm",
      createdDate: "2024-01-15",
    },
    {
      id: "PRD-002",
      name: "Standard NFC Card",
      description: "Standard NFC card with basic features and good quality",
      category: "NFC Cards",
      price: 1274.15,
      stock: 8,
      lowStockThreshold: 10,
      sold: 89,
      revenue: 113399.35,
      status: "active",
      image: "/placeholder.svg?height=60&width=60",
      sku: "NFC-STD-001",
      weight: "4g",
      dimensions: "85.6 × 53.98 × 0.76 mm",
      createdDate: "2024-01-15",
    },
    {
      id: "PRD-003",
      name: "Custom Design Service",
      description: "Professional custom design service for NFC cards",
      category: "Services",
      price: 500.0,
      stock: 999,
      lowStockThreshold: 0,
      sold: 45,
      revenue: 22500.0,
      status: "active",
      image: "/placeholder.svg?height=60&width=60",
      sku: "SRV-DESIGN-001",
      weight: "0g",
      dimensions: "Digital Service",
      createdDate: "2024-01-15",
    },
    {
      id: "PRD-004",
      name: "QR Code Generation",
      description: "QR code generation service with analytics",
      category: "Services",
      price: 299.0,
      stock: 999,
      lowStockThreshold: 0,
      sold: 78,
      revenue: 23322.0,
      status: "active",
      image: "/placeholder.svg?height=60&width=60",
      sku: "SRV-QR-001",
      weight: "0g",
      dimensions: "Digital Service",
      createdDate: "2024-01-20",
    },
    {
      id: "PRD-005",
      name: "Bulk NFC Cards (10 Pack)",
      description: "Bulk pack of 10 standard NFC cards with discount",
      category: "NFC Cards",
      price: 11500.0,
      stock: 2,
      lowStockThreshold: 5,
      sold: 12,
      revenue: 138000.0,
      status: "low_stock",
      image: "/placeholder.svg?height=60&width=60",
      sku: "NFC-BULK-10",
      weight: "40g",
      dimensions: "85.6 × 53.98 × 0.76 mm (each)",
      createdDate: "2024-01-22",
    },
  ]

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getStatusColor = (status: string, stock: number, threshold: number) => {
    if (stock <= threshold && threshold > 0) {
      return "bg-red-100 text-red-800"
    }
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "inactive":
        return "bg-gray-100 text-gray-800"
      case "out_of_stock":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusText = (status: string, stock: number, threshold: number) => {
    if (stock <= threshold && threshold > 0) {
      return "Low Stock"
    }
    if (stock === 0) {
      return "Out of Stock"
    }
    return status === "active" ? "Active" : "Inactive"
  }

  const handleViewProduct = (product: any) => {
    setSelectedProduct(product)
    setIsViewDialogOpen(true)
  }

  const handleEditProduct = (product: any) => {
    setSelectedProduct(product)
    setIsEditDialogOpen(true)
  }

  const handleDeleteProduct = (productId: string) => {
    console.log("Delete product:", productId)
  }

  const totalProducts = products.length
  const activeProducts = products.filter((p) => p.status === "active").length
  const lowStockProducts = products.filter((p) => p.stock <= p.lowStockThreshold && p.lowStockThreshold > 0).length
  const totalRevenue = products.reduce((sum, p) => sum + p.revenue, 0)

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Product Management</h1>
            <p className="text-gray-600">Manage your product catalog and inventory</p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export Products
            </Button>
            <Button className="bg-orange-500 hover:bg-orange-600">
              <Plus className="w-4 h-4 mr-2" />
              Add Product
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold">{totalProducts}</p>
                  <p className="text-sm text-gray-600">Total Products</p>
                </div>
                <Package className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-green-500">{activeProducts}</p>
                  <p className="text-sm text-gray-600">Active Products</p>
                </div>
                <TrendingUp className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-red-500">{lowStockProducts}</p>
                  <p className="text-sm text-gray-600">Low Stock</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-purple-500">৳{totalRevenue.toLocaleString()}</p>
                  <p className="text-sm text-gray-600">Total Revenue</p>
                </div>
                <TrendingUp className="w-8 h-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Products Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>All Products</CardTitle>
              <div className="flex space-x-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Search products..."
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
                  <TableHead>Product</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Sold</TableHead>
                  <TableHead>Revenue</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                          <ImageIcon className="w-6 h-6 text-gray-400" />
                        </div>
                        <div>
                          <p className="font-medium">{product.name}</p>
                          <p className="text-sm text-gray-500 truncate max-w-xs">{product.description}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-sm">{product.sku}</TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell>৳{product.price.toLocaleString()}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <span className={product.stock <= product.lowStockThreshold ? "text-red-600 font-medium" : ""}>
                          {product.stock}
                        </span>
                        {product.stock <= product.lowStockThreshold && product.lowStockThreshold > 0 && (
                          <AlertTriangle className="w-4 h-4 text-red-500" />
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{product.sold}</TableCell>
                    <TableCell>৳{product.revenue.toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(product.status, product.stock, product.lowStockThreshold)}>
                        {getStatusText(product.status, product.stock, product.lowStockThreshold)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleViewProduct(product)}>
                            <Eye className="w-4 h-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEditProduct(product)}>
                            <Edit className="w-4 h-4 mr-2" />
                            Edit Product
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDeleteProduct(product.id)} className="text-red-600">
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete Product
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

        {/* View Product Dialog */}
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Product Details</DialogTitle>
            </DialogHeader>
            {selectedProduct && (
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center">
                    <ImageIcon className="w-12 h-12 text-gray-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold">{selectedProduct.name}</h3>
                    <p className="text-gray-600 mt-1">{selectedProduct.description}</p>
                    <div className="flex items-center space-x-2 mt-2">
                      <Badge
                        className={getStatusColor(
                          selectedProduct.status,
                          selectedProduct.stock,
                          selectedProduct.lowStockThreshold,
                        )}
                      >
                        {getStatusText(
                          selectedProduct.status,
                          selectedProduct.stock,
                          selectedProduct.lowStockThreshold,
                        )}
                      </Badge>
                      <Badge variant="outline">{selectedProduct.category}</Badge>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>SKU</Label>
                    <p className="text-sm font-mono">{selectedProduct.sku}</p>
                  </div>
                  <div>
                    <Label>Price</Label>
                    <p className="text-sm">৳{selectedProduct.price.toLocaleString()}</p>
                  </div>
                  <div>
                    <Label>Stock Quantity</Label>
                    <p className="text-sm">{selectedProduct.stock} units</p>
                  </div>
                  <div>
                    <Label>Low Stock Threshold</Label>
                    <p className="text-sm">{selectedProduct.lowStockThreshold} units</p>
                  </div>
                  <div>
                    <Label>Total Sold</Label>
                    <p className="text-sm">{selectedProduct.sold} units</p>
                  </div>
                  <div>
                    <Label>Total Revenue</Label>
                    <p className="text-sm">৳{selectedProduct.revenue.toLocaleString()}</p>
                  </div>
                  <div>
                    <Label>Weight</Label>
                    <p className="text-sm">{selectedProduct.weight}</p>
                  </div>
                  <div>
                    <Label>Dimensions</Label>
                    <p className="text-sm">{selectedProduct.dimensions}</p>
                  </div>
                  <div>
                    <Label>Created Date</Label>
                    <p className="text-sm">{selectedProduct.createdDate}</p>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Edit Product Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Product</DialogTitle>
            </DialogHeader>
            {selectedProduct && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Product Name</Label>
                    <Input id="name" defaultValue={selectedProduct.name} />
                  </div>
                  <div>
                    <Label htmlFor="sku">SKU</Label>
                    <Input id="sku" defaultValue={selectedProduct.sku} />
                  </div>
                  <div>
                    <Label htmlFor="price">Price (৳)</Label>
                    <Input id="price" type="number" defaultValue={selectedProduct.price} />
                  </div>
                  <div>
                    <Label htmlFor="stock">Stock Quantity</Label>
                    <Input id="stock" type="number" defaultValue={selectedProduct.stock} />
                  </div>
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Input id="category" defaultValue={selectedProduct.category} />
                  </div>
                  <div>
                    <Label htmlFor="threshold">Low Stock Threshold</Label>
                    <Input id="threshold" type="number" defaultValue={selectedProduct.lowStockThreshold} />
                  </div>
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" defaultValue={selectedProduct.description} />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button className="bg-orange-500 hover:bg-orange-600">Save Changes</Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  )
}
