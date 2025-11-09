"use client";
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
            <a href="#" aria-label="facebook" className="hover:text-white">FB</a>
            <a href="#" aria-label="instagram" className="hover:text-white">IG</a>
            <a href="#" aria-label="whatsapp" className="hover:text-white">WA</a>
          </div>
        </div>
      </div>
      <p className="text-center text-xs mt-6"> {year} MaxiCare Dental. All rights reserved.</p>
    </footer>
  );
}
