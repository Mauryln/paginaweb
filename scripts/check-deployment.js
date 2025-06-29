#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔍 Verificando configuración de despliegue...\n');

// Verificar archivos necesarios
const requiredFiles = [
  'package.json',
  'next.config.js',
  'Dockerfile',
  'src/app/page.tsx',
  'src/app/layout.tsx'
];

let allFilesExist = true;

requiredFiles.forEach(file => {
  const exists = fs.existsSync(file);
  console.log(`${exists ? '✅' : '❌'} ${file}`);
  if (!exists) allFilesExist = false;
});

console.log('\n📋 Verificando configuración de Next.js...');

// Verificar next.config.js
try {
  const nextConfig = require('../next.config.js');
  if (nextConfig.output === 'standalone') {
    console.log('✅ output: standalone configurado correctamente');
  } else {
    console.log('❌ output: standalone no está configurado');
  }
} catch (error) {
  console.log('❌ Error al leer next.config.js:', error.message);
}

// Verificar package.json
try {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  if (packageJson.scripts.start) {
    console.log('✅ script start configurado:', packageJson.scripts.start);
  } else {
    console.log('❌ script start no encontrado');
  }
} catch (error) {
  console.log('❌ Error al leer package.json:', error.message);
}

// Verificar Dockerfile
try {
  const dockerfile = fs.readFileSync('Dockerfile', 'utf8');
  if (dockerfile.includes('FROM node:18-alpine')) {
    console.log('✅ Dockerfile configurado correctamente');
  } else {
    console.log('❌ Dockerfile no tiene la configuración correcta');
  }
  
  if (dockerfile.includes('output: standalone')) {
    console.log('✅ Dockerfile incluye configuración standalone');
  } else {
    console.log('❌ Dockerfile no incluye configuración standalone');
  }
} catch (error) {
  console.log('❌ Error al leer Dockerfile:', error.message);
}

console.log('\n🎯 Resumen:');
if (allFilesExist) {
  console.log('✅ Todos los archivos necesarios están presentes');
  console.log('🚀 Tu aplicación está lista para desplegarse en Render');
} else {
  console.log('❌ Faltan algunos archivos necesarios');
  console.log('⚠️  Por favor, verifica que todos los archivos estén presentes');
}

console.log('\n📝 Pasos para el despliegue en Render (Versión Gratuita):');
console.log('1. Haz commit de todos los cambios');
console.log('2. Sube los cambios a tu repositorio');
console.log('3. Ve a render.com y crea un nuevo Web Service');
console.log('4. Configura manualmente:');
console.log('   - Environment: Docker');
console.log('   - Variables de entorno: NODE_ENV=production, PORT=3000');
console.log('   - Health Check Path: /');
console.log('5. Render detectará automáticamente el Dockerfile y hará el build');
console.log('6. Verifica los logs en el dashboard de Render'); 