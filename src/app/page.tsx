"use client";
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  const cards = [
    { href: "/clinic", label: "Clinic", img: "/assets/clinic-card.jpg" },
    { href: "/lab", label: "Lab", img: "/assets/lab-card.jpg" },
    { href: "/education", label: "Education", img: "/assets/education-card.jpg" },
  ];

  return (
    <section className="flex flex-col gap-12">
      {/* Intro Text */}
      <div className="text-center space-y-6 max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold text-accent">Welcome to MaxiCare Dental</h1>
        <p className="text-lg md:text-xl leading-relaxed">
          Comprehensive dental care platform offering advanced clinic services, in-house laboratory, and rich educational content. Explore our sections below to book appointments, submit lab tickets, or learn more about oral health.
        </p>
      </div>

      {/* Image Cards */}
      <div className="flex flex-wrap gap-6 justify-start md:justify-center">
        {cards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="relative w-80 h-48 rounded-lg overflow-hidden group"
          >
            <Image
              src={card.img}
              alt={card.label}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <span className="absolute inset-0 bg-black/50 flex items-center justify-center text-accent font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
              {card.label}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
