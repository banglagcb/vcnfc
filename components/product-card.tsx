"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LoadingButton } from "@/components/ui/loading-states";
import { useToast } from "@/components/ui/toast";
import { Heart, ShoppingCart, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { type Product, useStore } from "@/lib/store";
import { useState, useEffect } from "react";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart, addToWishlist, removeFromWishlist, isInWishlist } =
    useStore();
  const { toast } = useToast();
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isTogglingWishlist, setIsTogglingWishlist] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch by only checking wishlist state after mount
  const inWishlist = mounted ? isInWishlist(product.id) : false;

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleAddToCart = async () => {
    setIsAddingToCart(true);
    addToCart(product);
    toast.success(`${product.name} added to cart!`);
    setTimeout(() => setIsAddingToCart(false), 800);
  };

  const handleWishlistToggle = async () => {
    setIsTogglingWishlist(true);
    if (inWishlist) {
      removeFromWishlist(product.id);
      toast.info(`${product.name} removed from wishlist`);
    } else {
      addToWishlist(product.id);
      toast.success(`${product.name} added to wishlist!`);
    }
    setTimeout(() => setIsTogglingWishlist(false), 500);
  };

  return (
    <Card className="overflow-hidden shadow-lg transition-transform duration-300 hover:scale-105 group">
      <div className="relative">
        {product.discount && (
          <Badge className="absolute top-4 left-4 bg-orange-500 text-white text-sm px-3 py-1 rounded-full z-10">
            -{product.discount}%
          </Badge>
        )}
        <LoadingButton
          variant="ghost"
          size="sm"
          isLoading={isTogglingWishlist}
          className={`absolute top-4 right-4 z-10 ${inWishlist ? "text-red-500" : "text-gray-400"} hover:text-red-500`}
          onClick={handleWishlistToggle}
        >
          <Heart className={`w-5 h-5 ${inWishlist ? "fill-current" : ""}`} />
        </LoadingButton>
        <Link href={`/products/${product.id}`}>
          <Image
            src={product.image || "/placeholder.svg"}
            alt={product.name}
            width={300}
            height={200}
            className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
          />
        </Link>
      </div>
      <CardContent className="p-6">
        <Link href={`/products/${product.id}`}>
          <h3 className="font-semibold mb-2 text-lg hover:text-orange-500 transition-colors">
            {product.name}
          </h3>
        </Link>
        <div className="flex items-center mb-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < Math.floor(product.rating)
                    ? "text-yellow-400 fill-current"
                    : "text-gray-300"
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-gray-500 ml-2">
            ({product.reviews})
          </span>
        </div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-2xl font-bold text-orange-500">
              ৳{product.price}
            </p>
            {product.originalPrice && (
              <p className="text-sm text-gray-500 line-through">
                ৳{product.originalPrice}
              </p>
            )}
          </div>
          <Badge variant={product.inStock ? "default" : "destructive"}>
            {product.inStock ? "In Stock" : "Out of Stock"}
          </Badge>
        </div>
        <LoadingButton
          onClick={handleAddToCart}
          isLoading={isAddingToCart}
          loadingText="Adding..."
          disabled={!product.inStock}
          className="w-full bg-orange-500 hover:bg-orange-600 transition-colors duration-200"
        >
          <ShoppingCart className="w-4 h-4 mr-2" />
          Add to Cart
        </LoadingButton>
      </CardContent>
    </Card>
  );
}
