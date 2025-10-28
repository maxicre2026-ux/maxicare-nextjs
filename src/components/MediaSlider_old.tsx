"use client";
import { useState } from "react";
import Image from "next/image";

export type MediaItem = {
  src: string;
  type?: "image" | "video"; // default image
  alt?: string;
};

interface SliderProps {
  items: MediaItem[];
}
  items: MediaItem[];
  interval?: number; // ms
}

export default function MediaSlider({ items, interval }: SliderProps) {
  const [index, setIndex] = useState(0);

  const next = () => setIndex((prev) => (prev + 1) % items.length);
  const prev = () => setIndex((prev) => (prev - 1 + items.length) % items.length);

  useEffect(() => {
    let id: number;
    if (interval) {
      id = window.setInterval(() => {
        setIndex((prev) => (prev + 1) % items.length);
      }, interval);
    }
    return () => {
      if (id) clearInterval(id);
    };
  }, [items.length, interval]);

  const item = items[index];

  return (
    <div className="w-full h-80 md:h-full relative overflow-hidden rounded-lg">
      {item.type === "video" ? (
        <video
          src={item.src}
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay
          muted
          loop
        />
      ) : (
        <Image
          src={item.src}
          alt={item.alt || "slide"}
          fill
          className="absolute inset-0 object-cover"
        />
      )}
      {/* Controls */}
      <button
        onClick={prev}
        className="absolute left-2 top-1/2 -translate-y-1/2 bg-background/60 text-accent px-2 py-1 rounded-full hover:bg-background/80"
      >
        &#8249;
      </button>
      <button
        onClick={next}
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-background/60 text-accent px-2 py-1 rounded-full hover:bg-background/80"
      >
        &#8250;
      </button>
    </div>
  );
}
