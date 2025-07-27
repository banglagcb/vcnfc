"use client"

import { AdminLayout } from "@/components/admin-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  Search,
  Filter,
  Plus,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Package,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Download,
  Upload,
  ImageIcon,
} from "lucide-react"
import { useState } from "react"

export default function AdminProducts() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedProduct, setSelectedProduct] = useState<any>(null)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)

  const products = [
    {
      id: "1",
      name: "SHAREINFO Premium - Full Customized Card",
      price: 1699.15,
      originalPrice: 1999.0,
      discount: 15,
      image: "/placeholder.svg?height=100&width=100",
      category: "premium",
      description:
        "Premium NFC business card with full customization options, premium materials, and advanced features.",
      features: [
        "Full Custom Design",
        "Premium Materials",
        "Advanced NFC Technology",
        "Unlimited Contact Fields",
        "Analytics Dashboard",
        "Priority Support",
      ],
      inStock: true,
      stockQuantity: 150,
      lowStockThreshold: 20,
      rating: 4.8,
      reviews: 124,
      sales: 89,
      revenue: 151232.35,
      status: "active",
      createdDate: "2024-01-01",
      lastUpdated: "2024-01-25",
    },
    {
      id: "2",
      name: "SHAREINFO Standard - Semi Customized Card",
      price: 1274.15,
      originalPrice: 1499.0,
      discount: 15,
      image: "/placeholder.svg?height=100&width=100",
      category: "standard",
      description: "Standard NFC business card with semi-customization options and essential features.",
      features: [
        "Semi-Custom Design",
        "Standard Materials",
        "NFC Technology",
        "Contact Fields",
        "Basic Analytics",
        "Email Support",
      ],
      inStock: true,
      stockQuantity: 75,
      lowStockThreshold: 25,
      rating: 4.5,
      reviews: 89,
      sales: 156,
      revenue: 198767.4,
      status: "active",
      createdDate: "2024-01-01",
      lastUpdated: "2024-01-20",
    },
    {
      id: "3",
      name: "SHAREINFO Classic Card",
      price: 849.15,
      originalPrice: 999.0,
      discount: 15,
      image: "/placeholder.svg?height=100&width=100",
      category: "classic",
      description: "Classic NFC business card with basic features and affordable pricing.",
      features: [
        "Basic Design Templates",
        "Standard Materials",
        "Basic NFC Technology",
        "Essential Contact Fields",
        "Basic Profile",
        "Community Support",
      ],
      inStock: true,
      stockQuantity: 12,
      lowStockThreshold: 15,
      rating: 4.2,
      reviews: 156,
      sales: 234,
      revenue: 198701.1,
      status: "active",
      createdDate: "2024-01-01",
      lastUpdated: "2024-01-22",
    },
    {
      id: "4",
      name: "SHAREINFO Women Professional Card",
      price: 1399.15,
      originalPrice: 1649.0,
      discount: 15,
      image: "/placeholder.svg?height=100&width=100",
      category: "women",
      description: "Specially designed NFC business card for professional women with elegant designs.",
      features: [
        "Elegant Women-Focused Designs",
        "Premium Materials",
        "Advanced NFC Technology",
        "Social Media Integration",
        "Portfolio Showcase",
        "Priority Support",
      ],
      inStock: false,
      stockQuantity: 0,
      lowStockThreshold: 10,
      rating: 4.7,
      reviews: 67,
      sales: 45,
      revenue: 62961.75,
      status: "out_of_stock",
      createdDate: "2024-01-05",
      lastUpdated: "2024-01-26",
    },
  ]

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase()),
  )

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

  const handleUpdateStock = (productId: string, newStock: number) => {
    console.log("Update stock:", productId, newStock)
  }

  const getStockStatus = (product: any) => {
    if (!product.inStock || product.stockQuantity === 0) {
      return { status: "Out of Stock", color: "bg-red-100 text-red-800" }
    } else if (product.stockQuantity <= product.lowStockThreshold) {
      return { status: "Low Stock", color: "bg-yellow-100 text-yellow-800" }
    } else {
      return { status: "In Stock", color: "bg-green-100 text-green-800" }
    }
  }

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
            <Button variant="outline">
              <Upload className="w-4 h-4 mr-2" />
              Import Products
            </Button>
            <Button className="bg-orange-500 hover:bg-orange-600" onClick={() => setIsAddDialogOpen(true)}>
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
                  <p className="text-sm text-gray-600">Total Products</p>
                  <p className="text-2xl font-bold">{products.length}</p>
                </div>
                <Package className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">In Stock</p>
                  <p className="text-2xl font-bold text-green-500">
                    {products.filter((p) => p.inStock && p.stockQuantity > 0).length}
                  </p>
                </div>
                <TrendingUp className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Low Stock</p>
                  <p className="text-2xl font-bold text-yellow-500">
                    {products.filter((p) => p.stockQuantity <= p.lowStockThreshold && p.stockQuantity > 0).length}
                  </p>
                </div>
                <AlertTriangle className="w-8 h-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Out of Stock</p>
                  <p className="text-2xl font-bold text-red-500">
                    {products.filter((p) => !p.inStock || p.stockQuantity === 0).length}
                  </p>
                </div>
                <TrendingDown className="w-8 h-8 text-red-500" />
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
                  <TableHead>Category</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Sales</TableHead>
                  <TableHead>Revenue</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product) => {
                  const stockStatus = getStockStatus(product)
                  return (
                    <TableRow key={product.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <img
                            src={product.image || "/placeholder.svg"}
                            alt={product.name}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                          <div>
                            <p className="font-medium">{product.name}</p>
                            <p className="text-sm text-gray-500">
                              ⭐ {product.rating} ({product.reviews} reviews)
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="capitalize">
                          {product.category}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">৳{product.price.toLocaleString()}</p>
                          {product.originalPrice && (
                            <p className="text-sm text-gray-500 line-through">
                              ৳{product.originalPrice.toLocaleString()}
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{product.stockQuantity}</p>
                          <div
                            className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${stockStatus.color}`}
                          >
                            {stockStatus.status}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{product.sales}</TableCell>
                      <TableCell>৳{product.revenue.toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge variant={product.status === "active" ? "default" : "secondary"}>
                          {product.status.replace("_", " ")}
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
                            <DropdownMenuItem onClick={() => handleUpdateStock(product.id, product.stockQuantity + 10)}>
                              <Package className="w-4 h-4 mr-2" />
                              Update Stock
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDeleteProduct(product.id)} className="text-red-600">
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete Product
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* View Product Dialog */}
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Product Details</DialogTitle>
            </DialogHeader>
            {selectedProduct && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <img
                      src={selectedProduct.image || "/placeholder.svg"}
                      alt={selectedProduct.name}
                      className="w-full h-64 object-cover rounded-lg"
                    />
                  </div>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-2xl font-bold">{selectedProduct.name}</h3>
                      <Badge variant="secondary" className="capitalize mt-2">
                        {selectedProduct.category}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-3xl font-bold text-orange-500">৳{selectedProduct.price.toLocaleString()}</p>
                      {selectedProduct.originalPrice && (
                        <p className="text-lg text-gray-500 line-through">
                          ৳{selectedProduct.originalPrice.toLocaleString()}
                        </p>
                      )}
                    </div>
                    <div>
                      <p className="text-gray-600">{selectedProduct.description}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Features:</h4>
                      <ul className="list-disc list-inside space-y-1">
                        {selectedProduct.features.map((feature: string, index: number) => (
                          <li key={index} className="text-sm text-gray-600">
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-4">
                  <Card>
                    <CardContent className="p-4 text-center">
                      <p className="text-2xl font-bold">{selectedProduct.stockQuantity}</p>
                      <p className="text-sm text-gray-600">Stock Quantity</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <p className="text-2xl font-bold">{selectedProduct.sales}</p>
                      <p className="text-sm text-gray-600">Total Sales</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <p className="text-2xl font-bold">৳{selectedProduct.revenue.toLocaleString()}</p>
                      <p className="text-sm text-gray-600">Revenue</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <p className="text-2xl font-bold">{selectedProduct.rating}</p>
                      <p className="text-sm text-gray-600">Rating ({selectedProduct.reviews})</p>
                    </CardContent>
                  </Card>
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
                    <Label htmlFor="category">Category</Label>
                    <Input id="category" defaultValue={selectedProduct.category} />
                  </div>
                  <div>
                    <Label htmlFor="price">Price</Label>
                    <Input id="price" type="number" defaultValue={selectedProduct.price} />
                  </div>
                  <div>
                    <Label htmlFor="stock">Stock Quantity</Label>
                    <Input id="stock" type="number" defaultValue={selectedProduct.stockQuantity} />
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

        {/* Add Product Dialog */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Product</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="new-name">Product Name</Label>
                  <Input id="new-name" placeholder="Enter product name" />
                </div>
                <div>
                  <Label htmlFor="new-category">Category</Label>
                  <Input id="new-category" placeholder="Enter category" />
                </div>
                <div>
                  <Label htmlFor="new-price">Price</Label>
                  <Input id="new-price" type="number" placeholder="Enter price" />
                </div>
                <div>
                  <Label htmlFor="new-stock">Stock Quantity</Label>
                  <Input id="new-stock" type="number" placeholder="Enter stock quantity" />
                </div>
              </div>
              <div>
                <Label htmlFor="new-description">Description</Label>
                <Textarea id="new-description" placeholder="Enter product description" />
              </div>
              <div>
                <Label htmlFor="new-image">Product Image</Label>
                <div className="flex items-center space-x-2">
                  <Input id="new-image" type="file" accept="image/*" />
                  <Button variant="outline" size="sm">
                    <ImageIcon className="w-4 h-4 mr-2" />
                    Upload
                  </Button>
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button className="bg-orange-500 hover:bg-orange-600">Add Product</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  )
}
