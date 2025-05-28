'use client';

import { useState, useEffect } from 'react';
import type { Curso } from "@/data/cursos";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Edit, Plus, Eye, EyeOff, Trash, LogOut, X } from "lucide-react";
import { useRouter } from 'next/navigation';
import { ImageUpload } from '@/components/ImageUpload';
import { cursosService } from '@/services/cursosService';

const tabs = [
  { label: 'Descripción', key: 'descripcion' },
  { label: 'Temario del curso', key: 'temario' },
  { label: 'Instructor', key: 'instructor' },
  { label: 'Opiniones', key: 'opiniones' },
];

export default function AdminDashboard() {
  const router = useRouter();
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [editMode, setEditMode] = useState(false);
  const [selectedCurso, setSelectedCurso] = useState<Curso | null>(null);
  const [formData, setFormData] = useState<Partial<Curso> & { durationHours?: string; durationMinutes?: string; benefits?: string[] }>({});
  const [loading, setLoading] = useState(true);
  const [tipoPrecio, setTipoPrecio] = useState<'unico' | 'diferenciado'>('diferenciado');
  const BS_TO_USD = 7;

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
    setTipoPrecio(
      curso.priceEstudiante && curso.priceProfesional && curso.priceEstudiante !== '' && curso.priceProfesional !== ''
        ? 'diferenciado'
        : 'unico'
    );
    setEditMode(true);
  };

  const handleCreate = () => {
    const newCurso: Partial<Curso> & { durationHours?: string; durationMinutes?: string; benefits?: string[] } = {
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
      priceProfesional: '',
      priceEstudiante: '',
      offerPriceProfesional: '',
      offerPriceEstudiante: '',
      offerEndDate: '',
      startDate: '',
      endDate: '',
      benefits: [''],
      categoria: '',
      visible: true,
    };
    setSelectedCurso(null);
    setFormData(newCurso);
    setTipoPrecio('diferenciado');
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

  const handleTemaTituloChange = (temaIdx: number, value: string) => {
    setFormData(prev => {
      const temas = [...(prev.temas || [])];
      temas[temaIdx] = { ...temas[temaIdx], titulo: value };
      return { ...prev, temas };
    });
  };

  const handleTemaContenidoChange = (temaIdx: number, contenidoIdx: number, value: string) => {
    setFormData(prev => {
      const temas = [...(prev.temas || [])];
      const contenidos = [...(temas[temaIdx]?.contenidos || [])];
      contenidos[contenidoIdx] = value;
      temas[temaIdx] = { ...temas[temaIdx], contenidos };
      return { ...prev, temas };
    });
  };

  const addTema = () => {
    setFormData(prev => ({
      ...prev,
      temas: [...(prev.temas || []), { titulo: '', contenidos: [''] }]
    }));
  };

  const removeTema = (temaIdx: number) => {
    setFormData(prev => ({
      ...prev,
      temas: prev.temas?.filter((_, i) => i !== temaIdx)
    }));
  };

  const addTemaContenido = (temaIdx: number) => {
    setFormData(prev => {
      const temas = [...(prev.temas || [])];
      temas[temaIdx] = { ...temas[temaIdx], contenidos: [...(temas[temaIdx].contenidos || []), ''] };
      return { ...prev, temas };
    });
  };

  const removeTemaContenido = (temaIdx: number, contenidoIdx: number) => {
    setFormData(prev => {
      const temas = [...(prev.temas || [])];
      temas[temaIdx] = { ...temas[temaIdx], contenidos: temas[temaIdx].contenidos.filter((_, i) => i !== contenidoIdx) };
      return { ...prev, temas };
    });
  };

  const handleSubmit = async () => {
    if (!formData.title || !formData.desc) {
      alert('Por favor completa los campos requeridos');
      return;
    }

    const today = new Date().toISOString().split('T')[0];

    if (formData.startDate && formData.startDate < today) {
      alert('La fecha de inicio no puede ser anterior a hoy.');
      return;
    }
    if (formData.endDate && formData.endDate < (formData.startDate || today)) {
      alert('La fecha de fin no puede ser anterior a la fecha de inicio.');
      return;
    }

    try {
      // Generar slug a partir del título
      const slug = formData.title
        .toLowerCase()
        .replace(/[áéíóú]/g, (match) => 'aeiou'['áéíóú'.indexOf(match)])
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');

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
        lessons,
        duration,
        level: formData.level || '',
        visible: formData.visible ?? true,
        startDate: formData.startDate || '',
        offerEndDate: formData.offerEndDate || '',
        // Remove or handle benefits properly if not part of Curso type
      };

      if (tipoPrecio === 'unico') {
        (cursoData as any).priceEstudiante = '';
        (cursoData as any).offerPriceEstudiante = '';
      } else {
        (cursoData as any).offerPriceProfesional = formData.offerPriceProfesional || '';
        (cursoData as any).offerPriceEstudiante = formData.offerPriceEstudiante || '';
      }

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
          img: data.url,
          images: [...(prev.images || []), data.url]
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

  const handleRemoveImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images?.filter((_, i) => i !== index)
    }));
  };

  const today = new Date().toISOString().split('T')[0];

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f6f8fa] flex items-center justify-center">
        <div className="text-[#1a1144] animate-fade-in">Cargando...</div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#f6f8fa]">
      <div className="bg-[#1a1144] text-white py-6">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Panel de Administración</h1>
          <Button
            variant="ghost"
            className="text-white hover:text-[#00ffae] hover-lift transition-all"
            onClick={handleLogout}
          >
            <LogOut className="w-5 h-5 mr-2" />
            Cerrar Sesión
          </Button>
        </div>
      </div>

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8 animate-fade-in">
          <h2 className="text-xl font-semibold text-[#1a1144]">Gestión de Cursos</h2>
          <Button
            className="bg-[#00ffae] text-[#1a1144] font-bold hover:bg-[#00e6a0] hover-lift transition-all"
            onClick={handleCreate}
          >
            <Plus className="w-5 h-5 mr-2" />
            Nuevo Curso
          </Button>
        </div>

        <div className="space-y-4">
          {cursos.map((curso, index) => (
            <div
              key={curso.id}
              className="bg-white rounded-lg shadow-md p-6 flex items-center justify-between hover-lift transition-all animate-slide-up"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className="flex items-center gap-4 flex-1">
                <div className="relative w-20 h-20 rounded-lg overflow-hidden hover-scale transition-all">
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
                    {curso.offerPriceProfesional || curso.offerPriceEstudiante ? (
                      <div>
                        <span className="block text-xs font-bold text-[#00ffae]">OFERTA ESPECIAL</span>
                        <span className="text-[#00ffae] font-bold">
                          Profesional: {curso.offerPriceProfesional} Bs
                        </span>
                        <span className="line-through text-gray-400 ml-2">
                          {curso.priceProfesional} Bs
                        </span>
                        <br />
                        <span className="text-[#00ffae] font-bold">
                          Estudiante: {curso.offerPriceEstudiante} Bs
                        </span>
                        <span className="line-through text-gray-400 ml-2">
                          {curso.priceEstudiante} Bs
                        </span>
                        {curso.offerEndDate && (
                          <div className="text-xs text-gray-400 mt-1">
                            Oferta válida hasta {new Date(curso.offerEndDate).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    ) : (
                      curso.priceEstudiante && String(curso.priceEstudiante).trim() !== '' ? (
                        <div>
                          <span className="font-semibold text-[#00b97c] text-base">
                            Profesional: {curso.priceProfesional} Bs
                          </span>
                          <br />
                          <span className="font-semibold text-[#00b97c] text-base">
                            Estudiante: {curso.priceEstudiante} Bs
                          </span>
                        </div>
                      ) : (
                        <span className="font-semibold text-[#00b97c] text-base">
                          {curso.priceProfesional} Bs
                        </span>
                      )
                    )}
                    <span>Categoría: {curso.categoria}</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  className="text-[#1a1144] hover:text-[#00ffae] transition-colors"
                  onClick={() => handleToggleVisibility(curso.id)}
                >
                  {curso.visible ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </Button>
                <Button
                  variant="ghost"
                  className="text-[#1a1144] hover:text-[#00ffae] transition-colors"
                  onClick={() => handleEdit(curso)}
                >
                  <Edit className="w-5 h-5" />
                </Button>
                <Button
                  variant="ghost"
                  className="text-red-500 hover:text-red-700 transition-colors"
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
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-2 md:p-4 overflow-y-auto z-50 animate-fade-in">
          <div className="bg-white rounded-lg p-4 md:p-6 w-full max-w-screen-lg my-8 shadow-lg overflow-y-auto max-h-[95vh]">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-[#1a1144]">
                {selectedCurso ? 'Editar Curso' : 'Nuevo Curso'}
              </h3>
              <Button
                variant="ghost"
                className="text-[#1a1144] hover:text-gray-600 transition-colors"
                onClick={() => setEditMode(false)}
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="col-span-1 md:col-span-2">
                <label className="block text-sm font-medium text-blue-700 mb-1">
                  Título *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title || ''}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-lg transition-all hover:shadow-lg focus:outline-none focus:border-[#00ffae]"
                  required
                />
              </div>

              <div className="col-span-1 md:col-span-2">
                <label className="block text-sm font-medium text-blue-700 mb-1">
                  Descripción Corta *
                </label>
                <input
                  type="text"
                  name="desc"
                  value={formData.desc || ''}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-lg transition-all hover:shadow-lg focus:outline-none focus:border-[#00ffae]"
                  required
                />
              </div>

              <div className="col-span-1 md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descripción Larga
                </label>
                <textarea
                  name="descLong"
                  value={formData.descLong || ''}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-lg transition-all hover:shadow-lg focus:outline-none focus:border-[#00ffae]"
                  rows={4}
                />
              </div>

              <div className="col-span-1 md:col-span-2">
                <label className="block text-sm font-medium text-purple-700 mb-1">
                  Imagen del Curso
                </label>
                <ImageUpload
                  currentImage={formData.img}
                  onImageChange={handleImageChange}
                />
              </div>

              <div className="col-span-1 md:col-span-2">
                <label className="block text-sm font-medium text-blue-700 mb-1">Tipo de precio</label>
                <div className="flex gap-4 mb-2">
                  <label className="flex items-center gap-2 text-[#1a1144]">
                    <input
                      type="radio"
                      name="tipoPrecio"
                      value="unico"
                      checked={tipoPrecio === 'unico'}
                      onChange={() => setTipoPrecio('unico')}
                      className="focus:ring-[#00ffae]"
                    />
                    Precio único
                  </label>
                  <label className="flex items-center gap-2 text-[#1a1144]">
                    <input
                      type="radio"
                      name="tipoPrecio"
                      value="diferenciado"
                      checked={tipoPrecio === 'diferenciado'}
                      onChange={() => setTipoPrecio('diferenciado')}
                      className="focus:ring-[#00ffae]"
                    />
                    Diferenciado (Profesional/Estudiante)
                  </label>
                </div>
              </div>

              {tipoPrecio === 'unico' ? (
                <>
                  <div className="flex flex-col gap-1">
                    <label className="block text-sm font-medium text-green-700 mb-1">Precio único</label>
                    <input
                      type="number"
                      name="priceProfesional"
                      min="0"
                      value={formData.priceProfesional || ''}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border rounded-lg transition-all hover:shadow-lg focus:outline-none focus:border-[#00ffae]"
                    />
                    {formData.priceProfesional && (
                      <div className="text-xs text-[#1a1144]/70 mt-1">
                        ≈ ${(Number(formData.priceProfesional) / BS_TO_USD).toFixed(2)} USD
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="block text-sm font-medium text-orange-500 mb-1">Precio oferta único</label>
                    <input
                      type="number"
                      name="offerPriceProfesional"
                      min="0"
                      value={formData.offerPriceProfesional || ''}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border rounded-lg transition-all hover:shadow-lg focus:outline-none focus:border-orange-500"
                    />
                    {formData.offerPriceProfesional && (
                      <div className="text-xs text-orange-500/90 mt-1">
                        ≈ ${(Number(formData.offerPriceProfesional) / BS_TO_USD).toFixed(2)} USD
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <div className="flex flex-col gap-1">
                    <label className="block text-sm font-medium text-green-700 mb-1">Precio Profesional</label>
                    <input
                      type="number"
                      name="priceProfesional"
                      min="0"
                      value={formData.priceProfesional || ''}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border rounded-lg transition-all hover:shadow-lg focus:outline-none focus:border-[#00ffae]"
                    />
                    {formData.priceProfesional && (
                      <div className="text-xs text-[#1a1144]/70 mt-1">
                        ≈ ${(Number(formData.priceProfesional) / BS_TO_USD).toFixed(2)} USD
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="block text-sm font-medium text-green-700 mb-1">Precio Estudiante</label>
                    <input
                      type="number"
                      name="priceEstudiante"
                      min="0"
                      value={formData.priceEstudiante || ''}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border rounded-lg transition-all hover:shadow-lg focus:outline-none focus:border-[#00ffae]"
                    />
                    {formData.priceEstudiante && (
                      <div className="text-xs text-[#1a1144]/70 mt-1">
                        ≈ ${(Number(formData.priceEstudiante) / BS_TO_USD).toFixed(2)} USD
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="block text-sm font-medium text-orange-500 mb-1">Precio Oferta Profesional</label>
                    <input
                      type="number"
                      name="offerPriceProfesional"
                      min="0"
                      value={formData.offerPriceProfesional || ''}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border rounded-lg transition-all hover:shadow-lg focus:outline-none focus:border-orange-500"
                    />
                    {formData.offerPriceProfesional && (
                      <div className="text-xs text-orange-500/90 mt-1">
                        ≈ ${(Number(formData.offerPriceProfesional) / BS_TO_USD).toFixed(2)} USD
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="block text-sm font-medium text-orange-500 mb-1">Precio Oferta Estudiante</label>
                    <input
                      type="number"
                      name="offerPriceEstudiante"
                      min="0"
                      value={formData.offerPriceEstudiante || ''}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border rounded-lg transition-all hover:shadow-lg focus:outline-none focus:border-orange-500"
                    />
                    {formData.offerPriceEstudiante && (
                      <div className="text-xs text-orange-500/90 mt-1">
                        ≈ ${(Number(formData.offerPriceEstudiante) / BS_TO_USD).toFixed(2)} USD
                      </div>
                    )}
                  </div>
                </>
              )}

              <div className="flex flex-col gap-1">
                <label className="block text-sm font-medium text-blue-700 mb-1">
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
                  className="w-full px-4 py-2 border rounded-lg transition-all hover:shadow-lg focus:outline-none focus:border-[#00ffae]"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="block text-sm font-medium text-blue-700 mb-1">
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
                    className="w-1/2 px-4 py-2 border rounded-lg transition-all hover:shadow-lg focus:outline-none focus:border-[#00ffae]"
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
                    className="w-1/2 px-4 py-2 border rounded-lg transition-all hover:shadow-lg focus:outline-none focus:border-[#00ffae]"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <label className="block text-sm font-medium text-blue-700 mb-1">
                  Nivel
                </label>
                <select
                  name="level"
                  value={formData.level || ''}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-lg transition-all hover:shadow-lg focus:outline-none focus:border-[#00ffae]"
                >
                  <option value="">Seleccionar nivel</option>
                  <option value="Básico">Básico</option>
                  <option value="Intermedio">Intermedio</option>
                  <option value="Avanzado">Avanzado</option>
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="block text-sm font-medium text-blue-700 mb-1">
                  Instructor
                </label>
                <input
                  type="text"
                  name="teacher"
                  value={formData.teacher || ''}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-lg transition-all hover:shadow-lg focus:outline-none focus:border-[#00ffae]"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="block text-sm font-medium text-blue-700 mb-1">
                  Categoría
                </label>
                <input
                  type="text"
                  name="categoria"
                  value={formData.categoria || ''}
                  onChange={handleInputChange}
                  placeholder="Escribe o selecciona una categoría"
                  className="w-full px-4 py-2 border rounded-lg transition-all hover:shadow-lg focus:outline-none focus:border-[#00ffae]"
                  list="categorias-list"
                />
                <datalist id="categorias-list">
                  {Array.from(new Set(cursos.map(c => c.categoria))).map((cat, i) => (
                    <option key={i} value={cat} />
                  ))}
                </datalist>
              </div>

              <div className="col-span-1 md:col-span-2">
                <label className="block text-sm font-medium text-green-600 mb-1">
                  Fecha de Inicio
                </label>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate || ''}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-lg transition-all hover:shadow-lg focus:outline-none focus:border-green-600"
                />
              </div>

              <div className="col-span-1 md:col-span-2">
                <label className="block text-sm font-medium text-yellow-600 mb-1">
                  Fecha de Fin de Oferta
                </label>
                <input
                  type="date"
                  name="offerEndDate"
                  value={formData.offerEndDate || ''}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-lg transition-all hover:shadow-lg focus:outline-none focus:border-yellow-600"
                />
              </div>

              <div className="col-span-1 md:col-span-2">
                <label className="block text-sm font-medium text-red-600 mb-1">
                  Fecha de Fin del Curso
                </label>
                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate || ''}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-lg transition-all hover:shadow-lg focus:outline-none focus:border-red-600"
                  min={formData.startDate || today}
                />
              </div>

              <div className="col-span-1 md:col-span-2">
                <label className="block text-sm font-medium text-blue-700 mb-1">Temario</label>
                <div className="space-y-4">
                  {formData.temas?.map((tema, temaIdx) => (
                    <div key={temaIdx} className="mb-4 p-2 border rounded-lg bg-black/10">
                      <input
                        type="text"
                        placeholder="Título del tema"
                        value={tema.titulo}
                        onChange={e => handleTemaTituloChange(temaIdx, e.target.value)}
                        className="w-full mb-2 px-4 py-2 border rounded-lg transition-all hover:shadow-lg focus:outline-none focus:border-[#00ffae]"
                      />
                      {tema.contenidos.map((contenido, contenidoIdx) => (
                        <div key={contenidoIdx} className="flex gap-2 mb-1">
                          <input
                            type="text"
                            placeholder="Contenido"
                            value={contenido}
                            onChange={e => handleTemaContenidoChange(temaIdx, contenidoIdx, e.target.value)}
                            className="flex-1 px-4 py-2 border rounded-lg transition-all hover:shadow-lg focus:outline-none focus:border-[#00ffae]"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            className="text-red-500 hover:text-red-700 transition-colors"
                            onClick={() => removeTemaContenido(temaIdx, contenidoIdx)}
                          >
                            <X className="w-5 h-5" />
                          </Button>
                        </div>
                      ))}
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full border-[#00ffae] text-[#00ffae] hover:bg-[#00ffae]/10 transition-all mb-2"
                        onClick={() => addTemaContenido(temaIdx)}
                      >
                        Agregar Contenido
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        className="text-red-500 w-full hover:text-red-700 transition-colors"
                        onClick={() => removeTema(temaIdx)}
                      >
                        Eliminar Tema
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full border-[#00ffae] text-[#00ffae] hover:bg-[#00ffae]/10 transition-all"
                    onClick={addTema}
                  >
                    Agregar Tema
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-4 mt-6">
              <Button
                variant="outline"
                className="border-[#1a1144] text-[#1a1144] hover:bg-gray-200 transition-colors"
                onClick={() => setEditMode(false)}
              >
                Cancelar
              </Button>
              <Button
                className="bg-[#00ffae] text-[#1a1144] font-bold hover:bg-[#00e6a0] hover-lift transition-all"
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