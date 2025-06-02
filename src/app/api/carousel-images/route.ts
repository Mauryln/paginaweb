import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { v4 as uuidv4 } from 'uuid';

const CAROUSEL_IMAGES_FILE = path.join(process.cwd(), 'src/data/carouselImages.json');
const UPLOADS_DIR = path.join(process.cwd(), 'public/uploads');

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
  const images = await readCarouselImages();
  return NextResponse.json(images);
}

// POST request to upload a new image
export async function POST(request: NextRequest) {
  try {
    // Ensure uploads directory exists
    await fs.mkdir(UPLOADS_DIR, { recursive: true });
    console.log(`Uploads directory ensured: ${UPLOADS_DIR}`);

    const formData = await request.formData();
    const image = formData.get('image') as File | null; // Allow null for URL uploads
    const imageUrl = formData.get('imageUrl') as string | null; // Get imageUrl
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;

    if (!image && !imageUrl) {
      return NextResponse.json(
        { error: 'Se requiere un archivo de imagen o una URL' },
        { status: 400 }
      );
    }
    if (!title || !description) {
      return NextResponse.json(
        { error: 'Faltan campos requeridos (título, descripción)' },
        { status: 400 }
      );
    }

    let filename: string;
    let savedImageUrl: string; // URL relative to public directory

    if (image) {
      // Handle file upload
      const bytes = await image.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Create a unique filename
      const fileExtension = path.extname(image.name);
      filename = `${uuidv4()}${fileExtension}`;
      const filePath = path.join(UPLOADS_DIR, filename);
      console.log(`Saving uploaded file to: ${filePath}`);

      // Save the file
      await fs.writeFile(filePath, buffer);
      console.log(`File saved successfully: ${filePath}`);
      savedImageUrl = `/uploads/${filename}`;

    } else if (imageUrl) {
      // Handle URL upload (Needs proper implementation to download the image)
      // For now, we'll just save the URL directly, but this won't display an image
      // unless the URL is directly accessible from the frontend.
      // **TODO: Implement image download from URL**
      console.warn('URL upload is not fully implemented (image file not downloaded). Storing URL directly.', imageUrl);
      // A more robust solution would involve downloading the image from the URL
      // and saving it to public/uploads, similar to file upload.
      // Example (requires a library like node-fetch): 
      /*
      try {
        const response = await fetch(imageUrl);
        if (!response.ok) throw new Error(`Failed to fetch image from URL: ${response.statusText}`);
        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const urlParts = imageUrl.split('.');
        const fileExtension = urlParts.length > 1 ? `.${urlParts.pop()}` : '';
        filename = `${uuidv4()}${fileExtension}`;
        const filePath = path.join(UPLOADS_DIR, filename);
        await fs.writeFile(filePath, buffer);
        savedImageUrl = `/uploads/${filename}`;
        console.log(`Downloaded and saved image from URL to: ${filePath}`);
      } catch (urlError) {
        console.error('Error downloading image from URL:', urlError);
        return NextResponse.json(
          { error: 'Error al descargar la imagen de la URL proporcionada' },
          { status: 500 }
        );
      }
      */
      // For now, just store the external URL directly (this likely won't work in <Image> if it's not in public)
      filename = imageUrl.split('/').pop() || `url-image-${uuidv4()}`;
      savedImageUrl = imageUrl; // Storing the external URL directly
    } else { // Should not happen based on initial check, but good for typesafety
      return NextResponse.json({ error: 'No image data provided' }, { status: 400 });
    }

    // Create image record
    const imageRecord = {
      id: uuidv4(),
      url: savedImageUrl, // Use the URL relative to public or the external URL
      title,
      description,
    };

    // Get current images and add new one
    const images = await readCarouselImages();
    images.push(imageRecord);
    await writeCarouselImages(images);
    console.log('Image record added to JSON:', imageRecord);

    return NextResponse.json(imageRecord);
  } catch (error) {
    console.error('Error uploading image (catch block):', error);
    return NextResponse.json(
      { error: 'Error interno del servidor al subir la imagen' }, // Generic error for client
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