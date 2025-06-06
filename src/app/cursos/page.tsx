'use client';

import { useState, useEffect } from "react";
import type { Curso } from "@/data/cursos";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cursosService } from "@/services/cursosService";
import { MessageCircle } from "lucide-react";
import { Suspense } from "react";

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
          <Image 
            src="/logo.jpg" 
            alt="BIMCAT Logo" 
            width={40} 
            height={40} 
            className="rounded-full bg-white p-1 hover-scale transition-all" 
          />
          <span className="font-bold text-xl tracking-tight text-white">BIMCAT S.R.L</span>
        </div>
        <nav className="hidden md:flex gap-8 text-base font-medium">
          {NAV_LINKS.map(link => (
            <Link 
              key={link.label} 
              href={link.href} 
              className="text-white hover:text-blue-400 transition-all hover:translate-x-1"
              prefetch={true}
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

// Componente de carga
function LoadingSpinner() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="text-gray-900 animate-fade-in">Cargando...</div>
    </div>
  );
}

// Componente de lista de cursos
function CursosList({ cursos, filtroActual, setFiltroActual }: { 
  cursos: Curso[], 
  filtroActual: string, 
  setFiltroActual: (filtro: string) => void 
}) {
  // Filtrar primero por visibilidad
  const cursosVisibles = cursos.filter(curso => curso.visible !== false);

  // Generar categorías a partir de cursos visibles
  const categoriasFiltro = [
    'Todos',
    ...Array.from(new Set(cursosVisibles.map((c) => c.categoria))).filter(Boolean)
  ];

  // Filtrar por categoría seleccionada
  const cursosFiltrados = filtroActual === "Todos" 
    ? cursosVisibles
    : cursosVisibles.filter(curso => curso.categoria === filtroActual);

  // Si el filtro actual no tiene cursos visibles, resetear a 'Todos'
  useEffect(() => {
    if (filtroActual !== 'Todos' && cursosFiltrados.length === 0 && categoriasFiltro.includes(filtroActual)) {
      setFiltroActual('Todos');
    }
  }, [cursosFiltrados, filtroActual, categoriasFiltro, setFiltroActual]);

  return (
    <>
      <div className="flex flex-wrap justify-center gap-3 mb-10 animate-fade-in">
        {categoriasFiltro.map((categoria) => (
          <button 
            key={categoria}
            className={`px-4 py-2 rounded-full ${
              filtroActual === categoria 
                ? 'bg-blue-600 text-white' 
                : 'bg-white text-gray-900 border border-blue-600'
            } font-semibold shadow hover:bg-blue-500 transition-all hover-lift`}
            onClick={() => setFiltroActual(categoria)}
          >
            {categoria}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {cursosFiltrados.map((curso) => (
          <CursoCard key={curso.id} curso={curso} />
        ))}
      </div>
    </>
  );
}

function CursoCard({ curso }: { curso: Curso }) {
  return (
    <Link href={`/cursos/${curso.slug}`}>
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col h-full hover:shadow-xl transition-all hover-lift">
        {curso.thumbnail && (
          <div className="relative h-48 w-full">
            <Image 
              src={curso.thumbnail} 
              alt={curso.title} 
              fill 
              className="object-cover object-top" 
            />
          </div>
        )}
        <div className="p-6 flex flex-col flex-1">
          <h3 className="font-bold text-lg text-gray-900 mb-1">{curso.title}</h3>
          <p className="text-gray-900/70 mb-3 text-sm flex-1">{curso.desc}</p>
          <div className="flex flex-wrap gap-2 text-xs text-gray-900/80 mb-3">
            <span>📚 {curso.lessons}</span>
            <span>⏱ {curso.duration}</span>
            <span>🎯 {curso.level}</span>
          </div>
          {curso.priceEstudiante && String(curso.priceEstudiante).trim() !== '' ? (
            <div className="flex flex-col">
              <span className="font-semibold text-blue-600 text-base">Profesional: {curso.priceProfesional} Bs ({(Number(curso.priceProfesional)/7).toFixed(2)} USD)</span>
              <span className="font-semibold text-blue-600 text-base">Estudiante: {curso.priceEstudiante} Bs ({(Number(curso.priceEstudiante)/7).toFixed(2)} USD)</span>
            </div>
          ) : (
            <span className="font-semibold text-blue-600 text-base">{curso.priceProfesional} Bs ({(Number(curso.priceProfesional)/7).toFixed(2)} USD)</span>
          )}
          <div className="mt-3 text-xs text-gray-900/60">👤 {curso.teacher}</div>
        </div>
      </div>
    </Link>
  );
}

export default function CursosPage() {
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [filtroActual, setFiltroActual] = useState("Todos");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = cursosService.subscribe((updatedCursos) => {
      setCursos(updatedCursos);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <main className="min-h-screen bg-gray-100">
      <Header />
      <div className="container mx-auto px-4 py-20">
        <h1 className="text-4xl font-extrabold text-center mb-2 text-gray-900 animate-fade-in">
          Nuestros Cursos
        </h1>
        <p className="text-center text-lg text-gray-900/70 mb-12 animate-fade-in">
          Explora nuestra selección de cursos y encuentra el que mejor se adapte a tus necesidades
        </p>

        <Suspense fallback={<LoadingSpinner />}>
          <CursosList 
            cursos={cursos} 
            filtroActual={filtroActual} 
            setFiltroActual={setFiltroActual} 
          />
        </Suspense>
      </div>
    </main>
  );
} 