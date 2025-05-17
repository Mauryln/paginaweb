'use client';

import { useState, useEffect } from 'react';
import { cursos } from "@/data/cursos";
import type { Curso } from "@/data/cursos";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Edit, Plus, Eye, EyeOff, Trash, LogOut, X } from "lucide-react";
import { useRouter } from 'next/navigation';
import { ImageUpload } from '@/components/ImageUpload';

export default function AdminDashboard() {
  const router = useRouter();
  const [cursosState, setCursosState] = useState<Curso[]>([]);
  const [editMode, setEditMode] = useState(false);
  const [selectedCurso, setSelectedCurso] = useState<Curso | null>(null);
  const [formData, setFormData] = useState<Partial<Curso>>({});

  // Cargar cursos al iniciar
  useEffect(() => {
    const savedCursos = localStorage.getItem('cursos');
    if (savedCursos) {
      setCursosState(JSON.parse(savedCursos));
    } else {
      setCursosState(cursos);
      localStorage.setItem('cursos', JSON.stringify(cursos));
    }
  }, []);

  // Guardar cursos cuando cambien
  useEffect(() => {
    if (cursosState.length > 0) {
      localStorage.setItem('cursos', JSON.stringify(cursosState));
    }
  }, [cursosState]);

  const handleLogout = () => {
    document.cookie = 'adminAuth=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    router.push('/admin/login');
  };

  const handleEdit = (curso: Curso) => {
    setSelectedCurso(curso);
    setFormData(curso);
    setEditMode(true);
  };

  const handleCreate = () => {
    const newCurso: Partial<Curso> = {
      id: String(cursosState.length + 1),
      slug: '',
      img: '',
      title: '',
      desc: '',
      descLong: '',
      lessons: '',
      duration: '',
      level: '',
      teacher: '',
      price: '',
      benefits: [''],
      categoria: '',
      visible: true,
    };
    setSelectedCurso(null);
    setFormData(newCurso);
    setEditMode(true);
  };

  const handleToggleVisibility = (id: string) => {
    setCursosState(prevCursos =>
      prevCursos.map(curso =>
        curso.id === id ? { ...curso, visible: !curso.visible } : curso
      )
    );
  };

  const handleDelete = (id: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este curso?')) {
      setCursosState(prevCursos => prevCursos.filter(curso => curso.id !== id));
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleBenefitsChange = (index: number, value: string) => {
    const newBenefits = [...(formData.benefits || [])];
    newBenefits[index] = value;
    setFormData(prev => ({
      ...prev,
      benefits: newBenefits
    }));
  };

  const addBenefit = () => {
    setFormData(prev => ({
      ...prev,
      benefits: [...(prev.benefits || []), '']
    }));
  };

  const removeBenefit = (index: number) => {
    setFormData(prev => ({
      ...prev,
      benefits: prev.benefits?.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = () => {
    if (!formData.title || !formData.desc) {
      alert('Por favor completa los campos requeridos');
      return;
    }

    // Generar slug a partir del título
    const slug = formData.title
      .toLowerCase()
      .replace(/[áéíóú]/g, (match) => 'aeiou'['áéíóú'.indexOf(match)])
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

    const updatedCurso = {
      ...formData,
      slug,
      visible: formData.visible ?? true,
    } as Curso;

    if (selectedCurso) {
      // Actualizar curso existente
      setCursosState(prevCursos =>
        prevCursos.map(curso =>
          curso.id === selectedCurso.id ? updatedCurso : curso
        )
      );
    } else {
      // Crear nuevo curso
      setCursosState(prevCursos => [...prevCursos, updatedCurso]);
    }

    setEditMode(false);
  };

  const handleImageChange = async (file: File | null) => {
    if (file) {
      try {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error('Error al subir la imagen');
        }

        const data = await response.json();
        setFormData(prev => ({
          ...prev,
          img: data.url
        }));
      } catch (error) {
        console.error('Error:', error);
        alert('Error al subir la imagen');
      }
    } else {
      setFormData(prev => ({
        ...prev,
        img: ''
      }));
    }
  };

  return (
    <main className="min-h-screen bg-[#f6f8fa]">
      <div className="bg-[#1a1144] text-white py-6">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Panel de Administración</h1>
          <Button
            variant="ghost"
            className="text-white hover:text-[#00ffae]"
            onClick={handleLogout}
          >
            <LogOut className="w-5 h-5 mr-2" />
            Cerrar Sesión
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-xl font-semibold text-[#1a1144]">Gestión de Cursos</h2>
          <Button
            className="bg-[#00ffae] text-[#1a1144] font-bold hover:bg-[#00e6a0]"
            onClick={handleCreate}
          >
            <Plus className="w-5 h-5 mr-2" />
            Nuevo Curso
          </Button>
        </div>

        <div className="grid gap-6">
          {cursosState.map((curso) => (
            <div
              key={curso.id}
              className="bg-white rounded-lg shadow-md p-6 flex items-center justify-between"
            >
              <div className="flex items-center gap-4 flex-1">
                <div className="relative w-20 h-20 rounded-lg overflow-hidden">
                  <Image
                    src={curso.img}
                    alt={curso.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg text-[#1a1144]">{curso.title}</h3>
                  <p className="text-sm text-[#1a1144]/70">{curso.desc}</p>
                  <div className="flex gap-4 mt-2 text-sm text-[#1a1144]/60">
                    <span>Precio: {curso.price}</span>
                    <span>Categoría: {curso.categoria}</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  className="text-[#1a1144] hover:text-[#00ffae]"
                  onClick={() => handleToggleVisibility(curso.id)}
                >
                  {curso.visible ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </Button>
                <Button
                  variant="ghost"
                  className="text-[#1a1144] hover:text-[#00ffae]"
                  onClick={() => handleEdit(curso)}
                >
                  <Edit className="w-5 h-5" />
                </Button>
                <Button
                  variant="ghost"
                  className="text-red-500 hover:text-red-700"
                  onClick={() => handleDelete(curso.id)}
                >
                  <Trash className="w-5 h-5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal de edición/creación */}
      {editMode && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl my-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-[#1a1144]">
                {selectedCurso ? 'Editar Curso' : 'Nuevo Curso'}
              </h3>
              <Button
                variant="ghost"
                className="text-[#1a1144]"
                onClick={() => setEditMode(false)}
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-[#1a1144] mb-1">
                  Título *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title || ''}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-lg"
                  required
                />
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-[#1a1144] mb-1">
                  Descripción Corta *
                </label>
                <input
                  type="text"
                  name="desc"
                  value={formData.desc || ''}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-lg"
                  required
                />
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-[#1a1144] mb-1">
                  Descripción Larga
                </label>
                <textarea
                  name="descLong"
                  value={formData.descLong || ''}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-lg"
                  rows={4}
                />
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-[#1a1144] mb-1">
                  Imagen del Curso
                </label>
                <ImageUpload
                  currentImage={formData.img}
                  onImageChange={handleImageChange}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#1a1144] mb-1">
                  Precio
                </label>
                <input
                  type="text"
                  name="price"
                  value={formData.price || ''}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#1a1144] mb-1">
                  Lecciones
                </label>
                <input
                  type="text"
                  name="lessons"
                  value={formData.lessons || ''}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#1a1144] mb-1">
                  Duración
                </label>
                <input
                  type="text"
                  name="duration"
                  value={formData.duration || ''}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#1a1144] mb-1">
                  Nivel
                </label>
                <select
                  name="level"
                  value={formData.level || ''}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-lg"
                >
                  <option value="">Seleccionar nivel</option>
                  <option value="Principiante">Principiante</option>
                  <option value="Intermedio">Intermedio</option>
                  <option value="Avanzado">Avanzado</option>
                  <option value="Experto">Experto</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#1a1144] mb-1">
                  Categoría
                </label>
                <select
                  name="categoria"
                  value={formData.categoria || ''}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-lg"
                >
                  <option value="">Seleccionar categoría</option>
                  <option value="BIM">BIM</option>
                  <option value="Arquitectura">Arquitectura</option>
                  <option value="Ingeniería">Ingeniería</option>
                  <option value="Tecnología">Tecnología</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#1a1144] mb-1">
                  Instructor
                </label>
                <input
                  type="text"
                  name="teacher"
                  value={formData.teacher || ''}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-[#1a1144] mb-1">
                  Beneficios
                </label>
                <div className="space-y-2">
                  {formData.benefits?.map((benefit, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={benefit}
                        onChange={(e) => handleBenefitsChange(index, e.target.value)}
                        className="flex-1 px-4 py-2 border rounded-lg"
                        placeholder="Agregar beneficio"
                      />
                      <Button
                        variant="ghost"
                        className="text-red-500 hover:text-red-700"
                        onClick={() => removeBenefit(index)}
                      >
                        <X className="w-5 h-5" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    className="w-full mt-2"
                    onClick={addBenefit}
                  >
                    Agregar Beneficio
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-4 mt-6">
              <Button
                variant="outline"
                onClick={() => setEditMode(false)}
              >
                Cancelar
              </Button>
              <Button
                className="bg-[#00ffae] text-[#1a1144] font-bold hover:bg-[#00e6a0]"
                onClick={handleSubmit}
              >
                Guardar
              </Button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
} 