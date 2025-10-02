import { Body, Controller, HttpStatus, Post, Res, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { GeminiService } from './gemini.service';
import { BasicPromptDto } from './dtos/basic-prompt.dto';
import { Response } from 'express';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';

@Controller('gemini')
export class GeminiController {
  constructor(private readonly geminiService: GeminiService) {

  }
  @Post('basic-prompt')
  async basicPrompt(@Body() basicPromptDto: BasicPromptDto) {
    return this.geminiService.basicPrompt(basicPromptDto);
  }

  @Post('basic-prompt-stream')
  @UseInterceptors(FilesInterceptor('files'))
  async basicPromptStream(
    @Body() basicPromptDto: BasicPromptDto,
    @Res() res: Response,
    @UploadedFiles() files: Express.Multer.File[]
  ) {

    basicPromptDto.files = files;

  
    const stream = await this.geminiService.basicPromptStream(basicPromptDto);
    res.setHeader('Content-Type', 'text/plain');
    res.status(HttpStatus.OK);

    for await (const chunk of stream) {
      const piece = chunk.text;
      res.write(piece);
    }
    res.end();
  }
}
