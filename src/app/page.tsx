"use client";
import Link from "next/link";
import { Playfair_Display } from "next/font/google";
import Image from "next/image";
import StorySection from "@/components/home/StorySection";
import TestimonialsSection from "@/components/home/TestimonialsSection";

const playfair = Playfair_Display({ subsets: ["latin"], weight: ["700"] });

export default function Home() {
  const cards = [
    { href: "/clinic", label: "Clinic", img: "/assets/clinic-card.jpg" },
    { href: "/lab", label: "Lab", img: "/assets/lab-card.jpg" },
    { href: "/education", label: "Education", img: "/assets/education-card.jpg" },
  ];

  return (
    <>
      {/* HERO */}
      <section className="relative h-screen w-full flex items-center justify-center text-center bg-[url('/assets/hero.jpg')] bg-cover bg-top">
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative z-10 max-w-3xl px-4 space-y-6">
          <p className="text-sm uppercase tracking-widest text-accent">Your Smile, Our Priority</p>
          <h1 className={`text-4xl md:text-5xl font-extrabold leading-tight text-accent ${playfair.className}`}>
            Comprehensive Dental Care at
            <br /> MAXICARE
          </h1>
          <p className="text-base md:text-lg text-accent/90">
            Experience exceptional dental care tailored to your needs, from routine check-ups to cosmetic enhancements and emergency services.
          </p>
          <Link
            href="/clinic"
            className="inline-block border border-accent text-accent px-8 py-3 rounded font-semibold hover:bg-accent hover:text-black transition-colors"
          >
            BOOK NOW
          </Link>
        </div>
      </section>

      {/* SERVICES */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center text-accent mb-10">Our Services</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {cards.map((c) => (
            <Link key={c.href} href={c.href} className="relative h-56 rounded overflow-hidden group">
              <Image
                src={c.img}
                alt={c.label}
                fill
                className="object-cover object-top opacity-60 transition-transform duration-300"
              />
              <span className="absolute inset-0 bg-black/50 flex items-center justify-center text-xl font-semibold text-accent opacity-0 group-hover:opacity-100 transition-opacity">
                {c.label}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* STORY */}
      <StorySection />

      {/* TESTIMONIALS */}
      <TestimonialsSection />
    </>
  );
}
