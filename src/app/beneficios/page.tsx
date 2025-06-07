'use client';

import Image from "next/image";
import { Laptop2, GraduationCap, UserCheck, Star, ShieldCheck, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MessageCircle, Facebook, Instagram, Linkedin } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import Carousel from '@/components/Carousel';
import Link from 'next/link';

interface CarouselImage {
  id: string;
  url: string;
  title: string;
  description: string;
}

const NAV_LINKS = [
  { label: 'Inicio', href: '/' },
  { label: 'Cursos', href: '/cursos' },
  { label: 'Beneficios', href: '/beneficios' },
  { label: 'Contacto', href: '/contacto' },
];

function Header() {
  const handleWhatsAppClick = () => {
    window.open("https://wa.me/61863578", "_blank");
  };
  return (
    <header className="w-full border-b border-white/10 bg-gray-900 sticky top-0 z-50">
      <div className="container mx-auto flex items-center justify-between py-4 px-4">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <Image 
              src="/logo.jpg" 
              alt="BIMCAT Logo" 
              width={60} 
              height={60} 
              className="rounded-full bg-white p-1 hover-scale transition-all" 
            />
            <span className="text-2xl font-bold text-white">BIMCAT</span>
          </Link>
        </div>
        <nav className="hidden md:flex gap-8 text-base font-medium">
          {NAV_LINKS.map(link => (
            <Link 
              key={link.label} 
              href={link.href} 
              className="hover:text-blue-400 transition-all hover:translate-x-1"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <Button 
          onClick={handleWhatsAppClick} 
          className="bg-blue-600 text-white font-bold hover:bg-blue-500 hover-lift"
        >
          <MessageCircle className="mr-2 h-5 w-5" /> WhatsApp
        </Button>
      </div>
    </header>
  );
}

export default function Beneficios() {
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [galleryImages, setGalleryImages] = useState<CarouselImage[]>([]);
  const [loadingGallery, setLoadingGallery] = useState(false);

  const openGallery = async () => {
    setIsGalleryOpen(true);
    try {
      setLoadingGallery(true);
      const response = await fetch('/api/carousel-images');
      if (!response.ok) {
        throw new Error('Error fetching gallery images');
      }
      const data = await response.json();
      setGalleryImages(data);
    } catch (error) {
      console.error('Error fetching gallery images:', error);
    } finally {
      setLoadingGallery(false);
    }
  };

  const closeGallery = () => {
    setIsGalleryOpen(false);
    setGalleryImages([]);
  };

  return (
    <main className="min-h-screen bg-gray-900 text-white">
      <Header />

      <section className="py-16 bg-gray-800 shadow-xl">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-8 text-white">
            Experiencias BIMCAT
          </h2>
          
          <div className="mb-8">
             <Carousel />
          </div>

          <div className="text-center">
            <Button
              size="lg"
              variant="outline"
              className="border-blue-400 text-blue-400 hover:bg-blue-400/10 hover-lift"
              onClick={openGallery}
            >
              Ver Todas las Imágenes
            </Button>
          </div>

        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-extrabold text-center mb-4 text-blue-400 animate-fade-in">
            Beneficios de Aprender con BIMCAT
          </h1>
          <p className="text-center text-lg text-white/80 mb-12 max-w-2xl mx-auto animate-fade-in">
            Descubre todas las ventajas de formarte con nosotros: calidad, certificación, comunidad y oportunidades reales para tu desarrollo profesional.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-5xl mx-auto mb-16">
            <div className="rounded-2xl border border-blue-400/30 bg-gray-800 p-10 flex flex-col items-center text-center hover:shadow-lg transition-all hover-lift animate-slide-up">
              <Laptop2 className="w-14 h-14 text-blue-400 mb-4 hover-glow" />
              <h3 className="font-bold text-xl text-white mb-2">Aprendizaje Actualizado</h3>
              <p className="text-white/70">Contenidos alineados a las últimas tendencias y necesidades del sector.</p>
            </div>
            <div className="rounded-2xl border border-blue-400/30 bg-gray-800 p-10 flex flex-col items-center text-center hover:shadow-lg transition-all hover-lift animate-slide-up" style={{ animationDelay: '0.1s' }}>
              <GraduationCap className="w-14 h-14 text-blue-400 mb-4 hover-glow" />
              <h3 className="font-bold text-xl text-white mb-2">Certificación Reconocida</h3>
              <p className="text-white/70">Obtén certificados que avalan tus conocimientos y mejoran tu perfil profesional.</p>
            </div>
            <div className="rounded-2xl border border-blue-400/30 bg-gray-800 p-10 flex flex-col items-center text-center hover:shadow-lg transition-all hover-lift animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <UserCheck className="w-14 h-14 text-blue-400 mb-4 hover-glow" />
              <h3 className="font-bold text-xl text-white mb-2">Oportunidades Laborales</h3>
              <p className="text-white/70">Conecta con empleadores y accede a proyectos reales a través de nuestra red.</p>
            </div>
            <div className="rounded-2xl border border-blue-400/30 bg-gray-800 p-10 flex flex-col items-center text-center hover:shadow-lg transition-all hover-lift animate-slide-up" style={{ animationDelay: '0.3s' }}>
              <Star className="w-14 h-14 text-blue-400 mb-4 hover-glow" />
              <h3 className="font-bold text-xl text-white mb-2">Docentes Expertos</h3>
              <p className="text-white/70">Aprende de profesionales con experiencia comprobada en BIM y tecnología.</p>
            </div>
            <div className="rounded-2xl border border-blue-400/30 bg-gray-800 p-10 flex flex-col items-center text-center hover:shadow-lg transition-all hover-lift animate-slide-up" style={{ animationDelay: '0.4s' }}>
              <ShieldCheck className="w-14 h-14 text-blue-400 mb-4 hover-glow" />
              <h3 className="font-bold text-xl text-white mb-2">Soporte Personalizado</h3>
              <p className="text-white/70">Acompañamiento y asesoría durante todo tu proceso de aprendizaje.</p>
            </div>
            <div className="rounded-2xl border border-blue-400/30 bg-gray-800 p-10 flex flex-col items-center text-center hover:shadow-lg transition-all hover-lift animate-slide-up" style={{ animationDelay: '0.5s' }}>
              <Users className="w-14 h-14 text-blue-400 mb-4 hover-glow" />
              <h3 className="font-bold text-xl text-white mb-2">Comunidad Activa</h3>
              <p className="text-white/70">Forma parte de una red de estudiantes y profesionales que comparten conocimiento y oportunidades.</p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row justify-center gap-6 mt-8 animate-fade-in">
            <Button 
              size="lg" 
              className="bg-blue-600 text-white font-bold hover:bg-blue-500 hover-lift" 
              onClick={() => window.location.href = '/#cursos'}
            >
              Ver Cursos
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-blue-400 text-blue-400 hover:bg-blue-400/10 hover-lift" 
              onClick={() => window.location.href = '/contacto'}
            >
              Contactar
            </Button>
          </div>
        </div>
      </section>

      {isGalleryOpen && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-[110] p-4 animate-fade-in">
          <div className="bg-white rounded-lg p-6 w-full max-w-screen-lg max-h-[95vh] overflow-y-auto relative">
            <button 
              onClick={closeGallery}
              className="absolute top-4 right-4 text-gray-800 hover:text-gray-600 text-2xl font-bold"
            >
              &times;
            </button>
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Galería de Imágenes</h2>
            
            {loadingGallery ? (
              <div className="text-center text-gray-600">Cargando galería...</div>
            ) : galleryImages.length === 0 ? (
              <div className="text-center text-gray-600">No hay imágenes disponibles en la galería.</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {galleryImages.map((image) => (
                  <div key={image.id} className="relative w-full h-40 rounded-lg overflow-hidden shadow-md">
                    <Image
                      src={image.url}
                      alt={image.title || 'Imagen de galería'}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            )}

          </div>
        </div>
      )}
    </main>
  );
} 