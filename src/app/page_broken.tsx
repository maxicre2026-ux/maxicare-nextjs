"use client";
import Link from "next/link";
import MediaSlider, { MediaItem } from "@/components/MediaSlider";

const slides: MediaItem[] = [
  { src: "/assets/Home/home-slide1.jpg" },
  { src: "/assets/Home/home-video.mp4", type: "video" },
];

export default function Home() {
  return (
    <section className="flex flex-col gap-12">
      {/* Hero + Slider */}
      <div className="grid md:grid-cols-2 gap-8 items-center">
        {/* Hero Text */}
        <div className="space-y-6">
          <h1 className="text-4xl font-bold">Welcome to MaxiCare Dental</h1>
          <p className="text-lg max-w-prose">
            Complete clinic management, online appointments, in-house lab, and educational resources — all in one platform.
          </p>
        </p>
        {/* Quick Links */}
        <div className="grid sm:grid-cols-3 gap-4">
          <Link href="/clinic" className="rounded-lg bg-accent/10 py-4 text-center font-semibold hover:bg-accent/20 transition-colors">Clinic</Link>
          <Link href="/lab" className="rounded-lg bg-accent/10 py-4 text-center font-semibold hover:bg-accent/20 transition-colors">Lab</Link>
          <Link href="/education" className="rounded-lg bg-accent/10 py-4 text-center font-semibold hover:bg-accent/20 transition-colors">Education</Link>
        </div>
      </div>

      {/* Slider column */}
      <MediaSlider items={slides} heightClass="h-[500px]" />
    </section>
  );
}
