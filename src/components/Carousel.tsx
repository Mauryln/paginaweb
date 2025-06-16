"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { ArrowLeft, ArrowRight, Expand, Minimize } from "lucide-react"

interface CarouselImage {
  id: string
  url: string
  title: string
  description: string
}

export default function Carousel() {
  const [images, setImages] = useState<CarouselImage[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isExpanded, setIsExpanded] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchImages = async () => {
      setLoading(true)
      try {
        const response = await fetch("/api/carousel-images")
        if (!response.ok) throw new Error("Error al cargar imágenes")
        const data = await response.json()
        setImages(data)
      } catch (e) {
        setImages([])
      } finally {
        setLoading(false)
      }
    }
    fetchImages()
  }, [])

  useEffect(() => {
    if (images.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
      }, 5000)
      return () => clearInterval(interval)
    }
  }, [images])

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
  }
  const goToNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
  }
  const toggleExpand = () => setIsExpanded((v) => !v)

  if (loading) {
    return (
      <div className="w-full h-96 flex items-center justify-center bg-gray-100 rounded-lg">
        <span className="text-gray-500">Cargando carrusel...</span>
      </div>
    )
  }
  if (!images.length) {
    return (
      <div className="w-full h-96 flex items-center justify-center bg-gray-100 rounded-lg">
        <span className="text-gray-500">No hay imágenes para mostrar</span>
      </div>
    )
  }

  // --- PREVIEW ---
  return (
    <>
      <div className="relative w-full max-w-3xl mx-auto h-96 bg-gray-900 rounded-lg shadow-xl flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <Image
            src={images[currentIndex].url}
            alt={images[currentIndex].title}
            fill
            sizes="(max-width: 768px) 100vw, 700px"
            className="object-contain rounded-lg bg-black"
            quality={100}
            priority
          />
        </div>
        <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white p-4">
          <h3 className="text-xl font-bold">{images[currentIndex].title}</h3>
          <p className="text-sm">{images[currentIndex].description}</p>
        </div>
        {images.length > 1 && (
          <>
            <button
              className="absolute top-1/2 left-4 -translate-y-1/2 bg-white/70 text-gray-800 p-2 rounded-full shadow hover:bg-white z-10"
              onClick={goToPrevious}
              aria-label="Anterior"
            >
              <ArrowLeft className="h-6 w-6" />
            </button>
            <button
              className="absolute top-1/2 right-4 -translate-y-1/2 bg-white/70 text-gray-800 p-2 rounded-full shadow hover:bg-white z-10"
              onClick={goToNext}
              aria-label="Siguiente"
            >
              <ArrowRight className="h-6 w-6" />
            </button>
          </>
        )}
        <button
          className="absolute top-4 right-4 bg-white/70 text-gray-800 p-2 rounded-full shadow hover:bg-white z-10"
          onClick={toggleExpand}
          aria-label="Expandir"
        >
          <Expand className="h-6 w-6" />
        </button>
      </div>

      {/* MODAL EXPANDIDO */}
      {isExpanded && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4">
          <button
            className="absolute top-4 right-4 bg-white/70 text-gray-800 p-2 rounded-full shadow hover:bg-white z-10"
            onClick={toggleExpand}
            aria-label="Minimizar"
          >
            <Minimize className="h-6 w-6" />
          </button>
          <div className="relative w-full max-w-6xl h-[80vh] flex items-center justify-center">
            <Image
              src={images[currentIndex].url}
              alt={images[currentIndex].title}
              fill
              sizes="(max-width: 1200px) 100vw, 1200px"
              className="object-contain rounded-lg bg-black"
              quality={100}
              priority
            />
            <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white p-4">
              <h3 className="text-xl font-bold">{images[currentIndex].title}</h3>
              <p className="text-sm">{images[currentIndex].description}</p>
            </div>
            {images.length > 1 && (
              <>
                <button
                  className="absolute top-1/2 left-4 -translate-y-1/2 bg-white/70 text-gray-800 p-2 rounded-full shadow hover:bg-white z-10"
                  onClick={goToPrevious}
                  aria-label="Anterior"
                >
                  <ArrowLeft className="h-6 w-6" />
                </button>
                <button
                  className="absolute top-1/2 right-4 -translate-y-1/2 bg-white/70 text-gray-800 p-2 rounded-full shadow hover:bg-white z-10"
                  onClick={goToNext}
                  aria-label="Siguiente"
                >
                  <ArrowRight className="h-6 w-6" />
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  )
}
