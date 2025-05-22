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
    <header className="w-full border-b border-white/10 bg-[#1a1144] sticky top-0 z-50">
      <div className="container mx-auto flex items-center justify-between py-4 px-4">
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
        <Button onClick={handleWhatsAppClick} className="bg-[#00ffae] text-[#1a1144] font-bold hover:bg-[#00e6a0]">
          <MessageCircle className="mr-2 h-5 w-5" /> WhatsApp
        </Button>
      </div>
    </header>
  );
}

// Componente de carga
function LoadingSpinner() {
  return (
    <div className="min-h-screen bg-[#f6f8fa] flex items-center justify-center">
      <div className="text-[#1a1144]">Cargando...</div>
    </div>
  );
}

// Componente de lista de cursos
function CursosList({ cursos, filtroActual, setFiltroActual }: { 
  cursos: Curso[], 
  filtroActual: string, 
  setFiltroActual: (filtro: string) => void 
}) {
  const categoriasFiltro = [
    'Todos',
    ...Array.from(new Set(cursos.map((c) => c.categoria))).filter(Boolean)
  ];
  const cursosFiltrados = filtroActual === "Todos" 
    ? cursos.filter(curso => curso.visible !== false)
    : cursos.filter(curso => curso.categoria === filtroActual && curso.visible !== false);

  return (
    <>
      <div className="flex flex-wrap justify-center gap-3 mb-10">
        {categoriasFiltro.map((categoria) => (
          <button 
            key={categoria}
            className={`px-4 py-2 rounded-full ${
              filtroActual === categoria 
                ? 'bg-[#00ffae] text-[#1a1144]' 
                : 'bg-white text-[#1a1144] border border-[#00ffae]'
            } font-semibold shadow hover:bg-[#00e6a0] transition`}
            onClick={() => setFiltroActual(categoria)}
          >
            {categoria}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {cursosFiltrados.map((curso) => (
          <Link href={`/cursos/${curso.slug}`} key={curso.id}>
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col h-full hover:shadow-xl transition-all">
              <div className="relative h-48 w-full">
                <Image src={curso.img} alt={curso.title} fill className="object-cover" />
              </div>
              <div className="p-6 flex flex-col flex-1">
                <h3 className="font-bold text-lg text-[#1a1144] mb-1">{curso.title}</h3>
                <p className="text-[#1a1144]/70 mb-3 text-sm flex-1">{curso.desc}</p>
                <div className="flex flex-wrap gap-2 text-xs text-[#1a1144]/80 mb-3">
                  <span>📚 {curso.lessons}</span>
                  <span>⏱ {curso.duration}</span>
                  <span>🎯 {curso.level}</span>
                </div>
                <div className="flex items-center justify-between mt-auto">
                  {curso.priceEstudiante && String(curso.priceEstudiante).trim() !== '' ? (
                    <div className="flex flex-col">
                      <span className="font-semibold text-[#00b97c] text-base">Profesional: {curso.priceProfesional} Bs ({(Number(curso.priceProfesional)/7).toFixed(2)} USD)</span>
                      <span className="font-semibold text-[#00b97c] text-base">Estudiante: {curso.priceEstudiante} Bs ({(Number(curso.priceEstudiante)/7).toFixed(2)} USD)</span>
                    </div>
                  ) : (
                    <span className="font-semibold text-[#00b97c] text-base">{curso.priceProfesional} Bs ({(Number(curso.priceProfesional)/7).toFixed(2)} USD)</span>
                  )}
                  <Button size="sm" className="bg-[#00ffae] text-[#1a1144] font-bold hover:bg-[#00e6a0]">
                    Ver Detalles
                  </Button>
                </div>
                <div className="mt-3 text-xs text-[#1a1144]/60">👤 {curso.teacher}</div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </>
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
    <main className="min-h-screen bg-[#f6f8fa]">
      <Header />
      <div className="container mx-auto px-4 py-20">
        <h1 className="text-4xl font-extrabold text-center mb-2 text-[#1a1144]">Nuestros Cursos</h1>
        <p className="text-center text-lg text-[#1a1144]/70 mb-12">
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