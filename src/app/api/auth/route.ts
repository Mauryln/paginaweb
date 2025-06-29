import { NextResponse } from 'next/server';

const ADMIN_PASSWORD = 'bimcat2024admin';

export async function POST(request: Request) {
  try {
    const { password } = await request.json();

    if (password === ADMIN_PASSWORD) {
      return NextResponse.json({ success: true });
    }

    return NextResponse.json(
      { success: false, message: 'Contraseña incorrecta' },
      { status: 401 }
    );
  } catch {
    return NextResponse.json(
      { success: false, message: 'Error en el servidor' },
      { status: 500 }
    );
  }
} 