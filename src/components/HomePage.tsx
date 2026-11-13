import { ArrowRight, Camera, Compass } from "lucide-react";
import { motion } from "motion/react";
import { HERO_IMAGE, RECIPES } from "../data/recipes";
import { PageId, Recipe } from "../types";
import { SafeImage } from "./SafeImage";

interface HomePageProps {
  onNavigate: (page: PageId) => void;
  onSelectRecipe: (recipe: Recipe) => void;
}

const CAPABILITIES = [
  {
    index: "01.",
    title: "Visual Pantry Scan",
    detail:
      "Snap or upload a photo of vegetables, spices, and staples on your counter.",
  },
  {
    index: "02.",
    title: "Match Scoring",
    detail:
      "Rank authentic recipes by percentage match and see missing items upfront.",
  },
  {
    index: "03.",
    title: "Regional Cuisines",
    detail:
      "Browse South Indian, North Indian, Andhra, and Telangana vegetarian & non-veg dishes.",
  },
  {
    index: "04.",
    title: "Guided Chef Chat",
    detail:
      "Ask for ingredient substitutions, tempering steps, and spice balance adjustments.",
  },
];

export function HomePage({ onNavigate, onSelectRecipe }: HomePageProps) {
  const featuredRecipes = [RECIPES[0], RECIPES[2], RECIPES[3]];

  return (
    <div className="space-y-16 pb-20">
      {/* Split Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="lg:col-span-6 flex flex-col justify-center space-y-6 py-2"
          >
            <p className="text-sm font-medium text-[#D9531E]">
              Vision-Based Indian Culinary Assistant
            </p>

            <h1 className="font-display text-4xl sm:text-5xl lg:text-[3.5rem] font-semibold leading-[1.08] tracking-tight text-[#133829] text-balance">
              What&apos;s in Your Kitchen Today?
            </h1>

            <p className="text-base sm:text-lg text-[#52615A] leading-relaxed max-w-xl">
              Upload a photo of your fresh produce, herbs, and pantry staples.
              SmartCook AI identifies every ingredient through computer vision,
              ranks regional Indian recipes you can cook right now, and guides
              you step by step.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                type="button"
                onClick={() => onNavigate("scanner")}
                className="inline-flex items-center gap-2.5 px-6 py-3 rounded-xl bg-[#D9531E] text-white text-sm font-semibold hover:bg-[#BF4312] transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D9531E]"
              >
                <Camera className="w-4 h-4" />
                Upload Ingredients
              </button>

              <button
                type="button"
                onClick={() => onNavigate("explorer")}
                className="inline-flex items-center gap-2.5 px-6 py-3 rounded-xl bg-white text-[#133829] border border-[#133829]/25 text-sm font-semibold hover:bg-[#F3EDE2] transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#133829]"
              >
                <Compass className="w-4 h-4" />
                Explore Indian Recipes
              </button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.99 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.25 }}
            className="lg:col-span-6"
          >
            <div className="h-full min-h-[280px] sm:min-h-[380px] rounded-2xl overflow-hidden border border-[#133829]/12 bg-[#F3EDE2]">
              <SafeImage
                src={HERO_IMAGE}
                alt="Traditional Indian meal spread with butter masala, crispy dosa, basmati rice, naan, and fresh curry leaves"
                fallbackTitle="SmartCook AI Culinary Spread"
                className="w-full h-full lg:h-full object-cover"
              />
            </div>
          </motion.div>
        </div>

        {/* Full-Width 4-Column Capability Strip Below Hero */}
        <div className="mt-12 pt-8 border-t border-[#133829]/12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {CAPABILITIES.map((cap) => (
            <div key={cap.index} className="space-y-1.5">
              <p className="font-mono text-xs font-medium text-[#D9531E]">
                {cap.index}
              </p>
              <h2 className="font-display text-lg font-semibold text-[#133829]">
                {cap.title}
              </h2>
              <p className="text-sm text-[#52615A] leading-relaxed">
                {cap.detail}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Regional Recipes Preview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-4 border-b border-[#133829]/10 pb-4">
          <div className="space-y-1">
            <h2 className="font-display text-2xl sm:text-3xl font-semibold text-[#133829]">
              Curated Regional Classics
            </h2>
            <p className="text-sm text-[#52615A]">
              Explore authentic dishes from North India, South India, Andhra,
              and Telangana.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate("explorer")}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#D9531E] hover:text-[#BF4312] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Browse all recipes
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredRecipes.map((recipe) => (
            <article
              key={recipe.id}
              onClick={() => onSelectRecipe(recipe)}
              className="group bg-white rounded-2xl border border-[#133829]/10 overflow-hidden transition-transform duration-150 hover:-translate-y-0.5 cursor-pointer flex flex-col"
            >
              <div className="aspect-4/3 w-full overflow-hidden bg-[#F3EDE2]">
                <SafeImage
                  src={recipe.image}
                  alt={recipe.title}
                  fallbackTitle={recipe.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                />
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs text-[#52615A]">
                    <span className="font-medium text-[#133829]">
                      {recipe.region}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className="tabular-nums">{recipe.cookingTime}</span>
                    <span aria-hidden="true">·</span>
                    <span>{recipe.diet}</span>
                  </div>

                  <h3 className="font-display text-xl font-semibold text-[#133829]">
                    {recipe.title}
                  </h3>
                  <p className="text-sm text-[#52615A] line-clamp-2 leading-relaxed">
                    {recipe.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-[#133829]/8 flex items-center justify-between text-xs font-semibold text-[#D9531E]">
                  <span>View Preparation Steps</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
