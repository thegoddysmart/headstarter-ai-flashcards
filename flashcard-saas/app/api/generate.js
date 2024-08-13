import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

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
  try {
    const genAI = new GoogleGenerativeAI({
      apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
    });

    const model = await genAI.getModel('gemini-1.5-flash');

    const data = await req.json();

    const result = await model.generateContentStream({
      // prompt: [systemPrompt, ...data.messages.map(m => m.content)],
      prompt: `${systemPrompt} ${data}`,
      max_tokens: 500, // Set token limit based on expected output
      temperature: 0.7, // Adjust temperature for creativity
    });

    // const stream = new ReadableStream({
    //   async start(controller) {
    //     const encoder = new TextEncoder();
    //     try {
    //       let accumulatedText = '';

    //       for await (const chunk of result.stream) {
    //         let content = chunk.text();
    //         content = content.replace(/\*/g, '');

    //         accumulatedText += content;

    //         // Add line breaks after periods for readability
    //         if (accumulatedText.includes('.')) {
    //           const sentences = accumulatedText.split('.');
    //           accumulatedText = sentences.pop(); // Hold onto any incomplete sentence

    //           sentences.forEach(sentence => {
    //             if (sentence.trim()) {
    //               const text = encoder.encode(sentence.trim() + '.\n\n');
    //               controller.enqueue(text);
    //             }
    //           });
    //         }
    //       }

    //       // Flush out any remaining text
    //       if (accumulatedText.trim()) {
    //         const text = encoder.encode(accumulatedText.trim());
    //         controller.enqueue(text);
    //       }
    //     } catch (err) {
    //       controller.error(err);
    //       console.error("Stream error:", err);
    //     } finally {
    //       controller.close();
    //     }
    //   },
    // });

    // Parse the response
    const flashcards = JSON.parse(result.text) // Assume the response text contains the JSON

    return new NextResponse(flashcards.flashcards);
  } catch (error) {
    console.error("Error in POST handler:", error);
    return new NextResponse("An error occurred while processing your request", { status: 500 });
  }
}
