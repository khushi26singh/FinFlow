import { useRef, useState } from 'react';
import { toast } from 'react-toastify';
import API from '../../services/api';

const MAX_FILES = 5;

const formatFileSize = (bytes) => {
  if (!bytes) return '0 B';

  const units = ['B', 'KB', 'MB', 'GB'];
  const size = Math.max(bytes, 0);
  const unitIndex = Math.min(Math.floor(Math.log(size) / Math.log(1024)), units.length - 1);
  const formatted = size / 1024 ** unitIndex;

  return `${formatted >= 10 || unitIndex === 0 ? Math.round(formatted) : formatted.toFixed(1)} ${units[unitIndex]}`;
};

const areSameFile = (firstFile, secondFile) =>
  firstFile.name === secondFile.name &&
  firstFile.size === secondFile.size &&
  firstFile.lastModified === secondFile.lastModified;

export default function DocumentUpload({ applicationId, onUploadSuccess }) {
  const inputRef = useRef(null);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);

  const addFiles = (incomingFiles) => {
    const files = Array.from(incomingFiles || []);

    if (!files.length) return;

    const nextFiles = [...selectedFiles];

    for (const file of files) {
      const isAllowedType = ['application/pdf', 'image/png', 'image/jpeg'].includes(file.type);

      if (!isAllowedType) {
        toast.error(`${file.name} is not a supported file type.`);
        continue;
      }

      if (nextFiles.length >= MAX_FILES) {
        toast.error(`You can upload up to ${MAX_FILES} documents at a time.`);
        break;
      }

      if (!nextFiles.some((existingFile) => areSameFile(existingFile, file))) {
        nextFiles.push(file);
      }
    }

    setSelectedFiles(nextFiles);
  };

  const handleInputChange = (event) => {
    addFiles(event.target.files);
    event.target.value = '';
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setDragActive(false);
    addFiles(event.dataTransfer.files);
  };

  const handleSubmit = async () => {
    if (!applicationId) {
      toast.error('Application ID is required to submit documents.');
      return;
    }

    if (!selectedFiles.length) {
      toast.error('Please select at least one document to upload.');
      return;
    }

    const formData = new FormData();
    selectedFiles.forEach((file) => {
      formData.append('documents', file);
    });

    try {
      setUploading(true);
      const { data } = await API.post(`/loans/applications/${applicationId}/documents`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      toast.success(data?.message || 'Documents uploaded successfully');
      setSelectedFiles([]);
      onUploadSuccess?.(data);
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to upload documents');
    } finally {
      setUploading(false);
    }
  };

  const removeFile = (indexToRemove) => {
    setSelectedFiles((currentFiles) => currentFiles.filter((_, index) => index !== indexToRemove));
  };

  return (
    <section className="rounded-3xl border border-white/10 bg-white/6 p-6 backdrop-blur">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-cyan-200/80">Documents</p>
          <h2 className="mt-2 text-2xl font-semibold text-white">Upload supporting files</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">
            Add PDFs or images for identity, income, and address verification. You can upload up to {MAX_FILES} files
            at once.
          </p>
        </div>
        <span className="rounded-full border border-white/10 bg-slate-950/40 px-3 py-1 text-xs font-medium text-slate-200">
          {selectedFiles.length}/{MAX_FILES} selected
        </span>
      </div>

      <div
        role="button"
        tabIndex={0}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            inputRef.current?.click();
          }
        }}
        onDragEnter={() => setDragActive(true)}
        onDragOver={(event) => {
          event.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={handleDrop}
        className={`mt-6 cursor-pointer rounded-3xl border border-dashed px-6 py-8 transition ${
          dragActive
            ? 'border-cyan-300/60 bg-cyan-400/10 shadow-lg shadow-cyan-950/20'
            : 'border-white/10 bg-slate-950/25 hover:border-cyan-300/30 hover:bg-slate-950/35'
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          multiple
          accept=".pdf, .png, .jpg, .jpeg"
          className="hidden"
          onChange={handleInputChange}
        />
        <div className="flex flex-col items-center text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/6 text-cyan-100 shadow-inner shadow-slate-950/20">
            <span className="text-xl font-semibold">+</span>
          </div>
          <h3 className="mt-4 text-lg font-semibold text-white">Drag and drop files here</h3>
          <p className="mt-2 text-sm leading-6 text-slate-300">
            Or click this area to browse and select your PDF or image documents.
          </p>
          <p className="mt-3 text-xs uppercase tracking-[0.25em] text-slate-400">
            Accepted: PDF, PNG, JPG, JPEG
          </p>
        </div>
      </div>

      <div className="mt-6 space-y-3">
        {selectedFiles.length > 0 ? (
          selectedFiles.map((file, index) => (
            <div
              key={`${file.name}-${file.size}-${file.lastModified}`}
              className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-slate-950/35 px-4 py-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-white">{file.name}</p>
                <p className="mt-1 text-xs text-slate-400">{formatFileSize(file.size)}</p>
              </div>
              <button
                type="button"
                onClick={() => removeFile(index)}
                className="inline-flex items-center justify-center rounded-2xl border border-rose-400/20 bg-rose-400/10 px-3 py-2 text-xs font-semibold text-rose-100 transition hover:bg-rose-400/15"
              >
                Remove
              </button>
            </div>
          ))
        ) : (
          <div className="rounded-2xl border border-white/8 bg-slate-950/25 px-4 py-5 text-sm text-slate-400">
            No documents selected yet.
          </div>
        )}
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-slate-400">Each submission appends files to the loan application record.</p>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={uploading || !selectedFiles.length}
          className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-cyan-400 to-emerald-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {uploading ? 'Submitting...' : 'Submit Documents'}
        </button>
      </div>
    </section>
  );
}