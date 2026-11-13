import { useState } from "react";
import { Navbar } from "./components/Navbar";
import { HomePage } from "./components/HomePage";
import { ScannerPage } from "./components/ScannerPage";
import { RecommendationsPage } from "./components/RecommendationsPage";
import { ChatbotPage } from "./components/ChatbotPage";
import { ExplorerPage } from "./components/ExplorerPage";
import { AboutPage } from "./components/AboutPage";
import { RecipeDetailModal } from "./components/RecipeDetailModal";
import {
  ChatMessage,
  DetectedIngredient,
  MatchedRecipe,
  PageId,
  Recipe,
} from "./types";

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageId>("home");
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [ingredients, setIngredients] = useState<DetectedIngredient[]>([]);
  const [scanSummary, setScanSummary] = useState("");
  const [customRecipes, setCustomRecipes] = useState<Recipe[]>([]);
  const [selectedRecipe, setSelectedRecipe] = useState<
    Recipe | MatchedRecipe | null
  >(null);
  const [chatActiveRecipe, setChatActiveRecipe] = useState<Recipe | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);

  const handleNavigate = (page: PageId) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleAskChef = (recipe: Recipe) => {
    setChatActiveRecipe(recipe);
    handleNavigate("chatbot");
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FBF8F3] text-[#17231D]">
      <Navbar currentPage={currentPage} onNavigate={handleNavigate} />

      <main className="flex-1">
        {currentPage === "home" && (
          <HomePage
            onNavigate={handleNavigate}
            onSelectRecipe={(r) => setSelectedRecipe(r)}
          />
        )}

        {currentPage === "scanner" && (
          <ScannerPage
            previewImage={previewImage}
            setPreviewImage={setPreviewImage}
            ingredients={ingredients}
            setIngredients={setIngredients}
            scanSummary={scanSummary}
            setScanSummary={setScanSummary}
            onNavigate={handleNavigate}
          />
        )}

        {currentPage === "recommendations" && (
          <RecommendationsPage
            ingredients={ingredients}
            customRecipes={customRecipes}
            onAddCustomRecipe={(r) => setCustomRecipes((prev) => [r, ...prev])}
            onSelectRecipe={(r) => setSelectedRecipe(r)}
            onNavigate={handleNavigate}
          />
        )}

        {currentPage === "chatbot" && (
          <ChatbotPage
            ingredients={ingredients}
            activeRecipe={chatActiveRecipe}
            onClearActiveRecipe={() => setChatActiveRecipe(null)}
            messages={chatMessages}
            setMessages={setChatMessages}
          />
        )}

        {currentPage === "explorer" && (
          <ExplorerPage onSelectRecipe={(r) => setSelectedRecipe(r)} />
        )}

        {currentPage === "about" && <AboutPage onNavigate={handleNavigate} />}
      </main>

      <footer className="border-t border-[#133829]/10 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#52615A]">
          <div className="flex items-center gap-3">
            <span className="font-display text-sm font-semibold text-[#133829]">
              SmartCook AI
            </span>
            <span aria-hidden="true">·</span>
            <span>Vision-Based Indian Recipe &amp; Ingredient System</span>
          </div>

          <div className="flex flex-wrap items-center gap-5">
            <button
              type="button"
              onClick={() => handleNavigate("scanner")}
              className="hover:text-[#133829] transition-colors cursor-pointer"
            >
              Ingredient Scanner
            </button>
            <button
              type="button"
              onClick={() => handleNavigate("explorer")}
              className="hover:text-[#133829] transition-colors cursor-pointer"
            >
              Recipe Explorer
            </button>
            <button
              type="button"
              onClick={() => handleNavigate("chatbot")}
              className="hover:text-[#133829] transition-colors cursor-pointer"
            >
              Chef Chat
            </button>
            <button
              type="button"
              onClick={() => handleNavigate("about")}
              className="hover:text-[#133829] transition-colors cursor-pointer"
            >
              About
            </button>
          </div>
        </div>
      </footer>

      <RecipeDetailModal
        recipe={selectedRecipe}
        onClose={() => setSelectedRecipe(null)}
        onAskChef={handleAskChef}
      />
    </div>
  );
}
