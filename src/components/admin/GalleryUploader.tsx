"use client";

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { updateMediaAction } from "@/app/(admin)/admin/galeri/actions";

export function GalleryUploader({ initialMedia }: { initialMedia: any[] }) {
  const router = useRouter();
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [editingMedia, setEditingMedia] = useState<any | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setError("");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("alt", file.name);

    try {
      const res = await fetch("/api/media", {
        method: "POST",
        body: formData,
      });

      const result = await res.json().catch(() => null);

      if (!res.ok) {
        console.error("Upload media error:", {
          status: res.status,
          statusText: res.statusText,
          response: result,
        });

        throw new Error(
          result?.errors?.[0]?.message ||
            result?.message ||
            `Upload gagal (${res.status})`,
        );
      }

      console.log("Upload media success:", result);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      router.refresh();
    } catch (err: any) {
      console.error("Upload media exception:", err);
      setError(err.message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus media ini? Tindakan ini tidak dapat dibatalkan."))
      return;

    try {
      const res = await fetch(`/api/media/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Gagal menghapus");
      setEditingMedia(null);
      router.refresh();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleSaveMetadata = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMedia) return;
    setIsSaving(true);

    const res = await updateMediaAction(editingMedia.id, {
      alt: editingMedia.alt,
      title: editingMedia.title,
      description: editingMedia.description,
      category: editingMedia.category,
    });

    setIsSaving(false);
    if (res.success) {
      setEditingMedia(null);
      router.refresh();
    } else {
      alert(res.error);
    }
  };

  return (
    <div className="space-y-6 relative">
      {error && (
        <div className="p-4 bg-red-50 text-red-600 rounded-md border border-red-200">
          {error}
        </div>
      )}

      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Upload Media Baru
        </label>
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleUpload}
          disabled={isUploading}
          className="block w-full text-sm text-slate-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-md file:border-0
            file:text-sm file:font-semibold
            file:bg-slate-50 file:text-slate-700
            hover:file:bg-slate-100 disabled:opacity-50"
        />
        {isUploading && (
          <p className="text-sm text-slate-500 mt-2">Mengupload...</p>
        )}
      </div>

      {/* Edit Modal / Panel */}
      {editingMedia && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full flex flex-col md:flex-row overflow-hidden max-h-[90vh]">
            <div className="md:w-1/2 bg-slate-100 p-4 flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={editingMedia.url}
                alt={editingMedia.alt}
                className="max-w-full max-h-[40vh] md:max-h-full object-contain"
              />
            </div>
            <div className="md:w-1/2 p-6 overflow-y-auto">
              <h3 className="font-bold text-lg mb-4">Edit Metadata Media</h3>
              <form onSubmit={handleSaveMetadata} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Alt Text (Aksesibilitas)
                  </label>
                  <input
                    required
                    type="text"
                    value={editingMedia.alt || ""}
                    onChange={(e) =>
                      setEditingMedia({ ...editingMedia, alt: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Judul (Opsional)
                  </label>
                  <input
                    type="text"
                    value={editingMedia.title || ""}
                    onChange={(e) =>
                      setEditingMedia({
                        ...editingMedia,
                        title: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Kategori
                  </label>
                  <select
                    value={editingMedia.category || ""}
                    onChange={(e) =>
                      setEditingMedia({
                        ...editingMedia,
                        category: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm"
                  >
                    <option value="">Pilih Kategori...</option>
                    <option value="building">Building</option>
                    <option value="interior">Interior</option>
                    <option value="activities">Activities</option>
                    <option value="history">History</option>
                    <option value="traditions">Traditions</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Deskripsi (Opsional)
                  </label>
                  <textarea
                    value={editingMedia.description || ""}
                    onChange={(e) =>
                      setEditingMedia({
                        ...editingMedia,
                        description: e.target.value,
                      })
                    }
                    rows={3}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm"
                  />
                </div>
                <div className="flex gap-2 pt-4">
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="flex-1 bg-slate-900 text-white py-2 rounded-md hover:bg-slate-800 disabled:opacity-50 text-sm font-medium"
                  >
                    Simpan
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingMedia(null)}
                    className="flex-1 bg-slate-100 text-slate-700 py-2 rounded-md hover:bg-slate-200 text-sm font-medium"
                  >
                    Batal
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {initialMedia.map((media) => (
          <div
            key={media.id}
            className="group relative aspect-square bg-slate-100 rounded-lg overflow-hidden border border-slate-200"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={media.url as string}
              alt={(media.alt as string) || "Media"}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-slate-900/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-4 gap-2">
              <button
                onClick={() => setEditingMedia(media)}
                className="px-3 py-1.5 bg-white text-slate-900 text-xs font-medium rounded-md hover:bg-slate-100 w-full"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(media.id)}
                className="px-3 py-1.5 bg-red-600 text-white text-xs font-medium rounded-md hover:bg-red-700 w-full"
              >
                Hapus
              </button>
            </div>
          </div>
        ))}
      </div>

      {initialMedia.length === 0 && (
        <div className="text-center py-12 text-slate-500 bg-white rounded-xl border border-slate-200 border-dashed">
          Belum ada media di galeri.
        </div>
      )}
    </div>
  );
}
