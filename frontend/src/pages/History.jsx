import { useState, useEffect } from 'react';
import { Clock, Image as ImageIcon, ExternalLink, Calendar, FileText, AlertCircle } from 'lucide-react';
import { axiosInstance } from '../lib/axiosInstance';
import { toast } from 'react-hot-toast';

export default function History() {
  const [uploads, setUploads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUploadHistory();
  }, []);

  const fetchUploadHistory = async () => {
    try {
      const response = await axiosInstance.get('/aws/history?limit=5');
      setUploads(response.data.uploads);
    } catch (error) {
      console.error('Error fetching history:', error);
      toast.error(error.response?.data?.message || 'Failed to load upload history');
    } finally {
      setLoading(false);
    }
  };

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading your upload history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Upload History
          </h1>
          <p className="text-lg text-gray-600">
            View your recent image uploads and access them anytime
          </p>
        </div>

        {/* Stats Card */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-blue-100 p-4 rounded-lg">
                <ImageIcon className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Uploads</p>
                <p className="text-3xl font-bold text-gray-900">{uploads.length}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Last 5 uploads</p>
              <p className="text-sm font-medium text-blue-600">Most Recent First</p>
            </div>
          </div>
        </div>

        {/* Upload List */}
        {uploads.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <ImageIcon className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-3">
              No uploads yet
            </h3>
            <p className="text-gray-600 mb-6">
              Start uploading images to see them appear here
            </p>
            <a
              href="/"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors"
            >
              Upload Your First Image
            </a>
          </div>
        ) : (
          <div className="space-y-4">
            {uploads.map((upload, index) => (
              <div
                key={upload._id}
                className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden"
              >
                <div className="flex flex-col md:flex-row">
                  {/* Image Preview */}
                  <div className="md:w-64 h-48 md:h-auto bg-gray-100 flex-shrink-0">
                    <img
                      src={upload.fileUrl}
                      alt={upload.fileName}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23ddd" width="100" height="100"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3ENo Image%3C/text%3E%3C/svg%3E';
                      }}
                    />
                  </div>

                  {/* Content */}
                  <div className="flex-1 p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full">
                            #{uploads.length - index}
                          </span>
                          <h3 className="text-lg font-semibold text-gray-900 truncate">
                            {upload.fileName}
                          </h3>
                        </div>
                        <p className="text-sm text-gray-500">
                          {formatFileSize(upload.fileSize)} • {upload.mimeType}
                        </p>
                      </div>
                      <a
                        href={upload.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-4 p-2 bg-blue-100 hover:bg-blue-200 rounded-lg transition-colors"
                        title="Open in new tab"
                      >
                        <ExternalLink className="w-5 h-5 text-blue-600" />
                      </a>
                    </div>

                    {/* Date and Time Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center space-x-3 bg-gray-50 rounded-lg p-3">
                        <Calendar className="w-5 h-5 text-gray-600" />
                        <div>
                          <p className="text-xs text-gray-500">Upload Date</p>
                          <p className="text-sm font-medium text-gray-900">
                            {formatDate(upload.createdAt)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3 bg-gray-50 rounded-lg p-3">
                        <Clock className="w-5 h-5 text-gray-600" />
                        <div>
                          <p className="text-xs text-gray-500">Upload Time</p>
                          <p className="text-sm font-medium text-gray-900">
                            {formatTime(upload.createdAt)}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* URL Display */}
                    <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-3">
                      <div className="flex items-start space-x-2">
                        <FileText className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-blue-600 font-medium mb-1">Image URL</p>
                          <p className="text-xs text-blue-800 break-all font-mono">
                            {upload.fileUrl}
                          </p>
                        </div>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(upload.fileUrl);
                            toast.success('URL copied to clipboard!');
                          }}
                          className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded transition-colors whitespace-nowrap"
                        >
                          Copy
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Info Footer */}
        {uploads.length > 0 && (
          <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-yellow-900 mb-2">
                  Storage Information
                </h3>
                <p className="text-sm text-yellow-800">
                  Showing your last 5 uploads. All images are securely stored in AWS S3 
                  and remain accessible through their unique URLs indefinitely.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
