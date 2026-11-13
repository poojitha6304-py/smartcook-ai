import "dotenv/config";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT) || 3000;

function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
    throw new Error(
      "GEMINI_API_KEY is not configured. Please add your Gemini API key in Settings > Secrets."
    );
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

const PRIMARY_MODEL = "gemini-4-hydrogen";
const FALLBACK_MODEL = "gemini-3.1-flash-lite";

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function getErrorStatus(err: unknown): number | undefined {
  if (typeof err === "object" && err !== null) {
    const record = err as { status?: unknown; code?: unknown };
    if (typeof record.status === "number") return record.status;
    if (typeof record.code === "number") return record.code;
  }
  return undefined;
}

function isHighDemand503Error(err: unknown): boolean {
  if (getErrorStatus(err) === 503) return true;
  const msg = (err instanceof Error ? err.message : String(err)).toLowerCase();
  return (
    msg.includes("503") ||
    msg.includes("unavailable") ||
    msg.includes("high demand") ||
    msg.includes("overloaded")
  );
}

function isRetryableError(err: unknown): boolean {
  if (isHighDemand503Error(err)) return true;
  const status = getErrorStatus(err);
  if (status === 429 || status === 500 || status === 502 || status === 504) {
    return true;
  }
  const msg = (err instanceof Error ? err.message : String(err)).toLowerCase();
  return (
    msg.includes("econnreset") ||
    msg.includes("etimedout") ||
    msg.includes("fetch failed") ||
    msg.includes("network")
  );
}

async function callGeminiWithRetry<T>(
  operation: (model: string) => Promise<T>
): Promise<T> {
  const retryDelaysMs = [600, 1400, 2600];
  let lastError: unknown;

  for (let attempt = 0; attempt <= retryDelaysMs.length; attempt++) {
    try {
      return await operation(PRIMARY_MODEL);
    } catch (err) {
      lastError = err;
      if (!isRetryableError(err) || attempt === retryDelaysMs.length) {
        break;
      }
      const jitter = Math.floor(Math.random() * 250);
      const waitMs = retryDelaysMs[attempt] + jitter;
      console.warn(
        `[Gemini] ${PRIMARY_MODEL} transient error (attempt ${attempt + 1}/${
          retryDelaysMs.length + 1
        }); retrying in ${waitMs}ms.`
      );
      await sleep(waitMs);
    }
  }

  if (isHighDemand503Error(lastError)) {
    console.warn(
      `[Gemini] ${PRIMARY_MODEL} returned 503 high-demand after retries; falling back to ${FALLBACK_MODEL}.`
    );
    const fallbackDelaysMs = [600];
    for (let attempt = 0; attempt <= fallbackDelaysMs.length; attempt++) {
      try {
        return await operation(FALLBACK_MODEL);
      } catch (fallbackErr) {
        lastError = fallbackErr;
        if (!isRetryableError(fallbackErr) || attempt === fallbackDelaysMs.length) {
          throw fallbackErr;
        }
        await sleep(fallbackDelaysMs[attempt]);
      }
    }
  }

  throw lastError;
}

