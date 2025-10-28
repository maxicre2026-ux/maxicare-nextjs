"use client";
import Link from "next/link";
import Image from "next/image";
import MediaSlider, { MediaItem } from "@/components/MediaSlider";

const slides: MediaItem[] = [
  { src: "/assets/Home/home-slide1.jpg" },
  { src: "/assets/Home/home-slide2.jpg" },
  { src: "/assets/Home/home-video.mp4", type: "video" },
];

export default function Home() {
  return (
    <section className="flex flex-col gap-12">
      {/* Hero + Slider Row */}
      <div className="grid md:grid-cols-2 gap-8 items-center">
        {/* Hero Text */}
        <div className="space-y-6 order-2 md:order-1">
          <h1 className="text-4xl font-bold">Welcome to MaxiCare Dental</h1>
          <p className="text-lg max-w-prose">
            Complete clinic management, online appointments, in-house lab, and educational resources — all in one platform.
          </p>
        </div>

        {/* Slider */}
      {/* Quick Links below */}
      <div className="flex flex-wrap gap-6 justify-start md:justify-center">
        {[
          { href: "/clinic", label: "Clinic", img: "/assets/clinic-card.jpg" },
          { href: "/lab", label: "Lab", img: "/assets/lab-card.jpg" },
          { href: "/education", label: "Education", img: "/assets/education-card.jpg" },
        ].map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="w-36 rounded-lg bg-accent/10 py-4 text-center font-semibold hover:bg-accent/20 transition-colors"
          >
            {item.label}
          </Link>
        ))}
      </div>
    </section>
  );
}
