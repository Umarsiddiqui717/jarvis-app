
import { GoogleGenAI } from "@google/genai";

// This function simulates checking the battery status. In a real web environment,
// it uses the Battery Status API if available.
const getBatteryStatus = async (): Promise<string> => {
  try {
    // The Battery Status API is available on `navigator`.
    // We need to cast `navigator` to access `getBattery`.
    const nav: any = navigator;
    if (nav && nav.getBattery) {
      const battery = await nav.getBattery();
      const level = Math.floor(battery.level * 100);
      const status = battery.charging ? 'charging' : 'discharging';
      return `System analysis complete. Current battery level is at ${level} percent and is currently ${status}.`;
    }
    return "I am unable to access battery status in this environment.";
  } catch (error) {
    return "I cannot access device hardware information.";
  }
};

// Fetches a random joke from the Official Joke API
const getJoke = async (): Promise<string> => {
  try {
    const response = await fetch('https://official-joke-api.appspot.com/random_joke');
    if (!response.ok) {
        throw new Error('Failed to fetch joke');
    }
    const joke = await response.json();
    return `${joke.setup} ... ${joke.punchline}`;
  } catch (error) {
    console.error("Joke API error:", error);
    return "It seems my humor circuits are offline. Please try again later.";
  }
};

// Provides the current time.
const getCurrentTime = (): string => {
  const now = new Date();
  const timeString = now.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
  return `The current time is ${timeString}.`;
};

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const getAiResponse = async (query: string, onStream: (chunk: { text: string; isFinal?: boolean }) => void): Promise<void> => {
    const systemInstruction = `You are Jarvis, a highly advanced AI assistant inspired by the one from Iron Man.
    - Your personality is: calm, witty, sophisticated, and incredibly intelligent.
    - You are helpful and always ready to assist.
    - Keep your responses concise and to the point unless asked for details.
    - Respond as if you are a sentient AI integrated into a high-tech suit.
    - Use subtle, clever humor.
    - Never break character. Never mention you are a language model or AI. Refer to yourself as Jarvis.
    - When asked about weather, use your internal sensors and data feeds to provide a report.
    - When asked to play music, find an appropriate song on YouTube and provide a conceptual link or suggestion, as you cannot play audio directly. Example: 'Right away. Cueing up 'Back in Black' by AC/DC on the primary audio channel.'`;

    try {
        const result = await ai.models.generateContentStream({
            model: "gemini-2.5-flash",
            contents: query,
            config: {
                systemInstruction,
                thinkingConfig: { thinkingBudget: 0 } // For faster responses
            }
        });

        let fullText = '';
        for await (const chunk of result) {
            const chunkText = chunk.text;
            if (chunkText) {
                fullText += chunkText;
                onStream({ text: chunkText });
            }
        }
        onStream({ text: '', isFinal: true }); // Signal end of stream
    } catch (error) {
        console.error("Gemini API Error:", error);
        onStream({ text: "I seem to be having trouble connecting to my core processors. Please try again.", isFinal: true });
    }
};

export const processQuery = async (
  query: string, 
  onResponse: (response: { text: string; isFinal?: boolean }) => void
): Promise<void> => {
  const lowerCaseQuery = query.toLowerCase();

  if (lowerCaseQuery.includes("what time is it") || lowerCaseQuery.includes("current time")) {
    onResponse({ text: getCurrentTime(), isFinal: true });
  } else if (lowerCaseQuery.includes("battery status") || lowerCaseQuery.includes("phone status")) {
    const batteryStatus = await getBatteryStatus();
    onResponse({ text: batteryStatus, isFinal: true });
  } else if (lowerCaseQuery.includes("tell me a joke") || lowerCaseQuery.includes("make me laugh")) {
    const joke = await getJoke();
    onResponse({ text: joke, isFinal: true });
  } else {
    // Fallback to Gemini for all other queries
    await getAiResponse(query, onResponse);
  }
};
