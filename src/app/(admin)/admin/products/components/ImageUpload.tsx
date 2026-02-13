"use client";

import { createClient } from "@/utils/supbase/client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Loader2, ImageIcon, X } from "lucide-react";

export function ImageUpload({
  onUploadSuccess,
  defaultValueUrl,
}: {
  onUploadSuccess: (url: string) => void;
  defaultValueUrl?: string;
}) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(
    defaultValueUrl || null,
  );
  const [currentFilePath, setCurrentFilePath] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    if (defaultValueUrl) {
      setPreview(defaultValueUrl);
    } else {
      setPreview(null);
    }
  }, [defaultValueUrl]);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    try {
      const file = e.target.files?.[0];
      if (!file) return;

      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);
      setUploading(true);

      if (currentFilePath) {
        await supabase.storage.from("products").remove([currentFilePath]);
      }

      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `product-images/${fileName}`;

     
      const { error: uploadError } = await supabase.storage
        .from("products")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      if (!uploadError) {
        setCurrentFilePath(filePath);
        const { data } = supabase.storage
          .from("products")
          .getPublicUrl(filePath);
        onUploadSuccess(data.publicUrl);
      }

      setUploading(false);
    } catch (error: any) {
      alert("Error uploading: " + error.message);
      setPreview(null);
    } finally {
      setUploading(false);
    }
  }

  const removeImage = async () => {
    if (currentFilePath) {
      await supabase.storage.from("products").remove([currentFilePath]);
    }
    setPreview(null);
    setCurrentFilePath(null);
    onUploadSuccess("");
  };

  return (
    <div className="space-y-4 w-full">
      <div className="flex items-center justify-center w-full">
        {preview ? (
          <div className="relative w-full h-40 border-2 border-dashed rounded-lg overflow-hidden group">
            <Image src={preview} alt="Preview" fill className="object-cover" />
            {uploading && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <Loader2 className="w-6 h-6 text-white animate-spin" />
              </div>
            )}
            {!uploading && (
              <button
                type="button"
                onClick={removeImage}
                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        ) : (
          <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors border-gray-300">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <ImageIcon className="w-8 h-8 mb-3 text-gray-400" />
              <p className="mb-2 text-sm text-gray-500">
                <span className="font-semibold">Klik untuk upload</span>
              </p>
              <p className="text-xs text-gray-400">PNG, JPG atau WEBP</p>
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={handleUpload}
              disabled={uploading}
              className="hidden"
            />
          </label>
        )}
      </div>
    </div>
  );
}
