import dotenv from 'dotenv';
dotenv.config({ path: 'backend\\.env' });

import { Elysia } from 'elysia';
import { cors } from '@elysiajs/cors';
import { staticPlugin } from '@elysiajs/static';
import { mkdir, writeFile } from 'fs/promises';
import { join } from 'path';
import { main as runGeminiOCR } from './gemini_ocr';
try {

  const app = new Elysia()
  .use(cors())
  // .use(staticPlugin())
  // Ensure required directories exist
  .onStart(async () => {
    const diagramsDir = join(process.cwd(), 'backend', 'data', 'diagrams');
    const outputDir = join(process.cwd(), 'backend', 'output');
    await mkdir(diagramsDir, { recursive: true });
    await mkdir(outputDir, { recursive: true });
  })
  .post('/', async () => {
    return 'Hello World!';
  })
  .post('/api/upload-diagram', async ({ body }) => {
    try {
      const { file, filename } = body as { file: Blob; filename: string };
      const uploadDir = join(process.cwd(), 'backend', 'data', 'diagrams');
      
      // Ensure upload directory exists
      await mkdir(uploadDir, { recursive: true });
      
      // Generate unique filename
      // const uniqueFilename = `${Date.now()}-${filename}`;
      // const filePath = join(uploadDir, uniqueFilename);
      const fixedFilename = 'inp.pdf';
      const filePath = join(uploadDir, fixedFilename);
      
      // Write file to disk
      const buffer = await file.arrayBuffer();
      await writeFile(filePath, Buffer.from(buffer));
      
      // Run Gemini OCR processing
      await runGeminiOCR(filePath);
      
      return { success: true, filename: fixedFilename };
    } catch (error) {
      return { success: false, error: error.message };
    }
  })
  .listen(3000);

console.log(`🦊 Server is running at ${app.server?.hostname}:${app.server?.port}`);
} catch (error) {
  console.error('Failed to start server:', error);
  process.exit(1);
}