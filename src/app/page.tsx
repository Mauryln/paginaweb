'use client';

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ShoppingCart, MessageCircle, ArrowRight, GraduationCap, Home as HomeIcon, Sun, Briefcase, Laptop, BookOpen, Cpu, Users, Mic, Monitor, Paintbrush, Compass, Printer, Laptop2, UserCheck, GraduationCap as GradCap, Facebook, Instagram, Linkedin } from "lucide-react";

const NAV_LINKS = [
  { label: 'Inicio', href: '#' },
  { label: 'Cursos', href: '#cursos' },
  { label: 'Beneficios', href: '#beneficios' },
  { label: 'Contacto', href: '#contacto' },
];

// Card de servicio
function ServicioCard({ icon, title }: { icon: string; title: string }) {
  const icons: Record<string, JSX.Element> = {
    "graduation-cap": <GraduationCap className="w-10 h-10 text-[#1a1144]" />,
    home: <HomeIcon className="w-10 h-10 text-[#1a1144]" />,
    sun: <Sun className="w-10 h-10 text-[#1a1144]" />,
    briefcase: <Briefcase className="w-10 h-10 text-[#1a1144]" />,
    laptop: <Laptop className="w-10 h-10 text-[#1a1144]" />,
    "book-open": <BookOpen className="w-10 h-10 text-[#1a1144]" />,
    cpu: <Cpu className="w-10 h-10 text-[#1a1144]" />,
    users: <Users className="w-10 h-10 text-[#1a1144]" />,
    mic: <Mic className="w-10 h-10 text-[#1a1144]" />,
    monitor: <Monitor className="w-10 h-10 text-[#1a1144]" />,
    paintbrush: <Paintbrush className="w-10 h-10 text-[#1a1144]" />,
    compass: <Compass className="w-10 h-10 text-[#1a1144]" />,
    printer: <Printer className="w-10 h-10 text-[#1a1144]" />,
  };
  return (
    <div className="bg-[#f6f8fa] rounded-2xl shadow p-8 flex flex-col items-center text-center hover:shadow-lg transition-all">
      <div className="bg-white rounded-full p-4 mb-4 flex items-center justify-center shadow">
        {icons[icon]}
      </div>
      <h3 className="font-semibold text-lg mb-1 text-[#1a1144]">{title}</h3>
    </div>
  );
}

// Componente de Card de Curso
function CursoCard({ img, title, desc, lessons, duration, level, teacher, price, onWhatsApp }: {
  img: string;
  title: string;
  desc: string;
  lessons: string;
  duration: string;
  level: string;
  teacher: string;
  price: string;
  onWhatsApp: () => void;
}) {
  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col h-full">
      <div className="relative h-48 w-full">
        <Image src={img} alt={title} fill className="object-cover" />
      </div>
      <div className="p-6 flex flex-col flex-1">
        <h3 className="font-bold text-lg text-[#1a1144] mb-1">{title}</h3>
        <p className="text-[#1a1144]/70 mb-3 text-sm flex-1">{desc}</p>
        <div className="flex flex-wrap gap-2 text-xs text-[#1a1144]/80 mb-3">
          <span>📚 {lessons}</span>
          <span>⏱ {duration}</span>
          <span>🎯 {level}</span>
        </div>
        <div className="flex items-center justify-between mt-auto">
          <span className="font-semibold text-[#00b97c] text-base">{price}</span>
          <Button size="sm" className="bg-[#00ffae] text-[#1a1144] font-bold hover:bg-[#00e6a0]" onClick={onWhatsApp}>
            WhatsApp
          </Button>
        </div>
        <div className="mt-3 text-xs text-[#1a1144]/60">👤 {teacher}</div>
      </div>
    </div>
  );
}

