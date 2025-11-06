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
    <section className="flex flex-col gap-8 pt-20">
      {/* Layout: Login شمال، النص يمين، Slider تحت */}
      {status === "unauthenticated" && (
        <div className="space-y-4 -mx-4 md:-mx-8">
          {/* الصف الأول: Login شمال + النص يمين - مع صورة خلفية */}
          <div 
            className="relative overflow-hidden min-h-[600px] md:min-h-[700px] w-screen"
            style={{
              backgroundImage: 'url(/assets/clinic-bg.jpg)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat'
            }}
          >
            {/* Overlay للتحكم في الشفافية */}
            <div className="absolute inset-0 bg-black/40"></div>
            
            {/* المحتوى فوق الصورة */}
            <div className="relative z-10 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6 items-center p-6 py-20 md:py-32">
              {/* Login buttons - الشمال */}
              <div className="space-y-2.5 bg-black/60 backdrop-blur-sm p-4 rounded-lg border-2 border-accent/30">
              <h1 className="text-2xl md:text-3xl font-bold text-accent">Clinic</h1>
              <p className="text-sm text-accent leading-snug">
                Book your appointment online and view full reports of your previous visits.
              </p>
              <div className="flex flex-col gap-2.5 pt-1">
                <Link
                  href="/auth/login"
                  className="border-2 border-accent text-accent py-2.5 px-6 rounded-lg text-center font-bold text-base hover:bg-accent hover:text-black transition-colors"
                >
                  LOGIN
                </Link>
                <Link
                  href="/auth/register"
                  className="border-2 border-accent text-accent py-2.5 px-6 rounded-lg text-center font-bold text-base hover:bg-accent hover:text-black transition-colors"
                >
                  REGISTER
                </Link>
              </div>
            </div>

              {/* النص - اليمين */}
              <div className="space-y-2.5 bg-black/60 backdrop-blur-sm p-4 rounded-lg">
              <p className="text-xs md:text-sm text-accent font-bold leading-snug">
                At MaxiCare Dental Clinic, we have outfitted our practice with state-of-the-art dental technology to provide minimally invasive, precise, and pain-managed treatments.
              </p>
              <ul className="space-y-2 text-xs md:text-sm">
                <li className="flex gap-2.5">
                  <span className="text-accent font-bold text-base">•</span>
                  <span className="text-accent"><strong>Digital Diagnostics:</strong> Intraoral scanners and x-rays let us visualize your teeth and jaws with unparalleled clarity.</span>
                </li>
                <li className="flex gap-2.5">
                  <span className="text-accent font-bold text-base">•</span>
                  <span className="text-accent"><strong>Laser Dentistry:</strong> We employ soft-tissue lasers for gum reshaping, lesion removal, and more.</span>
                </li>
                <li className="flex gap-2.5">
                  <span className="text-accent font-bold text-base">•</span>
                  <span className="text-accent"><strong>Same-Day Dentistry:</strong> Our in-office CAD/CAM system empowers us to design and mill custom crowns, onlays, and veneers.</span>
                </li>
                <li className="flex gap-2.5">
                  <span className="text-accent font-bold text-base">•</span>
                  <span className="text-accent"><strong>Dental Implants:</strong> Guided implant surgery and immediate-load protocols replace missing teeth with stable implants.</span>
                </li>
                <li className="flex gap-2.5">
                  <span className="text-accent font-bold text-base">•</span>
                  <span className="text-accent"><strong>Cosmetic Dentistry:</strong> Porcelain veneers and tailored whitening deliver stunning esthetic results.</span>
                </li>
                <li className="flex gap-2.5">
                  <span className="text-accent font-bold text-base">•</span>
                  <span className="text-accent"><strong>Orthodontics:</strong> Metal braces, ceramic brackets, or clear aligners—choose the system that fits your lifestyle.</span>
                </li>
              </ul>
              </div>
            </div>
          </div>

          {/* Slider في المنتصف تحت */}
          <div className="w-full max-w-3xl mx-auto">
            <MediaSlider items={slides} heightClass="h-[350px] md:h-[450px]" />
          </div>
        </div>
      )}

      {/* بعد Login: Hero + Slider العادي */}
      {status === "authenticated" && (
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="space-y-6">
            <h1 className="text-3xl md:text-4xl font-bold text-accent">Clinic</h1>
            <p className="text-lg max-w-prose text-accent">
              Book your appointment online and view full reports of your previous visits.
            </p>
            <button
              onClick={() => signOut({ callbackUrl: "/clinic" })}
              className="border border-accent text-accent py-2 px-6 rounded hover:bg-accent/20"
            >
              Logout
            </button>
          </div>
          <div>
            <MediaSlider items={slides} heightClass="h-[400px]" />
          </div>
        </div>
      )}

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