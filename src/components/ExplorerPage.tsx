import { useMemo, useState } from "react";
import { ArrowRight, Search } from "lucide-react";
import { RECIPES } from "../data/recipes";
import { DietType, Recipe, Region } from "../types";
import { SafeImage } from "./SafeImage";

interface ExplorerPageProps {
  onSelectRecipe: (recipe: Recipe) => void;
}

const REGIONS: Array<"All Regions" | Region> = [
  "All Regions",
  "South Indian",
  "North Indian",
  "Andhra",
  "Telangana",
];

const DIETS: Array<"All" | DietType> = [
  "All",
  "Vegetarian",
  "Non-Vegetarian",
];

export function ExplorerPage({ onSelectRecipe }: ExplorerPageProps) {
  const [selectedRegion, setSelectedRegion] = useState<
    "All Regions" | Region
  >("All Regions");
  const [selectedDiet, setSelectedDiet] = useState<"All" | DietType>("All");
  const [query, setQuery] = useState("");

  const filteredRecipes = useMemo(() => {
    const q = query.trim().toLowerCase();
    return RECIPES.filter((recipe) => {
      const matchesRegion =
        selectedRegion === "All Regions" || recipe.region === selectedRegion;
      const matchesDiet =
        selectedDiet === "All" || recipe.diet === selectedDiet;
      const matchesQuery =
        !q ||
        recipe.title.toLowerCase().includes(q) ||
        recipe.description.toLowerCase().includes(q) ||
        recipe.requiredIngredients.some((ing) =>
          ing.toLowerCase().includes(q)
        );
      return matchesRegion && matchesDiet && matchesQuery;
    });
  }, [selectedRegion, selectedDiet, query]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      <div className="space-y-2 border-b border-[#133829]/10 pb-6">
        <h1 className="font-display text-3xl sm:text-4xl font-semibold text-[#133829]">
          Indian Recipe Explorer
        </h1>
        <p className="text-sm sm:text-base text-[#52615A] max-w-2xl">
          Discover regional specialties across South Indian, North Indian,
          Andhra, and Telangana kitchens with vegetarian and non-vegetarian
          filters.
        </p>
      </div>

      {/* Filter Controls */}
      <div className="bg-white rounded-2xl border border-[#133829]/10 p-4 sm:p-5 space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Region Tabs */}
          <div
            role="group"
            aria-label="Filter by Indian region"
            className="flex flex-wrap items-center gap-1.5 p-1 bg-[#F3EDE2] rounded-xl"
          >
            {REGIONS.map((region) => (
              <button
                key={region}
                type="button"
                onClick={() => setSelectedRegion(region)}
                className={`px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  selectedRegion === region
                    ? "bg-[#133829] text-white"
                    : "text-[#52615A] hover:text-[#133829]"
                }`}
              >
                {region}
              </button>
            ))}
          </div>

          {/* Diet Filter */}
          <div
            role="group"
            aria-label="Filter by dietary type"
            className="flex items-center gap-1.5 p-1 bg-[#F3EDE2] rounded-xl self-start lg:self-auto"
          >
            {DIETS.map((diet) => (
              <button
                key={diet}
                type="button"
                onClick={() => setSelectedDiet(diet)}
                className={`px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  selectedDiet === diet
                    ? "bg-white text-[#133829] shadow-xs"
                    : "text-[#52615A] hover:text-[#133829]"
                }`}
              >
                {diet}
              </button>
            ))}
          </div>
        </div>

        {/* Search Input + Result Count */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-[#52615A] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search dishes or ingredients (e.g. Biryani, Paneer, Tamarind)..."
              aria-label="Search Indian recipes"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#133829]/15 bg-[#FBF8F3] text-sm text-[#17231D] placeholder:text-[#52615A]/70 focus:outline-none focus:border-[#D9531E]"
            />
          </div>
          <p className="text-xs font-mono text-[#52615A] tabular-nums">
            Showing {filteredRecipes.length} of {RECIPES.length} recipes
          </p>
        </div>
      </div>

      {/* Recipe Grid */}
      {filteredRecipes.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#133829]/10 p-12 text-center space-y-3">
          <p className="font-display text-xl font-semibold text-[#133829]">
            No recipes match your current filters
          </p>
          <p className="text-sm text-[#52615A]">
            Try clearing your search term or selecting &ldquo;All Regions&rdquo;.
          </p>
          <button
            type="button"
            onClick={() => {
              setSelectedRegion("All Regions");
              setSelectedDiet("All");
              setQuery("");
            }}
            className="px-4 py-2 rounded-lg bg-[#133829] text-white text-xs font-semibold hover:bg-[#0D271C] transition-colors cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRecipes.map((recipe) => (
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
                  <div className="flex flex-wrap items-center gap-2 text-xs text-[#52615A]">
                    <span className="font-semibold text-[#133829]">
                      {recipe.region}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>{recipe.diet}</span>
                    <span aria-hidden="true">·</span>
                    <span className="tabular-nums">{recipe.cookingTime}</span>
                    <span aria-hidden="true">·</span>
                    <span>{recipe.difficulty}</span>
                  </div>

                  <h2 className="font-display text-xl font-semibold text-[#133829]">
                    {recipe.title}
                  </h2>

                  <p className="text-sm text-[#52615A] line-clamp-2 leading-relaxed">
                    {recipe.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#133829]/8 flex items-center justify-between text-xs font-semibold text-[#D9531E]">
                  <span className="tabular-nums">
                    {recipe.requiredIngredients.length} ingredients
                  </span>
                  <span className="inline-flex items-center gap-1">
                    Open Recipe
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
