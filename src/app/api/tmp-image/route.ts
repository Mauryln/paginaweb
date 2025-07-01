import { NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { join } from 'path';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const fileName = searchParams.get('file');
    if (!fileName) {
      return NextResponse.json({ error: 'Falta el parámetro file' }, { status: 400 });
    }

    // Solo permitir nombres de archivo seguros (sin rutas)
    if (fileName.includes('/') || fileName.includes('..')) {
      return NextResponse.json({ error: 'Nombre de archivo no permitido' }, { status: 400 });
    }

    const filePath = join('/tmp/uploads', fileName);
    const fileBuffer = await readFile(filePath);

    // Detectar el tipo MIME por extensión
    const ext = fileName.split('.').pop()?.toLowerCase();
    let contentType = 'application/octet-stream';
    if (ext === 'jpg' || ext === 'jpeg') contentType = 'image/jpeg';
    else if (ext === 'png') contentType = 'image/png';
    else if (ext === 'webp') contentType = 'image/webp';
    else if (ext === 'gif') contentType = 'image/gif';
    else if (ext === 'svg') contentType = 'image/svg+xml';

    return new Response(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch {
    return NextResponse.json({ error: 'Archivo no encontrado o error al leerlo' }, { status: 404 });
  }
} 