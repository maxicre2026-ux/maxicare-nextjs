"use client";
import Image from "next/image";

const testimonials = [
  {
    name: "Sarah A.",
    text: "The team at MaxiCare transformed my smile! Professional and friendly service.",
    avatar: "/assets/avatar1.jpg",
  },
  {
    name: "Omar K.",
    text: "Fast appointments and top-notch equipment. Highly recommended.",
    avatar: "/assets/avatar2.jpg",
  },
  {
    name: "Mona S.",
    text: "Loved the in-house lab — I got my crown in one visit!", 
    avatar: "/assets/avatar3.jpg",
  },
];

export default function TestimonialsSection() {
  return (
    <section className="py-16 bg-background text-accent px-4">
      <h3 className="text-3xl font-bold text-center mb-10">What Our Patients Say</h3>
      <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-8">
        {testimonials.map((t) => (
          <div key={t.name} className="border border-accent/30 rounded-lg p-6 bg-neutral-900/60 space-y-4">
            <div className="flex items-center gap-3">
              <Image src={t.avatar} alt={t.name} width={40} height={40} className="rounded-full object-cover" />
              <p className="font-semibold text-sm">{t.name}</p>
            </div>
            <p className="text-white/80 text-sm leading-relaxed">{t.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
