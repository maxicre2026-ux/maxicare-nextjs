"use client";
import MediaSlider, { MediaItem } from "@/components/MediaSlider";

export default function EducationPage() {
  const slides: MediaItem[] = [
    { src: "/assets/education/edu-slide1.jpg" },
    { src: "/assets/education/edu-slide2.jpg" },
    { src: "/assets/education/edu-video.mp4", type: "video" },
  ];

  return (
    <section className="flex flex-col gap-8 pt-20">
      {/* Hero Section مع صورة خلفية */}
      <div className="space-y-4 -mx-4 md:-mx-8">
        <div 
          className="relative overflow-hidden min-h-[350px] md:min-h-[450px] w-screen"
          style={{
            backgroundImage: 'url(/assets/education-bg.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        >
          {/* Overlay للتحكم في الشفافية */}
          <div className="absolute inset-0 bg-black/40"></div>
          
          {/* المحتوى فوق الصورة */}
          <div className="relative z-10 max-w-7xl mx-auto flex flex-col items-center justify-center text-center p-6 py-16 md:py-20">
            <h1 className="text-3xl md:text-4xl font-bold text-accent mb-4">Expand Your Dental Knowledge</h1>
            <p className="text-base md:text-lg text-accent max-w-3xl leading-relaxed">
              Explore articles, videos and tutorials prepared by MaxiCare experts to keep you up-to-date with the latest techniques and best practices in implantology, periodontology, and esthetic dentistry.
            </p>
            <p className="text-3xl md:text-4xl font-bold text-accent pt-6">COMING SOON</p>
          </div>
        </div>

        {/* Slider في المنتصف تحت */}
        <div className="w-full max-w-3xl mx-auto">
          <MediaSlider items={slides} heightClass="h-[350px] md:h-[450px]" />
        </div>
      </div>

    </section>
  );
}
