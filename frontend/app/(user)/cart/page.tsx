"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const cartItems = [
  {
    id: 1,
    name: "Wireless Headphones",
    price: 2999,
    quantity: 1,
  },
  {
    id: 2,
    name: "Programming Book",
    price: 799,
    quantity: 2,
  },
];

export default function CartPage() {
  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  return (
    <div className="container mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold mb-8">Your Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* CART ITEMS */}
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item) => (
            <Card key={item.id}>
              <CardContent className="p-6 flex justify-between items-center">
                <div>
                  <h2 className="font-semibold">{item.name}</h2>
                  <p className="text-muted-foreground">
                    ₹{item.price} × {item.quantity}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    −
                  </Button>
                  <span>{item.quantity}</span>
                  <Button variant="outline" size="sm">
                    +
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* SUMMARY */}
        <Card>
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
          </CardHeader>

          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>₹{subtotal}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>Free</span>
            </div>
            <div className="flex justify-between font-semibold">
              <span>Total</span>
              <span>₹{subtotal}</span>
            </div>
          </CardContent>

          <CardFooter>
            <Button className="w-full">Proceed to Checkout</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
