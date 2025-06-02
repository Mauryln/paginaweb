import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const { imageUrl } = await request.json();

    if (!imageUrl) {
      return NextResponse.json({ error: 'Image URL is required' }, { status: 400 });
    }

    // Basic validation to ensure the URL is within the uploads directory
    if (!imageUrl.startsWith('/uploads/')) {
        return NextResponse.json({ error: 'Invalid image URL' }, { status: 400 });
    }

    // Construct the absolute file path
    const filename = path.basename(imageUrl);
    const filePath = path.join(process.cwd(), 'public', 'uploads', filename);

    // Check if the file exists before attempting to delete
    try {
        await fs.access(filePath);
    } catch (error) {
        console.warn(`File not found, skipping deletion: ${filePath}`);
        return NextResponse.json({ message: 'File not found, deletion skipped' });
    }

    // Delete the file
    await fs.unlink(filePath);

    return NextResponse.json({ message: 'File deleted successfully' });

  } catch (error) {
    console.error('Error deleting image file:', error);
    return NextResponse.json({ error: 'Error deleting image file' }, { status: 500 });
  }
} 