/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { updateMediaAction } from "@/app/(admin)/admin/galeri/actions";

export function GalleryUploader({ initialMedia, collection = "gallery-media" }: { initialMedia: any[], collection?: string }) {
  const router = useRouter();
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [editingMedia, setEditingMedia] = useState<any | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [usageStatus, setUsageStatus] = useState<any>(null);

  const [selectedMedia, setSelectedMedia] = useState<Set<string>>(new Set());
  const [isDeleting, setIsDeleting] = useState(false);

  const toggleSelect = (id: string) => {
    const newSet = new Set(selectedMedia);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setSelectedMedia(newSet);
  };

  const handleBulkDelete = async () => {
    if (selectedMedia.size === 0) return;
    
    setIsDeleting(true);
    try {
      const usageChecks = Array.from(selectedMedia).map(id =>
        fetch(`/api/media-usage?collection=${collection}&id=${id}`).then(r => r.json())
      );
      const results = await Promise.all(usageChecks);
      
      const inUseIndex = results.findIndex(res => res.used);
      if (inUseIndex !== -1) {
        alert("Gagal menghapus secara massal. Terdapat setidaknya 1 gambar yang sedang digunakan oleh konten lain.");
        setIsDeleting(false);
        return;
      }

      if (!confirm(`Hapus ${selectedMedia.size} gambar yang dipilih?\n\nTindakan ini akan menghapus gambar secara permanen.`)) {
        setIsDeleting(false);
        return;
      }

      const deletePromises = Array.from(selectedMedia).map(id => 
        fetch(`/api/${collection}/${id}`, { method: "DELETE" })
      );
      await Promise.all(deletePromises);
      
      setSelectedMedia(new Set());
      router.refresh();
    } catch (err: any) {
      alert("Terjadi kesalahan saat menghapus: " + err.message);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setError("");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("alt", file.name);

    try {
      const res = await fetch(`/api/${collection}`, {
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
    if (!confirm("Hapus gambar?\n\nGambar ini belum digunakan oleh konten apa pun.\n\nTindakan ini akan menghapus gambar secara permanen."))
      return;

    setIsDeleting(true);
    try {
      const res = await fetch(`/api/${collection}/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Gagal menghapus");
      setEditingMedia(null);
      setSelectedMedia(new Set(Array.from(selectedMedia).filter(sid => sid !== id)));
      router.refresh();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSaveMetadata = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMedia) return;
    setIsSaving(true);

    const res = await updateMediaAction(editingMedia.id, collection, {
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

      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
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

        {selectedMedia.size > 0 && (
          <div className="flex items-center gap-4 bg-red-50 p-3 rounded-lg border border-red-100">
            <span className="text-sm font-medium text-red-700">{selectedMedia.size} gambar dipilih</span>
            <button
              onClick={handleBulkDelete}
              disabled={isDeleting}
              className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 disabled:opacity-50"
            >
              {isDeleting ? 'Menghapus...' : 'Hapus Massal'}
            </button>
          </div>
        )}
      </div>

      {/* Edit Modal / Panel */}
      {editingMedia && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full flex flex-col md:flex-row overflow-hidden max-h-[90vh]">
            <div className="md:w-1/2 bg-slate-100 p-4 flex flex-col items-center justify-center relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={editingMedia.url}
                alt={editingMedia.alt}
                className="max-w-full max-h-[40vh] md:max-h-full object-contain"
              />
            </div>
            <div className="md:w-1/2 p-6 overflow-y-auto">
              <h3 className="font-bold text-lg mb-4">Detail Media</h3>
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
                
                {usageStatus && (
                  <div className={`p-3 text-xs rounded-md ${usageStatus.used ? 'bg-amber-50 text-amber-800' : 'bg-emerald-50 text-emerald-800'}`}>
                    {usageStatus.used ? (
                      <div>
                        <strong>Tidak dapat dihapus:</strong> Sedang digunakan oleh {usageStatus.references.length} dokumen.
                        <ul className="list-disc pl-4 mt-1">
                          {usageStatus.references.map((r: any, i: number) => (
                            <li key={i}>{r.type}: {r.title}</li>
                          ))}
                        </ul>
                      </div>
                    ) : (
                      'Media ini aman untuk dihapus (tidak sedang digunakan).'
                    )}
                  </div>
                )}

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
                    Tutup
                  </button>
                </div>

                {usageStatus && !usageStatus.used && (
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => handleDelete(editingMedia.id)}
                      disabled={isDeleting}
                      className="w-full bg-red-50 text-red-600 py-2 rounded-md hover:bg-red-100 disabled:opacity-50 text-sm font-medium border border-red-200"
                    >
                      {isDeleting ? 'Menghapus...' : 'Hapus Media'}
                    </button>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {initialMedia.map((media) => {
          const isSelected = selectedMedia.has(media.id);
          return (
            <div
              key={media.id}
              className={`group relative aspect-square bg-slate-100 rounded-lg overflow-hidden border-2 transition-all ${isSelected ? 'border-blue-500 shadow-md' : 'border-slate-200'}`}
            >
              {/* Checkbox */}
              <div className="absolute top-2 left-2 z-10">
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => toggleSelect(media.id)}
                  className="w-5 h-5 cursor-pointer rounded border-slate-300 text-blue-600 focus:ring-blue-500 shadow-sm opacity-100 md:opacity-0 group-hover:opacity-100 checked:opacity-100 transition-opacity bg-white"
                />
              </div>

              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={media.url as string}
                alt={(media.alt as string) || "Media"}
                className={`w-full h-full object-cover transition-transform cursor-pointer ${isSelected ? 'scale-95' : ''}`}
                onClick={() => {
                  if (selectedMedia.size > 0) {
                    toggleSelect(media.id);
                  } else {
                    setEditingMedia(media); 
                    setUsageStatus(null); 
                    fetch(`/api/media-usage?collection=${collection}&id=${media.id}`)
                      .then(r => r.json())
                      .then(setUsageStatus)
                      .catch(console.error);
                  }
                }}
              />
              <div className={`absolute inset-0 pointer-events-none bg-slate-900/50 flex flex-col items-center justify-center p-4 gap-2 transition-opacity ${selectedMedia.size > 0 ? 'hidden' : 'opacity-0 group-hover:opacity-100'}`}>
                <button
                  type="button"
                  className="px-3 py-1.5 bg-white pointer-events-auto text-slate-900 text-xs font-medium rounded-md hover:bg-slate-100 w-full"
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditingMedia(media);
                    setUsageStatus(null);
                    fetch(`/api/media-usage?collection=${collection}&id=${media.id}`)
                      .then(r => r.json())
                      .then(setUsageStatus)
                      .catch(console.error);
                  }}
                >
                  Edit / Hapus
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {initialMedia.length === 0 && (
        <div className="text-center py-12 text-slate-500 bg-white rounded-xl border border-slate-200 border-dashed">
          Belum ada media di galeri.
        </div>
      )}
    </div>
  );
}
