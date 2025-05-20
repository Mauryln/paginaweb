'use client';

import { useState, useEffect } from 'react';
import type { Curso } from "@/data/cursos";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useParams, notFound } from "next/navigation";
import { MessageCircle } from "lucide-react";
import { cursosService } from '@/services/cursosService';

export default function CursoPage() {
  const params = useParams();
  const [curso, setCurso] = useState<Curso | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCurso = async () => {
      try {
        const cursos = await cursosService.getCursos();
        const cursoEncontrado = cursos.find((c) => c.slug === params.slug);
        if (cursoEncontrado) {
          setCurso(cursoEncontrado);
        }
      } catch (error) {
        console.error('Error al cargar el curso:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCurso();
  }, [params.slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f6f8fa] flex items-center justify-center">
        <div className="text-[#1a1144]">Cargando...</div>
      </div>
    );
  }

  if (!curso) {
    notFound();
  }

  const handleWhatsAppClick = () => {
    window.open("https://wa.me/61863578", "_blank");
  };

  return (
    <main className="min-h-screen bg-[#f6f8fa]">
      {/* Hero Section */}
      <div className="bg-[#1a1144] text-white py-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-12 items-center">
            <div className="flex-1">
              <h1 className="text-4xl md:text-5xl font-extrabold mb-4">{curso.title}</h1>
              <p className="text-lg text-white/80 mb-6">{curso.descLong}</p>
              <div className="flex flex-wrap gap-4 mb-8">
                <div className="bg-white/10 px-4 py-2 rounded-lg">
                  <span className="block text-sm text-white/60">Duración</span>
                  <span className="font-semibold">{curso.duration}</span>
                </div>
                <div className="bg-white/10 px-4 py-2 rounded-lg">
                  <span className="block text-sm text-white/60">Lecciones</span>
                  <span className="font-semibold">{curso.lessons}</span>
                </div>
                <div className="bg-white/10 px-4 py-2 rounded-lg">
                  <span className="block text-sm text-white/60">Nivel</span>
                  <span className="font-semibold">{curso.level}</span>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-2xl font-bold text-[#00ffae]">{curso.price}</span>
                <Button 
                  size="lg"
                  className="bg-[#00ffae] text-[#1a1144] font-bold hover:bg-[#00e6a0]"
                  onClick={handleWhatsAppClick}
                >
                  <MessageCircle className="mr-2 h-5 w-5" />
                  Consultar por WhatsApp
                </Button>
              </div>
            </div>
            <div className="flex-1 max-w-lg">
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
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-12">
          <div className="md:col-span-2">
            <h2 className="text-2xl font-bold text-[#1a1144] mb-6">¿Qué aprenderás?</h2>
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {curso.benefits.map((benefit, index) => (
                  <li key={index} className="flex items-center gap-3 text-[#1a1144]">
                    <span className="text-[#00b97c] flex-shrink-0">✔</span>
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>

            <h2 className="text-2xl font-bold text-[#1a1144] mt-12 mb-6">Descripción del Curso</h2>
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <p className="text-[#1a1144]/80 leading-relaxed">{curso.descLong}</p>
            </div>
          </div>

          {/* Sidebar */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-2xl p-6 shadow-lg sticky top-24">
              <h3 className="font-bold text-lg text-[#1a1144] mb-4">Información del Curso</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-2 border-b">
                  <span className="text-[#1a1144]/70">Instructor</span>
                  <span className="font-medium text-[#1a1144]">{curso.teacher}</span>
                </div>
                <div className="flex items-center justify-between pb-2 border-b">
                  <span className="text-[#1a1144]/70">Duración</span>
                  <span className="font-medium text-[#1a1144]">{curso.duration}</span>
                </div>
                <div className="flex items-center justify-between pb-2 border-b">
                  <span className="text-[#1a1144]/70">Lecciones</span>
                  <span className="font-medium text-[#1a1144]">{curso.lessons}</span>
                </div>
                <div className="flex items-center justify-between pb-2 border-b">
                  <span className="text-[#1a1144]/70">Nivel</span>
                  <span className="font-medium text-[#1a1144]">{curso.level}</span>
                </div>
                <div className="flex items-center justify-between pb-2 border-b">
                  <span className="text-[#1a1144]/70">Categoría</span>
                  <span className="font-medium text-[#1a1144]">{curso.categoria}</span>
                </div>
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