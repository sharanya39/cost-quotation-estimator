import { Elysia } from 'elysia';
import { cors } from '@elysiajs/cors';

import { mkdir, writeFile, readFile } from 'fs/promises';
import { join } from 'path';
import { main as runGeminiOCR } from './gemini_ocr';

const app = new Elysia()
  .use(cors())

  // Ensure required directories exist
  .onStart(async () => {
    const diagramsDir = join(process.cwd(), 'data', 'diagrams');
    const outputDir = join(process.cwd(), 'output');
    await mkdir(diagramsDir, { recursive: true });
    await mkdir(outputDir, { recursive: true });
  })
  .get('/api/op-data', async () => {
    try {
      const opFilePath = join(process.cwd(), 'output', 'op.json');
      const opData = await readFile(opFilePath, 'utf-8');
      return JSON.parse(opData);
    } catch (error) {
      return { success: false, error: error.message };
    }
  })
  .get('/api/material-price/:code', async ({ params }) => {
    try {
      const pricingFilePath = join(process.cwd(), 'output', 'pricing.json');
      const pricingData = await readFile(pricingFilePath, 'utf-8');
      const pricing = JSON.parse(pricingData);
      
      const material = pricing.raw_materials.find(m => m.code === params.code);
      if (!material) {
        return { success: false, error: 'Material not found' };
      }
      
      return { success: true, material };
    } catch (error) {
      return { success: false, error: error.message };
    }
  })
  .get('/api/material-data', async () => {
    try {
      const opFilePath = join(process.cwd(), 'output', 'op.json');
      const opData = await readFile(opFilePath, 'utf-8');
      const parsedOpData = JSON.parse(opData);
      
      const pricingFilePath = join(process.cwd(), 'output', 'pricing.json');
      const pricingData = await readFile(pricingFilePath, 'utf-8');
      const pricing = JSON.parse(pricingData);
      
      const material = pricing.raw_materials.find(m => m.code === parsedOpData.material);
      
      return {
        success: true,
        material: parsedOpData.material,
        unit_weight_kg: parsedOpData.unit_weight_kg,
        price: material ? material.price : null
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  })

  .post('/api/upload-diagram', async ({ body }) => {
    try {
      const { file, filename } = body as { file: Blob; filename: string };
      const uploadDir = join(process.cwd(), 'data', 'diagrams');
      
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