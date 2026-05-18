"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FaLightbulb, FaShieldHalved, FaUsersViewfinder } from "react-icons/fa6";
import TrendingIdeas from "../components/TrendingIdeas";

export default function Home() {
  useEffect(() => {
    document.title = "IdeaVault | Home";
  }, []);

  return (
    <div className="w-full bg-white dark:bg-gray-900 transition-colors duration-300">
      <Banner />

      <TrendingIdeas />

      <section className="bg-gray-50 dark:bg-gray-950 py-16 border-t border-b border-gray-100 dark:border-gray-800 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              The Validation Workflow
            </h2>
            <p className="mt-3 max-w-2xl mx-auto text-base text-gray-500 dark:text-gray-400 font-light">
              Three simple, tactical checkpoints designed to transform speculative ideas into market-tested ventures without using default alerts.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-8 rounded-xl shadow-sm text-center flex flex-col items-center transition-all duration-300 ease-out hover:scale-105 hover:-translate-y-3 hover:shadow-[0_20px_40px_rgba(99,102,241,0.15)] dark:hover:shadow-[0_20px_40px_rgba(99,102,241,0.3)] hover:border-indigo-500/50 dark:hover:border-indigo-400/50 group cursor-pointer">
              <div className="mb-4 p-3 bg-indigo-50 dark:bg-indigo-950/40 rounded-lg transition-all duration-300 group-hover:bg-indigo-600 group-hover:text-white group-hover:scale-110 group-hover:shadow-md">
                <FaLightbulb className="w-8 h-8 text-indigo-600 dark:text-indigo-400 group-hover:text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 tracking-tight transition-colors duration-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                1. Deposit Your Concept
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 font-light leading-relaxed">
                Log your structural startup idea into our encrypted ecosystem repository using category parameters.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-8 rounded-xl shadow-sm text-center flex flex-col items-center transition-all duration-300 ease-out hover:scale-105 hover:-translate-y-3 hover:shadow-[0_20px_40px_rgba(99,102,241,0.15)] dark:hover:shadow-[0_20px_40px_rgba(99,102,241,0.3)] hover:border-indigo-500/50 dark:hover:border-indigo-400/50 group cursor-pointer">
              <div className="mb-4 p-3 bg-indigo-50 dark:bg-indigo-950/40 rounded-lg transition-all duration-300 group-hover:bg-indigo-600 group-hover:text-white group-hover:scale-110 group-hover:shadow-md">
                <FaShieldHalved className="w-8 h-8 text-indigo-600 dark:text-indigo-400 group-hover:text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 tracking-tight transition-colors duration-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                2. Gather Peer Validation
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 font-light leading-relaxed">
                Receive descriptive feedback text, validation indicators, and target profile match criteria.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-8 rounded-xl shadow-sm text-center flex flex-col items-center transition-all duration-300 ease-out hover:scale-105 hover:-translate-y-3 hover:shadow-[0_20px_40px_rgba(99,102,241,0.15)] dark:hover:shadow-[0_20px_40px_rgba(99,102,241,0.3)] hover:border-indigo-500/50 dark:hover:border-indigo-400/50 group cursor-pointer">
              <div className="mb-4 p-3 bg-indigo-50 dark:bg-indigo-950/40 rounded-lg transition-all duration-300 group-hover:bg-indigo-600 group-hover:text-white group-hover:scale-110 group-hover:shadow-md">
                <FaUsersViewfinder className="w-8 h-8 text-indigo-600 dark:text-indigo-400 group-hover:text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 tracking-tight transition-colors duration-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                3. Build Your Synergy
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 font-light leading-relaxed">
                Connect with verified co-founders, development leads, or angels matching your specific sector filters.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white dark:bg-gray-900 py-16 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-indigo-900 dark:bg-indigo-950/60 rounded-2xl py-12 px-6 sm:px-12 text-center text-white relative overflow-hidden shadow-xl">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-indigo-500/20 via-transparent to-transparent opacity-50" />
            
            <div className="relative z-10 max-w-3xl mx-auto mb-10">
              <h2 className="text-3xl font-black tracking-tight mb-2">
                Our Growing Ecosystem
              </h2>
              <p className="text-indigo-200 font-light text-sm md:text-base">
                Real-time metrics tracking global sharing activity, user collaboration networks, and platform engagement scores.
              </p>
            </div>

            <div className="relative z-10 grid grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="flex flex-col items-center">
                <span className="text-4xl md:text-5xl font-black tracking-tight mb-1 text-white">1,420+</span>
                <span className="text-xs md:text-sm text-indigo-200 font-light uppercase tracking-wider">Validated Concepts</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-4xl md:text-5xl font-black tracking-tight mb-1 text-white">42,000+</span>
                <span className="text-xs md:text-sm text-indigo-200 font-light uppercase tracking-wider">Comments Logged</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-4xl md:text-5xl font-black tracking-tight mb-1 text-white">89%</span>
                <span className="text-xs md:text-sm text-indigo-200 font-light uppercase tracking-wider">Synergy Rate</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-4xl md:text-5xl font-black tracking-tight mb-1 text-white">12,000+</span>
                <span className="text-xs md:text-sm text-indigo-200 font-light uppercase tracking-wider">Global Innovators</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function Banner() {
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