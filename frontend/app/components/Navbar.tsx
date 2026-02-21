"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-black border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">

        {/* Left: Logo + Brand */}
        <div className="flex items-center gap-3">
          <Image
            src="/lama.PNG"
            alt="AI Scraper Logo"
            width={44}
            height={44}
            className="rounded-sm"
          />
          <span className="text-base sm:text-lg font-semibold tracking-wide text-white">
            AI Scraper
          </span>
        </div>

        {/* Center: Navigation (Desktop) */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-8 text-sm text-white/70">
          <Link href="#" className="hover:text-white transition">Dashboard</Link>
          <Link href="#" className="hover:text-white transition">Scrapers</Link>
          <Link href="#" className="hover:text-white transition">Jobs</Link>
          <Link href="#" className="hover:text-white transition">Docs</Link>
        </nav>

        {/* Right */}
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="hidden sm:flex items-center gap-2 text-xs text-white/60">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            Shopify Compatible
          </div>

          <button className="px-3 sm:px-4 py-2 text-xs sm:text-sm rounded-md bg-white text-black font-medium hover:bg-gray-200 transition whitespace-nowrap">
            New Scrape
          </button>

          {/* Mobile Toggle */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden text-white text-2xl"
          >
            {open ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden bg-black border-t border-white/10 px-6 py-4 space-y-4 text-sm text-white/80">
          <Link onClick={() => setOpen(false)} href="#" className="block hover:text-white">Dashboard</Link>
          <Link onClick={() => setOpen(false)} href="#" className="block hover:text-white">Scrapers</Link>
          <Link onClick={() => setOpen(false)} href="#" className="block hover:text-white">Jobs</Link>
          <Link onClick={() => setOpen(false)} href="#" className="block hover:text-white">Docs</Link>
        </div>
      )}
    </header>
  );
}
