"use client";

export default function StorySection() {
  return (
    <section className="py-16 px-4 flex justify-center">
      <div className="bg-neutral-900/60 border border-accent/30 rounded-lg max-w-3xl w-full p-8 space-y-6 text-center">
        <h3 className="text-2xl font-bold text-accent">The Story of MAXICARE</h3>
        <p className="text-white/80 leading-relaxed text-sm md:text-base">
          Since our founding, MaxiCare has been committed to providing comprehensive dental
          solutions under one roof — from routine check-ups to advanced restorative procedures.
          Our in-house lab and multi-disciplinary team ensure precision, speed, and the highest
          standard of patient care.
        </p>
      </div>
    </section>
  );
}
