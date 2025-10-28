"use client";
export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="w-full border-t border-accent/20 py-6 text-center text-xs text-accent">
      © {year} MaxiCare Dental. All rights reserved.
    </footer>
  );
}
