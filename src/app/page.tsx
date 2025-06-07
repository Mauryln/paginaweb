'use client';

import { JSX } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ShoppingCart, MessageCircle, ArrowRight, GraduationCap, Home as HomeIcon, Sun, Briefcase, Laptop, BookOpen, Cpu, Users, Mic, Monitor, Paintbrush, Compass, Printer, Laptop2, UserCheck, GraduationCap as GradCap, Facebook, Instagram, Linkedin, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { cursos as defaultCursos } from "@/data/cursos";
import type { Curso } from "@/data/cursos";
import Link from "next/link";
import { cursosService } from "@/services/cursosService";

const NAV_LINKS = [
  { label: 'Inicio', href: '/' },
  { label: 'Cursos', href: '/cursos' },
  { label: 'Beneficios', href: '/beneficios' },
  { label: 'Contacto', href: '/contacto' },
];

// Card de servicio
function ServicioCard({ icon, title, style, className }: { icon: string; title: string; style?: React.CSSProperties; className?: string }) {
  const icons: Record<string, JSX.Element> = {
    "graduation-cap": <GraduationCap className="w-10 h-10 text-gray-900" />,
    home: <HomeIcon className="w-10 h-10 text-gray-900" />,
    sun: <Sun className="w-10 h-10 text-gray-900" />,
    briefcase: <Briefcase className="w-10 h-10 text-gray-900" />,
    laptop: <Laptop className="w-10 h-10 text-gray-900" />,
    "book-open": <BookOpen className="w-10 h-10 text-gray-900" />,
    cpu: <Cpu className="w-10 h-10 text-gray-900" />,
    users: <Users className="w-10 h-10 text-gray-900" />,
    mic: <Mic className="w-10 h-10 text-gray-900" />,
    monitor: <Monitor className="w-10 h-10 text-gray-900" />,
    paintbrush: <Paintbrush className="w-10 h-10 text-gray-900" />,
    compass: <Compass className="w-10 h-10 text-gray-900" />,
    printer: <Printer className="w-10 h-10 text-gray-900" />,
  };
  return (
    <div className={`bg-gray-100 rounded-2xl shadow p-8 flex flex-col items-center text-center hover:shadow-lg transition-transform hover:scale-105 duration-300 ${className || ''}`} style={style}>
      <div className="bg-white rounded-full p-4 mb-4 flex items-center justify-center shadow hover-glow">
        {icons[icon]}
      </div>
      <h3 className="font-semibold text-lg mb-1 text-gray-900">{title}</h3>
    </div>
  );
}

