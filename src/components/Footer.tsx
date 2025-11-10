"use client";
import { Facebook, Instagram, MessageCircle } from "lucide-react";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-black text-accent py-8 mt-20">
      <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-10 px-4 text-sm">
        {/* Brand */}
        <div>
          <h3 className="text-xl font-bold mb-2">MAXICARE</h3>
          <p>Comprehensive Dental Care</p>
        </div>
        {/* Contact */}
        <div>
          <h4 className="font-semibold mb-2">Contact</h4>
          <p>Phone: +20 115 881 8778</p>
          <p>Email: info@maxicaredental-eg.com</p>
        </div>
        {/* Social */}
        <div>
          <h4 className="font-semibold mb-2">Follow Us</h4>
          <div className="flex gap-4">
            <a 
              href="https://www.facebook.com/people/MaxiCare-Dental-Lab/61552783405116/" 
              target="_blank"
              rel="noopener noreferrer"
              aria-label="facebook" 
              className="hover:text-white transition-colors"
            >
              <Facebook size={24} />
            </a>
            <a 
              href="https://www.instagram.com/maxicare_dental_lab" 
              target="_blank"
              rel="noopener noreferrer"
              aria-label="instagram" 
              className="hover:text-white transition-colors"
            >
              <Instagram size={24} />
            </a>
            <a 
              href="https://wa.me/201158818778" 
              target="_blank"
              rel="noopener noreferrer"
              aria-label="whatsapp" 
              className="hover:text-white transition-colors"
            >
              <MessageCircle size={24} />
            </a>
          </div>
        </div>
      </div>
      <p className="text-center text-xs mt-6"> {year} MaxiCare Dental. All rights reserved.</p>
    </footer>
  );
}
