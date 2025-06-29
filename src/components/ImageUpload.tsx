import { ChangeEvent, useState, useRef } from 'react';
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import { Upload, X, Crop, Check } from "lucide-react";
import ReactCrop, { Crop as CropType, PixelCrop, centerCrop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

interface ImageUploadProps {
  currentImage?: string;
  onImageChange: (file: File | null) => void;
  aspectRatio?: number;
  disableCropping?: boolean;
}

export function ImageUpload({ currentImage, onImageChange, aspectRatio = 16/9, disableCropping }: ImageUploadProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentImage || null);
  const [isDragging, setIsDragging] = useState(false);
  const [isCropping, setIsCropping] = useState(!disableCropping && !!currentImage);
  const [crop, setCrop] = useState<CropType>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const imgRef = useRef<HTMLImageElement>(null);
  const [originalImage, setOriginalImage] = useState<File | null>(null);

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

    setOriginalImage(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);

    if (disableCropping) {
      onImageChange(file);
      setIsCropping(false);
    } else {
      setIsCropping(true);
    }
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
    setOriginalImage(null);
    setIsCropping(false);
    onImageChange(null);
  };

  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget;
    const crop = centerCrop(
      makeAspectCrop(
        {
          unit: '%',
          width: 90,
        },
        aspectRatio,
        width,
        height
      ),
      width,
      height
    );
    setCrop(crop);
  };

  const handleCropComplete = () => {
    if (!completedCrop || !imgRef.current || !originalImage) return;

    const currentImageElement = imgRef.current; // Capturar el elemento de imagen actual

    // Create a new Image object from the original file to ensure full resolution
    const originalLoadedImage = new window.Image(); // Usar window.Image
    originalLoadedImage.src = URL.createObjectURL(originalImage);

    originalLoadedImage.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      if (!ctx) return;

      // Disable image smoothing for maximum sharpness (pixel-perfect copy)
      ctx.imageSmoothingEnabled = false;

      // Usar currentImageElement para las escalas
      const scaleX = originalLoadedImage.naturalWidth / currentImageElement.width;
      const scaleY = originalLoadedImage.naturalHeight / currentImageElement.height;

      canvas.width = Math.round(completedCrop.width * scaleX); // Usar dimensiones reales de píxeles redondeadas para el canvas
      canvas.height = Math.round(completedCrop.height * scaleY); // Usar dimensiones reales de píxeles redondeadas para el canvas

      ctx.drawImage(
        originalLoadedImage, // Usar la imagen original recién cargada como fuente
        Math.round(completedCrop.x * scaleX), // Redondear a entero
        Math.round(completedCrop.y * scaleY), // Redondear a entero
        Math.round(completedCrop.width * scaleX), // Redondear a entero
        Math.round(completedCrop.height * scaleY), // Redondear a entero
        0,
        0,
        canvas.width,
        canvas.height
      );

      // Convertir el canvas a blob con máxima calidad
      canvas.toBlob((blob) => {
        if (blob) {
          const croppedFile = new File([blob], originalImage.name, {
            type: originalImage.type,
          });
          onImageChange(croppedFile);
          setPreviewUrl(URL.createObjectURL(blob));
          setIsCropping(false);
          URL.revokeObjectURL(originalLoadedImage.src); // Limpiar la URL del objeto
        }
      }, originalImage.type, 1); // Establecer la calidad a 1 (máxima)
    };
  };

  return (
    <div className="w-full">
      <div
        className={`border-2 border-dashed rounded-lg p-4 text-center ${
          isDragging ? 'border-blue-600 bg-blue-600/10' : 'border-gray-300'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {previewUrl ? (
          disableCropping ? (
            <>
              <div className="relative w-full h-48">
                <Image
                  src={previewUrl}
                  alt="Preview"
                  fill
                  className="object-cover rounded-lg"
                />
              </div>
              <div className="flex justify-end gap-2 mt-2">
                <Button
                  variant="ghost"
                  className="text-red-500 hover:text-red-700"
                  onClick={removeImage}
                >
                  <X className="w-5 h-5 mr-2" />
                  Eliminar
                </Button>
              </div>
            </>
          ) : (
            isCropping ? (
              <div className="space-y-4">
                <ReactCrop
                  crop={crop}
                  onChange={(c) => setCrop(c)}
                  onComplete={(c) => setCompletedCrop(c)}
                  aspect={aspectRatio}
                  className="max-h-[400px]"
                >
                  <Image
                    ref={imgRef}
                    src={previewUrl}
                    alt="Preview"
                    onLoad={onImageLoad}
                    className="max-w-full"
                    width={500}
                    height={500}
                  />
                </ReactCrop>
                <div className="flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    className="text-red-500 hover:text-red-700"
                    onClick={removeImage}
                  >
                    <X className="w-5 h-5 mr-2" />
                    Cancelar
                  </Button>
                  <Button
                    className="bg-blue-600 text-white hover:bg-blue-500"
                    onClick={handleCropComplete}
                  >
                    <Check className="w-5 h-5 mr-2" />
                    Aplicar Recorte
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <div className="relative w-full h-48">
                  <Image
                    src={previewUrl}
                    alt="Preview"
                    fill
                    className="object-cover rounded-lg"
                  />
                </div>
                <div className="flex justify-end gap-2 mt-2">
                  <Button
                    variant="ghost"
                    className="text-blue-600 hover:text-blue-500"
                    onClick={() => setIsCropping(true)}
                  >
                    <Crop className="w-5 h-5 mr-2" />
                    Recortar
                  </Button>
                  <Button
                    variant="ghost"
                    className="text-red-500 hover:text-red-700"
                    onClick={removeImage}
                  >
                    <X className="w-5 h-5 mr-2" />
                    Eliminar
                  </Button>
                </div>
              </>
            )
          )
        ) : (
          <div className="py-8">
            <Upload className="w-12 h-12 mx-auto text-gray-400 mb-2" />
            <p className="text-sm text-gray-500">
              Arrastra y suelta una imagen aquí o{' '}
              <label className="text-blue-600 hover:text-blue-500 cursor-pointer">
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