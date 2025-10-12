import { Injectable } from '@nestjs/common';
import { BasicPromptDto } from './dtos/basic-prompt.dto';
import { Content, GoogleGenAI } from "@google/genai";
import { basicPromptStreamUseCase, basicPromptUseCase } from './use-cases/basic-prompt.use-case';
import { ChatPromptDto } from './dtos/chat-prompt.dto';
import { chatPromptStreamUseCase } from './use-cases/chat-prompt-stream.use-case';

@Injectable()
export class GeminiService {
    
    private geminiAi = new GoogleGenAI({apiKey: process.env.GEMINI_API_KEY});

    private chatHistory = new Map<string, Content[]>();

    async basicPrompt(basicPromptDto: BasicPromptDto) {
        return await basicPromptUseCase(this.geminiAi, basicPromptDto);
    }

    async basicPromptStream(basicPromptDto: BasicPromptDto) {
        return  basicPromptStreamUseCase(this.geminiAi, basicPromptDto);
    }

    async chatPromptStream(chatPromptDto: ChatPromptDto) {
        const chatHistory = this.getChatHistory(chatPromptDto.chatId!);
        return  chatPromptStreamUseCase(this.geminiAi, chatPromptDto, chatHistory);
    }

    saveMessage(chatId: string, message: Content){
        const messages = this.getChatHistory(chatId);
        messages.push(message);
        this.chatHistory.set(chatId, messages);
    }

    getChatHistory(chatId: string){
        return structuredClone(this.chatHistory.get(chatId) ??  []);
    }
}
