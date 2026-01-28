import React, { useCallback } from 'react';
import { Upload, X } from 'lucide-react';
import { UploadedImage } from '../types';

interface ImageUploaderProps {
  images: UploadedImage[];
  onImagesChange: (images: UploadedImage[]) => void;
  multiple?: boolean;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ images, onImagesChange, multiple = false }) => {
  const handleFileChange = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const newImages: UploadedImage[] = [];

    // Process files
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      // Basic validation
      if (!file.type.startsWith('image/')) continue;

      try {
        const base64 = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = error => reject(error);
        });

        newImages.push({
          file,
          previewUrl: URL.createObjectURL(file),
          base64,
          mimeType: file.type
        });
      } catch (error) {
        console.error("Error reading file:", error);
      }
    }

    if (multiple) {
        onImagesChange([...images, ...newImages]);
    } else {
        // If single mode, replace existing
        onImagesChange(newImages.slice(0, 1));
    }
    
    // Reset input
    event.target.value = '';

  }, [images, multiple, onImagesChange]);

  const removeImage = (index: number) => {
    const updated = [...images];
    URL.revokeObjectURL(updated[index].previewUrl); // Cleanup
    updated.splice(index, 1);
    onImagesChange(updated);
  };

  return (
    <div className="w-full">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        {images.map((img, idx) => (
          <div key={idx} className="relative group aspect-square bg-gray-800 rounded-lg overflow-hidden border border-gray-700">
            <img src={img.previewUrl} alt="Preview" className="w-full h-full object-cover" />
            <button
              onClick={() => removeImage(idx)}
              className="absolute top-1 right-1 p-1 bg-black/70 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X size={14} />
            </button>
          </div>
        ))}
        
        {/* Dropzone trigger - conditionally render if single mode and already has image */}
        {(!multiple && images.length > 0) ? null : (
          <label className="flex flex-col items-center justify-center w-full aspect-square border-2 border-dashed border-gray-600 rounded-lg cursor-pointer hover:bg-gray-800 hover:border-yellow-500 transition-colors bg-gray-800/50">
            <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center p-2">
              <Upload className="w-8 h-8 mb-2 text-gray-400" />
              <p className="text-xs text-gray-400">
                <span className="font-semibold text-gray-300">Click to upload</span>
              </p>
              <p className="text-[10px] text-gray-500 mt-1">PNG, JPG</p>
            </div>
            <input type="file" className="hidden" onChange={handleFileChange} accept="image/*" multiple={multiple} />
          </label>
        )}
      </div>
    </div>
  );
};