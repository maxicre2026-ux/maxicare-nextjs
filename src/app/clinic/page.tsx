"use client";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import MediaSlider, { MediaItem } from "@/components/MediaSlider";
import BookingCalendar from "@/components/BookingCalendar";
import BookingHistory from "@/components/BookingHistory"; // تأكد أنّ الملف موجود بنفس الاسم

const slides: MediaItem[] = [
  { src: "/assets/Clinic/clinic-slide1.jpg" },
  { src: "/assets/Clinic/clinic-slide2.jpg" },
  { src: "/assets/Clinic/clinic-video.mp4", type: "video" },
];

export default function ClinicPage() {
  const { status, data: session } = useSession(); // unauthenticated | authenticated | loading

  // access guard
  if (status === "authenticated" && (session?.user as any).role === "LAB_CLIENT") {
    return <p className="p-6">Access denied.</p>;
  }

  return (
    <section className="flex flex-col gap-12">
      {/* Hero + Slider */}
      <div className="grid md:grid-cols-2 gap-8 items-center">
        {/* Text section */}
        <div className="space-y-6 order-2 md:order-1">
          <h1 className="text-3xl md:text-4xl font-bold text-accent">Clinic</h1>
          <p className="text-lg max-w-prose">
            Book your appointment online and view full reports of your previous
            visits.
          </p>

          {/* Auth buttons */}
          <div className="flex gap-4 pt-4">
            {status === "unauthenticated" && (
              <>
                <Link
                  href="/auth/login"
                  className="border border-accent text-accent py-2 px-6 rounded hover:bg-accent/20"
                >
                  Login
                </Link>
                <Link
                  href="/auth/register"
                  className="bg-accent text-black font-semibold py-2 px-6 rounded"
                >
                  Register
                </Link>
              </>
            )}

            {status === "authenticated" && (
              <button
                onClick={() => signOut({ callbackUrl: "/clinic" })}
                className="border border-accent text-accent py-2 px-6 rounded hover:bg-accent/20"
              >
                Logout
              </button>
            )}
          </div>
        </div>

        {/* Slider */}
        <div className="order-1 md:order-2">
          <MediaSlider items={slides} heightClass="h-[400px]" />
        </div>
      </div>

      {/* Calendar + History (after login) */}
      {status === "authenticated" && (
        <div className="space-y-10">
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-accent">Book an Appointment</h2>
            <BookingCalendar />
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-accent">My Appointments</h2>
            <BookingHistory />
          </div>
        </div>
      )}
    </section>
  );
}