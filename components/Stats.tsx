"use client";
import React, { useEffect, useRef, useState } from "react";

const stats = [
  { value: 70, label: "Crazy\nDigital Marketers" },
  { value: 223, label: "Happy\nGlobal Clients" },
  { value: 8, label: "Beautiful\nYears of Experience" },
  { value: 6, label: "Astonishing\nIn-House AI Products" },
  { value: 5, label: "Stunning\nWorldwide Offices" },
  { value: 10, label: "Applaudable\nAwards" },
];

const Stats: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [animatedValues, setAnimatedValues] = useState(stats.map(() => 0));
  const [inView, setInView] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0); // for mobile slider

  // Detect when section is in view
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          setAnimatedValues(stats.map(() => 0));
        } else {
          setInView(false);
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  // Animate numbers (desktop only)
  useEffect(() => {
    if (!inView || window.innerWidth < 768) return;

    stats.forEach((stat, index) => {
      let start = 0;
      const steps = 60;
      const increment = Math.ceil(stat.value / steps);
      const duration = 1500 / steps;

      const interval = setInterval(() => {
        start += increment;
        if (start >= stat.value) {
          start = stat.value;
          clearInterval(interval);
        }
        setAnimatedValues((prev) => {
          const updated = [...prev];
          updated[index] = start;
          return updated;
        });
      }, duration);
    });
  }, [inView]);

  // Mobile auto-slide logic
  useEffect(() => {
    if (window.innerWidth >= 768) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % stats.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      ref={sectionRef}
      className="relative bg-cover bg-center bg-no-repeat py-12"
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div className="relative z-10 max-w-7xl mx-auto px-4">
        {/* Desktop View */}
        <div className="hidden md:flex justify-between text-center text-white">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="w-1/6 p-4 flex flex-col items-center backdrop-blur-sm"
            >
              <h2 className="text-4xl font-extrabold text-[var(--primary-color)]">
                {animatedValues[index]}+
              </h2>
              <p className="whitespace-pre-line text-xs font-medium text-gray-200 uppercase mt-2">
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        {/* Mobile View (custom slider) */}
        <div className="md:hidden mt-4 overflow-hidden">
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {stats.map((stat, index) => (
              <div
                key={index}
                className="min-w-full flex flex-col items-center justify-center px-6 text-center"
              >
                <div className="bg-white/10 backdrop-blur-md shadow-md rounded-xl p-6 w-72 mx-auto text-white">
                  <h2 className="text-3xl font-bold text-[var(--primary-color)]">
                    {stat.value}+
                  </h2>
                  <p className="mt-2 text-sm font-medium text-gray-100 uppercase whitespace-pre-line">
                    {stat.label}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Dots */}
          <div className="flex justify-center mt-3 gap-2">
            {stats.map((_, idx) => (
              <span
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`h-2 w-2 rounded-full cursor-pointer transition-all ${
                  idx === currentIndex
                    ? "bg-[var(--primary-color)]"
                    : "bg-gray-400"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Stats;
