import Image from "next/image";
import Link from "next/link";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-black border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        
        {/* Left: Logo + Brand */}
        <div className="flex items-center gap-3">
          <Image
            src="/lama.jpg"
            alt="AI Scraper Logo"
            width={50}
            height={50}
            className="rounded-sm"
          />
          <span className="text-lg font-semibold tracking-wide text-white">
            AI Scraper
          </span>
        </div>

        {/* Center: Navigation */}
        <nav className="hidden md:flex items-center gap-8 text-sm text-white/70">
          <Link href="#" className="hover:text-white transition">
            Dashboard
          </Link>
          <Link href="#" className="hover:text-white transition">
            Scrapers
          </Link>
          <Link href="#" className="hover:text-white transition">
            Jobs
          </Link>
          <Link href="#" className="hover:text-white transition">
            Docs
          </Link>
        </nav>

        {/* Right: Status + Action */}
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 text-xs text-white/60">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            Shopify Compatible
          </div>

          <button className="px-4 py-2 text-sm rounded-md bg-white text-black font-medium hover:bg-gray-200 transition">
            New Scrape
          </button>
        </div>
      </div>
    </header>
  );
}
