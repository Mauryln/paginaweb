#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔍 Verificando configuración de despliegue...\n');

// Verificar archivos necesarios
const requiredFiles = [
  'package.json',
  'next.config.js',
  'Dockerfile',
  'render.yaml',
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

// Verificar render.yaml
try {
  const renderYaml = fs.readFileSync('render.yaml', 'utf8');
  if (renderYaml.includes('env: docker')) {
    console.log('✅ Render configurado para usar Docker');
  } else {
    console.log('❌ Render no está configurado para usar Docker');
  }
  
  if (renderYaml.includes('dockerfilePath: ./Dockerfile')) {
    console.log('✅ Dockerfile path configurado correctamente');
  } else {
    console.log('❌ Dockerfile path no configurado');
  }
} catch (error) {
  console.log('❌ Error al leer render.yaml:', error.message);
}

console.log('\n🎯 Resumen:');
if (allFilesExist) {
  console.log('✅ Todos los archivos necesarios están presentes');
  console.log('🚀 Tu aplicación debería desplegarse correctamente en Render');
} else {
  console.log('❌ Faltan algunos archivos necesarios');
  console.log('⚠️  Por favor, verifica que todos los archivos estén presentes');
}

console.log('\n📝 Pasos para el despliegue:');
console.log('1. Haz commit de todos los cambios');
console.log('2. Sube los cambios a tu repositorio');
console.log('3. Render detectará automáticamente los cambios y hará un nuevo despliegue');
console.log('4. Verifica los logs en el dashboard de Render'); 