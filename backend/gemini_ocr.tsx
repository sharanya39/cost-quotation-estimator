// To run this code you need to install the following dependencies:
// npm install @google/genai mime dotenv
// npm install -D @types/node

import dotenv from 'dotenv';
dotenv.config({ path: 'backend\\.env' });

import {
  GoogleGenAI,
  Type,
} from '@google/genai';

export async function main(filePath: string) {
  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
  });
  // Ensure that the file is available in local system working directory or change the file path.
  const files = [
    await ai.files.upload({file: filePath}),
  ]
  const config = {
    temperature: 0,
    responseMimeType: 'application/json',
    responseSchema: {
      type: Type.OBJECT,
      required: ["drawing_number", "part_name", "material", "dimensions"],
      properties: {
        drawing_number: {
          type: Type.STRING,
        },
        part_name: {
          type: Type.STRING,
        },
        revision: {
          type: Type.STRING,
        },
        material: {
          type: Type.STRING,
        },
        finish: {
          type: Type.STRING,
        },
        unit_weight_kg: {
          type: Type.NUMBER,
        },
        dimensions: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            required: ["dimension"],
            properties: {
              dimension: {
                type: Type.STRING,
              },
              tolerance: {
                type: Type.STRING,
              },
              is_bounding_dimension: {
                type: Type.BOOLEAN,
              },
            },
          },
        },
        holes: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            required: ["hole_type", "quantity", "diameter_mm"],
            properties: {
              hole_type: {
                type: Type.STRING,
              },
              quantity: {
                type: Type.INTEGER,
              },
              diameter_mm: {
                type: Type.NUMBER,
              },
              depth_mm: {
                type: Type.NUMBER,
              },
            },
          },
        },
        thread_specs: {
          type: Type.ARRAY,
          items: {
            type: Type.STRING,
          },
        },
        surface_treatment: {
          type: Type.STRING,
        },
        notes: {
          type: Type.ARRAY,
          items: {
            type: Type.STRING,
          },
        },
      },
    },
    systemInstruction: [
        {
          text: `## 📜 Task
You are given an engineering drawing in PDF format.  
Your task is to extract structured data according to the provided OpenAPI schema.

You must strictly follow the schema and instructions outlined below.

---

## 🛠 Instructions
- **Use the OpenAPI schema** provided below to structure your JSON output.
- **Do not infer** or create data that is not explicitly mentioned.
- **If a field is missing**, fill:
  - Scalars → \`null\`
  - Arrays → \`[]\`
- **Units and tolerances** must be preserved exactly as written.
- **Output only JSON** — no additional text, no explanations, no formatting errors.
- **If extraction fails due to missing or incomplete data**, set the field to \`null\` and move on.
- Only consider the maximum bounding box dimensions (length, width, thickness) when estimating volume for unit weight.
Ignore internal feature dimensions (e.g., hole spacings, slot spacings) for this calculation. 


---

## 📏 Unit Weight Estimation Logic
If the "unit_weight_kg" field is **missing** in the drawing:

- Estimate it using:
  - Volume = (length x width x thickness) based on available bounding box dimensions.
  - Standard material densities provided below.
- **Volume** must be computed in cubic centimeters (cm³).
- **Density** must be applied in grams per cubic centimeter (g/cm³).
- **Final mass** must be reported in kilograms (kg), rounded to 3 decimal places.
- **If any dimension is missing**, set \`unit_weight_kg: null\`.
- **If material is unknown or missing from the density table**, set \`unit_weight_kg: null\`.
- **If unit weight is estimated**, add a note in the "notes" field stating that unit weight was estimated based on bounding box and material density.

---

## 🧠 Standard Material Density Lookup Table (g/cm³)

\`\`\`json
{
  "Aluminium 6061": 2.7,
  "Aluminium 7075": 2.81,
  "Stainless Steel 304": 8.0,
  "Stainless Steel 316": 8.0,
  "Mild Steel": 7.85,
  "Carbon Steel": 7.85,
  "Cast Iron": 7.2,
  "Brass": 8.5,
  "Bronze": 8.7,
  "Copper": 8.96,
  "Titanium Grade 2": 4.51,
  "Titanium Grade 5": 4.43,
  "ABS Plastic": 1.04,
  "Nylon": 1.14,
  "Polycarbonate": 1.2,
  "POM (Delrin)": 1.41,
  "PVC": 1.38,
  "Rubber (General)": 1.5
}
\`\`\`
### ✅ Expected JSON Output

\`\`\`json
{
  "drawing_number": "B-4567",
  "part_name": "Mounting Plate",
  "revision": "Rev C",
  "material": "Stainless Steel 304",
  "finish": "Passivated",
  "unit_weight_kg": 1.8,
  "dimensions": [
    {
      "dimension": "150mm x 100mm x 5mm",
      "tolerance": null
    },
    {
      "dimension": "Overall thickness: 5mm",
      "tolerance": "+/-0.05mm"
    }
  ],
  "holes": [
    {
      "hole_type": "Through",
      "quantity": 4,
      "diameter_mm": 8,
      "depth_mm": null
    },
    {
      "hole_type": "Tapped",
      "quantity": 2,
      "diameter_mm": 6,
      "depth_mm": null
    }
  ],
  "thread_specs": [
    "M6"
  ],
  "surface_treatment": null,
  "notes": [
    "All sharp edges to be broken 0.5mm max",
    "Dimensions are in millimeters unless otherwise specified"
  ]
}
\`\`\`

`,
        }
    ],
  };
  const model = 'gemini-2.5-pro-preview-03-25';

const fs = require('fs').promises;

async function saveJsonOutput(data) {
  try {
    const parsedData = typeof data === 'string' ? JSON.parse(data) : data;
    await fs.writeFile('backend/output/op.json', JSON.stringify(parsedData, null, 2));
    console.log('JSON output saved to op.json');
  } catch (err) {
    console.error('Error saving JSON output:', err);
  }
}
  const contents = [
    {
      role: 'user',
      parts: [
        {
          fileData: {
            fileUri: files[0].uri,
            mimeType: files[0].mimeType,
          }
        },
        {
          text: `INSERT_INPUT_HERE`,
        },
      ],
    },
  ];

  const response = await ai.models.generateContentStream({
    model,
    config,
    contents,
  });
  let output = "";
  for await (const chunk of response) {
    // console.log(chunk.text);
    output += chunk.text;
  }
  
  // Remove escape characters and parse into single JSON object
  try {
    const cleanOutput = output.replace(/\\"/g, '"')
    const jsonOutput = JSON.parse(cleanOutput)
    await saveJsonOutput(jsonOutput)
  } catch (error) {
    console.error('Error parsing JSON:', error)
    await saveJsonOutput({error: 'Failed to parse JSON response'})
  }
}
