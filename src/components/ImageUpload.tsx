import { ChangeEvent, useState } from 'react';
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import { Upload, X } from "lucide-react";

interface ImageUploadProps {
  currentImage?: string;
  onImageChange: (file: File | null) => void;
}

export function ImageUpload({ currentImage, onImageChange }: ImageUploadProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentImage || null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleFile = (file: File) => {
    // Validar que sea una imagen
    if (!file.type.startsWith('image/')) {
      alert('Por favor selecciona un archivo de imagen válido');
      return;
    }

    // Crear URL para preview
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    onImageChange(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const removeImage = () => {
    setPreviewUrl(null);
    onImageChange(null);
  };

  return (
    <div className="w-full">
      <div
        className={`border-2 border-dashed rounded-lg p-4 text-center ${
          isDragging ? 'border-[#00ffae] bg-[#00ffae]/10' : 'border-gray-300'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {previewUrl ? (
          <div className="relative">
            <div className="relative w-full h-48">
              <Image
                src={previewUrl}
                alt="Preview"
                fill
                className="object-cover rounded-lg"
              />
            </div>
            <Button
              variant="ghost"
              className="absolute top-2 right-2 text-red-500 hover:text-red-700 bg-white rounded-full p-1"
              onClick={removeImage}
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        ) : (
          <div className="py-8">
            <Upload className="w-12 h-12 mx-auto text-gray-400 mb-2" />
            <p className="text-sm text-gray-500">
              Arrastra y suelta una imagen aquí o{' '}
              <label className="text-[#00ffae] hover:text-[#00e6a0] cursor-pointer">
                <span>selecciona un archivo</span>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </label>
            </p>
            <p className="text-xs text-gray-400 mt-1">
              PNG, JPG, GIF hasta 5MB
            </p>
          </div>
        )}
      </div>
    </div>
  );
} 