import { Content, createPartFromUri, createUserContent, GoogleGenAI } from "@google/genai";
import { BasicPromptDto } from "../dtos/basic-prompt.dto";
import { ChatPromptDto } from "../dtos/chat-prompt.dto";
import { geminiUploadFile } from "../helpers/gemini-upload-file";




export const chatPromptStreamUseCase = async (geminiAi: GoogleGenAI, chatPromptDto: ChatPromptDto, history: Content[]) =>{

    const {prompt, files = []} = chatPromptDto;

    const uploadedFiles = await geminiUploadFile(geminiAi, files);
 
    const chat = geminiAi.chats.create({
        model: "gemini-2.5-flash",
        config: {
            systemInstruction: "Responde unicamente en español, de forma concisa y formato markdown.",
        },
        history: history,
    });
  
    return chat.sendMessageStream({
        message: [
            prompt,
            ...uploadedFiles.map((file) => createPartFromUri(file.uri ?? '', file.mimeType ?? ''))
        ],
    });

}