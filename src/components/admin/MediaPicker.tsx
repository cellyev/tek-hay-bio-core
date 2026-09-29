'use client'

import React, { useState, useEffect } from 'react'
import { X, UploadCloud, Check, Loader2, Image as ImageIcon } from 'lucide-react'

export function MediaPicker({ 
  value, 
  onChange, 
  mediaCollection = 'media' 
}: { 
  value?: any, 
  onChange: (media: any) => void,
  mediaCollection?: string 
}) {
  const [showModal, setShowModal] = useState(false)
  const [mediaList, setMediaList] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedMedia, setSelectedMedia] = useState<any | null>(null)
  const [usage, setUsage] = useState<any>(null)

  useEffect(() => {
    if (showModal) {
      setLoading(true)
      fetch(`/api/${mediaCollection}?limit=100`)
        .then(r => r.json())
        .then(data => {
          setMediaList(data.docs || [])
          setLoading(false)
        })
        .catch(e => {
          console.error(e)
          setLoading(false)
        })
    }
  }, [showModal, mediaCollection])

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setLoading(true)
    const formData = new FormData()
    formData.append('file', file)
    formData.append('alt', file.name)
    try {
      const res = await fetch(`/api/${mediaCollection}`, { method: 'POST', body: formData })
      const data = await res.json()
      if (data.doc) {
        setMediaList([data.doc, ...mediaList])
        onChange(data.doc)
        setShowModal(false)
      }
    } catch (e) {
      console.error('Upload failed', e)
    }
    setLoading(false)
  }

  return (
    <div>
      {value ? (
        <div className="relative inline-block border border-slate-200 rounded overflow-hidden group">
          <img src={value.url || value} className="h-32 object-cover" alt="Preview" />
          <div className="absolute inset-0 bg-black/50 hidden group-hover:flex items-center justify-center gap-2">
            <button type="button" onClick={() => setShowModal(true)} className="bg-white text-slate-800 text-xs px-2 py-1 rounded font-medium">Ganti</button>
            <button type="button" onClick={() => onChange(null)} className="bg-red-500 text-white text-xs px-2 py-1 rounded font-medium">Hapus</button>
          </div>
        </div>
      ) : (
        <button type="button" onClick={() => setShowModal(true)} className="border-2 border-dashed border-slate-300 rounded p-4 flex flex-col items-center justify-center text-slate-500 hover:bg-slate-50 hover:text-slate-700 hover:border-slate-400 transition-colors">
          <ImageIcon className="w-6 h-6 mb-2" />
          <span className="text-sm font-medium">Pilih atau Unggah Gambar</span>
        </button>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center p-4 border-b border-slate-200">
              <h2 className="text-xl font-bold">Media Library ({mediaCollection})</h2>
              <button type="button" onClick={() => setShowModal(false)} className="p-2 hover:bg-slate-100 rounded-full"><X className="w-5 h-5" /></button>
            </div>
            
            <div className="flex flex-1 overflow-hidden">
              <div className="flex-1 p-4 overflow-y-auto">
                {loading && mediaList.length === 0 ? (
                  <div className="flex justify-center items-center h-32"><Loader2 className="w-6 h-6 animate-spin text-slate-400" /></div>
                ) : (
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
                    <label className="border-2 border-dashed border-slate-300 hover:border-slate-400 rounded-lg flex flex-col items-center justify-center cursor-pointer aspect-square bg-slate-50">
                      <UploadCloud className="w-8 h-8 text-slate-400 mb-2" />
                      <span className="text-sm text-slate-600 font-medium">Upload</span>
                      <input type="file" accept="image/*" className="hidden" onChange={handleUpload} />
                    </label>
                    {mediaList.map((m: any) => (
                      <div key={m.id} onClick={() => { setSelectedMedia(m); setUsage(null); fetch(`/api/media-usage?collection=${mediaCollection}&id=${m.id}`).then(r=>r.json()).then(setUsage).catch(console.error); }} className={"cursor-pointer relative aspect-square rounded-lg overflow-hidden border-2 " + (selectedMedia?.id === m.id ? "border-blue-500" : "border-transparent hover:border-blue-300")}>
                        <img src={m.url} alt={m.alt || 'Media'} className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              {selectedMedia && (
                <div className="w-80 border-l border-slate-200 p-4 flex flex-col overflow-y-auto bg-slate-50">
                  <h3 className="font-bold mb-4">Detail Media</h3>
                  <img src={selectedMedia.url} className="w-full rounded mb-4" alt="Preview" />
                  <div className="text-sm text-slate-500 mb-4">{selectedMedia.filename}</div>
                  
                  <div className="mb-6 p-3 bg-white rounded border border-slate-200">
                    <div className="text-xs font-semibold text-slate-500 mb-1 uppercase">Usage Status</div>
                    {!usage ? (
                      <div className="text-sm text-slate-400 flex items-center gap-2"><Loader2 className="w-3 h-3 animate-spin" /> Checking...</div>
                    ) : usage.used ? (
                      <div>
                        <div className="text-sm font-bold text-amber-600 mb-2">Used</div>
                        <div className="text-xs text-slate-600">Used by {usage.references.length} contents:</div>
                        <ul className="mt-1 text-xs text-slate-500 list-disc pl-4">
                          {usage.references.map((r: any, i: number) => (
                            <li key={i}>{r.type}: {r.title}</li>
                          ))}
                        </ul>
                      </div>
                    ) : (
                      <div>
                        <div className="text-sm font-bold text-green-600 mb-1">Unused</div>
                        <div className="text-xs text-slate-500">Belum digunakan oleh konten apa pun.</div>
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-auto flex flex-col gap-2">
                    <button onClick={() => { onChange(selectedMedia); setShowModal(false); }} className="w-full bg-blue-600 text-white rounded p-2 font-medium hover:bg-blue-700">Pilih Gambar</button>
                    {usage && !usage.used && (
                      <button onClick={async () => {
                        if (!confirm("Hapus gambar?\n\nGambar ini belum digunakan oleh konten apa pun.\n\nFile: " + selectedMedia.filename + "\n\nTindakan ini akan menghapus gambar secara permanen.")) return;
                        try {
                          const res = await fetch(`/api/${mediaCollection}/${selectedMedia.id}`, { method: 'DELETE' });
                          if (!res.ok) throw new Error(await res.text());
                          setMediaList(mediaList.filter(m => m.id !== selectedMedia.id));
                          setSelectedMedia(null);
                        } catch (e: any) {
                          alert(e.message || 'Gagal menghapus');
                        }
                      }} className="w-full bg-red-50 text-red-600 rounded p-2 font-medium hover:bg-red-100 border border-red-200">Hapus dari Server</button>
                    )}
                    {usage && usage.used && (
                      <button onClick={() => {
                        alert("Gambar tidak dapat dihapus\n\nGambar ini masih digunakan oleh " + usage.references.length + " konten.\n\nSilakan hapus atau ganti gambar pada konten tersebut terlebih dahulu.");
                      }} className="w-full bg-slate-100 text-slate-400 rounded p-2 font-medium cursor-not-allowed">Hapus dari Server</button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
