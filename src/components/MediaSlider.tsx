"use client";
import { useState } from "react";
import Image from "next/image";

export type MediaItem = {
  src: string;
  type?: "image" | "video"; // default is image
  alt?: string;
};

interface SliderProps {
  items: MediaItem[];
  heightClass?: string; // e.g. h-96
}

export default function MediaSlider({ items, heightClass = "h-96" }: SliderProps) {
  const [index, setIndex] = useState(0);

  const next = () => setIndex((prev) => (prev + 1) % items.length);
  const prev = () => setIndex((prev) => (prev - 1 + items.length) % items.length);

  const item = items[index];

  return (
    <div className={`relative w-full ${heightClass} overflow-hidden rounded-lg`}>
      {item.type === "video" ? (
        <video
          key={item.src}
          src={item.src}
          className="absolute inset-0 w-full h-full object-contain"
          autoPlay
          loop
          controls
        />
      ) : (
        <Image
          key={item.src}
          src={item.src}
          alt={item.alt || "slide"}
          fill
          className="absolute inset-0 object-cover" sizes="100vw"
        />
      )}
      {/* Controls */}
      <button
        onClick={prev}
        className="absolute left-3 top-1/2 -translate-y-1/2 bg-background/60 text-accent px-3 py-1 rounded-full hover:bg-background/80 focus:outline-none"
        aria-label="Previous"
      >
        ‹
      </button>
      <button
        onClick={next}
        className="absolute right-3 top-1/2 -translate-y-1/2 bg-background/60 text-accent px-3 py-1 rounded-full hover:bg-background/80 focus:outline-none"
        aria-label="Next"
      >
        ›
      </button>
    </div>
  );
}
