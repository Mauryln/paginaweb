import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

const CAROUSEL_IMAGES_FILE = path.join(process.cwd(), 'src/data/carouselImages.json');

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
async function writeCarouselImages(images: unknown[]) {
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
    // Leer las imágenes desde el archivo JSON para mantener los ids consistentes
    const images = await readCarouselImages();
    return NextResponse.json(images);
  } catch (error) {
    console.error('Error reading carousel images:', error)
    return NextResponse.json({ error: 'Error reading carousel images' }, { status: 500 })
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

    // Guardar el archivo en public/Carousel
    const carouselDir = path.join(process.cwd(), 'public', 'Carousel');
    await fs.mkdir(carouselDir, { recursive: true });
    const ext = path.extname((file as File & { name: string }).name) || '.jpg';
    const uniqueName = `${uuidv4()}${ext}`;
    const filePath = path.join(carouselDir, uniqueName);
    const arrayBuffer = await (file as File & { arrayBuffer: () => Promise<ArrayBuffer> }).arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    await fs.writeFile(filePath, buffer);

    // Crear la nueva entrada
    const images = await readCarouselImages();
    const newId = `carousel-${Date.now()}`;
    const newImage = {
      id: newId,
      url: `/Carousel/${uniqueName}`,
      title,
      description
    };
    images.push(newImage);
    await writeCarouselImages(images);

    return NextResponse.json(newImage);
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
    const imageToDelete = images.find((img: unknown) => (img as { id: string }).id === id);
    
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
    const updatedImages = images.filter((img: unknown) => (img as { id: string }).id !== id);
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
    const body = await request.json();

    // Si es un array, es para reordenar
    if (Array.isArray(body)) {
      const updatedImagesOrder: { id: string }[] = body;
      // Get current images
      const images = await readCarouselImages();
      // Create a map of current images for easy lookup
      const imageMap = new Map(images.map((img: unknown) => [(img as { id: string }).id, img]));
      // Build the new ordered list based on the received order
      const newOrderedImages: unknown[] = [];
      for (const imgOrder of updatedImagesOrder) {
        const image = imageMap.get(imgOrder.id);
        if (image) {
          newOrderedImages.push(image);
        } else {
          console.warn(`Image with ID ${imgOrder.id} not found during reordering.`);
        }
      }
      // Save the new ordered list
      await writeCarouselImages(newOrderedImages);
      return NextResponse.json({ success: true });
    }

    // Si es un objeto con id y title, es para actualizar el título
    if (body && typeof body === 'object' && body.id && body.title !== undefined) {
      const images = await readCarouselImages();
      const idx = images.findIndex((img: unknown) => (img as { id: string }).id === body.id);
      if (idx === -1) {
        return NextResponse.json({ error: 'Image not found' }, { status: 404 });
      }
      images[idx].title = body.title;
      await writeCarouselImages(images);
      return NextResponse.json({ success: true });
    }

    return NextResponse.json(
      { error: 'Invalid request body. Expected an array or an object with id and title.' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Error saving carousel order or updating title:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor al guardar el orden o actualizar el título' },
      { status: 500 }
    );
  }
} 