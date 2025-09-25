import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { Upload, FileText, Sparkles } from 'lucide-react'

export default function ProjectPage() {
  const { id } = useParams()
  const [files] = useState([
    { id: 1, name: 'document1.pdf', size: '2.3 MB', uploadedAt: '2024-01-15' },
    { id: 2, name: 'notes.txt', size: '45 KB', uploadedAt: '2024-01-14' },
  ])
  const [summary] = useState('')

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Project #{id}
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Upload documents and generate summaries using AI
          </p>
        </div>

        <div className="border-t border-gray-200">
          <div className="px-4 py-5 sm:p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

              <div>
                <h4 className="text-base font-medium text-gray-900 mb-4">Documents</h4>

                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-600">
                    <span className="font-medium text-blue-600 hover:text-blue-500 cursor-pointer">
                      Click to upload
                    </span>{' '}
                    or drag and drop
                  </p>
                  <p className="text-xs text-gray-500">PDF, TXT, DOCX up to 10MB</p>
                </div>

                {files.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {files.map((file) => (
                      <div
                        key={file.id}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center">
                          <FileText className="h-5 w-5 text-gray-400 mr-3" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">{file.name}</p>
                            <p className="text-xs text-gray-500">{file.size} • {file.uploadedAt}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-base font-medium text-gray-900">AI Summary</h4>
                  <button className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500">
                    <Sparkles className="h-4 w-4 mr-2" />
                    Generate Summary
                  </button>
                </div>

                <div className="min-h-[300px] p-4 bg-gray-50 rounded-lg">
                  {summary ? (
                    <p className="text-sm text-gray-700">{summary}</p>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-gray-500">
                      <Sparkles className="h-8 w-8 mb-2" />
                      <p className="text-sm">Upload documents and click "Generate Summary" to get started</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}