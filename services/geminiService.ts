import { GoogleGenAI } from "@google/genai";
import { Task } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function getInspiration(): Promise<string> {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: "Generate a single, concise motivational quote about productivity or achieving goals. Keep it under 20 words.",
    });
    return response.text;
  } catch (error) {
    console.error("Gemini API error in getInspiration:", error);
    throw new Error("Failed to fetch inspiration from Gemini.");
  }
}

export async function summarizeDay(tasks: Task[]): Promise<string> {
  const completedTasks = tasks.filter(task => task.completed);
  const trackedTasks = tasks.filter(task => task.timeSpent > 0);

  if (completedTasks.length === 0 && trackedTasks.length === 0) {
    return "No tasks were completed or tracked today.";
  }
  
  const completedList = completedTasks.map(t => `- ${t.text} (${t.category})`).join('\n');
  
  const trackedList = tasks
    .filter(t => t.timeSpent > 0)
    .map(t => `- ${t.text} (${t.category}): ${Math.round(t.timeSpent / 60)} minutes`)
    .join('\n');

  const prompt = `You are a positive and encouraging productivity coach. Based on the following user activity, write a brief, uplifting summary of their day. Praise their effort and highlight their accomplishments. Mention both completed tasks and where they spent their time.

Completed tasks:
${completedList.length > 0 ? completedList : "None"}

Time tracked on tasks:
${trackedList.length > 0 ? trackedList : "None"}
`;

  try {
     const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Gemini API error in summarizeDay:", error);
    throw new Error("Failed to fetch summary from Gemini.");
  }
}
