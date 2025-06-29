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

export async function GET() {
  try {
    const data = await readCursosFile();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: 'Error al obtener los cursos' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const curso = await request.json();
    const data = await readCursosFile();
    
    // Generar ID único
    const newId = String(Math.max(...data.cursos.map((c: Curso) => parseInt(c.id))) + 1);
    const newCurso = { ...curso, id: newId };
    
    data.cursos.push(newCurso);
    await writeCursosFile(data);
    
    return NextResponse.json(newCurso);
  } catch {
    return NextResponse.json({ error: 'Error al crear el curso' }, { status: 500 });
  }
} 