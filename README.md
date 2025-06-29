# BIMCAT SRL - E-Consultant

Aplicación web para consultoría BIM y construcción desarrollada con Next.js.

## 🚀 Despliegue en Render

### Configuración Actualizada

El proyecto está configurado para desplegarse automáticamente en Render usando Docker. Los cambios principales incluyen:

1. **Configuración Docker**: Usa un Dockerfile optimizado para producción
2. **Next.js Standalone**: Configurado para generar una build standalone
3. **Variables de entorno**: Configuradas correctamente para Render
4. **Health check**: Configurado para verificar que la aplicación esté funcionando

### Pasos para el Despliegue

1. **Subir código a GitHub**:
   ```bash
   git add .
   git commit -m "Configuración actualizada para Render"
   git push origin main
   ```

2. **En Render.com**:
   - Crear un nuevo **Web Service**
   - Conectar el repositorio de GitHub
   - Render detectará automáticamente la configuración Docker
   - Las variables de entorno están configuradas en `render.yaml`

3. **Variables de entorno** (opcionales):
   - `NODE_ENV`: production (ya configurado)
   - `PORT`: 10000 (ya configurado)

### Verificación

Ejecuta el script de verificación antes del despliegue:

```bash
npm run check-deployment
```

### Solución de Problemas

Si encuentras errores 404:

1. **Verifica los logs** en el dashboard de Render
2. **Asegúrate** de que el repositorio esté conectado correctamente
3. **Revisa** que el build se complete sin errores
4. **Confirma** que el health check pase correctamente

### Estructura del Proyecto

```
src/
├── app/                 # Páginas de la aplicación
├── components/          # Componentes reutilizables
├── data/               # Datos estáticos
├── services/           # Servicios de API
└── config/             # Configuraciones
```

### Tecnologías

- **Next.js 15** - Framework de React
- **TypeScript** - Tipado estático
- **Tailwind CSS** - Estilos
- **Docker** - Contenedorización
- **Render** - Plataforma de despliegue

### Desarrollo Local

```bash
npm install
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`

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
