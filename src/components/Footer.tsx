"use client";
import { Facebook, Instagram, MessageCircle } from "lucide-react";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-black text-accent py-8 mt-20">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-10 px-4 text-sm">
        {/* Contact */}
        <div>
          <h4 className="font-semibold mb-2">Contact</h4>
          <p>Phone: +20 115 881 8778</p>
          <p>Email: info@maxicaredental-eg.com</p>
        </div>
        {/* Social */}
        <div>
          <h4 className="font-semibold mb-2">Follow Us</h4>
          <div className="space-y-2 text-xs md:text-sm">
            {/* Clinic */}
            <div className="flex items-center gap-2">
              <span className="w-16 text-accent/80">Clinic</span>
              <div className="flex gap-3">
                <a
                  href="https://www.facebook.com/share/1FAxG6NZE5/?mibextid=wwXIfr"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Clinic Facebook"
                  className="hover:text-white transition-colors"
                >
                  <Facebook size={20} />
                </a>
                <a
                  href="https://www.instagram.com/maxicare.dental?igsh=MXF2cWRiMDRzMGtqZA%3D%3D&utm_source=qr"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Clinic Instagram"
                  className="hover:text-white transition-colors"
                >
                  <Instagram size={20} />
                </a>
              </div>
            </div>

            {/* Lab */}
            <div className="flex items-center gap-2">
              <span className="w-16 text-accent/80">Lab</span>
              <div className="flex gap-3">
                <a
                  href="https://www.facebook.com/share/17UueR8Z31/?mibextid=wwXIfr"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Lab Facebook"
                  className="hover:text-white transition-colors"
                >
                  <Facebook size={20} />
                </a>
                <a
                  href="https://www.instagram.com/maxicare_dental_lab?igsh=MXc1aWZybTJib3NpYg%3D%3D&utm_source=qr"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Lab Instagram"
                  className="hover:text-white transition-colors"
                >
                  <Instagram size={20} />
                </a>
              </div>
            </div>

            {/* Education */}
            <div className="flex items-center gap-2">
              <span className="w-16 text-accent/80">Edu</span>
              <div className="flex gap-3">
                <a
                  href="https://www.facebook.com/share/1GqtvV9U1f/?mibextid=wwXIfr"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Education Facebook"
                  className="hover:text-white transition-colors"
                >
                  <Facebook size={20} />
                </a>
              </div>
            </div>

            {/* WhatsApp (main clinic) */}
            <div className="flex items-center gap-2 pt-1 border-t border-accent/20 mt-2">
              <span className="w-16 text-accent/80">WhatsApp</span>
              <a
                href="https://wa.me/201158818778"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="hover:text-white transition-colors flex items-center gap-1"
              >
                <MessageCircle size={20} />
                <span className="hidden md:inline">+20 115 881 8778</span>
              </a>
            </div>
          </div>
        </div>
      </div>
      <p className="text-center text-xs mt-6"> {year} MaxiCare Dental. All rights reserved.</p>
    </footer>
  );
}
