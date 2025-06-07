import { Curso } from '@/data/cursos';

class CursosService {
  private static instance: CursosService;
  private cursos: Curso[] = [];
  private listeners: ((cursos: Curso[]) => void)[] = [];

  private constructor() {
    this.loadCursos().catch(error => {
      console.error('Error al cargar cursos inicialmente:', error);
    });
  }

  public static getInstance(): CursosService {
    if (!CursosService.instance) {
      CursosService.instance = new CursosService();
    }
    return CursosService.instance;
  }

  private async loadCursos() {
    try {
      const response = await fetch(`/api/cursos`, {
        cache: 'no-store'
      });
      
      if (!response.ok) {
        throw new Error('Error al cargar cursos');
      }
      
      const data = await response.json();
      this.cursos = data.cursos;
      this.notifyListeners();
    } catch (error) {
      console.error('Error al cargar cursos:', error);
      throw error;
    }
  }

  public subscribe(listener: (cursos: Curso[]) => void) {
    this.listeners.push(listener);
    listener(this.cursos); // Notificar inmediatamente con el estado actual
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener(this.cursos));
  }

  public async getCursos(): Promise<Curso[]> {
    if (this.cursos.length === 0) {
      await this.loadCursos();
    }
    return this.cursos;
  }

  public async getCursoBySlug(slug: string): Promise<Curso | undefined> {
    return this.cursos.find(curso => curso.slug === slug);
  }

  public async createCurso(curso: Omit<Curso, 'id'>): Promise<Curso> {
    try {
      const response = await fetch(`${window.location.origin}/api/cursos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(curso),
      });

      if (!response.ok) {
        throw new Error('Error al crear el curso');
      }

      const newCurso = await response.json();
      this.cursos.push(newCurso);
      this.notifyListeners();
      return newCurso;
    } catch (error) {
      console.error('Error al crear curso:', error);
      throw error;
    }
  }

  public async updateCurso(id: string, curso: Partial<Curso>): Promise<Curso> {
    try {
      const response = await fetch(`${window.location.origin}/api/cursos/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(curso),
      });

      if (!response.ok) {
        throw new Error('Error al actualizar el curso');
      }

      const updatedCurso = await response.json();
      this.cursos = this.cursos.map(c => c.id === id ? updatedCurso : c);
      this.notifyListeners();
      return updatedCurso;
    } catch (error) {
      console.error('Error al actualizar curso:', error);
      throw error;
    }
  }

  public async deleteCurso(id: string): Promise<void> {
    try {
      const response = await fetch(`${window.location.origin}/api/cursos/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Error al eliminar el curso');
      }

      this.cursos = this.cursos.filter(c => c.id !== id);
      this.notifyListeners();
    } catch (error) {
      console.error('Error al eliminar curso:', error);
      throw error;
    }
  }

  public async toggleVisibility(id: string): Promise<Curso> {
    const curso = this.cursos.find(c => c.id === id);
    if (!curso) {
      throw new Error('Curso no encontrado');
    }

    return this.updateCurso(id, { visible: !curso.visible });
  }
}

export const cursosService = CursosService.getInstance(); 