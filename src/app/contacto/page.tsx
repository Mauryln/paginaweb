'use client';
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { MessageCircle, Facebook, Instagram, Linkedin, Mail, Phone, MapPin } from "lucide-react";

const NAV_LINKS = [
  { label: 'Inicio', href: '/' },
  { label: 'Cursos', href: '/#cursos' },
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
          <span className="font-bold text-xl tracking-tight">BIMCAT</span>
        </div>
        <nav className="hidden md:flex gap-8 text-base font-medium">
          {NAV_LINKS.map(link => (
            <a key={link.label} href={link.href} className="hover:text-[#00ffae] transition-colors">{link.label}</a>
          ))}
        </nav>
        <Button onClick={handleWhatsAppClick} className="bg-[#00ffae] text-[#1a1144] font-bold hover:bg-[#00e6a0]">
          <MessageCircle className="mr-2 h-5 w-5" /> WhatsApp
        </Button>
      </div>
    </header>
  );
}

export default function Contacto() {
  return (
    <main className="min-h-screen bg-[#1a1144] text-white">
      <Header />
      <section className="py-20">
        <div className="container mx-auto px-4 max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-extrabold text-center mb-4 text-[#00ffae]">Contacto</h1>
          <p className="text-center text-lg text-white/80 mb-10 max-w-xl mx-auto">
            ¿Tienes dudas, consultas o quieres trabajar con nosotros? ¡Escríbenos y te responderemos lo antes posible!
          </p>
          <div className="bg-[#221a4d] rounded-2xl shadow-lg p-8 mb-10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              <div className="flex flex-col items-center text-center">
                <Mail className="w-8 h-8 text-[#00ffae] mb-2" />
                <span className="font-semibold">Email</span>
                <span className="text-white/70 text-sm">bimcat.srl.consultora@gmail.com</span>
              </div>
              <div className="flex flex-col items-center text-center">
                <Phone className="w-8 h-8 text-[#00ffae] mb-2" />
                <span className="font-semibold">Teléfono</span>
                <span className="text-white/70 text-sm">61863578</span>
              </div>
              <div className="flex flex-col items-center text-center">
                <MapPin className="w-8 h-8 text-[#00ffae] mb-2" />
                <span className="font-semibold">Ubicación</span>
                <span className="text-white/70 text-sm">Bolivia</span>
              </div>
            </div>
            <form className="flex flex-col gap-4">
              <div className="flex flex-col md:flex-row gap-4">
                <input type="text" placeholder="Nombre" className="rounded-lg px-4 py-2 bg-white text-[#1a1144] focus:outline-none w-full" required />
                <input type="email" placeholder="Email" className="rounded-lg px-4 py-2 bg-white text-[#1a1144] focus:outline-none w-full" required />
              </div>
              <input type="text" placeholder="Asunto" className="rounded-lg px-4 py-2 bg-white text-[#1a1144] focus:outline-none w-full" required />
              <textarea placeholder="Mensaje" className="rounded-lg px-4 py-2 bg-white text-[#1a1144] focus:outline-none w-full min-h-[100px]" required />
              <button type="submit" className="rounded-lg px-6 py-2 bg-[#00ffae] text-[#1a1144] font-bold hover:bg-[#00e6a0] w-full md:w-auto self-end">Enviar Mensaje</button>
            </form>
          </div>
          <div className="flex justify-center gap-6 mt-6">
            <a href="https://facebook.com/bimcat.srl" target="_blank" rel="noopener noreferrer" className="hover:text-[#00ffae]">
              <Facebook className="w-7 h-7" />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#00ffae]">
              <Instagram className="w-7 h-7" />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#00ffae]">
              <Linkedin className="w-7 h-7" />
            </a>
          </div>
        </div>
      </section>
    </main>
  );
} 