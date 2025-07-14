"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Plus, Minus, Trash2 } from "lucide-react";
import { LoadingButton } from "@/components/ui/loading-states";
import { useToast } from "@/components/ui/toast";
import { useStore } from "@/lib/store";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";

export function CartSidebar() {
  const {
    cart,
    updateQuantity,
    removeFromCart,
    getCartTotal,
    getCartItemsCount,
    clearCart,
  } = useStore();
  const { toast } = useToast();
  const [mounted, setMounted] = useState(false);
  const [isUpdating, setIsUpdating] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Use safe defaults during SSR to prevent hydration mismatch
  const itemsCount = mounted ? getCartItemsCount() : 0;
  const total = mounted ? getCartTotal() : 0;

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" className="relative">
          <ShoppingCart className="w-5 h-5 text-gray-600" />
          <span className="text-sm font-semibold ml-2">
            ৳{total.toFixed(2)}
          </span>
          <span className="text-sm text-gray-500 ml-1">
            ({itemsCount} Items)
          </span>
          {itemsCount > 0 && (
            <Badge className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs px-2 py-1 rounded-full">
              {itemsCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle>Shopping Cart ({itemsCount} items)</SheetTitle>
        </SheetHeader>
        <div className="mt-6 space-y-4">
          {!mounted || cart.length === 0 ? (
            <div className="text-center py-8">
              <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">
                {!mounted ? "Loading..." : "Your cart is empty"}
              </p>
              {mounted && (
                <Link href="/products">
                  <Button className="mt-4 bg-orange-500 hover:bg-orange-600">
                    Continue Shopping
                  </Button>
                </Link>
              )}
            </div>
          ) : (
            <>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center space-x-4 p-4 border rounded-lg"
                  >
                    <Image
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      width={60}
                      height={60}
                      className="rounded-md object-cover"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{item.name}</h4>
                      <p className="text-orange-500 font-semibold">
                        ৳{item.price}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={isUpdating === item.id}
                        onClick={async () => {
                          setIsUpdating(item.id);
                          updateQuantity(item.id, item.quantity - 1);
                          setTimeout(() => setIsUpdating(null), 300);
                        }}
                      >
                        <Minus className="w-3 h-3" />
                      </Button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={isUpdating === item.id}
                        onClick={async () => {
                          setIsUpdating(item.id);
                          updateQuantity(item.id, item.quantity + 1);
                          setTimeout(() => setIsUpdating(null), 300);
                        }}
                      >
                        <Plus className="w-3 h-3" />
                      </Button>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      disabled={isUpdating === item.id}
                      onClick={() => {
                        removeFromCart(item.id);
                        toast.success(`${item.name} removed from cart`);
                      }}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
              <div className="border-t pt-4">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-lg font-semibold">
                    Total: ৳{total.toFixed(2)}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      clearCart();
                      toast.info("Cart cleared successfully");
                    }}
                    className="text-red-500 hover:text-red-700 bg-transparent"
                  >
                    Clear Cart
                  </Button>
                </div>
                <div className="space-y-2">
                  <Link href="/checkout">
                    <Button className="w-full bg-orange-500 hover:bg-orange-600">
                      Proceed to Checkout
                    </Button>
                  </Link>
                  <Link href="/cart">
                    <Button variant="outline" className="w-full bg-transparent">
                      View Cart
                    </Button>
                  </Link>
                </div>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
