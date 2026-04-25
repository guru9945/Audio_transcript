"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { GoogleGenAI } from "@google/genai";
import { revalidatePath } from "next/cache";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function transcribeAudio(formData: FormData) {
  try {
    const session = await auth.api.getSession({
      headers: await headers()
    });

    if (!session || !session.user) {
      return { error: "Unauthorized" };
    }

    const file = formData.get("audio") as File | null;
    if (!file) {
      return { error: "No audio file provided" };
    }

    if (file.size > 20 * 1024 * 1024) { // 20MB limit
      return { error: "File too large. Please upload a short audio file." };
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64Data = buffer.toString("base64");

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          role: "user",
          parts: [
            { text: "Please transcribe the following audio accurately. Output only the transcript, without any markdown formatting or extra commentary." },
            {
              inlineData: {
                data: base64Data,
                mimeType: file.type || "audio/mp3",
              },
            },
          ],
        },
      ],
    });

    const transcriptText = response.text || "No transcription generated.";

    await prisma.transcript.create({
      data: {
        text: transcriptText,
        userId: session.user.id,
      },
    });

    revalidatePath("/");
    return { success: true };
  } catch (error: any) {
    console.error("Transcription error:", error);
    return { error: error.message || "Failed to transcribe audio" };
  }
}
