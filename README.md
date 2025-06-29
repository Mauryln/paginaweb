# E-Consultant - BIMCAT

Aplicación web para consultoría y cursos de BIMCAT, construida con Next.js 15.

## 🚀 Despliegue en Render (Versión Gratuita)

### Configuración Manual

Esta aplicación está configurada para desplegarse en Render usando Docker. Como estás usando la versión gratuita, necesitas configurar el servicio manualmente.

### Pasos para el Despliegue

1. **Subir código a GitHub**
   ```bash
   git add .
   git commit -m "Configuración para despliegue en Render"
   git push origin main
   ```

2. **Crear servicio en Render**
   - Ve a [render.com](https://render.com)
   - Haz clic en "New +" → "Web Service"
   - Conecta tu repositorio de GitHub
   - Selecciona el repositorio de tu proyecto

3. **Configuración del Servicio**
   - **Name**: `e-consultant` (o el nombre que prefieras)
   - **Environment**: `Docker`
   - **Region**: Elige la más cercana a tus usuarios
   - **Branch**: `main` (o tu rama principal)
   - **Root Directory**: Deja vacío (si tu código está en la raíz)
   - **Build Command**: Deja vacío (Docker se encarga automáticamente)
   - **Start Command**: Deja vacío (Docker se encarga automáticamente)

4. **Variables de Entorno**
   Agrega estas variables en la sección "Environment Variables":
   - `NODE_ENV` = `production`
   - `PORT` = `3000`

5. **Configuración Avanzada**
   - **Health Check Path**: `/`
   - **Auto-Deploy**: ✅ Activado
   - **Plan**: Free

6. **Crear Servicio**
   - Haz clic en "Create Web Service"
   - Render comenzará el build automáticamente

### Verificación de Configuración

Ejecuta el script de verificación para asegurar que todo esté configurado correctamente:

```bash
npm run check-deployment
```

### Solución de Problemas

Si encuentras un error 404 después del despliegue:

1. **Verifica los logs** en el dashboard de Render
2. **Asegúrate de que el build sea exitoso**
3. **Espera unos minutos** después del despliegue para que los cambios se propaguen
4. **Verifica que el health check esté pasando**

### ⚠️ Notas Importantes para Versión Gratuita

- **Tiempo de inactividad**: Tu aplicación se "dormirá" después de 15 minutos de inactividad
- **Límites de uso**: Revisa los límites de la versión gratuita en render.com
- **Reinicio automático**: La aplicación se reiniciará automáticamente cuando reciba tráfico

## 🛠 Desarrollo Local

### Instalación

```bash
npm install
```

### Ejecutar en Desarrollo

```bash
npm run dev
```

### Construir para Producción

```bash
npm run build
npm start
```

## 📁 Estructura del Proyecto

```
src/
├── app/                 # App Router de Next.js
│   ├── admin/          # Panel de administración
│   ├── api/            # API routes
│   ├── cursos/         # Páginas de cursos
│   └── ...
├── components/         # Componentes reutilizables
├── data/              # Datos estáticos
├── services/          # Servicios de datos
└── ...
```

## 🎨 Tecnologías

- **Next.js 15** - Framework de React
- **TypeScript** - Tipado estático
- **Tailwind CSS** - Estilos
- **Docker** - Containerización
- **Render** - Plataforma de despliegue

## 📞 Contacto

Para soporte técnico o consultas sobre el despliegue, contacta al equipo de desarrollo.
