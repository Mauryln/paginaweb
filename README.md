# BIMCAT SRL - E-Consultant

Aplicación web para consultoría BIM y construcción desarrollada con Next.js.

## 🚀 Despliegue en Render

### ⚠️ Solución para Error 404

Si tu aplicación muestra error 404 en Render, sigue estos pasos:

#### 1. **Verificar Configuración Actual**
```bash
npm run check-deployment
```

#### 2. **Subir Cambios a GitHub**
```bash
git add .
git commit -m "Configuración corregida para Render - Node.js setup"
git push origin main
```

#### 3. **En Render.com - Crear Nuevo Servicio**
1. Ve a [render.com](https://render.com)
2. Crea un **nuevo Web Service** (NO uses el existente)
3. Conecta tu repositorio de GitHub
4. Render detectará automáticamente la configuración de `render.yaml`

#### 4. **Configuración del Servicio**
- **Environment**: Node.js (automático)
- **Build Command**: `npm install && npm run build` (automático)
- **Start Command**: `npm start` (automático)
- **Health Check Path**: `/` (automático)

#### 5. **Variables de Entorno**
Las siguientes variables están configuradas automáticamente:
- `NODE_ENV`: production
- `PORT`: 10000

### 🔧 Configuración Actual

El proyecto está configurado para usar **Node.js** directamente en Render:

- ✅ **Next.js 15** con configuración optimizada
- ✅ **Scripts de build y start** configurados correctamente
- ✅ **Variables de entorno** configuradas
- ✅ **Health check** configurado
- ✅ **Build filters** para optimizar el despliegue

### 📁 Estructura del Proyecto

```
src/
├── app/                 # Páginas de la aplicación
├── components/          # Componentes reutilizables
├── data/               # Datos estáticos
├── services/           # Servicios de API
└── config/             # Configuraciones
```

### 🛠️ Tecnologías

- **Next.js 15** - Framework de React
- **TypeScript** - Tipado estático
- **Tailwind CSS** - Estilos
- **Render** - Plataforma de despliegue

### 🚀 Desarrollo Local

```bash
npm install
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`

### 🔍 Solución de Problemas

#### Error 404 en Render:
1. **Verifica los logs** en el dashboard de Render
2. **Asegúrate** de crear un nuevo servicio (no reutilizar el existente)
3. **Confirma** que el repositorio esté conectado correctamente
4. **Revisa** que el build se complete sin errores
5. **Espera** 2-3 minutos después del despliegue para que el health check pase

#### Build Fails:
1. Ejecuta `npm run build` localmente para verificar
2. Revisa que todas las dependencias estén instaladas
3. Verifica que no haya errores de TypeScript

### 📞 Soporte

Si el problema persiste:
1. Revisa los logs de build en Render
2. Verifica que el repositorio esté actualizado
3. Crea un nuevo servicio desde cero

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
