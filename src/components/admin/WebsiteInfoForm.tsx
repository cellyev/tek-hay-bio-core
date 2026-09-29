/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { saveGlobalAction } from "@/app/(admin)/admin/actions";

export function WebsiteInfoForm({
  contactData,
  siteData,
}: {
  contactData?: any;
  siteData?: any;
}) {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  const [contact, setContact] = useState({
    email: contactData?.email || "",
    phone: contactData?.phone || "",
    address: contactData?.address || "",
    googleMapsUrl: contactData?.googleMapsUrl || "",
    googleMapsEmbedCode: contactData?.googleMapsEmbedCode || "",
    latitude: contactData?.latitude || "",
    longitude: contactData?.longitude || "",
    visitingHours: contactData?.visitingHours || "",
  });

  const [socialMedia, setSocialMedia] = useState<any[]>(
    contactData?.socialMedia || [],
  );

  const [site, setSite] = useState({
    siteName: siteData?.siteName || "",
    tagline: siteData?.tagline || "",
  });

  const handleContactChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setContact({ ...contact, [e.target.name]: e.target.value });
  };

  const handleSiteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSite({ ...site, [e.target.name]: e.target.value });
  };

  const handleSocialMediaChange = (
    index: number,
    field: string,
    value: string,
  ) => {
    const newSm = [...socialMedia];
    newSm[index] = { ...newSm[index], [field]: value };
    setSocialMedia(newSm);
  };

  const addSocialMedia = () => {
    setSocialMedia([
      ...socialMedia,
      { platform: "", url: "", label: "", id: Math.random().toString() },
    ]);
  };

  const removeSocialMedia = (index: number) => {
    const newSm = [...socialMedia];
    newSm.splice(index, 1);
    setSocialMedia(newSm);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError("");

    const submitContact = {
      ...contact,
      socialMedia: socialMedia.map((sm) => ({
        platform: sm.platform,
        url: sm.url,
        label: sm.label,
      })),
    };

    const resSite = await saveGlobalAction("site-settings", site);
    const resContact = await saveGlobalAction(
      "contact-information",
      submitContact,
    );

    setIsSaving(false);
    if (resSite.success && resContact.success) {
      alert("Informasi website berhasil disimpan.");
      router.refresh();
    } else {
      setError(resSite.error || resContact.error || "Terjadi kesalahan.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl">
      {error && (
        <div className="p-4 bg-red-50 text-red-600 rounded-md border border-red-200">
          {error}
        </div>
      )}

      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6">
        <h3 className="font-semibold text-lg text-slate-900 border-b border-slate-100 pb-2">
          Identitas Website
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Nama Website
            </label>
            <input
              type="text"
              name="siteName"
              value={site.siteName}
              onChange={handleSiteChange}
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Tagline
            </label>
            <input
              type="text"
              name="tagline"
              value={site.tagline}
              onChange={handleSiteChange}
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6">
        <h3 className="font-semibold text-lg text-slate-900 border-b border-slate-100 pb-2">
          Kontak & Alamat
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={contact.email}
              onChange={handleContactChange}
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Telepon
            </label>
            <input
              type="text"
              name="phone"
              value={contact.phone}
              onChange={handleContactChange}
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Alamat Lengkap
            </label>
            <textarea
              name="address"
              value={contact.address}
              onChange={handleContactChange}
              rows={3}
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Jam Operasional
            </label>
            <textarea
              name="visitingHours"
              value={contact.visitingHours}
              onChange={handleContactChange}
              rows={2}
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-1">
              URL Embed Google Maps (Opsional)
            </label>
            <p className="text-xs text-slate-500 mb-2">
              Tempel (paste) kode &lt;iframe&gt; Embed dari Google Maps di sini.
              Jika diisi, ini akan mengabaikan titik koordinat otomatis.
            </p>
            <textarea
              name="googleMapsEmbedCode"
              value={contact.googleMapsEmbedCode}
              onChange={handleContactChange}
              rows={4}
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-900 font-mono text-sm mb-4"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Google Maps URL
            </label>
            <input
              type="url"
              name="googleMapsUrl"
              value={contact.googleMapsUrl}
              onChange={handleContactChange}
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Latitude
            </label>
            <input
              type="text"
              name="latitude"
              value={contact.latitude}
              onChange={handleContactChange}
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Longitude
            </label>
            <input
              type="text"
              name="longitude"
              value={contact.longitude}
              onChange={handleContactChange}
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6">
        <div className="flex justify-between items-center border-b border-slate-100 pb-2">
          <h3 className="font-semibold text-lg text-slate-900">Media Sosial</h3>
          <button
            type="button"
            onClick={addSocialMedia}
            className="text-sm bg-slate-100 px-3 py-1 rounded-md text-slate-700 hover:bg-slate-200"
          >
            + Tambah Media Sosial
          </button>
        </div>

        {socialMedia.length === 0 ? (
          <p className="text-slate-500 text-sm">Belum ada media sosial.</p>
        ) : (
          <div className="space-y-4">
            {socialMedia.map((sm, i) => (
              <div
                key={sm.id || i}
                className="p-4 border border-slate-200 rounded-md bg-slate-50 relative grid grid-cols-1 md:grid-cols-3 gap-4"
              >
                <button
                  type="button"
                  onClick={() => removeSocialMedia(i)}
                  className="absolute top-2 right-2 text-red-500 text-sm hover:underline"
                >
                  Hapus
                </button>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Platform (mis. Instagram)
                  </label>
                  <input
                    type="text"
                    value={sm.platform}
                    onChange={(e) =>
                      handleSocialMediaChange(i, "platform", e.target.value)
                    }
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-900 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Label (mis. @tekhaybio)
                  </label>
                  <input
                    type="text"
                    value={sm.label}
                    onChange={(e) =>
                      handleSocialMediaChange(i, "label", e.target.value)
                    }
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-900 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    URL
                  </label>
                  <input
                    type="url"
                    value={sm.url}
                    onChange={(e) =>
                      handleSocialMediaChange(i, "url", e.target.value)
                    }
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-900 text-sm"
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <button
        type="submit"
        disabled={isSaving}
        className="bg-slate-900 text-white px-6 py-2 rounded-md hover:bg-slate-800 disabled:opacity-50 font-medium"
      >
        {isSaving ? "Menyimpan..." : "Simpan Perubahan"}
      </button>
    </form>
  );
}
