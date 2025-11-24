"use client";
import { Facebook, Instagram } from "lucide-react";

export default function ContactPage() {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20">
      {/* صورة الخلفية الكبيرة */}
      <div 
        className="absolute inset-0 w-full h-full"
        style={{
          backgroundImage: 'url(/assets/contact-bg.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'top',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed'
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/50"></div>
      </div>

      {/* المحتوى فوق الصورة */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 pt-16 pb-32 md:pt-24 md:pb-40">
        {/* العنوان */}
        <h1 className="text-4xl md:text-5xl font-bold text-accent text-center mb-12">Contact Us</h1>

        {/* Map + Details */}
        <div className="grid md:grid-cols-2 gap-8 items-start">
          {/* Map */}
          <div className="w-full h-[350px] md:h-[450px] border-2 border-accent/30 rounded-lg overflow-hidden bg-black/60 backdrop-blur-sm">
            <iframe
              title="map"
              src="https://www.google.com/maps?q=3932%2BXQ+Nasr+City&output=embed&z=17"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>

          {/* Details */}
          <div className="space-y-6 bg-black/60 backdrop-blur-sm p-6 rounded-lg border-2 border-accent/30">
            <div>
              <h2 className="text-2xl font-semibold text-accent mb-3">Head Office</h2>
              <p className="text-accent/90 text-base">101 Mustafa El Nahhas<br/>Al Manteqah Ath Thamenah<br/>Nasr City, Cairo Governorate</p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-accent mb-2">Phone</h3>
              <p className="text-accent/90 text-base">
                <a href="tel:+201158818778" className="underline hover:text-accent">+20 115 881 8778</a>
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-accent mb-2">Email</h3>
              <p className="text-accent/90 text-base">
                General: <a href="mailto:info@maxicaredental-eg.com" className="underline hover:text-accent">info@maxicaredental-eg.com</a><br/>
                Support: <a href="mailto:support@maxicaredental-eg.com" className="underline hover:text-accent">support@maxicaredental-eg.com</a>
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-accent mb-2">Working Hours</h3>
              <p className="text-accent/90 text-base">
                Saturday - Thursday: 3:00 PM - 9:00 PM
              </p>
            </div>

            {/* Social Media */}
            <div className="space-y-3">
              <h3 className="text-xl font-semibold text-accent mb-1">Social Media</h3>

              {/* Clinic */}
              <div>
                <p className="text-accent/80 text-sm mb-1">Clinic</p>
                <div className="flex gap-3 items-center">
                  <a
                    href="https://www.facebook.com/share/1FAxG6NZE5/?mibextid=wwXIfr"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Clinic Facebook"
                    className="hover:text-white transition-colors flex items-center gap-1 text-sm"
                  >
                    <Facebook size={18} />
                    <span className="hidden md:inline">Facebook</span>
                  </a>
                  <a
                    href="https://www.instagram.com/maxicare.dental?igsh=MXF2cWRiMDRzMGtqZA%3D%3D&utm_source=qr"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Clinic Instagram"
                    className="hover:text-white transition-colors flex items-center gap-1 text-sm"
                  >
                    <Instagram size={18} />
                    <span className="hidden md:inline">Instagram</span>
                  </a>
                </div>
              </div>

              {/* Lab */}
              <div>
                <p className="text-accent/80 text-sm mb-1">Lab</p>
                <div className="flex gap-3 items-center">
                  <a
                    href="https://www.facebook.com/share/17UueR8Z31/?mibextid=wwXIfr"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Lab Facebook"
                    className="hover:text-white transition-colors flex items-center gap-1 text-sm"
                  >
                    <Facebook size={18} />
                    <span className="hidden md:inline">Facebook</span>
                  </a>
                  <a
                    href="https://www.instagram.com/maxicare_dental_lab?igsh=MXc1aWZybTJib3NpYg%3D%3D&utm_source=qr"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Lab Instagram"
                    className="hover:text-white transition-colors flex items-center gap-1 text-sm"
                  >
                    <Instagram size={18} />
                    <span className="hidden md:inline">Instagram</span>
                  </a>
                </div>
              </div>

              {/* Education */}
              <div>
                <p className="text-accent/80 text-sm mb-1">Education</p>
                <div className="flex gap-3 items-center">
                  <a
                    href="https://www.facebook.com/share/1GqtvV9U1f/?mibextid=wwXIfr"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Education Facebook"
                    className="hover:text-white transition-colors flex items-center gap-1 text-sm"
                  >
                    <Facebook size={18} />
                    <span className="hidden md:inline">Facebook</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
