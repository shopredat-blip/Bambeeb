import { GoogleGenAI } from "@google/genai";
import { AspectRatio, ImageSize, UploadedImage } from "../types";

interface GenerateParams {
  prompt: string;
  negativePrompt?: string;
  model: string;
  aspectRatio: AspectRatio;
  imageSize: ImageSize;
  referenceImages?: UploadedImage[];
  styleImage?: UploadedImage;
  numberOfImages?: number;
}

export const generateImageContent = async (params: GenerateParams): Promise<string[]> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key not found. Please connect your account.");
  }

  const ai = new GoogleGenAI({ apiKey });
  
  // Determine the number of requests to make (simulating variations)
  // Default to 1 if not specified
  const count = params.numberOfImages || 1;
  const requests = [];

  for (let i = 0; i < count; i++) {
    requests.push((async () => {
        // Construct parts for this specific request
        const parts: any[] = [];
        let promptPrefix = "";

        // 1. Handle Style Image (Priority 1)
        if (params.styleImage) {
            const base64Data = params.styleImage.base64.split(',')[1] || params.styleImage.base64;
            parts.push({
                inlineData: {
                    mimeType: params.styleImage.mimeType,
                    data: base64Data
                }
            });
            promptPrefix += "[Image 1] is a STYLE REFERENCE. Capture its artistic style, color palette, texture, and lighting. ";
        }

        // 2. Handle Content/Reference Images (Priority 2)
        if (params.referenceImages && params.referenceImages.length > 0) {
            params.referenceImages.forEach((img, index) => {
                const base64Data = img.base64.split(',')[1] || img.base64;
                parts.push({
                    inlineData: {
                        mimeType: img.mimeType,
                        data: base64Data
                    }
                });
                // Adjust index based on whether style image exists
                const realIndex = params.styleImage ? index + 2 : index + 1;
                promptPrefix += `[Image ${realIndex}] is a CONTENT REFERENCE. Maintain its composition and subject matter while applying the style. `;
            });
        }

        // 3. Construct Text Prompt
        let finalPrompt = "";
        
        if (params.styleImage && (!params.referenceImages || params.referenceImages.length === 0)) {
            // Text + Style
            finalPrompt = `${promptPrefix}\n\nGenerate an image matching the style of the first image based on this description: ${params.prompt}`;
        } else if (params.styleImage && params.referenceImages && params.referenceImages.length > 0) {
            // Content + Style (Style Transfer)
            finalPrompt = `${promptPrefix}\n\nTransform the content reference image(s) into the style of the style reference image. Instructions: ${params.prompt}`;
        } else if (params.referenceImages && params.referenceImages.length > 0) {
            // Content Only (Editing)
            finalPrompt = `The provided image(s) are content references. Edit or generate based on them. Instructions: ${params.prompt}`;
        } else {
            // Text Only
            finalPrompt = params.prompt;
        }

        // Add Negative Prompt
        if (params.negativePrompt && params.negativePrompt.trim()) {
            finalPrompt += `\n\nNegative Prompt (elements to avoid/exclude): ${params.negativePrompt.trim()}`;
        }
        
        // Add a seed variation for multiple images to encourage diversity if the model supports it implicitly
        // or just rely on randomness. We can append a subtle noise instruction for variations.
        if (count > 1) {
            finalPrompt += `\n\nVariation ${i+1}`; 
        }

        parts.push({ text: finalPrompt });

        try {
            const response = await ai.models.generateContent({
            model: params.model,
            contents: {
                parts: parts,
            },
            config: {
                imageConfig: {
                aspectRatio: params.aspectRatio,
                // imageSize is only supported by gemini-3-pro-image-preview
                ...(params.model === 'gemini-3-pro-image-preview' ? { imageSize: params.imageSize } : {}),
                },
            },
            });

            // Parse response
            if (response.candidates && response.candidates[0].content.parts) {
            for (const part of response.candidates[0].content.parts) {
                if (part.inlineData && part.inlineData.data) {
                const mimeType = part.inlineData.mimeType || 'image/png';
                return `data:${mimeType};base64,${part.inlineData.data}`;
                }
            }
            }
            throw new Error("No image generated.");
        } catch (error) {
            console.error("Gemini API Error in worker:", error);
            throw error;
        }
    })());
  }

  // Execute all requests
  const results = await Promise.all(requests);
  return results;
};