"use client"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { MessageCircle, Facebook, Instagram, Linkedin, Mail, Phone, MapPin } from "lucide-react"
import Link from "next/link"

const NAV_LINKS = [
  { label: "Inicio", href: "/" },
  { label: "Cursos", href: "/cursos" },
  { label: "Beneficios", href: "/beneficios" },
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
            <a
              key={link.label}
              href={link.href}
              className="text-white hover:text-accent transition-all hover:translate-x-1"
            >
              {link.label}
            </a>
          ))}
        </nav>
        <Button onClick={handleWhatsAppClick} className="btn-primary hover-lift">
          <MessageCircle className="mr-2 h-5 w-5" /> WhatsApp
        </Button>
      </div>
    </header>
  )
}

export default function Contacto() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <Header />
      <section className="py-20">
        <div className="container mx-auto px-4 max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-extrabold text-center mb-4 text-accent animate-fade-in">Contacto</h1>
          <p className="text-center text-lg text-foreground/80 mb-10 max-w-xl mx-auto animate-fade-in">
            ¿Tienes dudas, consultas o quieres trabajar con nosotros? ¡Escríbenos y te responderemos lo antes posible!
          </p>
          <div className="bg-primary-light rounded-2xl shadow-lg p-8 mb-10 animate-slide-up">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              <div className="flex flex-col items-center text-center hover-scale transition-all">
                <Mail className="w-8 h-8 text-accent mb-2 hover-glow" />
                <span className="font-semibold text-white">Email</span>
                <span className="text-white/70 text-sm">bimcat.srl.consultora@gmail.com</span>
              </div>
              <div className="flex flex-col items-center text-center hover-scale transition-all">
                <Phone className="w-8 h-8 text-accent mb-2 hover-glow" />
                <span className="font-semibold text-white">Teléfono</span>
                <span className="text-white/70 text-sm">61863578</span>
              </div>
              <div className="flex flex-col items-center text-center hover-scale transition-all">
                <MapPin className="w-8 h-8 text-accent mb-2 hover-glow" />
                <span className="font-semibold text-white">Ubicación</span>
                <span className="text-white/70 text-sm">Bolivia</span>
              </div>
            </div>
            <form className="flex flex-col gap-4">
              <div className="flex flex-col md:flex-row gap-4">
                <input
                  type="text"
                  placeholder="Nombre"
                  className="rounded-lg px-4 py-2 bg-white text-black placeholder-black focus:outline-none w-full transition-all hover:shadow-lg"
                  required
                />
                <input
                  type="email"
                  placeholder="Email"
                  className="rounded-lg px-4 py-2 bg-white text-black placeholder-black focus:outline-none w-full transition-all hover:shadow-lg"
                  required
                />
              </div>
              <input
                type="text"
                placeholder="Asunto"
                className="rounded-lg px-4 py-2 bg-white text-black placeholder-black focus:outline-none w-full transition-all hover:shadow-lg"
                required
              />
              <textarea
                placeholder="Mensaje"
                className="rounded-lg px-4 py-2 bg-white text-black placeholder-black focus:outline-none w-full min-h-[100px] transition-all hover:shadow-lg"
                required
              />
              <button type="submit" className="btn-primary w-full md:w-auto self-end hover-lift transition-all rounded-full px-6 py-2 shadow-lg font-semibold">
                Enviar Mensaje
              </button>
            </form>
          </div>
          <div className="flex justify-center gap-6 mt-6">
            <a
              href="https://facebook.com/bimcat.srl"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground hover:text-accent transition-all hover-scale"
            >
              <Facebook className="w-7 h-7" />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground hover:text-accent transition-all hover-scale"
            >
              <Instagram className="w-7 h-7" />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground hover:text-accent transition-all hover-scale"
            >
              <Linkedin className="w-7 h-7" />
            </a>
          </div>
        </div>
      </section>
    </main>
  )
}
