"use client";
import Image from "next/image";

const partners = [
  {
    name: "Dr. Mohamed Gamal",
    img: "/assets/partners/mohamed.jpg",
    text: "The team at MaxiCare transformed my smile! Professional and friendly service.",
  },
  {
    name: "Dr. Ahmed Radi",
    img: "/assets/partners/ahmed.jpg",
    text: "Fast appointments and top-notch equipment. Highly recommended.",
  },
  {
    name: "Our Partnership",
    img: "/assets/partners/team.jpg",
    text: "Loved the in-house lab — I got my crown in one visit!",
  },
];

export default function TestimonialsSection() {
  return (
    <section className="py-16 bg-background text-accent px-4">
      <h3 className="text-3xl font-bold text-center mb-10">Our Partners</h3>
      <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-8">
        {partners.map((t) => (
          <div key={t.name} className="border border-accent/30 rounded-lg p-6 bg-neutral-900/60 space-y-4">
            <div className="flex flex-col items-center gap-3">
              <Image src={t.img} alt={t.name} width={300} height={220} className="w-full h-56 object-cover rounded" />
              <p className="pt-4 font-semibold text-center text-sm md:text-base">{t.name}</p>
              <p className="text-white/80 text-sm leading-relaxed">{t.text}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
