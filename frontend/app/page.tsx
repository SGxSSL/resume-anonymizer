'use client'

import { useState } from 'react'

export default function Home() {
  const [files, setFiles] = useState<File[]>([])
  const [uploading, setUploading] = useState(false)
  const [downloadUrls, setDownloadUrls] = useState<string[]>([])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (files.length === 0) return

    setUploading(true)
    const formData = new FormData()
    files.forEach((file) => {
      formData.append('files', file)
    })

    try {
      const response = await fetch('http://localhost:8000/anonymize', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Failed to anonymize resumes')
      }

      const data = await response.json()
      setDownloadUrls(data.downloadUrls)
    } catch (error) {
      console.error('Error:', error)
      alert('Failed to process resumes')
    } finally {
      setUploading(false)
    }
  }

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">Resume Anonymizer</h1>
        
        <div className="bg-white p-8 rounded-lg shadow-md dark:bg-gray-800 dark:text-white">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="files" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                Upload Resumes (DOCX format)
              </label>
              <input
                type="file"
                id="files"
                multiple
                accept=".docx"
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

          {downloadUrls.length > 0 && (
            <div className="mt-8">
              <h2 className="text-lg font-medium mb-4">Processed Resumes:</h2>
              <ul className="space-y-2">
                {downloadUrls.map((url, index) => (
                  <li key={index}>
                    <a
                      href={url}
                      download
                      className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 underline"
                    >
                      Download Anonymized Resume {index + 1}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
