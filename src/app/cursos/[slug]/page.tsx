'use client';

import { useState, useEffect } from 'react';
import type { Curso } from "@/data/cursos";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useParams, notFound } from "next/navigation";
import { MessageCircle, Menu, X } from "lucide-react";
import { cursosService } from '@/services/cursosService';
import Link from "next/link";

const NAV_LINKS = [
  { label: 'Inicio', href: '/' },
  { label: 'Cursos', href: '/cursos' },
  { label: 'Beneficios', href: '/beneficios' },
  { label: 'Contacto', href: '/contacto' },
];

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const handleWhatsAppClick = () => {
    window.open("https://wa.me/61863578", "_blank");
  };
  return (
    <header className="w-full border-b border-white/10 bg-gray-900 sticky top-0 z-50">
      <div className="w-full max-w-4xl mx-auto flex items-center justify-between py-4 px-2 sm:px-4">
        <div className="flex items-center gap-2">
          <Image 
            src="/logo.jpg" 
            alt="BIMCAT Logo" 
            width={60} 
            height={60} 
            className="rounded-full bg-white p-1 hover-scale transition-all" 
          />
          <span className="font-bold text-2xl tracking-tight text-white">BIMCAT</span>
        </div>
        <nav className="hidden md:flex gap-8 text-base font-medium">
          {NAV_LINKS.map(link => (
            <Link 
              key={link.label} 
              href={link.href} 
              className="text-white hover:text-blue-400 transition-colors"
              prefetch={true}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <Button onClick={handleWhatsAppClick} className="hidden md:flex bg-blue-600 text-white font-bold hover:bg-blue-500">
          <MessageCircle className="mr-2 h-5 w-5" /> WhatsApp
        </Button>
        <button
          className="block md:hidden p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Abrir menú de navegación"
        >
          <Menu className="h-7 w-7 text-white" />
        </button>
      </div>
      {menuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-gray-900 border-b border-white/10 z-50 animate-fade-in">
          <nav className="flex flex-col gap-2 py-4 px-6">
            {NAV_LINKS.map(link => (
              <Link
                key={link.label}
                href={link.href}
                className="text-white text-lg py-2 hover:text-blue-400 transition-colors"
                onClick={() => setMenuOpen(false)}
                prefetch={true}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}

export default function CursoPage() {
  const params = useParams();
  const [curso, setCurso] = useState<Curso | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);

  useEffect(() => {
    const loadCurso = async () => {
      try {
        setLoading(true);
        setError(null);
        const cursos = await cursosService.getCursos();
        const cursoEncontrado = cursos.find((c) => c.slug === params.slug);
        
        if (!cursoEncontrado) {
          setError('Curso no encontrado');
          return;
        }
        
        setCurso(cursoEncontrado);
      } catch (error) {
        console.error('Error al cargar el curso:', error);
        setError('Error al cargar el curso');
      } finally {
        setLoading(false);
      }
    };

    if (params.slug) {
      loadCurso();
    }
  }, [params.slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f6f8fa] flex items-center justify-center">
        <div className="text-gray-900">Cargando...</div>
      </div>
    );
  }

  if (error || !curso) {
    return (
      <div className="min-h-screen bg-[#f6f8fa] flex items-center justify-center">
        <div className="text-gray-900 text-center">
          <h1 className="text-2xl font-bold mb-4">Error</h1>
          <p>{error || 'No se encontró el curso'}</p>
          <Link href="/cursos" className="text-blue-400 hover:underline mt-4 inline-block">
            Volver a cursos
          </Link>
        </div>
      </div>
    );
  }

  const handleWhatsAppClick = () => {
    window.open("https://wa.me/61863578", "_blank");
  };

  const hasOffer = curso.offerPriceProfesional && curso.offerEndDate && new Date(curso.offerEndDate) > new Date();
  const startDate = curso.startDate ? new Date(curso.startDate + 'T00:00:00').toLocaleDateString() : 'Por definir';
  const endDate = curso.endDate ? new Date(curso.endDate + 'T00:00:00').toLocaleDateString() : 'Por definir';
  const offerEndDate = curso.offerEndDate ? new Date(curso.offerEndDate + 'T00:00:00').toLocaleDateString() : '';

  return (
    <main className="min-h-screen bg-[#f6f8fa] overflow-x-hidden">
      <Header />
      {/* Hero Section */}
      <div className="bg-gray-900 text-white py-12 md:py-20 w-full">
        <div className="w-full max-w-4xl mx-auto px-2 sm:px-4">
          <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-center">
            <div className="flex-1 w-full">
              <h1 className="text-3xl md:text-4xl font-extrabold mb-4 break-words">{curso.title}</h1>
              <p className="text-base md:text-lg text-white/80 mb-6 break-words">{curso.descLong}</p>
              <div className="grid grid-cols-2 md:flex md:flex-wrap gap-3 md:gap-4 mb-8">
                <div className="bg-white/10 px-3 md:px-4 py-2 rounded-lg">
                  <span className="block text-sm text-white/60">Duración</span>
                  <span className="font-semibold text-sm md:text-base">{curso.duration}</span>
                </div>
                <div className="bg-white/10 px-3 md:px-4 py-2 rounded-lg">
                  <span className="block text-sm text-white/60">Lecciones</span>
                  <span className="font-semibold text-sm md:text-base">{curso.lessons}</span>
                </div>
                <div className="bg-white/10 px-3 md:px-4 py-2 rounded-lg">
                  <span className="block text-sm text-white/60">Nivel</span>
                  <span className="font-semibold text-sm md:text-base">{curso.level}</span>
                </div>
                <div className="bg-white/10 px-3 md:px-4 py-2 rounded-lg">
                  <span className="block text-sm text-white/60">Fecha de Inicio</span>
                  <span className="font-semibold text-sm md:text-base">{startDate}</span>
                </div>
                <div className="bg-white/10 px-3 md:px-4 py-2 rounded-lg">
                  <span className="block text-sm text-white/60">Fecha de Fin</span>
                  <span className="font-semibold text-sm md:text-base">{endDate}</span>
                </div>
              </div>
              <div className="flex flex-col gap-2 mb-4">
                {hasOffer ? (
                  <>
                    <span className="text-base md:text-lg font-bold text-blue-400">OFERTA ESPECIAL POR INSCRIPCIÓN TEMPRANA</span>
                    <span className="text-sm md:text-base text-white">Profesional: <span className="text-blue-400 font-bold">{curso.offerPriceProfesional} Bs</span> <span className="line-through text-white/60 ml-2">{curso.priceProfesional} Bs</span></span>
                    <span className="text-sm md:text-base text-white">Estudiante: <span className="text-blue-400 font-bold">{curso.offerPriceEstudiante} Bs</span> <span className="line-through text-white/60 ml-2">{curso.priceEstudiante} Bs</span></span>
                    <span className="text-xs text-white/60">Oferta válida hasta {offerEndDate}</span>
                  </>
                ) : (
                  <>
                    {curso.priceEstudiante && String(curso.priceEstudiante).trim() !== '' ? (
                      <>
                        <span className="text-sm md:text-base text-white">Profesional: <span className="text-blue-400 font-bold">{curso.priceProfesional} Bs</span> <span className="text-xs">({(Number(curso.priceProfesional)/7).toFixed(2)} USD)</span></span>
                        <span className="text-sm md:text-base text-white">Estudiante: <span className="text-blue-400 font-bold">{curso.priceEstudiante} Bs</span> <span className="text-xs">({(Number(curso.priceEstudiante)/7).toFixed(2)} USD)</span></span>
                      </>
                    ) : (
                      <span className="text-sm md:text-base text-white">{curso.priceProfesional} Bs <span className="text-xs">({(Number(curso.priceProfesional)/7).toFixed(2)} USD)</span></span>
                    )}
                  </>
                )}
              </div>
              <Button 
                size="lg"
                className="w-full md:w-auto bg-blue-600 text-white font-bold hover:bg-blue-500"
                onClick={handleWhatsAppClick}
              >
                <MessageCircle className="mr-2 h-5 w-5" />
                Consultar por WhatsApp
              </Button>
            </div>
            <div className="flex-1 w-full max-w-lg flex items-center justify-center">
              <div 
                className="relative w-full h-[550px] rounded-2xl overflow-hidden border-4 border-blue-600 cursor-pointer transition-transform hover:scale-[1.02]"
                onClick={() => setIsImageModalOpen(true)}
              >
                <Image
                  src={curso.img}
                  alt={curso.title}
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Imagen */}
      {isImageModalOpen && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4" onClick={() => setIsImageModalOpen(false)}>
          <button 
            className="absolute top-4 right-4 text-white hover:text-blue-400 transition-colors"
            onClick={() => setIsImageModalOpen(false)}
          >
            <X className="h-8 w-8" />
          </button>
          <div 
            className="relative w-full max-w-4xl h-[80vh] cursor-zoom-in" 
            onClick={(e) => {
              e.stopPropagation();
              setIsZoomed(!isZoomed);
            }}
          >
            <Image
              src={curso.img}
              alt={curso.title}
              fill
              className={`object-contain transition-transform duration-300 ${isZoomed ? 'scale-150' : 'scale-100'}`}
              quality={100}
            />
          </div>
        </div>
      )}

      {/* Contenido del Curso */}
      <div className="w-full max-w-4xl mx-auto px-2 sm:px-4 py-8 md:py-16">
        <div className="grid md:grid-cols-[2fr_1fr] gap-6 md:gap-8 lg:gap-10 items-start">
          <div className="md:col-span-1 md:mr-0">
          
            <div className="bg-white rounded-2xl p-4 md:p-8 shadow-lg">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 md:mb-6">¿Qué aprenderás?</h2>
            
              {curso.temas && curso.temas.length > 0 ? (
                <ul className="space-y-4">
                  {curso.temas.map((tema, idx) => (
                    <li key={idx}>
                      <div className="font-bold text-blue-400 mb-1">{tema.titulo}</div>
                      <ul className="list-disc ml-6 text-gray-900">
                        {tema.contenidos.map((contenido, i) => (
                          <li key={i} className="text-sm md:text-base">{contenido}</li>
                        ))}
                      </ul>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-gray-900/70">No hay temario definido.</div>
              )}
            </div>

          </div>
          {/* Sidebar */}
          <div className="md:col-span-1 lg:ml-0 flex justify-center md:justify-end">
            <div className="bg-white rounded-2xl p-6 shadow-xl sticky top-24 border border-gray-100 max-w-xs w-full">
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 md:mb-6">Detalles del Curso</h3>
              <div className="space-y-4">
                {[
                  { label: "Instructor", value: curso.teacher },
                  { label: "Duración", value: curso.duration },
                  { label: "Lecciones", value: curso.lessons },
                  { label: "Nivel", value: curso.level },
                  { label: "Categoría", value: curso.categoria },
                  { label: "Fecha de Inicio", value: startDate },
                  hasOffer && { label: "Oferta válida hasta", value: offerEndDate },
                ]
                  .filter((item): item is { label: string; value: string } => Boolean(item) && typeof item === 'object' && 'label' in item && 'value' in item)
                  .map((item, idx) => (
                    <div key={idx} className="flex justify-between text-sm md:text-base text-gray-900">
                      <span className="text-gray-900/70">{item.label}</span>
                      <span className="font-medium text-right">{item.value}</span>
                    </div>
                  ))}
              </div>
              <Button
                className="w-full mt-8 bg-blue-600 text-white font-semibold hover:bg-blue-500 transition-colors"
                onClick={handleWhatsAppClick}
              >
                <MessageCircle className="mr-2 h-5 w-5" />
                Consultar por WhatsApp
              </Button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
} 