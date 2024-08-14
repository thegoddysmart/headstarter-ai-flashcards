import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from "@google/generative-ai";

const systemPrompt = `
You are a flashcard creator, you take in text and create multiple flashcards from it. Make sure to create exactly 10 flashcards.
Both front and back should be one sentence long.
You should return in the following JSON format:
{
  "flashcards":[
    {
      "front": "Front of the card",
      "back": "Back of the card"
    }
  ]
}
`;

export async function POST(req) {
    const gemini = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY);
    const data = await req.text();

    try {
        const model = gemini.getGenerativeModel({ model: 'gemini-1.5-flash' });
        const result = await model.generateContent([
            {
                text: `${systemPrompt} ${data}`,
            },
        ]);

        // Log the raw response text for debugging
        console.log("Raw response text:", result.response.text());

        // Attempt to parse the response text
        const flashcards = JSON.parse(result.response.text());

        // Return the flashcards as a JSON response
        return NextResponse.json(flashcards.flashcards);
    } catch (error) {
        console.error('Error generating flashcards:', error);
        return NextResponse.json({ error: { message: error.message } }, { status: 500 });
    }
}