function formatGeminiError(err: unknown): { status: number; message: string } {
  const rawMessage = err instanceof Error ? err.message : String(err);
  if (rawMessage.includes("GEMINI_API_KEY")) {
    return { status: 500, message: rawMessage };
  }
  if (isHighDemand503Error(err)) {
    return {
      status: 503,
      message:
        "Gemini AI is currently experiencing high demand. Please try again in a few moments.",
    };
  }
  if (rawMessage.includes("403") || rawMessage.includes("PERMISSION_DENIED")) {
    return {
      status: 403,
      message:
        "Gemini API access denied. Please verify your API key in Settings > Secrets.",
    };
  }
  if (rawMessage.includes("400") || rawMessage.includes("API_KEY_INVALID")) {
    return {
      status: 400,
      message:
        "Invalid Gemini API request or key. Please check Settings > Secrets or try a clearer image.",
    };
  }
  if (rawMessage.includes("429") || rawMessage.includes("RESOURCE_EXHAUSTED")) {
    return {
      status: 429,
      message:
        "Rate limit reached on the Gemini API. Please wait a few seconds and try again.",
    };
  }
  return {
    status: 500,
    message: rawMessage || "Unexpected error communicating with Gemini AI.",
  };
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: "15mb" }));

  // Vision-based ingredient identification
  app.post("/api/identify-ingredients", async (req, res) => {
    try {
      const { imageBase64, mimeType } = req.body as {
        imageBase64?: string;
        mimeType?: string;
      };

      if (!imageBase64) {
        res.status(400).json({ error: "No image data provided." });
        return;
      }

      const cleanBase64 = imageBase64.includes(",")
        ? imageBase64.split(",")[1]
        : imageBase64;
      const resolvedMime = mimeType || "image/jpeg";

      const ai = getGeminiClient();

      const response = await callGeminiWithRetry((model) =>
        ai.models.generateContent({
          model,
          contents: {
            parts: [
              {
                inlineData: {
                  mimeType: resolvedMime,
                  data: cleanBase64,
                },
              },
              {
                text:
                  "Inspect this kitchen photo carefully and list every visible cooking ingredient, vegetable, herb, spice, dairy, grain, lentil, or protein. Use clean, standard culinary ingredient names common in Indian cooking (for example: 'Tomatoes', 'Red Onions', 'Green Chilies', 'Fresh Coriander', 'Curry Leaves', 'Paneer', 'Ginger', 'Garlic', 'Turmeric Powder'). Only list ingredients you can actually see.",
              },
            ],
          },
          config: {
            systemInstruction:
              "You are an expert Indian culinary computer-vision assistant. Identify visible kitchen ingredients accurately without hallucinating unseen items.",
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                ingredients: {
                  type: Type.ARRAY,
                  description: "List of detected culinary ingredients in the image.",
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      name: {
                        type: Type.STRING,
                        description: "Standardized ingredient name in Title Case.",
                      },
                      category: {
                        type: Type.STRING,
                        description:
                          "One of: Vegetable, Herb, Spice, Dairy, Protein, Grain & Lentil, Pantry.",
                      },
                      quantityNote: {
                        type: Type.STRING,
                        description:
                          "Brief visual observation such as 'fresh whole' or 'cubed in bowl'.",
                      },
                    },
                    required: ["name", "category", "quantityNote"],
                  },
                },
                summary: {
                  type: Type.STRING,
                  description:
                    "A concise 1-sentence summary of the culinary potential of these ingredients.",
                },
              },
              required: ["ingredients", "summary"],
            },
          },
        })
      );

      const parsed = JSON.parse((response.text ?? "{}").trim());
      res.json({
        ingredients: Array.isArray(parsed.ingredients) ? parsed.ingredients : [],
        summary:
          parsed.summary ||
          "Ingredients identified and ready for Indian recipe matching.",
      });
    } catch (err) {
      const formatted = formatGeminiError(err);
      res.status(formatted.status).json({ error: formatted.message });
    }
  });

  // Custom AI recipe generation from user's pantry list
  app.post("/api/custom-recipe", async (req, res) => {
    try {
      const { ingredients, preferredRegion, diet } = req.body as {
        ingredients?: string[];
        preferredRegion?: string;
        diet?: string;
      };

      if (!ingredients || ingredients.length === 0) {
        res
          .status(400)
          .json({ error: "Please provide at least one ingredient." });
        return;
      }

      const ai = getGeminiClient();

      const prompt = `Create an authentic Indian recipe using primarily these available ingredients: ${ingredients.join(", ")}. ${
        preferredRegion && preferredRegion !== "All"
          ? `Style it after ${preferredRegion} cuisine.`
          : "Choose the best-suited regional style from South Indian, North Indian, Andhra, or Telangana."
      } ${
        diet && diet !== "All" ? `The dish must be strictly ${diet}.` : ""
      } Keep standard pantry spices minimal and clearly listed.`;

      const response = await callGeminiWithRetry((model) =>
        ai.models.generateContent({
          model,
          contents: prompt,
          config: {
            systemInstruction:
              "You are an acclaimed Indian home-style chef. Craft practical, authentic recipes tailored to the user's available ingredients.",
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                region: {
                  type: Type.STRING,
                  description:
                    "Must be one of: South Indian, North Indian, Andhra, Telangana",
                },
                diet: {
                  type: Type.STRING,
                  description: "Must be Vegetarian or Non-Vegetarian",
                },
                cookingTime: {
                  type: Type.STRING,
                  description: "e.g. '30 mins'",
                },
                difficulty: {
                  type: Type.STRING,
                  description: "Easy, Medium, or Hard",
                },
                description: { type: Type.STRING },
                requiredIngredients: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
                instructions: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
              },
              required: [
                "title",
                "region",
                "diet",
                "cookingTime",
                "difficulty",
                "description",
                "requiredIngredients",
                "instructions",
              ],
            },
          },
        })
      );

      const recipe = JSON.parse((response.text ?? "{}").trim());
      res.json({ recipe });
    } catch (err) {
      const formatted = formatGeminiError(err);
      res.status(formatted.status).json({ error: formatted.message });
    }
  });

  // Interactive AI Cooking Chatbot
  app.post("/api/chat", async (req, res) => {
    try {
      const { message, history, ingredients, activeRecipe } = req.body as {
        message?: string;
        history?: Array<{ role: "user" | "model"; text: string }>;
        ingredients?: string[];
        activeRecipe?: {
          title: string;
          region: string;
          ingredients: string[];
        } | null;
      };

      if (!message || !message.trim()) {
        res.status(400).json({ error: "Message cannot be empty." });
        return;
      }

      const ai = getGeminiClient();

      const contextParts: string[] = [
        "You are SmartCook AI's resident Indian culinary expert specializing in South Indian, North Indian, Andhra, and Telangana cooking.",
        "Give clear, practical, warm, and well-structured cooking advice: step-by-step guidance, exact spice proportions, tadka/tempering tips, and ingredient substitutions.",
        "Keep answers concise, scannable with short numbered steps or bullet points when giving instructions, and free of filler.",
      ];

      if (ingredients && ingredients.length > 0) {
        contextParts.push(
          `The user currently has these ingredients in their kitchen: ${ingredients.join(", ")}. Reference them naturally when helpful.`
        );
      }

      if (activeRecipe) {
        contextParts.push(
          `The user is currently viewing the recipe "${activeRecipe.title}" (${activeRecipe.region} cuisine) which uses: ${activeRecipe.ingredients.join(", ")}.`
        );
      }

      const formattedHistory = (history || []).slice(-10).map((turn) => ({
        role: turn.role,
        parts: [{ text: turn.text }],
      }));

      const result = await callGeminiWithRetry((model) => {
        const chat = ai.chats.create({
          model,
          history: formattedHistory,
          config: {
            systemInstruction: contextParts.join("\n"),
          },
        });
        return chat.sendMessage({ message: message.trim() });
      });
      res.json({
        reply:
          result.text ||
          "I couldn't generate a cooking tip right now. Please try rephrasing your question.",
      });
    } catch (err) {
      const formatted = formatGeminiError(err);
      res.status(formatted.status).json({ error: formatted.message });
    }
  });

  // Vite dev middleware or static production build
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`SmartCook AI server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
