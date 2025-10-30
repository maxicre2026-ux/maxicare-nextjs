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
      <nav className="max-w-7xl mx-auto flex items-center justify-between px-4 py-2">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Image src="/logo.png" alt="MaxiCare Logo" width={140} height={140} priority className="object-contain" />
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
        {/* CTA */}
        <Link href="/clinic" className="hidden md:inline-block bg-accent text-black font-semibold px-4 py-1 rounded hover:opacity-90 transition-colors">Book Now</Link>
      </nav>
    </header>
  );
}
