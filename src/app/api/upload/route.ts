import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No se ha proporcionado ningún archivo' },
        { status: 400 }
      );
    }

    // Validar tipo de archivo
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'El archivo debe ser una imagen' },
        { status: 400 }
      );
    }

    // Validar tamaño (15MB máximo)
    if (file.size > 15 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'El archivo no debe superar los 5MB' },
        { status: 400 }
      );
    }

    // Generar nombre único para el archivo
    const timestamp = Date.now();
    const extension = file.name.split('.').pop();
    const fileName = `${timestamp}.${extension}`;

    // Convertir el archivo a Buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Guardar el archivo en /tmp/uploads
    const uploadDir = '/tmp/uploads';
    // Crear la carpeta si no existe
    await mkdir(uploadDir, { recursive: true });
    const path = join(uploadDir, fileName);
    await writeFile(path, buffer);

    // Devolver la URL temporal del archivo
    return NextResponse.json({ url: `/tmp/uploads/${fileName}` });
  } catch (error) {
    console.error('Error al subir el archivo:', error);
    return NextResponse.json(
      { error: 'Error al procesar el archivo' },
      { status: 500 }
    );
  }
} 