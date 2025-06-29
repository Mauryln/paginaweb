# E-Consultant - BIMCAT

Aplicación web para consultoría y cursos de BIMCAT, construida con Next.js 15.

## 🚀 Despliegue en Render

### Configuración Automática

Esta aplicación está configurada para desplegarse automáticamente en Render usando Docker. Los archivos de configuración incluyen:

- `render.yaml` - Configuración de Render
- `Dockerfile` - Configuración de Docker optimizada para Next.js
- `next.config.js` - Configuración de Next.js con output standalone

### Pasos para el Despliegue

1. **Subir código a GitHub**
   ```bash
   git add .
   git commit -m "Configuración para despliegue en Render"
   git push origin main
   ```

2. **Crear servicio en Render**
   - Ve a [render.com](https://render.com)
   - Crea un nuevo "Web Service"
   - Conecta tu repositorio de GitHub
   - Render detectará automáticamente la configuración

3. **Variables de Entorno (Opcional)**
   Si necesitas variables de entorno específicas, configúralas en el dashboard de Render:
   - `NODE_ENV=production`
   - `PORT=3000`

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
