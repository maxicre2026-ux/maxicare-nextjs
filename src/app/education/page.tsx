"use client";
import MediaSlider, { MediaItem } from "@/components/MediaSlider";

export default function EducationPage() {
  const slides: MediaItem[] = [
    { src: "/assets/education/edu-slide1.jpg" },
    { src: "/assets/education/edu-slide2.jpg" },
    { src: "/assets/education/edu-video.mp4", type: "video" },
  ];

  return (
    <section className="space-y-10 py-8">
      {/* Hero */}
      <div className="grid md:grid-cols-2 gap-8 items-center">
        {/* Text */}
        <div className="space-y-6 order-2 md:order-1">
          <h2 className="text-3xl font-bold text-accent">Expand Your Dental Knowledge</h2>
          <p className="text-lg max-w-prose">
            Explore articles, videos and tutorials prepared by MaxiCare experts to keep you up-to-date
            with the latest techniques and best practices.
          </p>
        </div>
        {/* Slider */}
        <div className="order-1 md:order-2">
          <MediaSlider items={slides} heightClass="h-[300px]" />
        </div>
      </div>

      {/* Resources placeholder */}
      <h3 className="text-2xl font-semibold text-accent">Featured Resources</h3>
      <p>Coming soon: interactive courses, downloadable guides, and webinar recordings.</p>
    </section>
  );
}
