'use client'

import { useState } from 'react'

export default function Home() {
  const [files, setFiles] = useState<File[]>([])
  const [uploading, setUploading] = useState(false)
  const [downloadUrls, setDownloadUrls] = useState<string[]>([])
  const [progress, setProgress] = useState<{[key: string]: {
    status: 'pending' | 'processing' | 'completed' | 'error',
    url?: string
  }}>({})

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files))
    }
  }

  const processFile = async (file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    
    setProgress(prev => ({
      ...prev,
      [file.name]: { status: 'processing' }
    }))

    try {
      const response = await fetch('http://localhost:8000/anonymize-single', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Failed to anonymize resume')
      }

      const data = await response.json()
      
      setProgress(prev => ({
        ...prev,
        [file.name]: { status: 'completed', url: data.downloadUrl }
      }))
      
      return data.downloadUrl
    } catch (error) {
      console.error('Error processing file:', file.name, error)
      setProgress(prev => ({
        ...prev,
        [file.name]: { status: 'error' }
      }))
      return null
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (files.length === 0) return

    setUploading(true)
    const newProgress: {[key: string]: {status: 'pending' | 'processing' | 'completed' | 'error', url?: string}} = {}
    files.forEach(file => {
      newProgress[file.name] = { status: 'pending' }
    })
    setProgress(newProgress)

    // Process all files concurrently
    const processPromises = files.map(file => processFile(file))
    const urls = (await Promise.all(processPromises)).filter(url => url !== null) as string[]
    setDownloadUrls(urls)
    setUploading(false)
  }

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">Resume Anonymizer</h1>
        
        <div className="bg-white p-8 rounded-lg shadow-md dark:bg-gray-800 dark:text-white">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="files" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                Upload Resumes (PDF or DOCX format)
              </label>
              <input
                type="file"
                id="files"
                multiple
                accept=".pdf,.docx"
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-500 dark:text-gray-300
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-md file:border-0
                  file:text-sm file:font-semibold
                  file:bg-blue-50 file:text-blue-700
                  hover:file:bg-blue-100
                  dark:file:bg-blue-900 dark:file:text-blue-100"
              />
            </div>

            <div>
              <button
                type="submit"
                disabled={uploading || files.length === 0}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white 
                  ${uploading || files.length === 0 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                  }`}
              >
                {uploading ? 'Processing...' : 'Anonymize Resumes'}
              </button>
            </div>
          </form>

          {Object.keys(progress).length > 0 && (
            <div className="mt-8">
              <h2 className="text-lg font-medium mb-4">Resume Processing Status:</h2>
              <ul className="space-y-3">
                {Object.entries(progress).map(([fileName, status]) => (
                  <li key={fileName} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded">
                    <div className="flex items-center space-x-3">
                      <span className={`w-2 h-2 rounded-full ${
                        status.status === 'pending' ? 'bg-gray-400' :
                        status.status === 'processing' ? 'bg-blue-500 animate-pulse' :
                        status.status === 'completed' ? 'bg-green-500' :
                        'bg-red-500'
                      }`} />
                      <span className="text-sm">{fileName}</span>
                    </div>
                    {status.status === 'completed' && status.url && (
                      <a
                        href={status.url}
                        download
                        className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 underline"
                      >
                        Download
                      </a>
                    )}
                    {status.status === 'error' && (
                      <span className="text-sm text-red-500">Failed to process</span>
                    )}
                    {status.status === 'processing' && (
                      <span className="text-sm text-blue-500">Processing...</span>
                    )}
                    {status.status === 'pending' && (
                      <span className="text-sm text-gray-500">Pending...</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
