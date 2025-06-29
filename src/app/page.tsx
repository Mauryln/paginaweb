"use client"

import type React from "react"

import type { JSX } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import {
  MessageCircle,
  ArrowRight,
  GraduationCap,
  HomeIcon,
  Sun,
  Briefcase,
  Laptop,
  BookOpen,
  Cpu,
  Users,
  Mic,
  Monitor,
  Paintbrush,
  Compass,
  Printer,
  Laptop2,
  UserCheck,
  GraduationCapIcon as GradCap,
  Menu,
  X,
} from "lucide-react"
import { useState, useEffect } from "react"
import type { Curso } from "@/data/cursos"
import Link from "next/link"
import { cursosService } from "@/services/cursosService"

const NAV_LINKS = [
  { label: "Inicio", href: "/" },
  { label: "Cursos", href: "/cursos" },
  { label: "Sobre Nosotros", href: "/sobre-nosotros" },
  { label: "Contacto", href: "/contacto" },
]

// Card de servicio
function ServicioCard({
  icon,
  title,
  style,
  className,
}: { icon: string; title: string; style?: React.CSSProperties; className?: string }) {
  const icons: Record<string, JSX.Element> = {
    "graduation-cap": <GraduationCap className="w-10 h-10 text-black" />,
    home: <HomeIcon className="w-10 h-10 text-black" />,
    sun: <Sun className="w-10 h-10 text-black" />,
    briefcase: <Briefcase className="w-10 h-10 text-black" />,
    laptop: <Laptop className="w-10 h-10 text-black" />,
    "book-open": <BookOpen className="w-10 h-10 text-black" />,
    cpu: <Cpu className="w-10 h-10 text-black" />,
    users: <Users className="w-10 h-10 text-black" />,
    mic: <Mic className="w-10 h-10 text-black" />,
    monitor: <Monitor className="w-10 h-10 text-black" />,
    paintbrush: <Paintbrush className="w-10 h-10 text-black" />,
    compass: <Compass className="w-10 h-10 text-black" />,
    printer: <Printer className="w-10 h-10 text-black" />,
  }
  return (
    <div
      className={`bg-gray-100 rounded-2xl shadow p-8 flex flex-col items-center text-center hover:shadow-lg transition-transform hover:scale-105 duration-300 ${className || ""}`}
      style={style}
    >
      <div className="bg-white rounded-full p-4 mb-4 flex items-center justify-center shadow hover-glow">
        {icons[icon]}
      </div>
      <h3 className="font-semibold text-lg mb-1 text-black">{title}</h3>
    </div>
  )
}

// Componente de Card de Curso
function CursoCard({ curso }: { curso: Curso }) {
  return (
    <Link href={`/cursos/${curso.slug}`}>
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col h-full hover:shadow-xl transition-all hover-lift">
        <div className="relative h-48 w-full">
          <Image src={curso.thumbnail || curso.img} alt={curso.title} fill className="object-cover" />
        </div>
        <div className="p-6 flex flex-col flex-1">
          <h3 className="font-bold text-lg text-black mb-1 truncate">{curso.title}</h3>
          <p className="text-black/70 mb-3 text-sm flex-1 overflow-hidden text-ellipsis">{curso.desc}</p>
          <div className="flex flex-wrap gap-2 text-xs text-black/80 mb-3">
            <span>📚 {curso.lessons}</span>
            <span>⏱ {curso.duration}</span>
            <span>🎯 {curso.level}</span>
          </div>
          {curso.priceEstudiante && String(curso.priceEstudiante).trim() !== "" ? (
            <div className="flex flex-col">
              <span className="font-semibold text-blue-600 text-base">
                Profesional: {curso.priceProfesional} Bs ({(Number(curso.priceProfesional) / 7).toFixed(2)} USD)
              </span>
              <span className="font-semibold text-blue-600 text-base">
                Estudiante: {curso.priceEstudiante} Bs ({(Number(curso.priceEstudiante) / 7).toFixed(2)} USD)
              </span>
            </div>
          ) : (
            <span className="font-semibold text-blue-600 text-base">
              {curso.priceProfesional} Bs ({(Number(curso.priceProfesional) / 7).toFixed(2)} USD)
            </span>
          )}
          <div className="mt-3 text-xs text-black/60">👤 {curso.teacher}</div>
        </div>
      </div>
    </Link>
  )
}

