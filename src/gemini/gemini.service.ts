import { Injectable } from '@nestjs/common';
import { BasicPromptDto } from './dtos/basic-prompt.dto';
import { GoogleGenAI } from "@google/genai";
import { basicPromptUseCase } from './use-cases/basic-prompt.use-case';

@Injectable()
export class GeminiService {
    
    private geminiAi = new GoogleGenAI({apiKey: process.env.GEMINI_API_KEY});

    async basicPrompt(basicPromptDto: BasicPromptDto) {
        return await basicPromptUseCase(this.geminiAi, basicPromptDto);
    }
}
