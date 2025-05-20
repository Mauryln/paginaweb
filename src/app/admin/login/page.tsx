'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";

export default function AdminLogin() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (data.success) {
        document.cookie = 'adminAuth=true; path=/';
        router.push('/admin/dashboard');
      } else {
        setError(data.message || 'Contraseña incorrecta');
      }
    } catch (error) {
      setError('Error al intentar iniciar sesión');
    }
  };

  return (
    <main className="min-h-screen bg-[#1a1144] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-[#1a1144] mb-6 text-center">Panel de Administración</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-[#1a1144] mb-1">
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#00ffae] focus:border-transparent"
              placeholder="Ingresa la contraseña"
            />
          </div>
          {error && (
            <p className="text-red-500 text-sm">{error}</p>
          )}
          <Button
            type="submit"
            className="w-full bg-[#00ffae] text-[#1a1144] font-bold hover:bg-[#00e6a0]"
          >
            Ingresar
          </Button>
        </form>
      </div>
    </main>
  );
} 