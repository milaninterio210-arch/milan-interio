"use client";

import React, { useState } from "react";
import { Upload, X, Loader } from "lucide-react";

interface CloudinaryUploadButtonProps {
  folder: string;
  onUploadSuccess: (url: string, publicId: string) => void;
  onUploadError?: (error: string) => void;
  onImageRemoved?: () => void;
  currentImageUrl?: string;
  label?: string;
  multiple?: boolean;
}

export default function CloudinaryUploadButton({
  folder,
  onUploadSuccess,
  onUploadError,
  onImageRemoved,
  currentImageUrl,
  label = "Upload Image",
  multiple = false,
}: CloudinaryUploadButtonProps) {
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  // Helper to extract Cloudinary public_id from secure URL
  const getPublicIdFromUrl = (url: string) => {
    if (!url.includes("res.cloudinary.com")) return null;
    try {
      const parts = url.split("/upload/");
      if (parts.length < 2) return null;
      const pathWithVersion = parts[1];
      const pathParts = pathWithVersion.split("/");
      const hasVersion = pathParts[0].startsWith("v");
      const pathArray = hasVersion ? pathParts.slice(1) : pathParts;
      const fullPath = pathArray.join("/");
      const lastDotIndex = fullPath.lastIndexOf(".");
      return lastDotIndex !== -1 ? fullPath.substring(0, lastDotIndex) : fullPath;
    } catch (e) {
      return null;
    }
  };

  const handleUpload = async (file: File) => {
    if (!file.type.startsWith("image/") && !file.type.startsWith("video/")) {
      const err = "Only image or video files are supported.";
      onUploadError?.(err);
      alert(err);
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      const err = "File size must not exceed 10MB.";
      onUploadError?.(err);
      alert(err);
      return;
    }

    setUploading(true);

    try {
      const timestamp = Math.round(new Date().getTime() / 1000).toString();

      // 1. Fetch Cloudinary upload signature from API
      const signRes = await fetch("/api/cloudinary/sign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ timestamp, folder }),
      });

      if (!signRes.ok) {
        const signData = await signRes.json();
        throw new Error(signData.error || "Failed to generate upload signature");
      }

      const { signature, apiKey, cloudName } = await signRes.json();

      // 2. Browser uploads directly to Cloudinary endpoint
      const formData = new FormData();
      formData.append("file", file);
      formData.append("api_key", apiKey);
      formData.append("timestamp", timestamp);
      formData.append("signature", signature);
      formData.append("folder", folder);

      const uploadRes = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: "POST",
        body: formData,
      });

      if (!uploadRes.ok) {
        const uploadData = await uploadRes.json();
        throw new Error(uploadData.error?.message || "Cloudinary upload failed");
      }

      const uploadData = await uploadRes.json();
      onUploadSuccess(uploadData.secure_url, uploadData.public_id);
    } catch (err: any) {
      onUploadError?.(err.message);
      alert("Upload failed: " + err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      if (multiple) {
        Array.from(e.target.files).forEach(file => handleUpload(file));
      } else {
        handleUpload(e.target.files[0]);
      }
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      if (multiple) {
        Array.from(e.dataTransfer.files).forEach(file => handleUpload(file));
      } else {
        handleUpload(e.dataTransfer.files[0]);
      }
    }
  };

  const handleRemove = async () => {
    if (!currentImageUrl) return;
    if (!confirm("Are you sure you want to remove this image?")) return;

    const publicId = getPublicIdFromUrl(currentImageUrl);
    
    // Clear parent state immediately
    onImageRemoved?.();

    if (publicId) {
      try {
        await fetch("/api/cloudinary/delete", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ publicId }),
        });
      } catch (e) {
        console.error("Failed to delete from Cloudinary:", e);
      }
    }
  };

  return (
    <div className="space-y-3">
      <div
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        className={`border border-dashed p-4 flex flex-col items-center justify-center min-h-[110px] transition-all duration-300 ${
          dragActive ? "border-milan-gold bg-milan-charcoal/50" : "border-milan-border bg-milan-charcoal/20"
        }`}
      >
        {uploading ? (
          <div className="flex flex-col items-center space-y-2 text-milan-gold font-mono text-[10px]">
            <Loader className="animate-spin text-milan-gold" size={16} />
            <span>UPLOADING TO CLOUDINARY...</span>
          </div>
        ) : (
          <div className="text-center space-y-2">
            <Upload className="mx-auto text-milan-muted" size={16} />
            <label className="block">
              <span className="text-[10px] tracking-wider text-milan-gold hover:underline cursor-pointer font-mono uppercase">
                {label}
              </span>
              <input
                type="file"
                accept="image/*"
                multiple={multiple}
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
            <span className="text-[9px] text-milan-muted font-mono block">
              Drag & Drop file here (Max 10MB)
            </span>
          </div>
        )}
      </div>

      {currentImageUrl && !multiple && (
        <div className="flex items-center space-x-4 p-2 bg-milan-charcoal/40 border border-milan-border/50">
          <div className="w-16 h-12 border border-milan-border overflow-hidden bg-milan-primary">
            <img src={currentImageUrl} alt="Preview" className="object-cover w-full h-full" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[9px] text-milan-muted font-mono truncate">{currentImageUrl}</p>
          </div>
          <button
            type="button"
            onClick={handleRemove}
            className="p-1 text-red-400 hover:text-red-300 font-mono hover:bg-milan-primary transition-all rounded"
            title="Remove Image"
          >
            <X size={14} />
          </button>
        </div>
      )}
    </div>
  );
}
