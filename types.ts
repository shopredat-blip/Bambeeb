export enum AppMode {
  GENERATE = 'GENERATE',
  EDIT = 'EDIT',
  HISTORY = 'HISTORY',
  INSPIRATION = 'INSPIRATION',
  SETTINGS = 'SETTINGS',
}

export enum ImageSize {
  SIZE_1K = '1K',
  SIZE_2K = '2K',
  SIZE_4K = '4K',
}

export enum AspectRatio {
  SQUARE = '1:1',
  PORTRAIT = '3:4',
  LANDSCAPE = '4:3',
  WIDE = '16:9',
  TALL = '9:16',
}

export interface GeneratedImage {
  id: string;
  url: string;
  prompt: string;
  negativePrompt?: string;
  timestamp: number;
  width?: number;
  height?: number;
  aspectRatio?: AspectRatio;
  imageSize?: ImageSize;
  model?: string;
  styleReferenceImageUrl?: string; // Stores the style image used for this generation
}

export interface UploadedImage {
  file: File;
  previewUrl: string;
  base64: string;
  mimeType: string;
}