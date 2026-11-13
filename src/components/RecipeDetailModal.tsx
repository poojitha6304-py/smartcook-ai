import { useEffect } from "react";
import { Check, MessageSquare, Minus, X } from "lucide-react";
import { MatchedRecipe, Recipe } from "../types";
import { SafeImage } from "./SafeImage";

interface RecipeDetailModalProps {
  recipe: Recipe | MatchedRecipe | null;
  onClose: () => void;
  onAskChef: (recipe: Recipe) => void;
}

function isMatchedRecipe(
  recipe: Recipe | MatchedRecipe
): recipe is MatchedRecipe {
  return "matchPercentage" in recipe;
}

export function RecipeDetailModal({
  recipe,
  onClose,
  onAskChef,
}: RecipeDetailModalProps) {
  useEffect(() => {
    if (!recipe) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [recipe, onClose]);

  if (!recipe) return null;

  const matched = isMatchedRecipe(recipe) ? recipe : null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#0D271C]/65 backdrop-blur-xs"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="recipe-modal-title"
    >
      <div
        className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl border border-[#133829]/15 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close recipe details"
          className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-white/95 text-[#133829] border border-[#133829]/15 hover:bg-[#F3EDE2] transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="aspect-video w-full overflow-hidden bg-[#F3EDE2]">
          <SafeImage
            src={recipe.image}
            alt={recipe.title}
            fallbackTitle={recipe.title}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="p-6 sm:p-8 space-y-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-[#52615A]">
              <span className="text-[#133829] font-semibold">
                {recipe.region}
              </span>
              <span aria-hidden="true">·</span>
              <span>{recipe.diet}</span>
              <span aria-hidden="true">·</span>
              <span className="tabular-nums">{recipe.cookingTime}</span>
              <span aria-hidden="true">·</span>
              <span>{recipe.difficulty}</span>
              <span aria-hidden="true">·</span>
              <span className="tabular-nums">Serves {recipe.servings}</span>
              {matched && (
                <>
                  <span aria-hidden="true">·</span>
                  <span className="font-mono text-[#D9531E] font-semibold tabular-nums">
                    {matched.matchPercentage}% match
                  </span>
                </>
              )}
            </div>

            <h2
              id="recipe-modal-title"
              className="font-display text-2xl sm:text-3xl font-semibold text-[#133829]"
            >
              {recipe.title}
            </h2>
            <p className="text-sm sm:text-base text-[#52615A] leading-relaxed">
              {recipe.description}
            </p>
          </div>

          <hr className="border-[#133829]/10" />

          {/* Ingredients Breakdown */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-lg font-semibold text-[#133829]">
                Required Ingredients
              </h3>
              {matched && (
                <span className="text-xs font-mono text-[#52615A] tabular-nums">
                  {matched.matchedIngredients.length} available /{" "}
                  {matched.missingIngredients.length} missing
                </span>
              )}
            </div>

            {matched ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-[#133829]">
                    In Your Kitchen ({matched.matchedIngredients.length})
                  </p>
                  {matched.matchedIngredients.length === 0 ? (
                    <p className="text-sm text-[#52615A]">
                      No matching pantry items yet.
                    </p>
                  ) : (
                    <ul className="space-y-1.5">
                      {matched.matchedIngredients.map((ing) => (
                        <li
                          key={ing}
                          className="flex items-center gap-2 text-sm text-[#17231D]"
                        >
                          <Check className="w-4 h-4 text-[#1E4D3A] shrink-0" />
                          <span>{ing}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className="space-y-2">
                  <p className="text-xs font-semibold text-[#D9531E]">
                    Missing Ingredients ({matched.missingIngredients.length})
                  </p>
                  {matched.missingIngredients.length === 0 ? (
                    <p className="text-sm text-[#1E4D3A]">
                      You have every ingredient needed.
                    </p>
                  ) : (
                    <ul className="space-y-1.5">
                      {matched.missingIngredients.map((ing) => (
                        <li
                          key={ing}
                          className="flex items-center gap-2 text-sm text-[#52615A]"
                        >
                          <Minus className="w-4 h-4 text-[#D9531E] shrink-0" />
                          <span>{ing}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            ) : (
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {recipe.requiredIngredients.map((ing) => (
                  <li
                    key={ing}
                    className="flex items-center gap-2 text-sm text-[#17231D]"
                  >
                    <Check className="w-4 h-4 text-[#1E4D3A] shrink-0" />
                    <span>{ing}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <hr className="border-[#133829]/10" />

          {/* Preparation Instructions */}
          <div className="space-y-3">
            <h3 className="font-display text-lg font-semibold text-[#133829]">
              Preparation Instructions
            </h3>
            <ol className="space-y-3">
              {recipe.instructions.map((step, index) => (
                <li key={index} className="flex gap-3.5 text-sm sm:text-base">
                  <span className="font-mono text-xs font-medium text-[#D9531E] pt-1 tabular-nums shrink-0">
                    {String(index + 1).padStart(2, "0")}.
                  </span>
                  <p className="text-[#17231D] leading-relaxed">{step}</p>
                </li>
              ))}
            </ol>
          </div>

          <div className="pt-2 flex flex-wrap items-center justify-between gap-4 border-t border-[#133829]/10">
            <p className="text-xs text-[#52615A]">
              Need ingredient swaps or spice adjustments?
            </p>
            <button
              type="button"
              onClick={() => {
                onClose();
                onAskChef(recipe);
              }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#133829] text-white text-sm font-semibold hover:bg-[#0D271C] transition-colors cursor-pointer"
            >
              <MessageSquare className="w-4 h-4" />
              Ask Chef AI About This Dish
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
