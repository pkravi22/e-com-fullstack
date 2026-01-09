"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

/* ---------------- TYPES ---------------- */
type Product = {
  id: number;
  name: string;
  price: number;
};

/* ---------------- COMPONENT ---------------- */
export default function AdminProductsPage() {
  /* ---------- SAMPLE DATA ---------- */
  const [products, setProducts] = useState<Product[]>([
    { id: 1, name: "Wireless Headphones", price: 2999 },
    { id: 2, name: "Smart Watch", price: 4499 },
    { id: 3, name: "Programming Book", price: 799 },
  ]);

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);

  /* ---------- ADD / UPDATE ---------- */
  const handleAddOrUpdate = () => {
    if (!name || !price) return;

    if (editingId !== null) {
      // Update product
      setProducts((prev) =>
        prev.map((p) =>
          p.id === editingId
            ? { ...p, name, price: Number(price) }
            : p
        )
      );
      setEditingId(null);
    } else {
      // Add product
      setProducts((prev) => [
        ...prev,
        {
          id: Date.now(),
          name,
          price: Number(price),
        },
      ]);
    }

    setName("");
    setPrice("");
  };

  /* ---------- EDIT ---------- */
  const handleEdit = (product: Product) => {
    setEditingId(product.id);
    setName(product.name);
    setPrice(product.price.toString());
  };

  /* ---------- DELETE ---------- */
  const handleDelete = (id: number) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  /* ---------------- UI ---------------- */
  return (
    <div className="container mx-auto px-6 py-10 space-y-10">
      <h1 className="text-3xl font-bold">Admin – Products</h1>

      {/* ADD / UPDATE FORM */}
      <Card>
        <CardHeader>
          <CardTitle>
            {editingId ? "Update Product" : "Add Product"}
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Product Name</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Product name"
            />
          </div>

          <div className="space-y-2">
            <Label>Price (₹)</Label>
            <Input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Price"
            />
          </div>

          <Button
            onClick={handleAddOrUpdate}
            disabled={!name || !price}
          >
            {editingId ? "Update Product" : "Add Product"}
          </Button>
        </CardContent>
      </Card>

      {/* PRODUCT LIST */}
      <Card>
        <CardHeader>
          <CardTitle>All Products</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {products.length === 0 && (
            <p className="text-muted-foreground">
              No products added
            </p>
          )}

          {products.map((product) => (
            <div
              key={product.id}
              className="flex justify-between items-center border p-3 rounded-md"
            >
              <div>
                <p className="font-medium">{product.name}</p>
                <p className="text-sm text-muted-foreground">
                  ₹{product.price}
                </p>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(product)}
                >
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(product.id)}
                >
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
