import { Content, ContentListUnion, createPartFromUri, GoogleGenAI, Modality } from "@google/genai";
import { geminiUploadFile } from "../helpers/gemini-upload-file";
import { ImageGenerationDto } from "../dtos/image-generation.dto";
import {v4 as uuidV4 } from "uuid";
import path from "path";
import * as fs from "node:fs";

const AI_IMAGES_PATH = path.join(__dirname, '..', '..', '..', 'public', 'ai-images');

export interface ImageGenerationResponse
{
    imageUrl: string;
    text: string;
}

export const imageGenerationUseCase = async (geminiAi: GoogleGenAI, imageGenerationDto: ImageGenerationDto): Promise<ImageGenerationResponse> =>{

    const {prompt, files = []} = imageGenerationDto;

    const contents: ContentListUnion = [
        { text: prompt }
    ];
    const uploadedFiles = await geminiUploadFile(geminiAi, files, { transformToPng: true });

    uploadedFiles.forEach(file => {
        contents.push(createPartFromUri(file.uri ?? '', file.mimeType ?? ''));
    });

    const response = await geminiAi.models.generateContent({
        model: "gemini-2.0-flash-exp-image-generation",
        contents: contents,
        config: {
            responseModalities: [ Modality.TEXT, Modality.IMAGE ],
        },
    });

    //console.log(response);

    let imageUrl = '';
    let text = '';
    const imageId = uuidV4();

    for (const part of response.candidates?.[0]?.content?.parts ?? []) {
        if(part.text){
            text = part.text;
        }
        if(!part.inlineData){
            continue;
        }

        const imageData = part.inlineData.data!;
        const buffer = Buffer.from(imageData, 'base64');
        const imagePath = path.join(AI_IMAGES_PATH, `${imageId}.png`);
        fs.writeFileSync(imagePath, buffer);
        imageUrl = `${process.env.API_URL}/ai-images/${imageId}.png`;
        //console.log(buffer);
    }

    //console.log({text});
    
    return {
        imageUrl: imageUrl,
        text: text
    }

}