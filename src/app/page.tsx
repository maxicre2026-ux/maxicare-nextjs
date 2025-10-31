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
    <>
      {/* HERO */}
      <section className="relative h-[70vh] w-full flex items-center justify-center text-center">
        <Image
          src="https://maxicaredental-eg.com/wp-content/uploads/2023/08/dental-hero.jpg"
          alt="Dental Hero"
          fill
          priority
          className="object-cover object-center opacity-60"
        />
        <div className="relative z-10 max-w-3xl px-4 space-y-6">
          <p className="text-sm uppercase tracking-widest text-accent">Your Smile, Our Priority</p>
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight text-white">
            Comprehensive Dental Care at
            <br /> MAXICARE
          </h1>
          <p className="text-base md:text-lg text-white/90">
            Experience exceptional dental care tailored to your needs, from routine check-ups to cosmetic enhancements and emergency services.
          </p>
          <Link
            href="/clinic"
            className="inline-block border border-accent text-accent px-8 py-3 rounded font-semibold hover:bg-accent hover:text-black transition-colors"
          >
            BOOK NOW
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
