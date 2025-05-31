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
async function writeCarouselImages(images: string[]) {
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

    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ message: 'No file uploaded' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Generate a unique filename
    const fileExtension = path.extname(file.name);
    const uniqueFilename = `${uuidv4()}${fileExtension}`;
    const filePath = path.join(UPLOADS_DIR, uniqueFilename);

    // Save the file
    await fs.writeFile(filePath, buffer);

    // Get current images list, add the new image path, and save
    const images = await readCarouselImages();
    const imageUrl = `/uploads/${uniqueFilename}`; // Path relative to public directory
    images.push(imageUrl);
    await writeCarouselImages(images);

    return NextResponse.json({ message: 'File uploaded successfully', filePath: imageUrl });

  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json({ message: 'Error uploading file' }, { status: 500 });
  }
}

// TODO: Add DELETE request to remove images
export async function DELETE(request: NextRequest) {
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json({ message: 'Image URL is required' }, { status: 400 });
    }

    // Construct the absolute file path
    const filename = path.basename(url);
    const filePath = path.join(UPLOADS_DIR, filename);

    // Check if the file exists and is within the uploads directory
    const realFilePath = await fs.realpath(filePath);
    const realUploadsDir = await fs.realpath(UPLOADS_DIR);

    if (!realFilePath.startsWith(realUploadsDir)) {
        return NextResponse.json({ message: 'Cannot delete files outside the uploads directory' }, { status: 400 });
    }

    // Delete the file from the filesystem
    await fs.unlink(filePath);

    // Read current images, remove the deleted image URL, and write back
    const images = await readCarouselImages();
    const updatedImages = images.filter(imageUrl => imageUrl !== url);
    await writeCarouselImages(updatedImages);

    return NextResponse.json({ message: 'Image deleted successfully' });

  } catch (error) {
    console.error('Error deleting file:', error);
    return NextResponse.json({ message: 'Error deleting file' }, { status: 500 });
  }
} 