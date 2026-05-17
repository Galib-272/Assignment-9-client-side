"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function Banner() {
  const slides = [
    {
      title: "Empower Your Startup Journey",
      description: "Securely store, refine, and co-create your disruptive business concepts in a shared space designed for true innovators.",
      image: "/s1.png"
    },
    {
      title: "Validate Before You Build",
      description: "Gather structural feedback and collaborate with domain experts to shape raw formulas into market-ready ventures.",
      image: "/s2.png"
    },
    {
      title: "Discover Next-Gen Innovations",
      description: "Explore breaking ideas across AI, Tech, and Education. See what the ecosystem is working on and find your synergy.",
      image: "/s3.png"
    }
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const slideInterval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(slideInterval);
  }, [slides.length]);

  return (
    <div className="relative w-full h-[500px] bg-gray-950 overflow-hidden text-white shadow-md">
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 w-full h-full flex items-center justify-center transition-opacity duration-1000 ease-in-out ${
            index === currentSlide ? "opacity-100 z-20" : "opacity-0 z-10"
          }`}
        >
          <img
            src={slide.image}
            alt={slide.title}
            className="absolute inset-0 w-full h-full object-cover"
          />
          
          <div className="absolute inset-0 bg-black/60" />

          <div className="relative max-w-4xl px-6 text-center mx-auto">
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-black tracking-tight mb-4 text-white">
              {slide.title}
            </h1>
            <p className="max-w-2xl text-base md:text-lg text-gray-200 mb-8 mx-auto font-light">
              {slide.description}
            </p>
            <Link
              href="/ideas"
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-8 py-3 rounded-md transition duration-300 shadow-lg transform active:scale-95 inline-block"
            >
              Explore Ideas
            </Link>
          </div>
        </div>
      ))}

      <div className="absolute bottom-6 left-0 right-0 flex justify-center space-x-3 z-30">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 focus:outline-none ${
              currentSlide === index ? "bg-white w-8" : "bg-white/40"
            }`}
          />
        ))}
      </div>
    </div>
  );
}