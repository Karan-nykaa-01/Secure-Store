import { useState, useRef, useContext, useEffect } from "react";
import { Upload, X, CheckCircle, Image as ImageIcon, CloudDownload, } from "lucide-react";
import { AppContext } from "../context/AppContext";
import { toast } from "react-hot-toast";
import Button from "../components/Button";
import Select from "../components/Select";
import { getBucketOptions } from "../lib/helper";

export default function Dashboard() {
  const { uploadImage, getDirectories } = useContext(AppContext);
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedBucket, setSelectedBucket] = useState("");
  const [directory, setDirectory] = useState("");
  const [directories, setDirectories] = useState([]);
  const fileInputRef = useRef(null);

  // Fetch directories when bucket changes
  useEffect(() => {
    const fetchDirectories = async () => {
      if (selectedBucket) {
        const dirs = await getDirectories(selectedBucket);
        setDirectories(dirs);
      }
    };
    fetchDirectories();
  }, [selectedBucket, getDirectories]);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.error("Please select an image file");
        return;
      }

      setSelectedFile(file);
      setUploadSuccess(false);

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
      fileInputRef.current.value = "";
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error("Please select a file first");
      return;
    }

    if(!selectedBucket) {
      toast.error("Please select a bucket");
      return;
    }

    if (!directory.trim()) {
      toast.error("Please specify a directory name");
      return;
    }

    setUploading(true);
    setUploadProgress(0);
    try {
      await uploadImage(selectedFile, selectedBucket, directory, (progress) => {
        setUploadProgress(progress);
      });

      setUploadSuccess(true);

      // Reset after 2 seconds
      setTimeout(() => {
        handleRemoveFile();
      }, 2000);
    } catch (error) {
      console.log(error);
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
    if (file && file.type.startsWith("image/")) {
      setSelectedFile(file);
      setUploadSuccess(false);

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      toast.error("Please drop an image file");
    }
  };

  return (
    <div className="h-screen overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col p-4">
      <Header />

      <div className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col max-w-3xl mx-auto w-full">
        <BucketSelector
          selectedBucket={selectedBucket}
          setSelectedBucket={setSelectedBucket}
          directory={directory}
          setDirectory={setDirectory}
          directories={directories}
        />

        {!preview ? (
          <UploadArea
            fileInputRef={fileInputRef}
            handleDragOver={handleDragOver}
            handleDrop={handleDrop}
            handleFileSelect={handleFileSelect}
          />
        ) : (
          <PreviewArea
            preview={preview}
            uploadSuccess={uploadSuccess}
            selectedFile={selectedFile}
            handleRemoveFile={handleRemoveFile}
            uploading={uploading}
            uploadProgress={uploadProgress}
            handleUpload={handleUpload}
          />
        )}
      </div>
    </div>
  );
}

function Header() {
  return (
    <div className="mb-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Image Upload</h1>
      <p className="text-sm text-gray-600">
        Upload your images safely to cloud storage with ease.
      </p>
    </div>
  );
}

function BucketSelector({ selectedBucket, setSelectedBucket, directory, setDirectory, directories }) {
  const bucketOptions = getBucketOptions();
  
  const directoryOptions = directories.map(dir => ({
    value: dir,
    label: dir
  }));

  return (
    <div className="border-b border-gray-200 p-4">
      <div className="flex gap-4 items-start">
        <Select
          label="Select Bucket"
          options={bucketOptions}
          value={selectedBucket}
          onChange={setSelectedBucket}
          placeholder="Choose a bucket"
          required
        />

        <Select
          label="Directory Name"
          options={directoryOptions}
          value={directory}
          onChange={setDirectory}
          placeholder={directories.length > 0 ? "Select a directory" : "No directories found"}
          required
        />
      </div>
    </div>
  );
}

function UploadArea({
  fileInputRef,
  handleDragOver,
  handleDrop,
  handleFileSelect,
}) {
  return (
    <div className="flex-1 flex items-center justify-center p-6">
      <div
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className="w-full border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all duration-300"
      >
        <div className="flex flex-col items-center space-y-3">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
            <CloudDownload className="w-8 h-8 text-blue-600" />
          </div>
          <div>
            <p className="text-lg font-semibold text-gray-700 mb-1">
              Click to upload or drag and drop
            </p>
            <p className="text-sm text-gray-500">PNG, JPG, JPEG, GIF, WEBP</p>
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
    </div>
  );
}

function PreviewArea({
  preview,
  uploadSuccess,
  selectedFile,
  handleRemoveFile,
  uploading,
  uploadProgress,
  handleUpload,
}) {
  return (
    <div className="flex flex-col p-6 space-y-4">
      <div className="relative w-full flex items-center justify-center bg-gray-50 rounded-lg p-4">
        <img
          src={preview}
          alt="Preview"
          className="max-h-[250px] max-w-full object-contain rounded-lg"
        />
        {uploadSuccess && (
          <div className="absolute inset-0 bg-green-500 bg-opacity-90 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <CheckCircle className="w-16 h-16 text-white mx-auto mb-3" />
              <p className="text-xl font-bold text-white">Upload Successful!</p>
            </div>
          </div>
        )}
      </div>

      <FileInfo
        selectedFile={selectedFile}
        handleRemoveFile={handleRemoveFile}
        uploading={uploading}
      />

      {uploading && <ProgressBar uploadProgress={uploadProgress} />}

      <Button
        text={uploadSuccess ? "Uploaded Successfully" : "Upload to Cloud"}
        icon={uploadSuccess ? <CheckCircle /> : <Upload />}
        onClick={handleUpload}
        disabled={uploading || uploadSuccess}
        loading={uploading}
        loaderText={`Uploading... ${uploadProgress}%`}
        className="w-full py-3"
      />
    </div>
  );
}

function FileInfo({ selectedFile, handleRemoveFile, uploading }) {
  return (
    <div className="bg-gray-50 rounded-lg p-3 flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <ImageIcon className="w-6 h-6 text-gray-600 flex-shrink-0" />
        <div className="min-w-0">
          <p className="font-medium text-gray-900 text-sm truncate">
            {selectedFile?.name}
          </p>
          <p className="text-xs text-gray-500">
            {(selectedFile?.size / 1024).toFixed(2)} KB
          </p>
        </div>
      </div>
      <button
        onClick={handleRemoveFile}
        disabled={uploading}
        className="p-2 hover:bg-gray-200 rounded-full transition-colors disabled:opacity-50 flex-shrink-0 cursor-pointer"
      >
        <X className="w-5 h-5 text-gray-600" />
      </button>
    </div>
  );
}

function ProgressBar({ uploadProgress }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-600 font-medium">Uploading...</span>
        <span className="text-blue-600 font-bold">{uploadProgress}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
        <div
          className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-300 ease-out"
          style={{ width: `${uploadProgress}%` }}
        />
      </div>
    </div>
  );
}
