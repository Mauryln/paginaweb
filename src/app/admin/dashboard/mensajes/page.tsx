"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

interface Mensaje {
  nombre: string;
  email: string;
  telefono?: string;
  asunto: string;
  mensaje: string;
  fecha?: string;
  leido: boolean;
}

export default function MensajesAdmin() {
  const [mensajes, setMensajes] = useState<Mensaje[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string|null>(null);

  useEffect(() => {
    const fetchMensajes = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/mensajes");
        if (res.ok) {
          const data = await res.json();
          setMensajes(data);
        } else {
          setError("No se pudieron cargar los mensajes.");
        }
      } catch {
        setError("No se pudieron cargar los mensajes.");
      } finally {
        setLoading(false);
      }
    };
    fetchMensajes();
  }, []);

  const marcarComoLeido = async (realIndex: number) => {
    try {
      const res = await fetch('/api/mensajes', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ index: realIndex })
      });
      if (res.ok) {
        setMensajes(prev => prev.map((msg, i) => i === realIndex ? { ...msg, leido: true } : msg));
      }
    } catch {}
  };

  return (
    <main className="min-h-screen bg-[#f6f8fa]">
      <div className="bg-[#1a1144] text-white py-6 mb-8">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Mensajes de Contacto</h1>
        </div>
      </div>
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 animate-slide-up">
          <h2 className="text-2xl font-bold mb-4 text-[#1a1144]">Mensajes de Contacto</h2>
          {loading ? (
            <p className="text-[#1a1144]">Cargando mensajes...</p>
          ) : error ? (
            <p className="text-red-600">{error}</p>
          ) : mensajes.length === 0 ? (
            <p className="text-[#1a1144]/70">No hay mensajes.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full border border-[#e5e7eb] rounded-lg overflow-hidden">
                <thead>
                  <tr className="bg-[#f6f8fa] text-[#1a1144]">
                    <th className="p-3 border-b font-semibold">Nombre</th>
                    <th className="p-3 border-b font-semibold">Email</th>
                    <th className="p-3 border-b font-semibold">Teléfono</th>
                    <th className="p-3 border-b font-semibold">Asunto</th>
                    <th className="p-3 border-b font-semibold">Mensaje</th>
                    <th className="p-3 border-b font-semibold">Fecha</th>
                    <th className="p-3 border-b font-semibold">Leído</th>
                    <th className="p-3 border-b font-semibold">Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {mensajes.slice().reverse().map((msg, idx) => {
                    const realIndex = mensajes.length - 1 - idx;
                    return (
                      <tr key={realIndex} className={`border-b last:border-b-0 ${msg.leido ? 'bg-[#f0fdfa]' : 'hover:bg-[#f6f8fa]'} transition-all`}>
                        <td className="p-3 font-semibold text-[#1a1144] align-top">{msg.nombre}</td>
                        <td className="p-3 text-[#1a1144]/80 align-top">{msg.email}</td>
                        <td className="p-3 text-[#1a1144]/80 align-top">{msg.telefono || '-'}</td>
                        <td className="p-3 text-[#1a1144]/80 align-top">{msg.asunto}</td>
                        <td className="p-3 text-[#1a1144]/80 align-top whitespace-pre-line max-w-xs break-words">{msg.mensaje}</td>
                        <td className="p-3 text-xs text-[#1a1144]/60 align-top">{msg.fecha ? new Date(msg.fecha).toLocaleString() : ''}</td>
                        <td className="p-3 text-center align-top">{msg.leido ? <span className="inline-block px-2 py-1 rounded bg-[#00ffae]/20 text-[#00ae7a] text-xs font-bold">Sí</span> : <span className="inline-block px-2 py-1 rounded bg-red-100 text-red-600 text-xs font-bold">No</span>}</td>
                        <td className="p-3 text-center align-top">
                          {!msg.leido && (
                            <Button size="sm" className="bg-[#00ffae] text-[#1a1144] font-bold hover:bg-[#00e6a0] hover-lift transition-all" onClick={() => marcarComoLeido(realIndex)}>
                              Marcar como leído
                            </Button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </main>
  );
} 