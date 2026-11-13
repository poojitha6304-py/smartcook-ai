import { ChangeEvent, DragEvent, useRef, useState } from "react";
import {
  AlertCircle,
  ArrowRight,
  ImagePlus,
  Loader2,
  Plus,
  ScanSearch,
  Trash2,
  Upload,
} from "lucide-react";
import { SAMPLE_INGREDIENTS_IMAGE } from "../data/recipes";
import { DetectedIngredient, PageId } from "../types";
import { SafeImage } from "./SafeImage";

interface ScannerPageProps {
  previewImage: string | null;
  setPreviewImage: (img: string | null) => void;
  ingredients: DetectedIngredient[];
  setIngredients: (items: DetectedIngredient[]) => void;
  scanSummary: string;
  setScanSummary: (summary: string) => void;
  onNavigate: (page: PageId) => void;
}

const QUICK_STAPLES = [
  "Basmati Rice",
  "Toor Dal",
  "Chicken",
  "Paneer",
  "Spinach",
  "Baby Brinjals",
  "Potatoes",
  "Yogurt",
];

export function ScannerPage({
  previewImage,
  setPreviewImage,
  ingredients,
  setIngredients,
  scanSummary,
  setScanSummary,
  onNavigate,
}: ScannerPageProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [mimeType, setMimeType] = useState("image/jpeg");
  const [isDragging, setIsDragging] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newIngredientName, setNewIngredientName] = useState("");

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      setError("Please upload a valid image file (JPEG, PNG, or WebP).");
      return;
    }
    setError(null);
    setMimeType(file.type || "image/jpeg");
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setPreviewImage(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const loadSamplePhoto = async () => {
    setError(null);
    try {
      const response = await fetch(SAMPLE_INGREDIENTS_IMAGE);
      const blob = await response.blob();
      setMimeType(blob.type || "image/jpeg");
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          setPreviewImage(reader.result);
        }
      };
      reader.readAsDataURL(blob);
    } catch {
      setError("Unable to load sample photo. Please upload your own image.");
    }
  };

  const handleIdentify = async () => {
    if (!previewImage) {
      setError("Upload a kitchen ingredient photo before scanning.");
      return;
    }

    setIsScanning(true);
    setError(null);

    try {
      const res = await fetch("/api/identify-ingredients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageBase64: previewImage,
          mimeType,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to identify ingredients.");
      }

      const mapped: DetectedIngredient[] = (data.ingredients || []).map(
        (
          item: { name: string; category?: string; quantityNote?: string },
          idx: number
        ) => ({
          id: `${Date.now()}-${idx}`,
          name: item.name,
          category: item.category || "Ingredient",
          quantityNote: item.quantityNote,
        })
      );

      setIngredients(mapped);
      setScanSummary(
        data.summary ||
          "Ingredients identified. Edit or add pantry items below before finding matching recipes."
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong while analyzing the image."
      );
    } finally {
      setIsScanning(false);
    }
  };

  const handleUpdateName = (id: string, name: string) => {
    setIngredients(
      ingredients.map((item) => (item.id === id ? { ...item, name } : item))
    );
  };

  const handleRemove = (id: string) => {
    setIngredients(ingredients.filter((item) => item.id !== id));
  };

  const handleAddIngredient = (nameToAdd: string) => {
    const trimmed = nameToAdd.trim();
    if (!trimmed) return;
    const exists = ingredients.some(
      (item) => item.name.toLowerCase() === trimmed.toLowerCase()
    );
    if (exists) {
      setNewIngredientName("");
      return;
    }

    setIngredients([
      ...ingredients,
      {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        name: trimmed,
        category: "Pantry",
        quantityNote: "added manually",
      },
    ]);
    setNewIngredientName("");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      <div className="space-y-2 border-b border-[#133829]/10 pb-6">
        <h1 className="font-display text-3xl sm:text-4xl font-semibold text-[#133829]">
          Ingredient Scanner
        </h1>
        <p className="text-sm sm:text-base text-[#52615A] max-w-2xl">
          Upload a clear photo of vegetables, spices, dairy, or proteins in your
          kitchen. Our vision model extracts every visible ingredient so you can
          review, edit, and match regional Indian recipes.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Upload & Image Preview */}
        <div className="lg:col-span-6 space-y-4">
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            className={`rounded-2xl border-2 border-dashed transition-colors p-5 bg-white ${
              isDragging
                ? "border-[#D9531E] bg-[#FDF0E9]/50"
                : "border-[#133829]/20"
            }`}
          >
            {previewImage ? (
              <div className="space-y-4">
                <div className="aspect-4/3 w-full rounded-xl overflow-hidden bg-[#F3EDE2]">
                  <SafeImage
                    src={previewImage}
                    alt="Uploaded kitchen ingredients preview"
                    fallbackTitle="Ingredient Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold text-[#133829] bg-[#F3EDE2] hover:bg-[#E7DEC9] transition-colors cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    Replace Photo
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setPreviewImage(null);
                      setError(null);
                    }}
                    className="text-xs font-medium text-[#52615A] hover:text-[#133829] cursor-pointer"
                  >
                    Clear Image
                  </button>
                </div>
              </div>
            ) : (
              <div className="py-12 px-4 text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-[#F3EDE2] text-[#133829] flex items-center justify-center mx-auto">
                  <ImagePlus className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <p className="font-display text-lg font-semibold text-[#133829]">
                    Drop your ingredient photo here
                  </p>
                  <p className="text-xs text-[#52615A]">
                    Supports JPG, PNG, and WebP photos up to 12 MB
                  </p>
                </div>
                <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#133829] text-white text-sm font-semibold hover:bg-[#0D271C] transition-colors cursor-pointer"
                  >
                    <Upload className="w-4 h-4" />
                    Choose Image
                  </button>
                  <button
                    type="button"
                    onClick={loadSamplePhoto}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#F3EDE2] text-[#133829] text-sm font-semibold hover:bg-[#E8DFCD] transition-colors cursor-pointer"
                  >
                    Try Sample Kitchen Photo
                  </button>
                </div>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          {error && (
            <div
              role="alert"
              className="flex items-start gap-2.5 p-4 rounded-xl bg-red-50 border border-red-200 text-red-900 text-sm"
            >
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="button"
            onClick={handleIdentify}
            disabled={!previewImage || isScanning}
            className="w-full inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-[#D9531E] text-white text-sm font-semibold hover:bg-[#BF4312] disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            {isScanning ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Identifying Kitchen Ingredients...
              </>
            ) : (
              <>
                <ScanSearch className="w-4 h-4" />
                Identify Ingredients
              </>
            )}
          </button>
        </div>

        {/* Right Column: Editable Detected Ingredients */}
        <div className="lg:col-span-6 bg-white rounded-2xl border border-[#133829]/12 p-6 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2 className="font-display text-xl font-semibold text-[#133829]">
                Detected Ingredients
              </h2>
              <p className="text-xs text-[#52615A] mt-0.5">
                {scanSummary ||
                  "Edit detected names, remove false positives, or add pantry staples."}
              </p>
            </div>
            <span className="font-mono text-xs font-medium text-[#133829] tabular-nums">
              {ingredients.length} items
            </span>
          </div>

          {/* Add Manual Ingredient Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleAddIngredient(newIngredientName);
            }}
            className="flex gap-2"
          >
            <input
              type="text"
              value={newIngredientName}
              onChange={(e) => setNewIngredientName(e.target.value)}
              placeholder="Add an ingredient (e.g. Basmati Rice, Spinach)..."
              aria-label="Add an ingredient"
              className="flex-1 px-3.5 py-2.5 rounded-lg border border-[#133829]/20 bg-[#FBF8F3] text-sm text-[#17231D] placeholder:text-[#52615A]/70 focus:outline-none focus:border-[#D9531E]"
            />
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-[#133829] text-white text-sm font-semibold hover:bg-[#0D271C] transition-colors shrink-0 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Add
            </button>
          </form>

          {/* Interactive Staple Quick-Add Buttons */}
          <div className="space-y-2">
            <p className="text-xs font-medium text-[#52615A]">
              Quick-add common staples:
            </p>
            <div className="flex flex-wrap gap-2">
              {QUICK_STAPLES.map((staple) => (
                <button
                  key={staple}
                  type="button"
                  onClick={() => handleAddIngredient(staple)}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium bg-[#F3EDE2] text-[#133829] hover:bg-[#E6DEC8] transition-colors cursor-pointer"
                >
                  + {staple}
                </button>
              ))}
            </div>
          </div>

          <hr className="border-[#133829]/10" />

          {/* Editable Ingredient Rows */}
          {ingredients.length === 0 ? (
            <div className="py-10 text-center space-y-2">
              <p className="text-sm font-medium text-[#133829]">
                No ingredients listed yet
              </p>
              <p className="text-xs text-[#52615A] max-w-sm mx-auto">
                Upload a photo and click &ldquo;Identify Ingredients&rdquo;, or
                add items manually above to start matching Indian recipes.
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-[#133829]/10 max-h-[360px] overflow-y-auto pr-1">
              {ingredients.map((item) => (
                <li
                  key={item.id}
                  className="py-2.5 flex items-center justify-between gap-3"
                >
                  <div className="flex-1 min-w-0">
                    <input
                      type="text"
                      value={item.name}
                      onChange={(e) =>
                        handleUpdateName(item.id, e.target.value)
                      }
                      aria-label={`Edit ingredient ${item.name}`}
                      className="w-full px-2.5 py-1.5 rounded-md border border-transparent hover:border-[#133829]/15 focus:border-[#D9531E] focus:bg-[#FBF8F3] text-sm font-medium text-[#17231D] focus:outline-none"
                    />
                    <div className="px-2.5 flex items-center gap-2 text-xs text-[#52615A]">
                      <span>{item.category}</span>
                      {item.quantityNote && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span>{item.quantityNote}</span>
                        </>
                      )}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemove(item.id)}
                    aria-label={`Remove ${item.name}`}
                    className="p-2 rounded-lg text-[#52615A] hover:text-red-700 hover:bg-red-50 transition-colors cursor-pointer shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </li>
              ))}
            </ul>
          )}

          {ingredients.length > 0 && (
            <div className="pt-2">
              <button
                type="button"
                onClick={() => onNavigate("recommendations")}
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#133829] text-white text-sm font-semibold hover:bg-[#0D271C] transition-colors cursor-pointer"
              >
                Find Matching Recipes
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
