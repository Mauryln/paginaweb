'use client';

import { useState, useEffect } from 'react';
import type { Curso } from "@/data/cursos";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Edit, Plus, Eye, EyeOff, Trash, LogOut, X } from "lucide-react";
import { useRouter } from 'next/navigation';
import { ImageUpload } from '@/components/ImageUpload';
import { cursosService } from '@/services/cursosService';

export default function AdminDashboard() {
  const router = useRouter();
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [editMode, setEditMode] = useState(false);
  const [selectedCurso, setSelectedCurso] = useState<Curso | null>(null);
  const [formData, setFormData] = useState<Partial<Curso> & { durationHours?: string; durationMinutes?: string }>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = cursosService.subscribe((updatedCursos) => {
      setCursos(updatedCursos);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = () => {
    document.cookie = 'adminAuth=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    router.push('/admin/login');
  };

  const handleEdit = (curso: Curso) => {
    let durationHours = '';
    let durationMinutes = '';
    if (curso.duration) {
      const match = curso.duration.match(/(\d+)h\s*(\d+)?m?/);
      if (match) {
        durationHours = match[1] || '';
        durationMinutes = match[2] || '';
      }
    }
    setSelectedCurso(curso);
    setFormData({ ...curso, durationHours, durationMinutes });
    setEditMode(true);
  };

  const handleCreate = () => {
    const newCurso: Partial<Curso> & { durationHours?: string; durationMinutes?: string } = {
      slug: '',
      img: '',
      title: '',
      desc: '',
      descLong: '',
      lessons: '',
      duration: '',
      durationHours: '',
      durationMinutes: '',
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

  const handleToggleVisibility = async (id: string) => {
    try {
      await cursosService.toggleVisibility(id);
    } catch (error) {
      console.error('Error al cambiar visibilidad:', error);
      alert('Error al cambiar la visibilidad del curso');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este curso?')) {
      try {
        await cursosService.deleteCurso(id);
      } catch (error) {
        console.error('Error al eliminar curso:', error);
        alert('Error al eliminar el curso');
      }
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

  const handleSubmit = async () => {
    if (!formData.title || !formData.desc) {
      alert('Por favor completa los campos requeridos');
      return;
    }

    try {
      // Generar slug a partir del título
      const slug = formData.title
        .toLowerCase()
        .replace(/[áéíóú]/g, (match) => 'aeiou'['áéíóú'.indexOf(match)])
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');

      // Formatear precio
      let price = formData.price ? `${formData.price} Bs` : '';
      // Formatear lecciones
      let lessons = formData.lessons ? `${formData.lessons} lecciones` : '';
      // Formatear duración
      let duration = '';
      if (formData.durationHours || formData.durationMinutes) {
        duration = `${formData.durationHours || 0}h ${formData.durationMinutes || 0}m`;
      }

      const cursoData = {
        ...formData,
        slug,
        price,
        lessons,
        duration,
        level: formData.level || '',
        visible: formData.visible ?? true,
      };

      if (selectedCurso) {
        await cursosService.updateCurso(selectedCurso.id, cursoData);
      } else {
        await cursosService.createCurso(cursoData as Omit<Curso, 'id'>);
      }

      setEditMode(false);
    } catch (error) {
      console.error('Error al guardar curso:', error);
      alert('Error al guardar el curso');
    }
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

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f6f8fa] flex items-center justify-center">
        <div className="text-[#1a1144]">Cargando...</div>
      </div>
    );
  }

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

        <div className="space-y-4">
          {cursos.map((curso) => (
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
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-2 md:p-4 overflow-y-auto z-50">
          <div className="bg-white rounded-lg p-4 md:p-6 w-full max-w-lg my-8 shadow-lg overflow-y-auto max-h-[95vh]">
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="col-span-1 md:col-span-2">
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

              <div className="col-span-1 md:col-span-2">
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

              <div className="col-span-1 md:col-span-2">
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

              <div className="col-span-1 md:col-span-2">
                <label className="block text-sm font-medium text-[#1a1144] mb-1">
                  Imagen del Curso
                </label>
                <ImageUpload
                  currentImage={formData.img}
                  onImageChange={handleImageChange}
                />
              </div>

              {/* Precio y Lecciones */}
              <div className="flex flex-col gap-1">
                <label className="block text-sm font-medium text-[#1a1144] mb-1">
                  Precio
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    name="price"
                    min="0"
                    value={formData.price || ''}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^0-9]/g, '');
                      setFormData(prev => ({ ...prev, price: value }));
                    }}
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                  <span className="text-[#1a1144] font-semibold">Bs</span>
                </div>
                {formData.price && (
                  <div className="text-xs text-[#1a1144]/70 mt-1">
                    ≈ ${(Number(formData.price) / 7).toFixed(2)} USD
                  </div>
                )}
              </div>
              <div className="flex flex-col gap-1">
                <label className="block text-sm font-medium text-[#1a1144] mb-1">
                  Lecciones
                </label>
                <input
                  type="number"
                  name="lessons"
                  min="1"
                  value={formData.lessons || ''}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^0-9]/g, '');
                    setFormData(prev => ({ ...prev, lessons: value }));
                  }}
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>

              {/* Duración y Nivel */}
              <div className="flex flex-col gap-1">
                <label className="block text-sm font-medium text-[#1a1144] mb-1">
                  Duración
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    name="durationHours"
                    min="0"
                    placeholder="Horas"
                    value={formData.durationHours || ''}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^0-9]/g, '');
                      setFormData(prev => ({ ...prev, durationHours: value }));
                    }}
                    className="w-1/2 px-4 py-2 border rounded-lg"
                  />
                  <input
                    type="number"
                    name="durationMinutes"
                    min="0"
                    max="59"
                    placeholder="Minutos"
                    value={formData.durationMinutes || ''}
                    onChange={(e) => {
                      let value = e.target.value.replace(/[^0-9]/g, '');
                      if (Number(value) > 59) value = '59';
                      setFormData(prev => ({ ...prev, durationMinutes: value }));
                    }}
                    className="w-1/2 px-4 py-2 border rounded-lg"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-1">
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
                  <option value="Básico">Básico</option>
                  <option value="Intermedio">Intermedio</option>
                  <option value="Avanzado">Avanzado</option>
                </select>
              </div>

              {/* Instructor y Categoría */}
              <div className="flex flex-col gap-1">
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
              <div className="flex flex-col gap-1">
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

              <div className="col-span-1 md:col-span-2">
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
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        className="text-red-500"
                        onClick={() => removeBenefit(index)}
                      >
                        <X className="w-5 h-5" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full border-[#00ffae] text-[#00ffae] hover:bg-[#00ffae]/10"
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
                className="border-[#1a1144] text-[#1a1144]"
                onClick={() => setEditMode(false)}
              >
                Cancelar
              </Button>
              <Button
                className="bg-[#00ffae] text-[#1a1144] font-bold hover:bg-[#00e6a0]"
                onClick={handleSubmit}
              >
                {selectedCurso ? 'Guardar Cambios' : 'Crear Curso'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
} 