// Componente Modal de Detalle de Curso
function CursoDetalleModal({ open, onClose, curso }: { open: boolean; onClose: () => void; curso: Curso }) {
  if (!open || !curso) return null
  const handleWhatsAppClick = () => {
    window.open("https://wa.me/61863578", "_blank")
  }
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-6 md:p-8 relative text-gray-900 animate-fade-in max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 md:top-4 md:right-4 text-blue-600 text-xl md:text-2xl font-bold"
        >
          ×
        </button>
        <div className="flex flex-col md:flex-row gap-4 md:gap-6">
          <div className="flex-shrink-0 w-full md:w-56 h-48 md:h-56 relative rounded-xl overflow-hidden border-2 border-blue-600">
            <Image src={curso.img || "/placeholder.svg"} alt={curso.title} fill className="object-cover" />
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
              <span className="font-semibold text-blue-600 text-lg md:text-xl">{curso.priceProfesional}</span>
              <Button
                size="sm"
                className="bg-blue-600 text-white font-bold hover:bg-blue-500"
                onClick={handleWhatsAppClick}
              >
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
            {curso.descLong ||
              "Este curso te permitirá dominar las habilidades clave para avanzar en tu carrera profesional."}
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
  )
}

function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const handleWhatsAppClick = () => {
    window.open("https://wa.me/61863578", "_blank")
  }

  return (
    <header className="w-full border-b border-slate-700 bg-primary sticky top-0 z-50">
      <div className="w-full max-w-7xl mx-auto flex items-center justify-between py-3 px-4 sm:py-4">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/logo.jpg"
              alt="BIMCAT Logo"
              width={50}
              height={50}
              className="rounded-full bg-white p-1 hover-scale transition-all sm:w-[60px] sm:h-[60px]"
            />
            <span className="text-xl font-bold text-white sm:text-2xl">BIMCAT</span>
          </Link>
        </div>
        <nav className="hidden md:flex gap-6 lg:gap-8 text-sm font-medium lg:text-base">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-white hover:text-accent transition-all hover:translate-x-1"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <Button
          onClick={handleWhatsAppClick}
          className="hidden sm:flex btn-primary hover-lift text-sm px-3 py-2 lg:px-4 lg:py-2 lg:text-base"
        >
          <MessageCircle className="mr-1 h-4 w-4 lg:mr-2 lg:h-5 lg:w-5" />
          <span className="hidden sm:inline">WhatsApp</span>
        </Button>

        <button
          className="md:hidden text-white focus:outline-none p-2 touch-target"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 bg-primary z-40 flex flex-col animate-fade-in">
          <div className="flex justify-end p-4">
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-white p-2 touch-target"
              aria-label="Close menu"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center space-y-8 px-4">
            {NAV_LINKS.map((link, idx) => (
              <Link
                key={`${link.label}-${idx}`}
                href={link.href}
                className="text-2xl font-bold text-white hover:text-accent transition-colors touch-target"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Button
              onClick={() => {
                handleWhatsAppClick()
                setIsMobileMenuOpen(false)
              }}
              className="btn-primary hover-lift text-lg py-3 px-6 mt-4"
            >
              <MessageCircle className="mr-2 h-5 w-5" /> WhatsApp
            </Button>
          </div>
        </div>
      )}
    </header>
  )
}

