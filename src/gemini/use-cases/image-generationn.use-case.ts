import { Content, createPartFromUri, createUserContent, GoogleGenAI } from "@google/genai";
import { BasicPromptDto } from "../dtos/basic-prompt.dto";
import { ChatPromptDto } from "../dtos/chat-prompt.dto";
import { geminiUploadFile } from "../helpers/gemini-upload-file";
import { ImageGenerationDto } from "../dtos/image-generation.dto";


export interface ImageGenerationResponse
{
    imageUrl: string;
    text: string;
}

export const imageGenerationUseCase = async (geminiAi: GoogleGenAI, imageGenerationDto: ImageGenerationDto): Promise<ImageGenerationResponse> =>{

    const {prompt, files = []} = imageGenerationDto;

    const uploadedFiles = await geminiUploadFile(geminiAi, files);
 
    const chat = geminiAi.chats.create({
        model: "gemini-2.5-flash",
        config: {
            systemInstruction: "Responde unicamente en español, de forma concisa y formato markdown.",
        },
        
    });
    
    return {
        imageUrl: 'https://example.com/generated-image.png',
        text: 'Imagen generada con éxito.'
    }

}