// Componente de Card de Curso
function CursoCard({ curso }: { curso: any }) {
  return (
    <Link href={`/cursos/${curso.slug}`}>
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col h-full hover:shadow-xl transition-all hover-lift">
        <div className="relative h-48 w-full">
          <Image 
            src={curso.thumbnail || curso.img} 
            alt={curso.title} 
            fill 
            className="object-cover" 
          />
        </div>
        <div className="p-6 flex flex-col flex-1">
          <h3 className="font-bold text-lg text-gray-900 mb-1 truncate">{curso.title}</h3>
          <p className="text-gray-900/70 mb-3 text-sm flex-1 overflow-hidden text-ellipsis">{curso.desc}</p>
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

// Componente Modal de Detalle de Curso
function CursoDetalleModal({ open, onClose, curso }: { open: boolean; onClose: () => void; curso: any }) {
  if (!open || !curso) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-6 md:p-8 relative text-gray-900 animate-fade-in max-h-[90vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-3 right-3 md:top-4 md:right-4 text-blue-600 text-xl md:text-2xl font-bold">×</button>
        <div className="flex flex-col md:flex-row gap-4 md:gap-6">
          <div className="flex-shrink-0 w-full md:w-56 h-48 md:h-56 relative rounded-xl overflow-hidden border-2 border-blue-600">
            <Image src={curso.img} alt={curso.title} fill className="object-cover" />
          </div>
          <div className="flex-1 flex flex-col">
            <h2 className="text-xl md:text-2xl font-extrabold mb-2">{curso.title}</h2>
            <div className="flex flex-wrap gap-2 text-xs text-gray-900/80 mb-2">
              <span>📚 {curso.lessons}</span>
              <span>⏱ {curso.duration}</span>
              <span>🎯 {curso.level}</span>
            </div>
            <div className="mb-3 text-gray-900/70 text-sm">{curso.descLong || curso.desc}</div>
            <div className="flex items-center gap-4 mt-auto flex-wrap">
              <span className="font-semibold text-blue-600 text-lg md:text-xl">{curso.price}</span>
              <Button size="sm" className="bg-blue-600 text-white font-bold hover:bg-blue-500" onClick={curso.onWhatsApp}>
                WhatsApp
              </Button>
            </div>
            <div className="mt-2 text-xs text-gray-900/60">👤 {curso.teacher}</div>
          </div>
        </div>
        {/* Simulación de tabs y contenido adicional */}
        <div className="mt-6">
          <div className="flex flex-wrap gap-4 md:gap-6 border-b mb-4">
            <button className="pb-2 border-b-2 border-blue-600 font-semibold text-sm md:text-base">Descripción</button>
            <button className="pb-2 text-gray-900/50 text-sm md:text-base">Contenido</button>
            <button className="pb-2 text-gray-900/50 text-sm md:text-base">Instructor</button>
            <button className="pb-2 text-gray-900/50 text-sm md:text-base">Opiniones</button>
          </div>
          <div className="text-sm text-gray-900/80">
            {curso.descLong || 'Este curso te permitirá dominar las habilidades clave para avanzar en tu carrera profesional.'}
          </div>
          <ul className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
            {curso.temas?.map((tema: any, idx: number) => (
              <li key={`${tema.titulo}-${idx}`}>
                <div className="font-bold text-blue-600 mb-1">{tema.titulo}</div>
                <ul className="list-disc ml-6 text-gray-900">
                  {tema.contenidos.map((contenido: string, i: number) => (
                    <li key={`${contenido}-${i}`}>{contenido}</li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [filtroActual, setFiltroActual] = useState("Todos");
  const [loading, setLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = cursosService.subscribe((updatedCursos) => {
      setCursos(updatedCursos);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleWhatsAppClick = () => {
    window.open("https://wa.me/61863578", "_blank");
  };

  // Estado para el modal y el curso seleccionado
  const [modalOpen, setModalOpen] = useState(false);
  const [cursoSeleccionado, setCursoSeleccionado] = useState<any>(null);
  
  // Filtrar cursos visibles primero
  const cursosVisibles = cursos.filter(curso => curso.visible !== false);

  // Categorías de filtro disponibles (generadas a partir de cursos visibles)
  const categoriasFiltro = [
    'Todos',
    ...Array.from(new Set(cursosVisibles.map((c) => c.categoria))).filter(Boolean)
  ];

  // Filtrar cursos según la categoría seleccionada
  const cursosFiltrados = filtroActual === "Todos" 
    ? cursosVisibles
    : cursosVisibles.filter(curso => curso.categoria === filtroActual);

  // Si el filtro actual no tiene cursos visibles, resetear a 'Todos'
  useEffect(() => {
    if (filtroActual !== 'Todos' && cursosFiltrados.length === 0 && categoriasFiltro.includes(filtroActual)) {
      setFiltroActual('Todos');
    }
  }, [cursosFiltrados, filtroActual, categoriasFiltro, setFiltroActual]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-gray-900">Cargando...</div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="w-full border-b border-gray-100 bg-gray-900 sticky top-0 z-50">
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

          <button 
            className="md:hidden text-white focus:outline-none" 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </header>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 bg-gray-900 z-40 flex flex-col items-center justify-center space-y-8 animate-fade-in">
          {NAV_LINKS.map((link, idx) => (
            <a 
              key={`${link.label}-${idx}`} 
              href={link.href} 
              className="text-3xl font-bold text-white hover:text-blue-400 transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {link.label}
            </a>
          ))}
          <Button 
            onClick={() => { handleWhatsAppClick(); setIsMobileMenuOpen(false); }} 
            className="bg-blue-600 text-white font-bold hover:bg-blue-500 hover-lift text-xl py-3 px-6"
          >
            <MessageCircle className="mr-2 h-6 w-6" /> WhatsApp
          </Button>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-24 md:pt-24 md:pb-32">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between px-4 gap-8">
          {/* Texto */}
          <div className="flex-1 max-w-xl animate-fade-in">
            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-6">
              Aprende nuevas habilidades online<br />con <span className="text-blue-400">expertos BIM</span>
            </h1>
            <p className="text-lg md:text-xl mb-8 text-white/80">
              Cursos, consultoría y actualización tecnológica en construcción y BIM. ¡Impulsa tu carrera con nosotros!
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                className="bg-blue-600 text-white font-bold hover:bg-blue-500 hover-lift" 
                onClick={() => window.location.hash = 'cursos'}
              >
                Ver Cursos <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-blue-600 text-blue-400 bg-gray-800 hover:bg-gray-700 hover-lift" 
                onClick={handleWhatsAppClick}
              >
                Consultar por WhatsApp
              </Button>
            </div>
          </div>
          {/* Imagen destacada */}
          <div className="flex-1 flex justify-center md:justify-end w-full relative animate-slide-up">
            <div className="w-full md:max-w-lg aspect-video rounded-3xl overflow-hidden shadow-2xl border-4 border-blue-600 bg-white/10">
              <Image
                src="/banner1.jpg"
                alt="Hero"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
        {/* Efecto decorativo */}
        <div className="absolute left-0 top-0 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-3xl -z-10" />
      </section>

      {/* Cursos Populares Section */}
      <section id="cursos" className="bg-gray-100 py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-2 text-gray-900 animate-fade-in">
            Cursos Populares
          </h2>
          <p className="text-center text-lg text-gray-900/70 mb-8 animate-fade-in">
            ¡Explora nuestros cursos más demandados y potencia tu perfil profesional!
          </p>
          
          {/* Filtros de categoría con funcionalidad */}
          <div className="flex flex-wrap justify-center gap-3 mb-10">
            {categoriasFiltro.map((categoria, idx) => (
              <button 
                key={`${categoria}-${idx}`}
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
          
          {/* Grid de cursos filtrados */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {cursosFiltrados.map((curso, idx) => (
              <CursoCard key={`${curso.id}-${idx}`} curso={curso} />
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/cursos">
              <Button size="lg" className="bg-blue-600 text-white font-bold hover:bg-blue-500">
                Ver Todos los Cursos <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Sección: ¿Por qué aprender con nuestros cursos? */}
      <section className="bg-gray-900 py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-2 text-white">¿Por qué aprender con nuestros cursos?</h2>
          <p className="text-center text-lg text-white/70 mb-12">Impulsa tu carrera con formación de calidad, certificación y oportunidades laborales.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="rounded-2xl border border-blue-600/30 bg-gray-800 p-10 flex flex-col items-center text-center hover:shadow-lg transition-transform hover:scale-105 duration-300">
              <Laptop2 className="w-14 h-14 text-blue-400 mb-4" />
              <h3 className="font-bold text-xl text-white mb-2">01. Aprende</h3>
              <p className="text-white/70">Accede a contenido actualizado y aprende de expertos en BIM, tecnología y negocios.</p>
            </div>
            <div className="rounded-2xl border border-blue-600/30 bg-gray-800 p-10 flex flex-col items-center text-center hover:shadow-lg transition-transform hover:scale-105 duration-300">
              <GradCap className="w-14 h-14 text-blue-400 mb-4" />
              <h3 className="font-bold text-xl text-white mb-2">02. Certifícate</h3>
              <p className="text-white/70">Obtén certificados que avalan tus conocimientos y mejoran tu perfil profesional.</p>
            </div>
            <div className="rounded-2xl border border-blue-600/30 bg-gray-800 p-10 flex flex-col items-center text-center hover:shadow-lg transition-transform hover:scale-105 duration-300">
              <UserCheck className="w-14 h-14 text-blue-400 mb-4" />
              <h3 className="font-bold text-xl text-white mb-2">03. Trabaja</h3>
              <p className="text-white/70">Conecta con oportunidades laborales y proyectos reales a través de nuestra red.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Servicios Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-2">Nuestros Servicios</h2>
          <p className="text-center text-lg text-white/70 mb-12">Soluciones integrales para tu desarrollo profesional y empresarial.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            <ServicioCard icon="graduation-cap" title="Consultoría BIM / Capacitación" className="animate-slide-up" style={{ animationDelay: '0s' }} />
            <ServicioCard icon="home" title="Peciba Homes – Agencia Inmobiliaria" className="animate-slide-up" style={{ animationDelay: '0.05s' }}/>
            <ServicioCard icon="sun" title="Eversur – Paneles Solares" className="animate-slide-up" style={{ animationDelay: '0.1s' }}/>
            <ServicioCard icon="briefcase" title="Centro Empresarial Emprendedurismo Bimcat" className="animate-slide-up" style={{ animationDelay: '0.15s' }}/>
            <ServicioCard icon="laptop" title="Informática – Tesis – Web – Redes" className="animate-slide-up" style={{ animationDelay: '0.2s' }}/>
            <ServicioCard icon="book-open" title="Posgrado Univalle – Funcipro" className="animate-slide-up" style={{ animationDelay: '0.25s' }}/>
            <ServicioCard icon="cpu" title="Robótica – Ofimática – Ajedrez" className="animate-slide-up" style={{ animationDelay: '0.3s' }}/>
            <ServicioCard icon="mic" title="Producción de Espectáculos" className="animate-slide-up" style={{ animationDelay: '0.35s' }}/>
            <ServicioCard icon="monitor" title="Alquileres Data & Ecram" className="animate-slide-up" style={{ animationDelay: '0.4s' }}/>
            <ServicioCard icon="paintbrush" title="BD Home Servicios Pintura – Refacción" className="animate-slide-up" style={{ animationDelay: '0.45s' }}/>
            <ServicioCard icon="compass" title="Servicios de Ing-Top-Arq-Consult" className="animate-slide-up" style={{ animationDelay: '0.5s' }}/>
            <ServicioCard icon="printer" title="Impresión 3D – Venta de Software" className="animate-slide-up" style={{ animationDelay: '0.55s' }}/>
          </div>
        </div>
      </section>
    </main>
  );
}