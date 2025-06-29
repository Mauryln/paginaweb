# Guía de Despliegue en Render

## Pasos para desplegar en Render

### 1. Preparación del Repositorio
- Asegúrate de que tu código esté en un repositorio de GitHub
- Verifica que todos los archivos de configuración estén presentes

### 2. Configuración en Render

1. Ve a [render.com](https://render.com) y crea una cuenta
2. Haz clic en "New +" y selecciona "Web Service"
3. Conecta tu repositorio de GitHub
4. Configura el servicio:
   - **Name**: e-consultant (o el nombre que prefieras)
   - **Environment**: Node
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Plan**: Free (o el plan que prefieras)

### 3. Variables de Entorno (si las necesitas)

Si tu aplicación usa variables de entorno, agrégalas en la sección "Environment Variables":

```
NODE_ENV=production
PORT=3000
```

### 4. Configuración Adicional

- **Health Check Path**: `/`
- **Auto-Deploy**: Habilitado (se despliega automáticamente cuando haces push)

### 5. Despliegue

Una vez configurado, Render automáticamente:
1. Clonará tu repositorio
2. Instalará las dependencias
3. Construirá la aplicación
4. La desplegará

### 6. URL de la Aplicación

Tu aplicación estará disponible en: `https://tu-app-name.onrender.com`

## Archivos de Configuración Incluidos

- `render.yaml`: Configuración automática para Render
- `Dockerfile`: Para containerización (opcional)
- `.dockerignore`: Archivos a excluir del build
- `package.json`: Actualizado para usar la variable PORT de Render

## Notas Importantes

- Render usa la variable de entorno `PORT` automáticamente
- El build puede tomar varios minutos en la primera vez
- Asegúrate de que tu aplicación no tenga dependencias de archivos locales que no estén en el repositorio 