import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { Curso } from '@/data/cursos';

const cursosFilePath = path.join(process.cwd(), 'src/data/cursos.json');

async function readCursosFile() {
  try {
    const fileContents = await fs.readFile(cursosFilePath, 'utf8');
    return JSON.parse(fileContents);
  } catch (error) {
    console.error('Error al leer el archivo de cursos:', error);
    return { cursos: [] };
  }
}

async function writeCursosFile(data: { cursos: Curso[] }) {
  try {
    await fs.writeFile(cursosFilePath, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error al escribir el archivo de cursos:', error);
    throw error;
  }
}

function getIdFromRequest(request: Request) {
  const url = new URL(request.url);
  const match = url.pathname.match(/\/api\/cursos\/(.+)$/);
  return match ? match[1] : null;
}

export async function GET(request: Request) {
  try {
    const id = getIdFromRequest(request);
    if (!id) {
      return NextResponse.json({ error: 'ID no proporcionado' }, { status: 400 });
    }
    const data = await readCursosFile();
    const curso = data.cursos.find((c: Curso) => c.id === id);
    if (!curso) {
      return NextResponse.json({ error: 'Curso no encontrado' }, { status: 404 });
    }
    return NextResponse.json(curso);
  } catch {
    return NextResponse.json({ error: 'Error al obtener el curso' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const id = getIdFromRequest(request);
    if (!id) {
      return NextResponse.json({ error: 'ID no proporcionado' }, { status: 400 });
    }
    const cursoActualizado = await request.json();
    const data = await readCursosFile();
    const index = data.cursos.findIndex((c: Curso) => c.id === id);
    if (index === -1) {
      return NextResponse.json({ error: 'Curso no encontrado' }, { status: 404 });
    }
    data.cursos[index] = { ...data.cursos[index], ...cursoActualizado };
    await writeCursosFile(data);
    return NextResponse.json(data.cursos[index]);
  } catch {
    return NextResponse.json({ error: 'Error al actualizar el curso' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const id = getIdFromRequest(request);
    if (!id) {
      return NextResponse.json({ error: 'ID no proporcionado' }, { status: 400 });
    }
    const data = await readCursosFile();
    const index = data.cursos.findIndex((c: Curso) => c.id === id);
    if (index === -1) {
      return NextResponse.json({ error: 'Curso no encontrado' }, { status: 404 });
    }
    data.cursos.splice(index, 1);
    await writeCursosFile(data);
    return NextResponse.json({ message: 'Curso eliminado exitosamente' });
  } catch {
    return NextResponse.json({ error: 'Error al eliminar el curso' }, { status: 500 });
  }
} 