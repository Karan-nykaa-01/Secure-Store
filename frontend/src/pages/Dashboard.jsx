import { useState, useRef } from 'react';
import { Upload, X, CheckCircle, AlertCircle, Image as ImageIcon } from 'lucide-react';
import { axiosInstance } from '../lib/axiosInstance';
import { toast } from 'react-hot-toast';

export default function Dashboard() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef(null);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file');
        return;
      }
      
      setSelectedFile(file);
      setUploadSuccess(false);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setPreview(null);
    setUploadSuccess(false);
    setUploadProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error('Please select a file first');
      return;
    }

    const formData = new FormData();
    formData.append('image', selectedFile);

    setUploading(true);
    setUploadProgress(0);
    try {
      const response = await axiosInstance.post('/aws/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(percentCompleted);
        },
      });

      toast.success('Image uploaded successfully!');
      setUploadSuccess(true);
      
      // Reset after 2 seconds
      setTimeout(() => {
        handleRemoveFile();
      }, 2000);
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(error.response?.data?.message || 'Upload failed');
      setUploadProgress(0);
    } finally {
      setUploading(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      setUploadSuccess(false);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      toast.error('Please drop an image file');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Secure Image Upload
          </h1>
          <p className="text-lg text-gray-600">
            Upload your images safely to cloud storage with instant preview
          </p>
        </div>

        {/* Upload Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {!preview ? (
            // Upload Area
            <div
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className="border-3 border-dashed border-gray-300 rounded-xl p-12 text-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all duration-300"
            >
              <div className="flex flex-col items-center space-y-4">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
                  <Upload className="w-10 h-10 text-blue-600" />
                </div>
                <div>
                  <p className="text-xl font-semibold text-gray-700 mb-2">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-sm text-gray-500">
                    PNG, JPG, JPEG, GIF, WEBP up to 10MB
                  </p>
                </div>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>
          ) : (
            // Preview Area
            <div className="space-y-6">
              <div className="relative">
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full h-96 object-contain rounded-lg bg-gray-50"
                />
                {uploadSuccess && (
                  <div className="absolute inset-0 bg-green-500 bg-opacity-90 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <CheckCircle className="w-20 h-20 text-white mx-auto mb-4" />
                      <p className="text-2xl font-bold text-white">Upload Successful!</p>
                    </div>
                  </div>
                )}
              </div>

              {/* File Info */}
              <div className="bg-gray-50 rounded-lg p-4 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <ImageIcon className="w-8 h-8 text-gray-600" />
                  <div>
                    <p className="font-medium text-gray-900">{selectedFile?.name}</p>
                    <p className="text-sm text-gray-500">
                      {(selectedFile?.size / 1024).toFixed(2)} KB
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleRemoveFile}
                  disabled={uploading}
                  className="p-2 hover:bg-gray-200 rounded-full transition-colors disabled:opacity-50"
                >
                  <X className="w-6 h-6 text-gray-600" />
                </button>
              </div>

              {/* Progress Bar */}
              {uploading && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 font-medium">Uploading...</span>
                    <span className="text-blue-600 font-bold">{uploadProgress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-300 ease-out flex items-center justify-end pr-1"
                      style={{ width: `${uploadProgress}%` }}
                    >
                      {uploadProgress > 10 && (
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Upload Button */}
              <button
                onClick={handleUpload}
                disabled={uploading || uploadSuccess}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-lg transition-all duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {uploading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Uploading... {uploadProgress}%</span>
                  </>
                ) : uploadSuccess ? (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    <span>Uploaded Successfully</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-5 h-5" />
                    <span>Upload to Cloud</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Info Section */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-blue-900 mb-2">
                Secure Storage Information
              </h3>
              <p className="text-sm text-blue-800">
                Your images are securely stored in AWS S3 with encryption at rest. 
                All uploads are processed through secure channels and are accessible only to you.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
