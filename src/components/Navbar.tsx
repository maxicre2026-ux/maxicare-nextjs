"use client";
import Link from "next/link";
import Image from "next/image";

const navItems = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

export default function Navbar() {
  return (
    <header className="fixed top-0 w-full bg-black/90 backdrop-blur z-50">
      <nav className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3">
        {/* Logo / Brand */}
        <Link href="/" className="text-2xl font-extrabold text-accent tracking-widest">
          MAXICARE
        </Link>
        {/* Links */}
        <ul className="hidden md:flex gap-8 text-sm font-semibold tracking-wide">
          {navItems.map((item) => (
            <li key={item.href}>
              <Link href={item.href} className="text-white hover:text-accent transition-colors">
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
