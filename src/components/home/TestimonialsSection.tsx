"use client";
import Image from "next/image";

const partners = [
  {
    name: "Dr. Mohamed Gamal Al Akawy",
    title: "BDS, MSc, PhD",
    img: "/assets/partners/mohamed.jpg",
    text: "Dr. Al Akawy is a highly accomplished Consultant in Periodontology, Implantology, and Esthetic Dentistry with over 16 years of clinical experience since graduating in 2010. Holding both a Master's and Doctorate degree in Periodontology, he has spent more than nine years teaching at dental university level and over seven years conducting advanced postgraduate courses in implantology, periodontology, and esthetic dentistry for dentists from all over the Arab region. Dr. Al Akawy has been a distinguished lecturer at numerous national and international conferences. His commitment to excellence, innovation, and patient-centered care defines his approach, blending science and artistry to deliver outstanding dental results and confident smiles.",
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
      <h3 className="text-3xl font-bold text-center mb-10">Meet the Founder</h3>
      <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-8">
        {partners.map((t) => (
          <div key={t.name} className="border border-accent/30 rounded-lg bg-neutral-900/60 overflow-hidden space-y-0 h-full">
            <div className="flex flex-col items-center p-4">
              <Image src={t.img} alt={t.name} width={300} height={220} className="w-full h-48 object-contain object-center" />
              <div className="pt-2 text-center">
                <p className="font-semibold text-sm md:text-base">{t.name}</p>
                {(t as any).title && <p className="text-accent/80 text-xs">{(t as any).title}</p>}
              </div>
              <p className="text-white/80 text-xs leading-snug text-justify pt-2">{t.text}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
