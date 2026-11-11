import type { GeneratorSource } from "./types";

export type LlmProvider = Exclude<GeneratorSource, "fallback">;

export const LLM_TIMEOUT_MS = 6000;

export function extractJsonObject(text: string): unknown {
  const cleaned = text
    .trim()
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```\s*$/i, "")
    .trim();
  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");
  if (start === -1 || end === -1 || end <= start) {
    throw new Error("Upstream LLM did not return a JSON object");
  }
  return JSON.parse(cleaned.slice(start, end + 1));
}

export function resolveProvider(): LlmProvider | null {
  const preferred = process.env.VENJIX_LLM_PROVIDER?.toLowerCase();
  const hasGemini = Boolean(process.env.GEMINI_API_KEY?.trim());
  const hasMistral = Boolean(process.env.MISTRAL_API_KEY?.trim());
  const hasOpenAI = Boolean(process.env.OPENAI_API_KEY?.trim());

  if (preferred === "gemini" && hasGemini) return "gemini";
  if (preferred === "mistral" && hasMistral) return "mistral";
  if (preferred === "openai" && hasOpenAI) return "openai";

  if (hasGemini) return "gemini";
  if (hasMistral) return "mistral";
  if (hasOpenAI) return "openai";
  return null;
}

export async function callUpstreamJsonLlm(
  provider: LlmProvider,
  systemPrompt: string,
  userPrompt: string,
  timeoutMs: number = LLM_TIMEOUT_MS
): Promise<unknown> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    if (provider === "gemini") {
      const apiKey = process.env.GEMINI_API_KEY?.trim();
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${encodeURIComponent(
          apiKey ?? ""
        )}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          signal: controller.signal,
          body: JSON.stringify({
            systemInstruction: { parts: [{ text: systemPrompt }] },
            contents: [{ role: "user", parts: [{ text: userPrompt }] }],
            generationConfig: {
              temperature: 0.85,
              responseMimeType: "application/json",
            },
          }),
        }
      );

      if (!res.ok) {
        throw new Error(`Gemini upstream failed with status ${res.status}`);
      }
      const data = (await res.json()) as {
        candidates?: Array<{
          content?: { parts?: Array<{ text?: string }> };
        }>;
      };
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
      return extractJsonObject(text);
    }

    const isMistral = provider === "mistral";
    const endpoint = isMistral
      ? "https://api.mistral.ai/v1/chat/completions"
      : "https://api.openai.com/v1/chat/completions";
    const apiKey = isMistral
      ? process.env.MISTRAL_API_KEY?.trim()
      : process.env.OPENAI_API_KEY?.trim();
    const model = isMistral ? "mistral-small-latest" : "gpt-4o-mini";

    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey ?? ""}`,
      },
      signal: controller.signal,
      body: JSON.stringify({
        model,
        temperature: 0.85,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
      }),
    });

    if (!res.ok) {
      throw new Error(`${provider} upstream failed with status ${res.status}`);
    }

    const data = (await res.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    const text = data.choices?.[0]?.message?.content ?? "";
    return extractJsonObject(text);
  } finally {
    clearTimeout(timeout);
  }
}

