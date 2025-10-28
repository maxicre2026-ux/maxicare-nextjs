"use client";
import Link from "next/link";
import Image from "next/image";

const navItems = [
  { label: "Home", href: "/" },
  { label: "Clinic", href: "/clinic" },
  { label: "Lab", href: "/lab" },
  { label: "Education", href: "/education" },
  { label: "Contact Us", href: "/contact" },];

export default function Navbar() {
  return (
    <header className="w-full sticky top-0 z-50 bg-background bg-opacity-90 backdrop-blur-md border-b border-accent/20">
      <nav className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <div className="w-[180px] h-[180px] bg-black flex items-center justify-center rounded">
            <Image
              src="/logo.png"
              alt="MaxiCare Logo"
              width={140}
              height={140}
              className="object-contain"
            />
          </div>
        </Link>

        {/* Navigation links */}
        <ul className="flex-1 flex justify-center gap-8 text-lg md:text-xl font-semibold">
          {navItems.map((item) => (
            <li key={item.href}>
              <Link href={item.href} className="text-accent hover:text-accent/80 transition-colors">
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
