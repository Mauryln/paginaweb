import { NextRequest, NextResponse } from 'next/server'
import { writeFile } from 'fs/promises'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const files = formData.getAll('files')

    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: 'No se han proporcionado archivos' },
        { status: 400 }
      )
    }

    const carouselDir = path.join(process.cwd(), 'public', 'Carousel')

    for (const file of files) {
      if (!(file instanceof File)) {
        continue
      }

      const bytes = await file.arrayBuffer()
      const buffer = Buffer.from(bytes)

      // Generar un nombre único para el archivo
      const uniqueName = `${uuidv4()}${path.extname(file.name)}`
      const filePath = path.join(carouselDir, uniqueName)

      // Guardar el archivo
      await writeFile(filePath, buffer)
    }

    return NextResponse.json({ message: 'Imágenes subidas correctamente' })
  } catch (error) {
    console.error('Error al subir las imágenes:', error)
    return NextResponse.json(
      { error: 'Error al subir las imágenes' },
      { status: 500 }
    )
  }
} 