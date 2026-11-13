import { ArrowRight } from "lucide-react";
import { PageId } from "../types";

interface AboutPageProps {
  onNavigate: (page: PageId) => void;
}

const OBJECTIVES = [
  {
    index: "01.",
    title: "Reduce Kitchen Food Waste",
    description:
      "Turn leftover vegetables, herbs, and pantry staples into complete regional meals without extra grocery trips.",
  },
  {
    index: "02.",
    title: "Accurate Vision Recognition",
    description:
      "Identify fresh produce, spices, dairy, and proteins from everyday kitchen photographs with editable verification.",
  },
  {
    index: "03.",
    title: "Celebrate Regional Indian Cuisines",
    description:
      "Highlight authentic dishes across South Indian, North Indian, Andhra, and Telangana cooking traditions.",
  },
  {
    index: "04.",
    title: "Interactive Culinary Guidance",
    description:
      "Provide instant substitutions, tempering techniques, and spice-balancing advice through an AI cooking assistant.",
  },
];

const TECH_STACK = [
  {
    name: "React 19 & TypeScript",
    role: "Modular, type-safe single-page frontend with responsive layout architecture.",
  },
  {
    name: "Tailwind CSS v4",
    role: "Custom culinary design system built around cream, saffron-orange, dark green, and white.",
  },
  {
    name: "Node.js & Express",
    role: "Full-stack API server handling image payloads, recipe synthesis, and secure model routing.",
  },
  {
    name: "Google Gemini AI Vision & Chat",
    role: "Multimodal ingredient recognition using structured JSON schemas and conversational culinary coaching.",
  },
];

export function AboutPage({ onNavigate }: AboutPageProps) {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12">
      {/* Project Description */}
      <section className="space-y-4 border-b border-[#133829]/10 pb-8">
        <p className="text-sm font-medium text-[#D9531E]">
          About the Platform
        </p>
        <h1 className="font-display text-3xl sm:text-4xl font-semibold text-[#133829]">
          Vision-Based Ingredient Recognition &amp; Indian Recipe Recommendation
          System
        </h1>
        <p className="text-base text-[#52615A] leading-relaxed">
          SmartCook AI bridges computer vision and regional Indian home cooking.
          Instead of searching manually through endless recipe blogs, home cooks
          simply photograph the ingredients on their counter. The system detects
          available produce and spices, scores authentic South Indian, North
          Indian, Andhra, and Telangana recipes by ingredient match percentage,
          and pairs every dish with an interactive AI cooking assistant.
        </p>
      </section>

      {/* Project Objectives */}
      <section className="space-y-6">
        <h2 className="font-display text-2xl font-semibold text-[#133829]">
          Project Objectives
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {OBJECTIVES.map((obj) => (
            <div
              key={obj.index}
              className="bg-white rounded-2xl border border-[#133829]/10 p-6 space-y-2"
            >
              <p className="font-mono text-xs font-medium text-[#D9531E]">
                {obj.index}
              </p>
              <h3 className="font-display text-lg font-semibold text-[#133829]">
                {obj.title}
              </h3>
              <p className="text-sm text-[#52615A] leading-relaxed">
                {obj.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Technologies Used */}
      <section className="space-y-6">
        <h2 className="font-display text-2xl font-semibold text-[#133829]">
          Technologies Used
        </h2>
        <div className="bg-white rounded-2xl border border-[#133829]/10 divide-y divide-[#133829]/10">
          {TECH_STACK.map((tech) => (
            <div
              key={tech.name}
              className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
            >
              <h3 className="font-display text-base font-semibold text-[#133829] sm:w-64 shrink-0">
                {tech.name}
              </h3>
              <p className="text-sm text-[#52615A] flex-1">{tech.role}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Direct Action */}
      <section className="bg-[#133829] text-white rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <h2 className="font-display text-2xl font-semibold">
            Ready to scan your kitchen?
          </h2>
          <p className="text-sm text-white/80">
            Upload a photo or test our sample pantry layout in seconds.
          </p>
        </div>
        <button
          type="button"
          onClick={() => onNavigate("scanner")}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#D9531E] text-white text-sm font-semibold hover:bg-[#BF4312] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
        >
          Open Ingredient Scanner
          <ArrowRight className="w-4 h-4" />
        </button>
      </section>
    </div>
  );
}
