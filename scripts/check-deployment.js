#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔍 Verificando configuración para despliegue en Render...\n');

// Verificar archivos necesarios
const requiredFiles = [
  'package.json',
  'next.config.js',
  'render.yaml',
  'Dockerfile',
  '.dockerignore'
];

let allFilesPresent = true;

requiredFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file} - Presente`);
  } else {
    console.log(`❌ ${file} - Faltante`);
    allFilesPresent = false;
  }
});

// Verificar package.json
try {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  
  if (packageJson.scripts.start && packageJson.scripts.start.includes('${PORT:-3000}')) {
    console.log('✅ package.json - Script start configurado correctamente');
  } else {
    console.log('❌ package.json - Script start no está configurado para usar ${PORT:-3000}');
    allFilesPresent = false;
  }
} catch (error) {
  console.log('❌ package.json - Error al leer el archivo');
  allFilesPresent = false;
}

// Verificar next.config.js
try {
  const nextConfig = fs.readFileSync('next.config.js', 'utf8');
  if (nextConfig.includes('output: \'standalone\'')) {
    console.log('✅ next.config.js - Configuración standalone presente');
  } else {
    console.log('❌ next.config.js - Configuración standalone faltante');
    allFilesPresent = false;
  }
} catch (error) {
  console.log('❌ next.config.js - Error al leer el archivo');
  allFilesPresent = false;
}

// Verificar render.yaml
try {
  const renderYaml = fs.readFileSync('render.yaml', 'utf8');
  if (renderYaml.includes('env: docker') && renderYaml.includes('dockerfilePath: ./Dockerfile')) {
    console.log('✅ render.yaml - Configuración Docker presente');
  } else {
    console.log('❌ render.yaml - Configuración Docker faltante');
    allFilesPresent = false;
  }
} catch (error) {
  console.log('❌ render.yaml - Error al leer el archivo');
  allFilesPresent = false;
}

// Verificar estructura de directorios
const requiredDirs = [
  'src/app',
  'src/components',
  'public'
];

requiredDirs.forEach(dir => {
  if (fs.existsSync(dir)) {
    console.log(`✅ ${dir}/ - Presente`);
  } else {
    console.log(`❌ ${dir}/ - Faltante`);
    allFilesPresent = false;
  }
});

console.log('\n📋 Resumen:');
if (allFilesPresent) {
  console.log('🎉 ¡Todo está listo para el despliegue en Render!');
  console.log('\n📝 Próximos pasos:');
  console.log('1. Sube tu código a GitHub');
  console.log('2. Ve a render.com y crea un nuevo Web Service');
  console.log('3. Conecta tu repositorio de GitHub');
  console.log('4. Configura las variables de entorno si las necesitas');
  console.log('5. ¡Despliega!');
} else {
  console.log('⚠️  Hay algunos problemas que necesitan ser resueltos antes del despliegue.');
}

console.log('\n📖 Para más información, consulta DEPLOYMENT.md'); 