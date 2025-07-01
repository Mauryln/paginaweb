import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const mensajesPath = path.join(process.cwd(), 'src/data/mensajes.json');

export async function GET() {
  try {
    const data = await fs.readFile(mensajesPath, 'utf-8');
    const mensajes = JSON.parse(data);
    return NextResponse.json(mensajes);
  } catch {
    return NextResponse.json({ error: 'No se pudieron leer los mensajes.' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = await fs.readFile(mensajesPath, 'utf-8');
    const mensajes = JSON.parse(data);
    mensajes.push({ ...body, fecha: new Date().toISOString(), leido: false });
    await fs.writeFile(mensajesPath, JSON.stringify(mensajes, null, 2), 'utf-8');
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'No se pudo guardar el mensaje.' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { index } = await req.json();
    const data = await fs.readFile(mensajesPath, 'utf-8');
    const mensajes = JSON.parse(data);
    if (typeof index === 'number' && mensajes[index]) {
      mensajes[index].leido = true;
      await fs.writeFile(mensajesPath, JSON.stringify(mensajes, null, 2), 'utf-8');
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ error: 'Índice inválido.' }, { status: 400 });
    }
  } catch {
    return NextResponse.json({ error: 'No se pudo actualizar el mensaje.' }, { status: 500 });
  }
} 