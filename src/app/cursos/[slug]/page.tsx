'use client';

import { useState, useEffect } from 'react';
import type { Curso } from "@/data/cursos";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useParams, notFound } from "next/navigation";
import { MessageCircle, Menu } from "lucide-react";
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
    <header className="w-full border-b border-white/10 bg-[#1a1144] sticky top-0 z-50">
      <div className="w-full max-w-4xl mx-auto flex items-center justify-between py-4 px-2 sm:px-4">
        <div className="flex items-center gap-2">
          <Image src="/logo.jpg" alt="BIMCAT Logo" width={40} height={40} className="rounded-full bg-white p-1" />
          <span className="font-bold text-xl tracking-tight text-white">BIMCAT</span>
        </div>
        <nav className="hidden md:flex gap-8 text-base font-medium">
          {NAV_LINKS.map(link => (
            <Link 
              key={link.label} 
              href={link.href} 
              className="text-white hover:text-[#00ffae] transition-colors"
              prefetch={true}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <Button onClick={handleWhatsAppClick} className="hidden md:flex bg-[#00ffae] text-[#1a1144] font-bold hover:bg-[#00e6a0]">
          <MessageCircle className="mr-2 h-5 w-5" /> WhatsApp
        </Button>
        <button
          className="block md:hidden p-2 rounded focus:outline-none focus:ring-2 focus:ring-[#00ffae]"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Abrir menú de navegación"
        >
          <Menu className="h-7 w-7 text-white" />
        </button>
      </div>
      {menuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-[#1a1144] border-b border-white/10 z-50 animate-fade-in">
          <nav className="flex flex-col gap-2 py-4 px-6">
            {NAV_LINKS.map(link => (
              <Link
                key={link.label}
                href={link.href}
                className="text-white text-lg py-2 hover:text-[#00ffae] transition-colors"
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
        <div className="text-[#1a1144]">Cargando...</div>
      </div>
    );
  }

  if (error || !curso) {
    return (
      <div className="min-h-screen bg-[#f6f8fa] flex items-center justify-center">
        <div className="text-[#1a1144] text-center">
          <h1 className="text-2xl font-bold mb-4">Error</h1>
          <p>{error || 'No se encontró el curso'}</p>
          <Link href="/cursos" className="text-[#00ffae] hover:underline mt-4 inline-block">
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
      <div className="bg-[#1a1144] text-white py-12 md:py-20 w-full">
        <div className="w-full max-w-4xl mx-auto px-2 sm:px-4">
          <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-center">
            <div className="flex-1 w-full">
              <h1 className="text-3xl md:text-5xl font-extrabold mb-4 break-words">{curso.title}</h1>
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
                    <span className="text-base md:text-lg font-bold text-[#00ffae]">OFERTA ESPECIAL POR INSCRIPCIÓN TEMPRANA</span>
                    <span className="text-sm md:text-base text-white">Profesional: <span className="text-[#00ffae] font-bold">{curso.offerPriceProfesional} Bs</span> <span className="line-through text-white/60 ml-2">{curso.priceProfesional} Bs</span></span>
                    <span className="text-sm md:text-base text-white">Estudiante: <span className="text-[#00ffae] font-bold">{curso.offerPriceEstudiante} Bs</span> <span className="line-through text-white/60 ml-2">{curso.priceEstudiante} Bs</span></span>
                    <span className="text-xs text-white/60">Oferta válida hasta {offerEndDate}</span>
                  </>
                ) : (
                  <>
                    {curso.priceEstudiante && String(curso.priceEstudiante).trim() !== '' ? (
                      <>
                        <span className="text-sm md:text-base text-white">Profesional: <span className="text-[#00ffae] font-bold">{curso.priceProfesional} Bs</span> <span className="text-xs">({(Number(curso.priceProfesional)/7).toFixed(2)} USD)</span></span>
                        <span className="text-sm md:text-base text-white">Estudiante: <span className="text-[#00ffae] font-bold">{curso.priceEstudiante} Bs</span> <span className="text-xs">({(Number(curso.priceEstudiante)/7).toFixed(2)} USD)</span></span>
                      </>
                    ) : (
                      <span className="text-sm md:text-base text-white">{curso.priceProfesional} Bs <span className="text-xs">({(Number(curso.priceProfesional)/7).toFixed(2)} USD)</span></span>
                    )}
                  </>
                )}
              </div>
              <Button 
                size="lg"
                className="w-full md:w-auto bg-[#00ffae] text-[#1a1144] font-bold hover:bg-[#00e6a0]"
                onClick={handleWhatsAppClick}
              >
                <MessageCircle className="mr-2 h-5 w-5" />
                Consultar por WhatsApp
              </Button>
            </div>
            <div className="flex-1 w-full max-w-lg">
              <div className="relative aspect-video rounded-2xl overflow-hidden border-4 border-[#00ffae]">
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

      {/* Contenido del Curso */}
      <div className="w-full max-w-4xl mx-auto px-2 sm:px-4 py-8 md:py-16">
        <div className="grid md:grid-cols-3 gap-8 md:gap-12">
          <div className="md:col-span-2">
            <h2 className="text-xl md:text-2xl font-bold text-[#1a1144] mb-4 md:mb-6">¿Qué aprenderás?</h2>
            <div className="bg-white rounded-2xl p-4 md:p-8 shadow-lg">
              {curso.temas && curso.temas.length > 0 ? (
                <ul className="space-y-4">
                  {curso.temas.map((tema, idx) => (
                    <li key={idx}>
                      <div className="font-bold text-[#00b97c] mb-1">{tema.titulo}</div>
                      <ul className="list-disc ml-6 text-[#1a1144]">
                        {tema.contenidos.map((contenido, i) => (
                          <li key={i} className="text-sm md:text-base">{contenido}</li>
                        ))}
                      </ul>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-[#1a1144]/70">No hay temario definido.</div>
              )}
            </div>

            <h2 className="text-xl md:text-2xl font-bold text-[#1a1144] mt-8 md:mt-12 mb-4 md:mb-6">Descripción del Curso</h2>
            <div className="bg-white rounded-2xl p-4 md:p-8 shadow-lg">
              <p className="text-[#1a1144]/80 leading-relaxed text-sm md:text-base">{curso.descLong}</p>
            </div>
          </div>

          {/* Sidebar */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-2xl p-4 md:p-6 shadow-lg sticky top-24">
              <h3 className="font-bold text-base md:text-lg text-[#1a1144] mb-4">Información del Curso</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-2 border-b">
                  <span className="text-sm md:text-base text-[#1a1144]/70">Instructor</span>
                  <span className="font-medium text-sm md:text-base text-[#1a1144]">{curso.teacher}</span>
                </div>
                <div className="flex items-center justify-between pb-2 border-b">
                  <span className="text-sm md:text-base text-[#1a1144]/70">Duración</span>
                  <span className="font-medium text-sm md:text-base text-[#1a1144]">{curso.duration}</span>
                </div>
                <div className="flex items-center justify-between pb-2 border-b">
                  <span className="text-sm md:text-base text-[#1a1144]/70">Lecciones</span>
                  <span className="font-medium text-sm md:text-base text-[#1a1144]">{curso.lessons}</span>
                </div>
                <div className="flex items-center justify-between pb-2 border-b">
                  <span className="text-sm md:text-base text-[#1a1144]/70">Nivel</span>
                  <span className="font-medium text-sm md:text-base text-[#1a1144]">{curso.level}</span>
                </div>
                <div className="flex items-center justify-between pb-2 border-b">
                  <span className="text-sm md:text-base text-[#1a1144]/70">Categoría</span>
                  <span className="font-medium text-sm md:text-base text-[#1a1144]">{curso.categoria}</span>
                </div>
                <div className="flex items-center justify-between pb-2 border-b">
                  <span className="text-sm md:text-base text-[#1a1144]/70">Fecha de Inicio</span>
                  <span className="font-medium text-sm md:text-base text-[#1a1144]">{startDate}</span>
                </div>
                {hasOffer && (
                  <div className="flex items-center justify-between pb-2 border-b">
                    <span className="text-sm md:text-base text-[#1a1144]/70">Oferta válida hasta</span>
                    <span className="font-medium text-sm md:text-base text-[#1a1144]">{offerEndDate}</span>
                  </div>
                )}
              </div>
              <Button 
                className="w-full mt-6 bg-[#00ffae] text-[#1a1144] font-bold hover:bg-[#00e6a0]"
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