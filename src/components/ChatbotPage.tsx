import { FormEvent, useEffect, useRef, useState } from "react";
import { AlertCircle, Loader2, Send, Trash2 } from "lucide-react";
import { ChatMessage, DetectedIngredient, Recipe } from "../types";

interface ChatbotPageProps {
  ingredients: DetectedIngredient[];
  activeRecipe: Recipe | null;
  onClearActiveRecipe: () => void;
  messages: ChatMessage[];
  setMessages: (msgs: ChatMessage[]) => void;
}

const SUGGESTED_QUESTIONS = [
  "What can I substitute for heavy cream in Paneer Butter Masala?",
  "How do I get a crisp golden Masala Dosa without sticking?",
  "Give me an authentic South Indian tadka tempering guide.",
  "How can I tone down excess chili heat in an Andhra curry?",
  "Suggest a 25-minute vegetarian dinner with tomatoes, onions, and paneer.",
];

function renderFormattedText(text: string) {
  const lines = text.split("\n");
  return lines.map((line, i) => {
    const clean = line.replace(/\*\*(.*?)\*\*/g, "$1");
    if (!clean.trim()) {
      return <div key={i} className="h-2" />;
    }
    return (
      <p key={i} className="leading-relaxed">
        {clean}
      </p>
    );
  });
}

export function ChatbotPage({
  ingredients,
  activeRecipe,
  onClearActiveRecipe,
  messages,
  setMessages,
}: ChatbotPageProps) {
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isSending]);

  const sendMessage = async (textToSend: string) => {
    const trimmed = textToSend.trim();
    if (!trimmed || isSending) return;

    setError(null);
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      text: trimmed,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    const nextHistory = [...messages, userMessage];
    setMessages(nextHistory);
    setInput("");
    setIsSending(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: trimmed,
          history: messages.map((m) => ({ role: m.role, text: m.text })),
          ingredients: ingredients.map((i) => i.name),
          activeRecipe: activeRecipe
            ? {
                title: activeRecipe.title,
                region: activeRecipe.region,
                ingredients: activeRecipe.requiredIngredients,
              }
            : null,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to get response from Chef AI.");
      }

      const aiMessage: ChatMessage = {
        id: `model-${Date.now()}`,
        role: "model",
        text: data.reply,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      setMessages([...nextHistory, aiMessage]);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to connect to the cooking assistant."
      );
    } finally {
      setIsSending(false);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-[#133829]/10 pb-5">
        <div className="space-y-1.5">
          <h1 className="font-display text-3xl sm:text-4xl font-semibold text-[#133829]">
            AI Cooking Assistant
          </h1>
          <p className="text-sm sm:text-base text-[#52615A]">
            Ask for regional spice ratios, ingredient substitutions, tempering
            techniques, or step-by-step recipe coaching.
          </p>
        </div>

        {messages.length > 0 && (
          <button
            type="button"
            onClick={() => {
              setMessages([]);
              setError(null);
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold text-[#52615A] hover:text-[#133829] hover:bg-[#F3EDE2] transition-colors cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Clear Chat
          </button>
        )}
      </div>

      {/* Active Context Banner */}
      {(ingredients.length > 0 || activeRecipe) && (
        <div className="bg-white rounded-xl border border-[#133829]/10 px-4 py-3 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="space-y-0.5">
            {activeRecipe && (
              <p className="text-[#133829]">
                <span className="font-semibold">Discussing Recipe:</span>{" "}
                {activeRecipe.title} ({activeRecipe.region})
              </p>
            )}
            {ingredients.length > 0 && (
              <p className="text-[#52615A]">
                <span className="font-semibold text-[#133829]">
                  Kitchen Pantry:
                </span>{" "}
                {ingredients.map((i) => i.name).join(", ")}
              </p>
            )}
          </div>
          {activeRecipe && (
            <button
              type="button"
              onClick={onClearActiveRecipe}
              className="text-xs font-medium text-[#D9531E] hover:underline cursor-pointer"
            >
              Clear recipe focus
            </button>
          )}
        </div>
      )}

      {/* Chat Workspace */}
      <div className="bg-white rounded-2xl border border-[#133829]/12 flex flex-col min-h-[480px] max-h-[65vh]">
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">
          {messages.length === 0 ? (
            <div className="space-y-6 py-4">
              <div className="space-y-1.5">
                <h2 className="font-display text-xl font-semibold text-[#133829]">
                  How can I help in your kitchen today?
                </h2>
                <p className="text-sm text-[#52615A]">
                  Choose a common culinary question below or type your own.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {SUGGESTED_QUESTIONS.map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => sendMessage(q)}
                    className="text-left p-3.5 rounded-xl bg-[#FBF8F3] border border-[#133829]/12 hover:border-[#D9531E] hover:bg-[#FDF0E9]/40 text-sm text-[#17231D] transition-colors cursor-pointer"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${
                  msg.role === "user" ? "items-end" : "items-start"
                }`}
              >
                <div
                  className={`max-w-[85%] sm:max-w-[78%] rounded-2xl px-4 py-3 text-sm space-y-1.5 ${
                    msg.role === "user"
                      ? "bg-[#133829] text-white"
                      : "bg-[#FBF8F3] border border-[#133829]/10 text-[#17231D]"
                  }`}
                >
                  {renderFormattedText(msg.text)}
                </div>
                <span className="mt-1 px-1 text-[11px] font-mono text-[#52615A] tabular-nums">
                  {msg.role === "user" ? "You" : "SmartCook Chef"} ·{" "}
                  {msg.timestamp}
                </span>
              </div>
            ))
          )}

          {isSending && (
            <div className="flex items-start">
              <div className="px-4 py-3 rounded-2xl bg-[#FBF8F3] border border-[#133829]/10 text-sm text-[#52615A] inline-flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-[#D9531E]" />
                Preparing culinary guidance...
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {error && (
          <div
            role="alert"
            className="mx-5 mb-3 flex items-start gap-2 p-3 rounded-xl bg-red-50 border border-red-200 text-red-900 text-xs"
          >
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Quick Suggestions Row when conversation active */}
        {messages.length > 0 && (
          <div className="px-5 py-2 border-t border-[#133829]/8 flex items-center gap-2 overflow-x-auto">
            {SUGGESTED_QUESTIONS.slice(0, 3).map((q) => (
              <button
                key={q}
                type="button"
                onClick={() => sendMessage(q)}
                disabled={isSending}
                className="px-3 py-1.5 rounded-lg bg-[#F3EDE2] text-xs font-medium text-[#133829] hover:bg-[#E7DEC9] whitespace-nowrap shrink-0 transition-colors cursor-pointer"
              >
                {q}
              </button>
            ))}
          </div>
        )}

        {/* Input Form */}
        <form
          onSubmit={handleSubmit}
          className="p-4 border-t border-[#133829]/10 flex items-center gap-3"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about cooking steps, spice swaps, or regional dishes..."
            aria-label="Ask the AI cooking assistant"
            className="flex-1 px-4 py-3 rounded-xl border border-[#133829]/20 bg-[#FBF8F3] text-sm text-[#17231D] placeholder:text-[#52615A]/70 focus:outline-none focus:border-[#D9531E]"
          />
          <button
            type="submit"
            disabled={!input.trim() || isSending}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#D9531E] text-white text-sm font-semibold hover:bg-[#BF4312] disabled:opacity-50 disabled:cursor-not-allowed transition-colors shrink-0 cursor-pointer"
          >
            <span>Send</span>
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