export default function Home() {
  const handleWhatsAppClick = () => {
    window.open("https://wa.me/61863578", "_blank");
  };

  return (
    <main className="min-h-screen bg-[#1a1144] text-white">
      {/* Header */}
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

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-24 md:pt-24 md:pb-32">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between px-4 gap-8">
          {/* Texto */}
          <div className="flex-1 max-w-xl">
            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-6">
              Aprende nuevas habilidades online<br />con <span className="text-[#00ffae]">expertos BIM</span>
            </h1>
            <p className="text-lg md:text-xl mb-8 text-white/80">
              Cursos, consultoría y actualización tecnológica en construcción y BIM. ¡Impulsa tu carrera con nosotros!
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-[#00ffae] text-[#1a1144] font-bold hover:bg-[#00e6a0]" onClick={() => window.location.hash = 'cursos'}>
                Ver Cursos <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" className="border-[#00ffae] text-[#00ffae] hover:bg-[#00ffae]/10" onClick={handleWhatsAppClick}>
                Consultar por WhatsApp
              </Button>
            </div>
          </div>
          {/* Imagen destacada */}
          <div className="flex-1 flex justify-center md:justify-end w-full max-w-lg relative">
            <div className="rounded-3xl overflow-hidden shadow-2xl border-4 border-[#00ffae] bg-white/10">
              <Image src="/banner.jpg" alt="Hero" width={420} height={420} className="object-cover w-full h-[320px] md:h-[420px]" />
            </div>
          </div>
        </div>
        {/* Efecto decorativo */}
        <div className="absolute left-0 top-0 w-[600px] h-[600px] bg-[#00ffae]/10 rounded-full blur-3xl -z-10" />
      </section>

      {/* Cursos Populares Section */}
      <section id="cursos" className="bg-[#f6f8fa] py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-2 text-[#1a1144]">Cursos Populares</h2>
          <p className="text-center text-lg text-[#1a1144]/70 mb-8">¡Explora nuestros cursos más demandados y potencia tu perfil profesional!</p>
          {/* Filtros de categoría */}
          <div className="flex flex-wrap justify-center gap-3 mb-10">
            <button className="px-4 py-2 rounded-full bg-[#00ffae] text-[#1a1144] font-semibold shadow hover:bg-[#00e6a0] transition">Todos</button>
            <button className="px-4 py-2 rounded-full bg-white text-[#1a1144] font-semibold border border-[#00ffae] hover:bg-[#00ffae]/10 transition">BIM</button>
            <button className="px-4 py-2 rounded-full bg-white text-[#1a1144] font-semibold border border-[#00ffae] hover:bg-[#00ffae]/10 transition">Arquitectura</button>
            <button className="px-4 py-2 rounded-full bg-white text-[#1a1144] font-semibold border border-[#00ffae] hover:bg-[#00ffae]/10 transition">Ingeniería</button>
            <button className="px-4 py-2 rounded-full bg-white text-[#1a1144] font-semibold border border-[#00ffae] hover:bg-[#00ffae]/10 transition">Tecnología</button>
          </div>
          {/* Grid de cursos */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            <CursoCard
              img="/curso1.jpg"
              title="Curso BIM Avanzado"
              desc="Aprende técnicas avanzadas de modelado y gestión BIM."
              lessons="8 lecciones"
              duration="12h 30m"
              level="Experto"
              teacher="Ing. Laura Pérez"
              price="$120"
              onWhatsApp={handleWhatsAppClick}
            />
            <CursoCard
              img="/curso2.jpg"
              title="Revit para Arquitectos"
              desc="Domina Revit para el diseño arquitectónico profesional."
              lessons="6 lecciones"
              duration="9h 10m"
              level="Intermedio"
              teacher="Arq. Juan Gómez"
              price="Gratis"
              onWhatsApp={handleWhatsAppClick}
            />
            <CursoCard
              img="/curso3.jpg"
              title="BIM para Ingenieros"
              desc="Especialízate en BIM para ingeniería estructural y MEP."
              lessons="10 lecciones"
              duration="15h 00m"
              level="Avanzado"
              teacher="Ing. Sofía Ruiz"
              price="$150"
              onWhatsApp={handleWhatsAppClick}
            />
          </div>
        </div>
      </section>

      {/* Sección: ¿Por qué aprender con nuestros cursos? */}
      <section className="bg-[#1a1144] py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-2 text-white">¿Por qué aprender con nuestros cursos?</h2>
          <p className="text-center text-lg text-white/70 mb-12">Impulsa tu carrera con formación de calidad, certificación y oportunidades laborales.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="rounded-2xl border border-[#00ffae]/30 bg-[#221a4d] p-10 flex flex-col items-center text-center hover:shadow-lg transition-all">
              <Laptop2 className="w-14 h-14 text-[#00ffae] mb-4" />
              <h3 className="font-bold text-xl text-white mb-2">01. Aprende</h3>
              <p className="text-white/70">Accede a contenido actualizado y aprende de expertos en BIM, tecnología y negocios.</p>
            </div>
            <div className="rounded-2xl border border-[#00ffae]/30 bg-[#221a4d] p-10 flex flex-col items-center text-center hover:shadow-lg transition-all">
              <GradCap className="w-14 h-14 text-[#00ffae] mb-4" />
              <h3 className="font-bold text-xl text-white mb-2">02. Certifícate</h3>
              <p className="text-white/70">Obtén certificados que avalan tus conocimientos y mejoran tu perfil profesional.</p>
            </div>
            <div className="rounded-2xl border border-[#00ffae]/30 bg-[#221a4d] p-10 flex flex-col items-center text-center hover:shadow-lg transition-all">
              <UserCheck className="w-14 h-14 text-[#00ffae] mb-4" />
              <h3 className="font-bold text-xl text-white mb-2">03. Trabaja</h3>
              <p className="text-white/70">Conecta con oportunidades laborales y proyectos reales a través de nuestra red.</p>
            </div>
          </div>
        </div>
      </section>


      {/* Servicios Section */}
      <section id="servicios" className="bg-[#221a4d] text-white py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-2">Nuestros Servicios</h2>
          <p className="text-center text-lg text-white/70 mb-12">Soluciones integrales para tu desarrollo profesional y empresarial.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            <ServicioCard icon="graduation-cap" title="Consultoría BIM / Capacitación" />
            <ServicioCard icon="home" title="Peciba Homes – Agencia Inmobiliaria" />
            <ServicioCard icon="sun" title="Eversur – Paneles Solares" />
            <ServicioCard icon="briefcase" title="Centro Empresarial Emprendedurismo Bimcat" />
            <ServicioCard icon="laptop" title="Informática – Tesis – Web – Redes" />
            <ServicioCard icon="book-open" title="Posgrado Univalle – Funcipro" />
            <ServicioCard icon="cpu" title="Robótica – Ofimática – Ajedrez" />
            <ServicioCard icon="mic" title="Producción de Espectáculos" />
            <ServicioCard icon="monitor" title="Alquileres Data & Ecram" />
            <ServicioCard icon="paintbrush" title="BD Home Servicios Pintura – Refacción" />
            <ServicioCard icon="compass" title="Servicios de Ing-Top-Arq-Consult" />
            <ServicioCard icon="printer" title="Impresión 3D – Venta de Software" />
          </div>
        </div>
      </section>


      {/* Footer */}
      <footer className="bg-[#1a1144] border-t border-[#00ffae]/10 pt-16 pb-8 text-white mt-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-12">
            {/* Logo y redes */}
            <div className="flex-1 flex flex-col gap-4 items-center md:items-start">
              <div className="flex items-center gap-2 mb-2">
                <Image src="/logo.jpg" alt="BIMCAT Logo" width={40} height={40} className="rounded-full bg-white p-1" />
                <span className="font-bold text-xl tracking-tight">BIMCAT</span>
              </div>
              <p className="text-white/70 max-w-xs text-center md:text-left">Consultoría, capacitación y tecnología para tu desarrollo profesional y empresarial.</p>
              <div className="flex gap-4 mt-2">
                <a href="https://facebook.com/bimcat.srl" target="_blank" rel="noopener noreferrer" className="hover:text-[#00ffae]">
                  <Facebook />
                </a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#00ffae]">
                  <Instagram />
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#00ffae]">
                  <Linkedin />
                </a>
              </div>
            </div>
            {/* Links */}
            <div className="flex-[2] grid grid-cols-2 md:grid-cols-4 gap-8">
              <div>
                <h4 className="font-semibold mb-3">SOBRE</h4>
                <ul className="space-y-2 text-white/80 text-sm">
                  <li><a href="#">Nosotros</a></li>
                  <li><a href="#">Equipo</a></li>
                  <li><a href="#">Contacto</a></li>
                  <li><a href="#">Blog</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-3">CATEGORÍAS</h4>
                <ul className="space-y-2 text-white/80 text-sm">
                  <li><a href="#cursos">BIM</a></li>
                  <li><a href="#cursos">Arquitectura</a></li>
                  <li><a href="#cursos">Ingeniería</a></li>
                  <li><a href="#cursos">Tecnología</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-3">SOPORTE</h4>
                <ul className="space-y-2 text-white/80 text-sm">
                  <li><a href="#">FAQs</a></li>
                  <li><a href="#">Ayuda</a></li>
                  <li><a href="#">Términos</a></li>
                  <li><a href="#">Privacidad</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-3">CONTACTO</h4>
                <ul className="space-y-2 text-white/80 text-sm">
                  <li>Email: bimcat.srl.consultora@gmail.com</li>
                  <li>Tel: 61863578</li>
                  <li>Bolivia</li>
                </ul>
              </div>
            </div>
            {/* Newsletter */}
            <div className="flex-1 flex flex-col items-center md:items-end gap-4">
              <h4 className="font-semibold mb-3">Suscríbete</h4>
              <form className="flex w-full max-w-xs">
                <input type="email" placeholder="Tu email..." className="rounded-l-full px-4 py-2 bg-white text-[#1a1144] focus:outline-none w-full" />
                <button type="submit" className="rounded-r-full px-4 py-2 bg-[#00ffae] text-[#1a1144] font-bold hover:bg-[#00e6a0]">Enviar</button>
              </form>
              <span className="text-xs text-white/60">No enviamos spam.</span>
            </div>
          </div>
          <div className="border-t border-white/10 mt-12 pt-6 text-center text-white/60 text-xs">
            © {new Date().getFullYear()} BIMCAT SRL. Todos los derechos reservados.
          </div>
        </div>
      </footer>
    </main>
  );
}
