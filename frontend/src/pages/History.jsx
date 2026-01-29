import { useEffect, useContext } from 'react';
import { Image as ImageIcon, ExternalLink, Copy, AlertCircle } from 'lucide-react';
import { AppContext } from '../context/AppContext';
import { toast } from 'react-hot-toast';
import Loader from '../components/Loader';

export default function History() {
  const { uploadsLoading=false, fetchUploadHistory } = useContext(AppContext);

  const uploads = [
    {
      _id: '1',
      fileName: 'sunset.jpg',
      fileSize: 204800,
      mimeType: 'image/jpeg',
      fileUrl: 'https://example.com/sunset.jpg',
      createdAt: '2024-06-15T14:30:00Z'
    },
    {
      _id: '2',
      fileName: 'mountains.png',
      fileSize: 512000,
      mimeType: 'image/png',
      fileUrl: 'https://example.com/mountains.png',
      createdAt: '2024-06-14T10:15:00Z'
    },
    {
      _id: '3',
      fileName: 'forest.gif',
      fileSize: 102400,
      mimeType: 'image/gif',
      fileUrl: 'https://example.com/forest.gif',
      createdAt: '2024-06-13T08:45:00Z'
    },
    {
      _id: '4',
      fileName: 'beach.bmp',
      fileSize: 307200,
      mimeType: 'image/bmp',
      fileUrl: 'https://example.com/beach.bmp',
      createdAt: '2024-06-12T16:20:00Z'
    },
    {
      _id: '5',
      fileName: 'cityscape.tiff',
      fileSize: 409600,
      mimeType: 'image/tiff',
      fileUrl: 'https://example.com/cityscape.tiff',
      createdAt: '2024-06-11T12:00:00Z'
    }
  ]

  useEffect(() => {
    fetchUploadHistory();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  const copyToClipboard = (url) => {
    navigator.clipboard.writeText(url);
    toast.success('URL copied to clipboard!');
  };

  return (
    <div className="h-screen overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="h-full max-w-7xl mx-auto flex flex-col">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Upload History
          </h1>
          <p className="text-sm text-gray-600">
            You last 5 uploads are listed below
          </p>
        </div>


        {/* Table Card */}
        <div className="flex-1 bg-white rounded-lg shadow-sm overflow-hidden flex flex-col">
          {uploadsLoading ? (
            <div className="flex-1 flex items-center justify-center">
              <Loader message="Loading your upload history..." />
            </div>
          ) : uploads.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="flex-1 overflow-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200 sticky top-0">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Preview
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      File Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Upload Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {uploads.map((upload, index) => (
                    <tr key={upload._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <img
                          src={upload.fileUrl}
                          alt={upload.fileName}
                          className="w-12 h-12 object-cover rounded border border-gray-200"
                          onError={(e) => {
                            e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="48" height="48"%3E%3Crect fill="%23e5e7eb" width="48" height="48"/%3E%3Ctext fill="%239ca3af" x="50%25" y="50%25" text-anchor="middle" dy=".3em" font-size="10"%3ENo Image%3C/text%3E%3C/svg%3E';
                          }}
                        />
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        <div className="max-w-xs truncate" title={upload.fileName}>
                          {upload.fileName}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {formatDate(upload.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => copyToClipboard(upload.fileUrl)}
                            className="p-2 bg-gray-100 hover:bg-gray-200 rounded transition-colors"
                            title="Copy URL"
                          >
                            <Copy className="w-4 h-4 text-gray-600" />
                          </button>
                          <a
                            href={upload.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 bg-blue-100 hover:bg-blue-200 rounded transition-colors"
                            title="Open in new tab"
                          >
                            <ExternalLink className="w-4 h-4 text-blue-600" />
                          </a>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Empty State Component
function EmptyState() {
  return (
    <div className="flex-1 flex items-center justify-center p-12">
      <div className="text-center">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <ImageIcon className="w-10 h-10 text-gray-400" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          No uploads yet
        </h3>
        <p className="text-gray-600 mb-4 text-sm">
          Start uploading images to see them appear here
        </p>
      </div>
    </div>
  );
}