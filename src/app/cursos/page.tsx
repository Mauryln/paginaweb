'use client';

import { useState } from "react";
import { cursos } from "@/data/cursos";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function CursosPage() {
  // Categorías de filtro disponibles
  const categoriasFiltro = ["Todos", "BIM", "Arquitectura", "Ingeniería", "Tecnología"];
  const [filtroActual, setFiltroActual] = useState("Todos");

  // Filtrar cursos según la categoría seleccionada y visibilidad
  const cursosFiltrados = filtroActual === "Todos" 
    ? cursos.filter(curso => curso.visible !== false)
    : cursos.filter(curso => curso.categoria === filtroActual && curso.visible !== false);

  return (
    <main className="min-h-screen bg-[#f6f8fa] py-20">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-extrabold text-center mb-2 text-[#1a1144]">Nuestros Cursos</h1>
        <p className="text-center text-lg text-[#1a1144]/70 mb-12">
          Explora nuestra selección de cursos y encuentra el que mejor se adapte a tus necesidades
        </p>

        {/* Filtros de categoría */}
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

        {/* Grid de cursos */}
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
                    <span className="font-semibold text-[#00b97c] text-base">{curso.price}</span>
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
      </div>
    </main>
  );
} 