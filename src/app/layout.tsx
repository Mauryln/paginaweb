import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Image from "next/image";
import Link from "next/link";
import { Facebook, Instagram, Linkedin } from "lucide-react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "BIMCAT SRL - Consultoría BIM y Construcción",
  description: "Consultoría especializada en construcción y tecnología BIM. Implementación de metodologías BIM, capacitación y desarrollo de proyectos.",
};

// Nuevo componente para el pie de página con directiva client
function Footer() {
  'use client';
  return (
    <footer className="bg-gray-900 border-blue-600/10 pt-16 pb-8 text-white mt-12">
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
              <a href="https://facebook.com/bimcat.srl" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400">
                <Facebook />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400">
                <Instagram />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400">
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
        </div>
        <div className="border-t border-white/10 mt-12 pt-6 text-center text-white/60 text-xs">
          © {new Date().getFullYear()} BIMCAT SRL. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      
      <body className={`${inter.className} min-h-screen bg-background antialiased`}>
        {children}
        <Footer />
      </body>
    </html>
  );
}
