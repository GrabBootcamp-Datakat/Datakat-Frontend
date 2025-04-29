import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(
  process.env.NEXT_PUBLIC_GEMINI_API_KEY || ""
);

export interface ChartQuery {
  timeUnit?:
    | "second"
    | "minute"
    | "hour"
    | "day"
    | "month"
    | "2month"
    | "3month"
    | "6month"
    | "year";
  component?: string;
  level?: "INFO" | "WARN" | "ERROR";
  startDate?: string;
  endDate?: string;
}

export async function extractChartQuery(
  userInput: string
): Promise<ChartQuery> {
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  const prompt = `
    Extract chart query parameters from the following user input. Return a JSON object with the following structure:
    {
      "timeUnit": "second" | "minute" | "hour" | "day" | "month" | "2month" | "3month" | "6month" | "year",
      "component": string,
      "level": "INFO" | "WARN" | "ERROR",
      "startDate": "YYYY-MM-DD",
      "endDate": "YYYY-MM-DD"
    }
    
    User input: ${userInput}
    
    Only include fields that are explicitly mentioned in the input. If a field is not mentioned, omit it from the response.
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    return JSON.parse(text);
  } catch (error) {
    console.error("Error extracting chart query:", error);
    return {};
  }
}
