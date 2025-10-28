"use client";

export default function ContactPage() {
  return (
    <section className="space-y-10 py-8">
      {/* Heading */}
      <h1 className="text-4xl md:text-5xl font-bold text-accent text-center mb-8">Contact Us</h1>

      {/* Map + Details */}
      <div className="grid md:grid-cols-2 gap-8 items-start">
        {/* Map */}
        <div className="w-full h-[300px] md:h-[400px] border border-accent/40 rounded overflow-hidden order-2 md:order-1">
          <iframe
            title="map"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d23812.565!2d31.235711!3d30.044420!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0:0x0!2zMzDCsDAyJzMzLjkiTiAzMcKwMTQnMDYuNSJF!5e0!3m2!1sen!2seg!4v1697840000000!5m2!1sen!2seg"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>

        {/* Details */}
        <div className="space-y-6 order-1 md:order-2">
          <div>
            <h2 className="text-2xl font-semibold text-accent mb-2">Head Office</h2>
            <p>123 Placeholder Street,<br/>Nasr City, Cairo, Egypt</p>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-accent mb-1">Phone</h3>
            <p>
              Clinic: <a href="tel:+201234567890" className="underline">+20 123 456 7890</a><br/>
              Lab: <a href="tel:+201098765432" className="underline">+20 109 876 5432</a>
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-accent mb-1">Email</h3>
            <p>
              General: <a href="mailto:info@maxicare.com" className="underline">info@maxicare.com</a><br/>
              Support: <a href="mailto:support@maxicare.com" className="underline">support@maxicare.com</a>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
