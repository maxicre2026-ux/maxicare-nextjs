"use client";
import { useSession } from "next-auth/react";
import Link from "next/link";
import MediaSlider, { MediaItem } from "@/components/MediaSlider";
import BookingCalendar from "@/components/BookingCalendar";

const slides: MediaItem[] = [
  { src: "/assets/Clinic/clinic-slide2.jpg" },
  { src: "/assets/Clinic/clinic-video.mp4", type: "video" },
];

export default function ClinicPage() {
  const { data: session } = useSession();
  return (
    <section className="flex flex-col gap-12">
      {/* Hero + Slider */}
      <div className="grid md:grid-cols-2 gap-8 items-center">
        {/* Text */}
{{ ... }}
          <h1 className="text-3xl md:text-4xl font-bold text-accent">Clinic</h1>
          <p className="text-lg max-w-prose">
            Book your appointment online and view full reports of your previous visits.
          </p>
          <div className="flex gap-4 pt-4">
            <Link href="/auth/login" className="bg-accent text-black font-semibold py-2 px-6 rounded">Login</Link>
            <Link href="/auth/register" className="border border-accent py-2 px-6 rounded hover:bg-accent/20">Register</Link>
          </div>
        </div>

        {/* Slider */}
        <div className="order-1 md:order-2">
          <MediaSlider items={slides} heightClass="h-[400px]" />
        </div>
      </div>
          {/* Booking calendar */}
      {session && <BookingCalendar />}
    </section>
  );
}
