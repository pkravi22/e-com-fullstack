import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t bg-slate-50">
      <div className="container mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* BRAND */}
        <div>
          <h3 className="text-lg font-semibold mb-2">MyStore</h3>
          <p className="text-sm text-muted-foreground">
            Your one-stop shop for everything you need.
          </p>
        </div>

        {/* LINKS */}
        <div>
          <h4 className="font-medium mb-2">Quick Links</h4>
          <ul className="space-y-1 text-sm">
            <li>
              <Link href="/">Home</Link>
            </li>
            <li>
              <Link href="/products">Products</Link>
            </li>
            <li>
              <Link href="/about">About</Link>
            </li>
          </ul>
        </div>

        {/* COPYRIGHT */}
        <div className="text-sm text-muted-foreground md:text-right">
          © {new Date().getFullYear()} MyStore. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
