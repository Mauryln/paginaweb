'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { ArrowLeft, ArrowRight, Expand, Minimize } from 'lucide-react';

interface CarouselImage {
  id: string;
  url: string;
  title: string;
  description: string;
}

export default function Carousel() {
  const [images, setImages] = useState<CarouselImage[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const [loading, setLoading] = useState(true);
  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/carousel-images');
        if (!response.ok) {
          throw new Error('Error fetching carousel images');
        }
        const data = await response.json();
        setImages(data);
      } catch (error) {
        console.error('Error fetching carousel images:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  useEffect(() => {
    if (images.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex(prevIndex => 
          prevIndex === images.length - 1 ? 0 : prevIndex + 1
        );
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [images]);

  useEffect(() => {
    if (carouselRef.current) {
      carouselRef.current.style.transform = `translateX(-${currentIndex * 100}%)`;
    }
  }, [currentIndex]);

  const goToPrevious = () => {
    setCurrentIndex(prevIndex => 
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex(prevIndex => 
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  if (loading) {
    return (
      <div className="w-full h-96 bg-gray-100 rounded-lg flex items-center justify-center">
        <div className="text-gray-500">Cargando carrusel...</div>
      </div>
    );
  }

  if (images.length === 0) {
    return null;
  }

  return (
    <div className={`relative w-full max-w-4xl mx-auto overflow-hidden rounded-lg shadow-xl ${isExpanded ? '!fixed !inset-0 !z-[100] !max-w-full !rounded-none !flex !items-center !justify-center !bg-black/90' : 'h-96'}`}>
      <div 
        ref={carouselRef} 
        className="flex h-full transition-transform duration-500 ease-in-out"
        style={{ width: `${images.length * 100}%` }}
      >
        {images.map((image, index) => (
          <div key={image.id} className="w-full flex-shrink-0 h-full relative">
            <Image
              src={image.url}
              alt={image.title}
              fill
              className={`object-cover ${isExpanded ? 'object-contain' : ''}`}
            />
            <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-4">
              <h3 className="text-xl font-bold">{image.title}</h3>
              <p className="text-sm">{image.description}</p>
            </div>
          </div>
        ))}
      </div>

      {!isExpanded && images.length > 1 && (
        <>
          <button 
            className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white/50 text-gray-800 p-2 rounded-full shadow-md hover:bg-white transition-colors z-10"
            onClick={goToPrevious}
            aria-label="Imagen anterior"
          >
            <ArrowLeft className="h-6 w-6" />
          </button>
          <button 
            className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white/50 text-gray-800 p-2 rounded-full shadow-md hover:bg-white transition-colors z-10"
            onClick={goToNext}
            aria-label="Imagen siguiente"
          >
            <ArrowRight className="h-6 w-6" />
          </button>
        </>
      )}

      <button 
        className={`absolute ${isExpanded ? 'top-8 right-8' : 'top-4 right-4'} bg-white/50 text-gray-800 p-2 rounded-full shadow-md hover:bg-white transition-colors z-10`}
        onClick={toggleExpand}
        aria-label={isExpanded ? 'Minimizar carrusel' : 'Expandir carrusel'}
      >
        {isExpanded ? <Minimize className="h-6 w-6" /> : <Expand className="h-6 w-6" />}
      </button>
    </div>
  );
} 