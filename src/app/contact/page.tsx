"use client";

export default function ContactPage() {
  return (
    <section className="relative min-h-screen flex items-center justify-center -mt-20">
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
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 py-32 md:py-40">
        {/* العنوان */}
        <h1 className="text-4xl md:text-5xl font-bold text-accent text-center mb-12">Contact Us</h1>

        {/* Map + Details */}
        <div className="grid md:grid-cols-2 gap-8 items-start">
          {/* Map */}
          <div className="w-full h-[350px] md:h-[450px] border-2 border-accent/30 rounded-lg overflow-hidden bg-black/60 backdrop-blur-sm">
            <iframe
              title="map"
              src="https://www.google.com/maps?q=101+Mustafa+El+Nahhas,Al+Manteqah+Ath+Thamenah,Nasr+City,Cairo+Governorate+4450113&output=embed&z=16"
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
              <p className="text-accent/90 text-base">101 Mustafa El Nahhas<br/>Al Manteqah Ath Thamenah<br/>Nasr City, Cairo Governorate 4450113</p>
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
                General: <a href="mailto:info@maxicare.com" className="underline hover:text-accent">info@maxicare.com</a><br/>
                Support: <a href="mailto:support@maxicare.com" className="underline hover:text-accent">support@maxicare.com</a>
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-accent mb-2">Working Hours</h3>
              <p className="text-accent/90 text-base">
                Sunday - Thursday: 9:00 AM - 9:00 PM<br/>
                Friday - Saturday: 10:00 AM - 6:00 PM
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
