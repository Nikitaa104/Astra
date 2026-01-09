
import { GoogleGenAI } from "@google/genai";

// ✅ Vite-compatible env access
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

// ✅ Create client only if key exists
let ai: GoogleGenAI | null = null;

if (apiKey) {
  ai = new GoogleGenAI({ apiKey });
} else {
  console.warn("⚠️ Gemini API key missing. Running in demo mode.");
}

// ---------------- SAFETY ADVICE ----------------
export const getSafetyAdvice = async (locationContext: string) => {
  if (!ai) {
    return "Stay in well-lit areas, keep your phone accessible, and trust your intuition.";
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Provide 3 concise, highly actionable safety tips for a woman in this context: ${locationContext}. Focus on awareness and immediate actions. Keep it empathetic but serious.`,
    });

    return (
      response.text ??
      "Stay in well-lit areas, keep your phone accessible, and trust your intuition."
    );
  } catch (error) {
    console.error("Gemini failed:", error);
    return "Stay in well-lit areas, keep your phone accessible, and trust your intuition.";
  }
};

// ---------------- SITUATION ANALYSIS ----------------
export const analyzeSituationForEmergencyContacts = async (
  transcriptionSnippet: string
) => {
  if (!ai) {
    return "Situation analysis unavailable. Proceed with emergency protocol.";
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Based on this snippet of background audio during an SOS alert: "${transcriptionSnippet}", summarize the potential danger level and situational context for emergency contacts. Be direct and objective.`,
    });

    return (
      response.text ??
      "Situation analysis unavailable. Proceed with emergency protocol."
    );
  } catch (error) {
    console.error("Gemini analysis failed:", error);
    return "Situation analysis unavailable. Proceed with emergency protocol.";
  }
};

// ---------------- CROWD DENSITY ----------------
export const analyzeCrowdDensity = async (signals: {
  audioDesc: string;
  btDeviceCount: number;
  motionIntensity: string;
}) => {
  if (!ai) {
    return { density: "UNKNOWN", reasoning: "AI unavailable (demo mode)." };
  }

  try {
    const prompt = `Analyze environmental signals to estimate crowd density for an SOS safety event.
Signals:
- Ambient Sound: ${signals.audioDesc}
- Bluetooth Proximity Devices: ${signals.btDeviceCount}
- Motion Profile: ${signals.motionIntensity}

Rules:
1. Density must be one of: LOW, MEDIUM, HIGH.
2. Do not identify individuals.
3. Provide 1-sentence reasoning.

Return JSON: { "density": "LOW|MEDIUM|HIGH", "reasoning": "string" }`;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    return JSON.parse(
      response.text ||
        '{"density":"UNKNOWN","reasoning":"Signal processing error"}'
    );
  } catch (error) {
    console.error("Crowd analysis failed:", error);
    return { density: "UNKNOWN", reasoning: "Signal processing error" };
  }
};