export default function Home() {
  const [cursos, setCursos] = useState<Curso[]>([])
  const [filtroActual, setFiltroActual] = useState("Todos")
  const [loading, setLoading] = useState(true)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const unsubscribe = cursosService.subscribe((updatedCursos) => {
      setCursos(updatedCursos)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const handleWhatsAppClick = () => {
    window.open("https://wa.me/61863578", "_blank")
  }

  // Estado para el modal y el curso seleccionado
  const [modalOpen, setModalOpen] = useState(false)
  const [cursoSeleccionado, setCursoSeleccionado] = useState<any>(null)

  // Filtrar cursos visibles primero
  const cursosVisibles = cursos.filter((curso) => curso.visible !== false)

  // Categorías de filtro disponibles (generadas a partir de cursos visibles)
  const categoriasFiltro = ["Todos", ...Array.from(new Set(cursosVisibles.map((c) => c.categoria))).filter(Boolean)]

  // Filtrar cursos según la categoría seleccionada
  const cursosFiltrados =
    filtroActual === "Todos" ? cursosVisibles : cursosVisibles.filter((curso) => curso.categoria === filtroActual)

  // Si el filtro actual no tiene cursos visibles, resetear a 'Todos'
  useEffect(() => {
    if (filtroActual !== "Todos" && cursosFiltrados.length === 0) {
      setFiltroActual("Todos")
    }
  }, [cursosFiltrados, filtroActual])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-gray-900">Cargando...</div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden py-16 sm:py-20 md:py-24 lg:py-32 bg-primary">
        <div className="w-full max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between px-4 gap-8 lg:gap-16">
          {/* Texto */}
          <div className="flex-1 max-w-2xl text-center lg:text-left animate-fade-in">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 text-white">
              Aprende nuevas
              <br />
              habilidades online
              <br />
              <span className="block mt-2">
                con <span className="text-accent font-bold">expertos BIM</span>
              </span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl mb-8 text-white/80 max-w-xl mx-auto lg:mx-0">
              Cursos, consultoría y actualización tecnológica en construcción y BIM. ¡Impulsa tu carrera con nosotros!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button
                size="lg"
                className="btn-primary hover-lift w-full sm:w-auto px-8 py-3"
                onClick={() => (window.location.hash = "cursos")}
              >
                Ver Cursos <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white bg-transparent hover:bg-white/10 hover-lift w-full sm:w-auto px-8 py-3"
                onClick={handleWhatsAppClick}
              >
                Consultar por WhatsApp
              </Button>
            </div>
          </div>
          {/* Imagen destacada */}
          <div className="flex-1 flex justify-center w-full max-w-lg lg:max-w-none animate-slide-up">
            <div className="w-full max-w-md lg:max-w-lg">
              <Image
                src="/banner1.jpg"
                alt="BIMCAT Consultants"
                width={600}
                height={400}
                className="w-full h-auto rounded-lg shadow-2xl"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Cursos Populares Section */}
      <section id="cursos" className="bg-background py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-2 text-foreground animate-fade-in">
            Cursos Populares
          </h2>
          <p className="text-center text-lg text-foreground/70 mb-8 animate-fade-in">
            ¡Explora nuestros cursos más demandados y potencia tu perfil profesional!
          </p>

          {/* Filtros de categoría con funcionalidad */}
          <div className="flex flex-wrap justify-center gap-3 mb-10">
            {categoriasFiltro.map((categoria, idx) => (
              <button
                key={`${categoria}-${idx}`}
                className={`px-4 py-2 rounded-full ${
                  filtroActual === categoria ? "btn-primary" : "bg-white text-black border border-accent"
                } font-semibold shadow hover:bg-accent/80 transition-all hover-lift`}
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
              <Button size="lg" className="btn-primary hover-lift">
                Ver Todos los Cursos <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Sección: ¿Por qué aprender con nuestros cursos? */}
      <section className="bg-primary py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-2 text-white">
            ¿Por qué aprender con nuestros cursos?
          </h2>
          <p className="text-center text-lg text-white/70 mb-12">
            Impulsa tu carrera con formación de calidad, certificación y oportunidades laborales.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="rounded-2xl border border-accent/30 bg-primary-light p-10 flex flex-col items-center text-center hover:shadow-lg transition-transform hover:scale-105 duration-300">
              <Laptop2 className="w-14 h-14 text-accent mb-4" />
              <h3 className="font-bold text-xl text-white mb-2">01. Aprende</h3>
              <p className="text-white/70">
                Accede a contenido actualizado y aprende de expertos en BIM, tecnología y negocios.
              </p>
            </div>
            <div className="rounded-2xl border border-accent/30 bg-primary-light p-10 flex flex-col items-center text-center hover:shadow-lg transition-transform hover:scale-105 duration-300">
              <GradCap className="w-14 h-14 text-accent mb-4" />
              <h3 className="font-bold text-xl text-white mb-2">02. Certifícate</h3>
              <p className="text-white/70">
                Obtén certificados que avalan tus conocimientos y mejoran tu perfil profesional.
              </p>
            </div>
            <div className="rounded-2xl border border-accent/30 bg-primary-light p-10 flex flex-col items-center text-center hover:shadow-lg transition-transform hover:scale-105 duration-300">
              <UserCheck className="w-14 h-14 text-accent mb-4" />
              <h3 className="font-bold text-xl text-white mb-2">03. Trabaja</h3>
              <p className="text-white/70">
                Conecta con oportunidades laborales y proyectos reales a través de nuestra red.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Servicios Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-2 text-foreground">Nuestros Servicios</h2>
          <p className="text-center text-lg text-foreground/70 mb-12">
            Soluciones integrales para tu desarrollo profesional y empresarial.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            <ServicioCard
              icon="graduation-cap"
              title="Consultoría BIM / Capacitación"
              className="animate-slide-up"
              style={{ animationDelay: "0s" }}
            />
            <ServicioCard
              icon="home"
              title="Peciba Homes – Agencia Inmobiliaria"
              className="animate-slide-up"
              style={{ animationDelay: "0.05s" }}
            />
            <ServicioCard
              icon="sun"
              title="Eversur – Paneles Solares"
              className="animate-slide-up"
              style={{ animationDelay: "0.1s" }}
            />
            <ServicioCard
              icon="briefcase"
              title="Centro Empresarial Emprendedurismo Bimcat"
              className="animate-slide-up"
              style={{ animationDelay: "0.15s" }}
            />
            <ServicioCard
              icon="laptop"
              title="Informática – Tesis – Web – Redes"
              className="animate-slide-up"
              style={{ animationDelay: "0.2s" }}
            />
            <ServicioCard
              icon="book-open"
              title="Posgrado Univalle – Funcipro"
              className="animate-slide-up"
              style={{ animationDelay: "0.25s" }}
            />
            <ServicioCard
              icon="cpu"
              title="Robótica – Ofimática – Ajedrez"
              className="animate-slide-up"
              style={{ animationDelay: "0.3s" }}
            />
            <ServicioCard
              icon="mic"
              title="Producción de Espectáculos"
              className="animate-slide-up"
              style={{ animationDelay: "0.35s" }}
            />
            <ServicioCard
              icon="monitor"
              title="Alquileres Data & Ecram"
              className="animate-slide-up"
              style={{ animationDelay: "0.4s" }}
            />
            <ServicioCard
              icon="paintbrush"
              title="BD Home Servicios Pintura – Refacción"
              className="animate-slide-up"
              style={{ animationDelay: "0.45s" }}
            />
            <ServicioCard
              icon="compass"
              title="Servicios de Ing-Top-Arq-Consult"
              className="animate-slide-up"
              style={{ animationDelay: "0.5s" }}
            />
            <ServicioCard
              icon="printer"
              title="Impresión 3D – Venta de Software"
              className="animate-slide-up"
              style={{ animationDelay: "0.55s" }}
            />
          </div>
        </div>
      </section>
    </main>
  )
}
