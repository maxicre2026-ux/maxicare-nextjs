"use client";
import Link from "next/link";
import Image from "next/image";

const navItems = [
  { label: "Home", href: "/" },
  { label: "Clinic", href: "/clinic" },
  { label: "Lab", href: "/lab" },
  { label: "Education", href: "/education" },
  { label: "Contact Us", href: "/contact" },
];

export default function Navbar() {
  return (
    <header className="w-full sticky top-0 z-50 bg-background bg-opacity-90 backdrop-blur-md border-b border-accent/20">
      <nav className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3">
          {/* Logo container with black background */}
          <div className="w-[180px] h-[180px] bg-background flex items-center justify-center rounded">
            {/* Mask element to color logo lines */}
            <div className="w-[140px] h-[140px] bg-accent" style={{ WebkitMask: "url('/logo.png') center/contain no-repeat", mask: "url('/logo.png') center/contain no-repeat" }} />
          </div>        </Link>
        <ul className="flex gap-6 text-sm font-semibold">
          {navItems.map((item) => (
            <li key={item.href}>
              <Link
                className="text-accent hover:text-accent/80 transition-colors"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
