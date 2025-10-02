import { createPartFromUri, createUserContent, GoogleGenAI } from "@google/genai";
import { BasicPromptDto } from "../dtos/basic-prompt.dto";


export const basicPromptUseCase = async (geminiAi: GoogleGenAI, basicPromptDto: BasicPromptDto) =>{
    const response = await geminiAi.models.generateContent({
        model: "gemini-2.5-flash",
        contents: basicPromptDto.prompt,
        config: {
            systemInstruction: "Responde unicamente en español, de forma concisa y formato markdown.",
            thinkingConfig: {
                thinkingBudget: 0, // Disables thinking
            },
        }
    });
    console.log(response.text);
    return response.text;
}

export const basicPromptStreamUseCase = async (geminiAi: GoogleGenAI, basicPromptDto: BasicPromptDto) =>{

    const {prompt, files = []} = basicPromptDto;

    const images = await Promise.all(
        files.map((file) => {
            const blob = new Blob([new Uint8Array(file.buffer)], {
                type: file.mimetype?.includes('image') ? file.mimetype : 'image/jpeg',
            });
            const image = geminiAi.files.upload({ file: blob });
            return image;
        })
    );
 
    console.log(files);
 
    const stream = await geminiAi.models.generateContentStream({
        model: "gemini-2.5-flash",
        //contents: basicPromptDto.prompt,
        contents: [
            createUserContent([
                prompt,
                ...images.map( (image) => createPartFromUri(image.uri!, image.mimeType!))
            ]),
        ],
        config: {
            systemInstruction: "Responde unicamente en español, de forma concisa y formato markdown.",
            thinkingConfig: {
                thinkingBudget: 0, // Disables thinking
            },
        }
    });
    return stream;
}

