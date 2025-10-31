"use client";

export default function StatsSection() {
  const stats = [
    { value: "92%", label: "Satisfaction" },
    { value: "25+", label: "Dentists" },
    { value: "12+", label: "Treatments" },
    { value: "5+", label: "Branches" },
  ];

  return (
    <section className="py-16 bg-background text-accent">
      <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
        {stats.map((s) => (
          <div key={s.label} className="space-y-2">
            <p className="text-4xl font-extrabold">{s.value}</p>
            <p className="text-sm uppercase tracking-wider text-white/80">{s.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
