"use client";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
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
      {/* Overview - في الأعلى قبل كل حاجة */}
      {status === "unauthenticated" && (
        <section className="relative overflow-hidden rounded-lg shadow-2xl">
          <Image src="/assets/Clinic/clinic-slide1.jpg" alt="Dental chair" fill priority className="object-cover object-bottom opacity-30" />
          <div className="relative z-10 p-4 md:p-6 max-w-5xl mx-auto space-y-3">
            <p className="text-sm md:text-base text-accent font-semibold leading-snug">
              At MaxiCare Dental Clinic, we have outfitted our practice with state-of-the-art dental technology to provide minimally invasive, precise, and pain-managed treatments.
            </p>
            <ul className="space-y-2 text-xs md:text-sm">
              <li className="flex gap-2">
                <span className="text-accent font-bold">•</span>
                <span className="text-accent"><strong>Digital Diagnostics:</strong> Intraoral scanners and x-rays let us visualize your teeth and jaws with unparalleled clarity.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-accent font-bold">•</span>
                <span className="text-accent"><strong>Laser Dentistry:</strong> We employ soft-tissue lasers for gum reshaping, lesion removal, and more.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-accent font-bold">•</span>
                <span className="text-accent"><strong>Same-Day Dentistry:</strong> Our in-office CAD/CAM system empowers us to design and mill custom crowns, onlays, and veneers.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-accent font-bold">•</span>
                <span className="text-accent"><strong>Dental Implants:</strong> Guided implant surgery and immediate-load protocols replace missing teeth with stable implants.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-accent font-bold">•</span>
                <span className="text-accent"><strong>Cosmetic Dentistry:</strong> Porcelain veneers and tailored whitening deliver stunning esthetic results.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-accent font-bold">•</span>
                <span className="text-accent"><strong>Endodontics:</strong> Rotary instrumentation and apex locators enable comfortable, high-success root-canal therapy.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-accent font-bold">•</span>
                <span className="text-accent"><strong>Orthodontics:</strong> Metal braces, ceramic brackets, or clear aligners—choose the system that fits your lifestyle.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-accent font-bold">•</span>
                <span className="text-accent"><strong>Anesthesia Options:</strong> From oral sedation to full general anesthesia, your comfort is individualized.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-accent font-bold">•</span>
                <span className="text-accent"><strong>Comfort &amp; Safety:</strong> Ergonomic operatories and advanced sterilization keep your well-being first.</span>
              </li>
            </ul>
          </div>
        </section>
      )}

      {/* Hero + Slider */}
      <div className="grid md:grid-cols-2 gap-8 items-center">
        {/* Text section */}
        <div className="space-y-6 order-2 md:order-1">
          <h1 className="text-3xl md:text-4xl font-bold text-accent">Clinic</h1>
          <p className="text-lg max-w-prose text-accent">
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