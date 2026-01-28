import { AspectRatio, ImageSize } from "./types";

export const MODELS = [
  { 
    value: 'gemini-3-pro-image-preview', 
    label: 'Bambee Pro (Photorealism)',
    description: 'Cinematic 4K quality, complex lighting, and high fidelity. Best for final production assets.'
  },
  { 
    value: 'gemini-2.5-flash-image', 
    label: 'Bambee Basic (High Speed)',
    description: 'Lightning fast generation for iteration and concepts. Optimized for efficiency.'
  },
];

export const ASPECT_RATIOS = [
  { value: AspectRatio.SQUARE, label: 'Square (1:1)' },
  { value: AspectRatio.PORTRAIT, label: 'Portrait (3:4)' },
  { value: AspectRatio.LANDSCAPE, label: 'Landscape (4:3)' },
  { value: AspectRatio.TALL, label: 'Story (9:16)' },
  { value: AspectRatio.WIDE, label: 'Cinematic (16:9)' },
];

export const IMAGE_SIZES = [
  { value: ImageSize.SIZE_1K, label: 'Standard HD (1K)' },
  { value: ImageSize.SIZE_2K, label: 'Ultra HD (2K)' },
  { value: ImageSize.SIZE_4K, label: 'Cinema 4K (4K)' },
];