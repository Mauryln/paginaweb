import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { v4 as uuidv4 } from 'uuid';

const CAROUSEL_IMAGES_FILE = path.join(process.cwd(), 'src/data/carouselImages.json');
const UPLOADS_DIR = path.join(process.cwd(), 'public/uploads');
const DRIVE_FOLDER_ID = '1blrkL8jiwvqJH2XmxcsOQe8jiRy_tUKl';

// Helper function to read carousel images
async function readCarouselImages() {
  try {
    const data = await fs.readFile(CAROUSEL_IMAGES_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading carousel images file:', error);
    return []; // Return empty array if file doesn't exist or is invalid
  }
}

// Helper function to write carousel images
async function writeCarouselImages(images: any[]) {
  try {
    await fs.writeFile(CAROUSEL_IMAGES_FILE, JSON.stringify(images, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error writing carousel images file:', error);
    throw new Error('Failed to save image list.');
  }
}

// GET request to list carousel images
export async function GET() {
  try {
    // Lista de imágenes con sus IDs y títulos
    const images = [
      {
        id: '1',
        url: 'https://drive.google.com/thumbnail?id=1w5jBtcBbDHt0B8z0rh2SDNQJq8V0_0v7&sz=w1000',
        title: 'Portada Salud',
        description: 'Servicios de salud y bienestar'
      },
      {
        id: '2',
        url: 'https://drive.google.com/thumbnail?id=1w5jBtcBbDHt0B8z0rh2SDNQJq8V0_0v7&sz=w1000',
        title: 'Portada Financiera',
        description: 'Servicios financieros y asesoría'
      },
      {
        id: '3',
        url: 'https://drive.google.com/thumbnail?id=1w5jBtcBbDHt0B8z0rh2SDNQJq8V0_0v7&sz=w1000',
        title: 'Portada Jurídica',
        description: 'Servicios legales y consultoría jurídica'
      },
      {
        id: '4',
        url: 'https://drive.google.com/thumbnail?id=1w5jBtcBbDHt0B8z0rh2SDNQJq8V0_0v7&sz=w1000',
        title: 'Portada General',
        description: 'Servicios generales y consultoría'
      },
      {
        id: '5',
        url: 'https://drive.google.com/thumbnail?id=1w5jBtcBbDHt0B8z0rh2SDNQJq8V0_0v7&sz=w1000',
        title: '02 de Junio',
        description: 'Evento especial del 02 de junio'
      },
      {
        id: '6',
        url: 'https://drive.google.com/thumbnail?id=1w5jBtcBbDHt0B8z0rh2SDNQJq8V0_0v7&sz=w1000',
        title: '14 de Mayo',
        description: 'Evento especial del 14 de mayo'
      },
      {
        id: '7',
        url: 'https://drive.google.com/thumbnail?id=1w5jBtcBbDHt0B8z0rh2SDNQJq8V0_0v7&sz=w1000',
        title: 'Interior',
        description: 'Vista interior de nuestras instalaciones'
      },
      {
        id: '8',
        url: 'https://drive.google.com/thumbnail?id=1w5jBtcBbDHt0B8z0rh2SDNQJq8V0_0v7&sz=w1000',
        title: '26 de Mayo',
        description: 'Evento especial del 26 de mayo'
      },
      {
        id: '9',
        url: 'https://drive.google.com/thumbnail?id=1w5jBtcBbDHt0B8z0rh2SDNQJq8V0_0v7&sz=w1000',
        title: 'Anatomía del Delito',
        description: 'Teoría, Procedimientos y Valoración de la Prueba'
      },
      {
        id: '10',
        url: 'https://drive.google.com/thumbnail?id=1w5jBtcBbDHt0B8z0rh2SDNQJq8V0_0v7&sz=w1000',
        title: 'Investigación de Mercado',
        description: 'Servicios de investigación y análisis de mercado'
      },
      {
        id: '11',
        url: 'https://drive.google.com/thumbnail?id=1w5jBtcBbDHt0B8z0rh2SDNQJq8V0_0v7&sz=w1000',
        title: 'Fungicidas e Insecticidas',
        description: 'Productos y servicios agrícolas'
      },
      {
        id: '12',
        url: 'https://drive.google.com/thumbnail?id=1w5jBtcBbDHt0B8z0rh2SDNQJq8V0_0v7&sz=w1000',
        title: 'Diseño de Restaurantes',
        description: 'Servicios de diseño y consultoría para restaurantes'
      },
      {
        id: '13',
        url: 'https://drive.google.com/thumbnail?id=1w5jBtcBbDHt0B8z0rh2SDNQJq8V0_0v7&sz=w1000',
        title: 'Habitaciones Niños',
        description: 'Diseño de espacios para niños'
      }
    ];

    return NextResponse.json(images);
  } catch (error) {
    console.error('Error fetching carousel images:', error);
    return NextResponse.json({ error: 'Error al obtener las imágenes' }, { status: 500 });
  }
}

// POST request to upload a new image
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;

    if (!file || !title || !description) {
      return NextResponse.json(
        { error: 'Faltan campos requeridos' },
        { status: 400 }
      );
    }

    // Aquí implementaremos la lógica para subir la imagen a Google Drive
    // Por ahora retornamos una respuesta de ejemplo
    return NextResponse.json({
      id: '1',
      url: 'https://drive.google.com/uc?export=view&id=1w5jBtcBbDHt0B8z0rh2SDNQJq8V0_0v7',
      title,
      description
    });
  } catch (error) {
    console.error('Error uploading carousel image:', error);
    return NextResponse.json(
      { error: 'Error al subir la imagen' },
      { status: 500 }
    );
  }
}

// DELETE request to remove an image
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Image ID is required' },
        { status: 400 }
      );
    }

    // Get current images
    const images = await readCarouselImages();
    
    // Find the image to delete
    const imageToDelete = images.find((img: any) => img.id === id);
    
    if (!imageToDelete) {
      return NextResponse.json(
        { error: 'Image not found' },
        { status: 404 }
      );
    }

    // Delete the file from the filesystem
    const filePath = path.join(process.cwd(), 'public', imageToDelete.url);
    try {
      await fs.unlink(filePath);
    } catch (error) {
      console.error('Error deleting file:', error);
    }

    // Remove the image from the list
    const updatedImages = images.filter((img: any) => img.id !== id);
    await writeCarouselImages(updatedImages);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting image:', error);
    return NextResponse.json(
      { error: 'Error deleting image' },
      { status: 500 }
    );
  }
}

// PUT request to update the order of images
export async function PUT(request: NextRequest) {
  try {
    const updatedImagesOrder: { id: string }[] = await request.json();

    if (!Array.isArray(updatedImagesOrder)) {
      return NextResponse.json(
        { error: 'Invalid request body. Expected an array of image objects with id.' },
        { status: 400 }
      );
    }

    // Get current images
    const images = await readCarouselImages();

    // Create a map of current images for easy lookup
    const imageMap = new Map(images.map((img: any) => [img.id, img]));

    // Build the new ordered list based on the received order
    const newOrderedImages: any[] = [];
    for (const imgOrder of updatedImagesOrder) {
      const image = imageMap.get(imgOrder.id);
      if (image) {
        newOrderedImages.push(image);
      } else {
        console.warn(`Image with ID ${imgOrder.id} not found during reordering.`);
        // Optionally handle missing images, e.g., return an error or skip
      }
    }

    // Save the new ordered list
    await writeCarouselImages(newOrderedImages);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving carousel order:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor al guardar el orden' },
      { status: 500 }
    );
  }
} 