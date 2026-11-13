import { useMemo, useState } from "react";
import {
  AlertCircle,
  ArrowRight,
  Camera,
  ChefHat,
  Loader2,
  SlidersHorizontal,
} from "lucide-react";
import {
  HERO_IMAGE,
  RECIPES,
  REGION_IMAGES,
  matchRecipesToIngredients,
} from "../data/recipes";
import {
  DetectedIngredient,
  DietType,
  MatchedRecipe,
  PageId,
  Recipe,
  Region,
} from "../types";
import { SafeImage } from "./SafeImage";

interface RecommendationsPageProps {
  ingredients: DetectedIngredient[];
  customRecipes: Recipe[];
  onAddCustomRecipe: (recipe: Recipe) => void;
  onSelectRecipe: (recipe: MatchedRecipe) => void;
  onNavigate: (page: PageId) => void;
}

export function RecommendationsPage({
  ingredients,
  customRecipes,
  onAddCustomRecipe,
  onSelectRecipe,
  onNavigate,
}: RecommendationsPageProps) {
  const [dietFilter, setDietFilter] = useState<"All" | DietType>("All");
  const [isGenerating, setIsGenerating] = useState(false);
  const [genError, setGenError] = useState<string | null>(null);

  const ingredientNames = useMemo(
    () => ingredients.map((i) => i.name.trim()).filter(Boolean),
    [ingredients]
  );

  const matchedRecipes = useMemo(() => {
    const combined = [...customRecipes, ...RECIPES];
    const matched = matchRecipesToIngredients(combined, ingredientNames);
    return dietFilter === "All"
      ? matched
      : matched.filter((r) => r.diet === dietFilter);
  }, [customRecipes, ingredientNames, dietFilter]);

  const handleGenerateCustom = async () => {
    if (ingredientNames.length === 0) return;
    setIsGenerating(true);
    setGenError(null);

    try {
      const res = await fetch("/api/custom-recipe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ingredients: ingredientNames,
          diet: dietFilter,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Unable to generate custom recipe.");
      }

      const raw = data.recipe;
      const validRegion: Region =
        raw.region === "South Indian" ||
        raw.region === "North Indian" ||
        raw.region === "Andhra" ||
        raw.region === "Telangana"
          ? raw.region
          : "South Indian";

      const newRecipe: Recipe = {
        id: `custom-${Date.now()}`,
        title: raw.title || "Chef's Pantry Special",
        region: validRegion,
        diet:
          raw.diet === "Non-Vegetarian" ? "Non-Vegetarian" : "Vegetarian",
        cookingTime: raw.cookingTime || "30 mins",
        cookingMinutes: parseInt(raw.cookingTime, 10) || 30,
        difficulty:
          raw.difficulty === "Hard" || raw.difficulty === "Medium"
            ? raw.difficulty
            : "Easy",
        servings: 3,
        image: REGION_IMAGES[validRegion] || HERO_IMAGE,
        description:
          raw.description ||
          "Custom regional Indian dish tailored to your detected kitchen ingredients.",
        requiredIngredients: Array.isArray(raw.requiredIngredients)
          ? raw.requiredIngredients
          : ingredientNames,
        instructions: Array.isArray(raw.instructions)
          ? raw.instructions
          : [],
        isCustomAI: true,
      };

      onAddCustomRecipe(newRecipe);
    } catch (err) {
      setGenError(
        err instanceof Error ? err.message : "Failed to generate custom recipe."
      );
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-[#133829]/10 pb-6">
        <div className="space-y-2">
          <h1 className="font-display text-3xl sm:text-4xl font-semibold text-[#133829]">
            Recipe Recommendations
          </h1>
          <p className="text-sm sm:text-base text-[#52615A] max-w-2xl">
            Indian recipes ranked by how closely they match the ingredients
            currently in your kitchen, showing missing pantry items and full
            cooking instructions.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => onNavigate("scanner")}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-white border border-[#133829]/20 text-sm font-semibold text-[#133829] hover:bg-[#F3EDE2] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <SlidersHorizontal className="w-4 h-4" />
            Edit Ingredients
          </button>

          {ingredientNames.length > 0 && (
            <button
              type="button"
              onClick={handleGenerateCustom}
              disabled={isGenerating}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#D9531E] text-white text-sm font-semibold hover:bg-[#BF4312] disabled:opacity-60 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Crafting Recipe...
                </>
              ) : (
                <>
                  <ChefHat className="w-4 h-4" />
                  Craft Custom AI Recipe
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Active Ingredients Strip & Diet Filter */}
      <div className="bg-white rounded-2xl border border-[#133829]/10 p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="space-y-1">
          <p className="text-xs font-semibold text-[#133829]">
            Active Kitchen Ingredients ({ingredientNames.length})
          </p>
          {ingredientNames.length > 0 ? (
            <p className="text-sm text-[#52615A]">
              {ingredientNames.join(" · ")}
            </p>
          ) : (
            <p className="text-sm text-[#52615A]">
              No ingredients scanned yet. Upload a photo in the Scanner to see
              live match percentages.
            </p>
          )}
        </div>

        <div
          role="group"
          aria-label="Dietary preference filter"
          className="flex items-center gap-1 p-1 bg-[#F3EDE2] rounded-xl shrink-0 self-start lg:self-center"
        >
          {(["All", "Vegetarian", "Non-Vegetarian"] as const).map((diet) => (
            <button
              key={diet}
              type="button"
              onClick={() => setDietFilter(diet)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                dietFilter === diet
                  ? "bg-white text-[#133829] shadow-xs"
                  : "text-[#52615A] hover:text-[#133829]"
              }`}
            >
              {diet}
            </button>
          ))}
        </div>
      </div>

      {genError && (
        <div
          role="alert"
          className="flex items-start gap-2.5 p-4 rounded-xl bg-red-50 border border-red-200 text-red-900 text-sm"
        >
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
          <span>{genError}</span>
        </div>
      )}

      {ingredientNames.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#133829]/10 p-10 text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-[#F3EDE2] text-[#133829] flex items-center justify-center mx-auto">
            <Camera className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h2 className="font-display text-2xl font-semibold text-[#133829]">
              Scan Your Ingredients First
            </h2>
            <p className="text-sm text-[#52615A] max-w-md mx-auto">
              Once you scan a kitchen photo or add staples in the Ingredient
              Scanner, every recipe below will show an exact match score and
              missing items.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate("scanner")}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#D9531E] text-white text-sm font-semibold hover:bg-[#BF4312] transition-colors cursor-pointer"
          >
            Go to Ingredient Scanner
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      ) : null}

      {/* Matched Recipe Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {matchedRecipes.map((recipe) => (
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
              <div className="space-y-3">
                {/* Unboxed metadata strip */}
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
                  {recipe.isCustomAI ? " (Custom)" : ""}
                </h2>

                {/* Match Percentage Bar */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono font-semibold text-[#D9531E] tabular-nums">
                      {recipe.matchPercentage}% match
                    </span>
                    <span className="text-[#52615A] tabular-nums">
                      {recipe.matchedIngredients.length} of{" "}
                      {recipe.requiredIngredients.length} ingredients
                    </span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-[#F3EDE2] overflow-hidden">
                    <div
                      className="h-full bg-[#133829] rounded-full transition-all duration-200"
                      style={{ width: `${recipe.matchPercentage}%` }}
                    />
                  </div>
                </div>

                {/* Required / Missing Summary */}
                <div className="space-y-1 text-xs">
                  <p className="text-[#17231D] line-clamp-1">
                    <span className="font-semibold text-[#133829]">
                      Required:
                    </span>{" "}
                    {recipe.requiredIngredients.join(", ")}
                  </p>
                  <p className="text-[#52615A] line-clamp-2">
                    <span className="font-semibold text-[#D9531E]">
                      Missing ({recipe.missingIngredients.length}):
                    </span>{" "}
                    {recipe.missingIngredients.length === 0
                      ? "None — ready to cook"
                      : recipe.missingIngredients.join(", ")}
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-[#133829]/8 flex items-center justify-between text-xs font-semibold text-[#133829]">
                <span>View Full Recipe &amp; Instructions</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#D9531E]" />
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
