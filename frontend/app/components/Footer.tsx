import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-black border-t border-white/10 mt-24">
      <div className="max-w-7xl mx-auto px-6 py-14 grid grid-cols-1 md:grid-cols-4 gap-10">

        {/* Brand */}
        <div className="md:col-span-2">
          <div className="flex items-center gap-3 mb-4">
            <Image
              src="/lama.jpg"
              alt="AI Scraper Logo"
              width={34}
              height={34}
              className="rounded-sm"
            />
            <span className="text-lg font-semibold tracking-wide text-white">
              AI Scraper
            </span>
          </div>
          <p className="text-sm text-white/60 max-w-md">
            Fast, intelligent web scraping built for modern e-commerce.  
            Fully compatible with Shopify and designed for scale.
          </p>
        </div>

        {/* Links */}
        <div>
          <h4 className="text-sm font-medium text-white mb-4">
            Product
          </h4>
          <ul className="space-y-2 text-sm text-white/60">
            <li><Link href="#" className="hover:text-white transition">Dashboard</Link></li>
            <li><Link href="#" className="hover:text-white transition">Scrapers</Link></li>
            <li><Link href="#" className="hover:text-white transition">Jobs</Link></li>
            <li><Link href="#" className="hover:text-white transition">Docs</Link></li>
          </ul>
        </div>

        {/* Meta */}
        <div>
          <h4 className="text-sm font-medium text-white mb-4">
            Platform
          </h4>
          <ul className="space-y-2 text-sm text-white/60">
            <li>Shopify Compatible</li>
            <li>AI-Powered Extraction</li>
            <li>Structured Data Output</li>
            <li>Secure & Scalable</li>
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-white/50">
          <span>
            © {new Date().getFullYear()} AI Scraper. All rights reserved.
          </span>

          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            Shopify Ready
          </div>
        </div>
      </div>
    </footer>
  );
}
