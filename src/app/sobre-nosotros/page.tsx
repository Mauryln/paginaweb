"use client"

import Image from "next/image"
import { Laptop2, GraduationCap, UserCheck, Star, ShieldCheck, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { MessageCircle } from "lucide-react"
import { useState } from "react"
import Carousel from "@/components/Carousel"
import Link from "next/link"

interface CarouselImage {
  id: string
  url: string
  title: string
  description: string
}

const NAV_LINKS = [
  { label: "Inicio", href: "/" },
  { label: "Cursos", href: "/cursos" },
  { label: "Sobre Nosotros", href: "/sobre-nosotros" },
  { label: "Contacto", href: "/contacto" },
]

function Header() {
  const handleWhatsAppClick = () => {
    window.open("https://wa.me/61863578", "_blank")
  }
  return (
    <header className="w-full border-b border-slate-700 bg-primary sticky top-0 z-50">
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
        <Button onClick={handleWhatsAppClick} className="btn-primary hover-lift">
          <MessageCircle className="mr-2 h-5 w-5" /> WhatsApp
        </Button>
      </div>
    </header>
  )
}

export default function SobreNosotros() {
  const [isGalleryOpen, setIsGalleryOpen] = useState(false)
  const [galleryImages, setGalleryImages] = useState<CarouselImage[]>([])
  const [loadingGallery, setLoadingGallery] = useState(false)

  const openGallery = async () => {
    setIsGalleryOpen(true)
    try {
      setLoadingGallery(true)
      const response = await fetch("/api/carousel-images")
      if (!response.ok) {
        throw new Error("Error fetching gallery images")
      }
      const data = await response.json()
      setGalleryImages(data)
    } catch (error) {
      console.error("Error fetching gallery images:", error)
    } finally {
      setLoadingGallery(false)
    }
  }

  const closeGallery = () => {
    setIsGalleryOpen(false)
    setGalleryImages([])
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Header />

      <section className="py-16 bg-primary-light shadow-xl">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-8 text-white">Nuestra Historia</h2>
          <p className="text-center text-lg text-white/80 mb-8 max-w-3xl mx-auto">
            BIMCAT nace con la visión de transformar la educación en el sector de la construcción y tecnología, 
            ofreciendo formación de calidad y oportunidades reales de desarrollo profesional.
          </p>

          <div className="mb-8">
            <Carousel />
          </div>

          <div className="text-center">
            <Button
              size="lg"
              variant="outline"
              className="border-accent text-accent hover:bg-accent/10 hover-lift"
              onClick={openGallery}
            >
              Ver Todas las Imágenes
            </Button>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-extrabold text-center mb-4 text-accent animate-fade-in">
            Nuestro Compromiso
          </h1>
          <p className="text-center text-lg text-foreground/80 mb-12 max-w-2xl mx-auto animate-fade-in">
            Nos dedicamos a formar profesionales capaces de enfrentar los desafíos del futuro en la industria de la construcción y tecnología.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-5xl mx-auto mb-16">
            <div className="rounded-2xl border border-accent/30 bg-primary-light p-10 flex flex-col items-center text-center hover:shadow-lg transition-all hover-lift animate-slide-up">
              <Laptop2 className="w-14 h-14 text-accent mb-4 hover-glow" />
              <h3 className="font-bold text-xl text-white mb-2">Innovación Constante</h3>
              <p className="text-white/70">Mantenemos nuestros contenidos actualizados con las últimas tendencias y tecnologías.</p>
            </div>
            <div
              className="rounded-2xl border border-accent/30 bg-primary-light p-10 flex flex-col items-center text-center hover:shadow-lg transition-all hover-lift animate-slide-up"
              style={{ animationDelay: "0.1s" }}
            >
              <GraduationCap className="w-14 h-14 text-accent mb-4 hover-glow" />
              <h3 className="font-bold text-xl text-white mb-2">Excelencia Educativa</h3>
              <p className="text-white/70">
                Nuestros docentes son profesionales con amplia experiencia en el sector.
              </p>
            </div>
            <div
              className="rounded-2xl border border-accent/30 bg-primary-light p-10 flex flex-col items-center text-center hover:shadow-lg transition-all hover-lift animate-slide-up"
              style={{ animationDelay: "0.2s" }}
            >
              <UserCheck className="w-14 h-14 text-accent mb-4 hover-glow" />
              <h3 className="font-bold text-xl text-white mb-2">Desarrollo Profesional</h3>
              <p className="text-white/70">
                Facilitamos conexiones con empresas y oportunidades laborales reales.
              </p>
            </div>
            <div
              className="rounded-2xl border border-accent/30 bg-primary-light p-10 flex flex-col items-center text-center hover:shadow-lg transition-all hover-lift animate-slide-up"
              style={{ animationDelay: "0.3s" }}
            >
              <Star className="w-14 h-14 text-accent mb-4 hover-glow" />
              <h3 className="font-bold text-xl text-white mb-2">Calidad Garantizada</h3>
              <p className="text-white/70">Nuestros cursos están diseñados para maximizar el aprendizaje y la aplicación práctica.</p>
            </div>
            <div
              className="rounded-2xl border border-accent/30 bg-primary-light p-10 flex flex-col items-center text-center hover:shadow-lg transition-all hover-lift animate-slide-up"
              style={{ animationDelay: "0.4s" }}
            >
              <ShieldCheck className="w-14 h-14 text-accent mb-4 hover-glow" />
              <h3 className="font-bold text-xl text-white mb-2">Soporte Continuo</h3>
              <p className="text-white/70">Acompañamos a nuestros estudiantes durante y después de su formación.</p>
            </div>
            <div
              className="rounded-2xl border border-accent/30 bg-primary-light p-10 flex flex-col items-center text-center hover:shadow-lg transition-all hover-lift animate-slide-up"
              style={{ animationDelay: "0.5s" }}
            >
              <Users className="w-14 h-14 text-accent mb-4 hover-glow" />
              <h3 className="font-bold text-xl text-white mb-2">Comunidad Activa</h3>
              <p className="text-white/70">
                Fomentamos una comunidad de aprendizaje colaborativo y networking profesional.
              </p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row justify-center gap-6 mt-8 animate-fade-in">
            <Button size="lg" className="btn-primary hover-lift" onClick={() => (window.location.href = "/#cursos")}>
              Ver Cursos
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-accent text-accent hover:bg-accent/10 hover-lift"
              onClick={() => (window.location.href = "/contacto")}
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
                      src={image.url || "/placeholder.svg"}
                      alt={image.title || "Imagen de galería"}
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
  )
} 