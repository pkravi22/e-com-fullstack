"use client";
import Footer from "@/components/mycomponents/Footer";
import Header from "@/components/mycomponents/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useProfile } from "@/hooks/useProfile";
import { RootState } from "@/store/store";
import { useSelector } from "react-redux";

const categories = [
  { id: 1, name: "Electronics" },
  { id: 2, name: "Fashion" },
  { id: 3, name: "Books" },
  { id: 4, name: "Home & Kitchen" },
];

const products = [
  {
    id: 1,
    name: "Wireless Headphones",
    price: "₹2,999",
  },
  {
    id: 2,
    name: "Smart Watch",
    price: "₹4,499",
  },
  {
    id: 3,
    name: "Programming Book",
    price: "₹799",
  },
];

export default function HomePage() {
  const { data, isLoading } = useProfile();
  const { loading, error, isAuthenticated, user } = useSelector(
    (state: RootState) => state.auth
  );
  console.log("user detail", data);
  return (
    <main className="flex flex-col gap-16">
      <Header />
      <section className="bg-gradient-to-r from-slate-900 to-slate-700 text-white py-20">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Shop Smart, Shop Fast
          </h1>
          <p className="text-lg mb-6">
            Discover the best products at unbeatable prices
          </p>
          <Button size="lg">Shop Now</Button>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="container mx-auto px-6">
        <h2 className="text-2xl font-semibold mb-6">Shop by Category</h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((cat) => (
            <Card key={cat.id} className="hover:shadow-lg transition">
              <CardContent className="p-6 text-center font-medium">
                {cat.name}
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="container mx-auto px-6">
        <h2 className="text-2xl font-semibold mb-6">Featured Products</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {products.map((product) => (
            <Card key={product.id} className="hover:shadow-lg transition">
              <CardContent className="p-6 flex flex-col gap-3">
                <div className="h-40 bg-gray-100 rounded-md flex items-center justify-center">
                  Image
                </div>
                <h3 className="font-semibold">{product.name}</h3>
                <p className="text-muted-foreground">{product.price}</p>
                <Button>Add to Cart</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-slate-100 py-16 text-center">
        <h2 className="text-2xl font-semibold mb-4">Start Shopping Today</h2>
        <Button size="lg">Explore Products</Button>
      </section>
      <Footer />
    </main>
  );
}
