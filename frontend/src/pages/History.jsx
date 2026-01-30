/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect, useContext } from "react";
import {
  ExternalLink,
  Copy,
  AlertCircle,
} from "lucide-react";
import { AppContext } from "../context/AppContext";
import { copyToClipboard, formatDate } from "../lib/helper";

export default function History() {
  const { uploads, fetchUploadHistory } = useContext(AppContext);
  const [loading, setLoading] = useState(true);

  const fetchUploads = async () => {
    setLoading(true);
    await fetchUploadHistory();
    console.log("Fetched uploads:", uploads);
    setLoading(false);
  };

  useEffect(() => {
    fetchUploads();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <Header />
      <Table uploads={uploads} loading={loading} />
    </div>
  );
}

function Header() {
  return (
    <div className="mb-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Upload History</h1>
      <p className="text-sm text-gray-600">
        Your last 5 uploads are listed below
      </p>
    </div>
  );
}

function Table({ uploads, loading }) {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="overflow-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-800 uppercase tracking-wider">
                Preview
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-800 uppercase tracking-wider">
                File Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-800 uppercase tracking-wider">
                Upload Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-800 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan="4"
                  className="py-10 text-center text-gray-500"
                >
                  fetching uploads...
                </td>
              </tr>
            ) : uploads.length === 0 ? (
              <tr>
                <td colSpan="4" className="py-10 text-center text-gray-500">
                  <div className="flex flex-col items-center justify-center">
                    <AlertCircle className="mb-2" />
                    No uploads found.
                  </div>
                </td>
              </tr>
            ) : (
              uploads.map((upload) => (
                <tr
                  key={upload._id}
                  className="hover:bg-gray-50 transition-colors border-b border-gray-200"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <img
                      src={upload.fileUrl}
                      alt={upload.fileName}
                      className="w-12 h-12 object-cover rounded border border-gray-200"
                      onError={(e) => {
                        e.target.src =
                          'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="48" height="48"%3E%3Crect fill="%23e5e7eb" width="48" height="48"/%3E%3Ctext fill="%239ca3af" x="50%25" y="50%25" text-anchor="middle" dy=".3em" font-size="10"%3ENo Image%3C/text%3E%3C/svg%3E';
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
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
