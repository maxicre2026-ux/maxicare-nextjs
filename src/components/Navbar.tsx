"use client";
import Link from "next/link";
import Image from "next/image";

const navItems = [
  { label: "Home", href: "/" },
  { label: "Clinic", href: "/clinic" },
  { label: "Lab", href: "/lab" },
  { label: "Education", href: "/education" },
  { label: "Contact", href: "/contact" },
];

export default function Navbar() {
  return (
    <header className="fixed top-0 w-full bg-black/90 backdrop-blur z-50">
      <nav className="max-w-7xl mx-auto flex items-center justify-between px-4 py-0.5">
        {/* Logo / Brand */}
        <Link href="/" className="flex items-center -ml-2">
          <Image 
            src="/assets/logo.png" 
            alt="MaxiCare Logo" 
            width={540}
            height={270}
            priority
            className="h-28 w-auto object-contain"
          />
        </Link>
        {/* Links */}
        <ul className="hidden md:flex gap-8 text-lg font-bold tracking-wide">
          {navItems.map((item) => (
            <li key={item.href}>
              <Link href={item.href} className="text-accent hover:text-accent/80 transition-colors">
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
        {/* CTA */}
        <Link
          href="/clinic"
          className="hidden md:inline-block border border-accent text-accent px-6 py-2 rounded hover:bg-accent hover:text-black transition-colors"
        >
          BOOK NOW
        </Link>
      </nav>
    </header>
  );
}
