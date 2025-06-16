"use client"

import { useState } from 'react'
import { Upload } from 'lucide-react'

export default function CarouselAdmin() {
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState('')

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files || files.length === 0) return

    setUploading(true)
    setMessage('')

    const formData = new FormData()
    for (let i = 0; i < files.length; i++) {
      formData.append('files', files[i])
    }

    try {
      const response = await fetch('/api/upload-carousel', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Error al subir las imágenes')
      }

      setMessage('Imágenes subidas correctamente')
      // Recargar la página después de 2 segundos
      setTimeout(() => {
        window.location.reload()
      }, 2000)
    } catch (error) {
      setMessage('Error al subir las imágenes')
      console.error('Error:', error)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Administración del Carrusel</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Subir imágenes al carrusel
          </label>
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
            <div className="space-y-1 text-center">
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <div className="flex text-sm text-gray-600">
                <label
                  htmlFor="file-upload"
                  className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                >
                  <span>Subir imágenes</span>
                  <input
                    id="file-upload"
                    name="file-upload"
                    type="file"
                    className="sr-only"
                    multiple
                    accept="image/*"
                    onChange={handleFileUpload}
                    disabled={uploading}
                  />
                </label>
                <p className="pl-1">o arrastrar y soltar</p>
              </div>
              <p className="text-xs text-gray-500">
                PNG, JPG, GIF hasta 10MB
              </p>
            </div>
          </div>
        </div>

        {message && (
          <div className={`mt-4 p-4 rounded-md ${
            message.includes('Error') ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'
          }`}>
            {message}
          </div>
        )}

        {uploading && (
          <div className="mt-4 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-300 border-t-indigo-600"></div>
            <p className="mt-2 text-sm text-gray-500">Subiendo imágenes...</p>
          </div>
        )}
      </div>
    </div>
  )
} 