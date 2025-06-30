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
  'src/app/layout.tsx',
  'tailwind.config.ts',
  'postcss.config.mjs',
  'tsconfig.json'
];

let allFilesExist = true;

requiredFiles.forEach(file => {
  const exists = fs.existsSync(file);
  console.log(`${exists ? '✅' : '❌'} ${file}`);
  if (!exists) allFilesExist = false;
});

console.log('\n📦 Verificando dependencias...');

// Verificar package.json
try {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  
  // Verificar scripts necesarios
  const requiredScripts = ['build', 'start', 'dev'];
  requiredScripts.forEach(script => {
    const hasScript = packageJson.scripts && packageJson.scripts[script];
    console.log(`${hasScript ? '✅' : '❌'} Script '${script}'`);
  });
  
  // Verificar dependencias críticas
  const criticalDeps = ['next', 'react', 'react-dom'];
  criticalDeps.forEach(dep => {
    const hasDep = packageJson.dependencies && packageJson.dependencies[dep];
    console.log(`${hasDep ? '✅' : '❌'} Dependencia '${dep}'`);
  });
  
  // Verificar devDependencies críticas
  const criticalDevDeps = ['typescript', 'tailwindcss'];
  criticalDevDeps.forEach(dep => {
    const hasDep = packageJson.devDependencies && packageJson.devDependencies[dep];
    console.log(`${hasDep ? '✅' : '❌'} DevDependencia '${dep}'`);
  });
  
} catch (error) {
  console.log('❌ Error al leer package.json:', error.message);
  allFilesExist = false;
}

console.log('\n📁 Verificando estructura de directorios...');

// Verificar directorios necesarios
const requiredDirs = [
  'src/app',
  'src/components',
  'src/data',
  'public'
];

requiredDirs.forEach(dir => {
  const exists = fs.existsSync(dir);
  console.log(`${exists ? '✅' : '❌'} Directorio '${dir}'`);
  if (!exists) allFilesExist = false;
});

console.log('\n🔧 Verificando configuración de TypeScript...');

// Verificar tsconfig.json
try {
  const tsConfig = JSON.parse(fs.readFileSync('tsconfig.json', 'utf8'));
  
  // Verificar configuración de paths
  const hasPaths = tsConfig.compilerOptions && tsConfig.compilerOptions.paths;
  console.log(`${hasPaths ? '✅' : '❌'} Configuración de paths en tsconfig.json`);
  
  // Verificar configuración de moduleResolution
  const moduleResolution = tsConfig.compilerOptions && tsConfig.compilerOptions.moduleResolution;
  console.log(`${moduleResolution ? '✅' : '❌'} moduleResolution configurado: ${moduleResolution}`);
  
} catch (error) {
  console.log('❌ Error al leer tsconfig.json:', error.message);
  allFilesExist = false;
}

console.log('\n🎨 Verificando configuración de Tailwind...');

// Verificar tailwind.config.ts
try {
  const tailwindConfig = require('../tailwind.config.ts');
  const hasContent = tailwindConfig.content && Array.isArray(tailwindConfig.content);
  console.log(`${hasContent ? '✅' : '❌'} Configuración de content en Tailwind`);
  
} catch (error) {
  console.log('❌ Error al leer tailwind.config.ts:', error.message);
  allFilesExist = false;
}

console.log('\n📋 Resumen:');
if (allFilesExist) {
  console.log('✅ Todos los archivos y configuraciones necesarias están presentes');
  console.log('🚀 El proyecto debería poder construirse correctamente');
} else {
  console.log('❌ Se encontraron problemas en la configuración');
  console.log('🔧 Por favor, corrige los problemas antes de intentar el despliegue');
}

console.log('\n💡 Consejos para el despliegue:');
console.log('1. Asegúrate de que todas las dependencias estén instaladas: npm install');
console.log('2. Prueba el build localmente: npm run build');
console.log('3. Verifica que no haya errores de TypeScript: npx tsc --noEmit');
console.log('4. Asegúrate de que las variables de entorno estén configuradas en Render');

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