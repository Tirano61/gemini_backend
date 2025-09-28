import { GoogleGenAI } from "@google/genai";
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