import { createPartFromUri, createUserContent, GoogleGenAI } from "@google/genai";
import { BasicPromptDto } from "../dtos/basic-prompt.dto";
import { ChatPromptDto } from "../dtos/chat-prompt.dto";




export const chatPromptStreamUseCase = async (geminiAi: GoogleGenAI, chatPromptDto: ChatPromptDto) =>{

    const {prompt, files = []} = chatPromptDto;

    const uploadedFiles = await Promise.all(
        files.map((file) => {
            const blob = new Blob([new Uint8Array(file.buffer)], {
                type: file.mimetype?.includes('image') ? file.mimetype : 'image/jpeg',
            });
            const image = geminiAi.files.upload({ file: blob });
            return image;
        })
    );
 
    const chat = geminiAi.chats.create({
        model: "gemini-2.5-flash",
        config: {
            systemInstruction: "Responde unicamente en español, de forma concisa y formato markdown.",
        },
        history: [
        {
            role: "user",
            parts: [{ text: "Hello" }],
        },
        {
            role: "model",
            parts: [{ text: "Great to meet you. What would you like to know?" }],
        },
        ],
    });
  
    return chat.sendMessageStream({
        message: [
            prompt,
            ...uploadedFiles.map((file) => createPartFromUri(file.uri ?? '', file.mimeType ?? ''))
        ],
    });

}