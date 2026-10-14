/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import Link from 'next/link'
import { Plus, Edit, Calendar, Moon } from 'lucide-react'
import { DeleteActionClient } from '@/components/admin/DeleteActionClient'
import { BulkDeleteProvider, BulkDeleteCheckbox, BulkDeleteSelectAll, BulkDeleteButton } from '@/components/admin/BulkDelete'
import { deleteActivityAction, deleteManyActivityAction } from './actions'
import { AdminPagination } from '@/components/admin/AdminPagination'
import {
  getActivityCategoryLabel,
  getActivityScheduleStatus,
  formatGregorianDateRange,
  formatLunarDate,
} from '@/lib/activities/utils'

export const dynamic = 'force-dynamic'

export default async function ActivitiesAdminPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; limit?: string }>
}) {
  const { page, limit } = await searchParams
  const payload = await getPayload({ config: configPromise })
  const { user } = await payload.auth({ headers: await headers() })
  if (!user) redirect('/admin/login')

  const currentPage = parseInt(page || '1', 10)
  const currentLimit = parseInt(limit || '10', 10)
  const data = await payload.find({
    collection: 'activities',
    sort: '-createdAt',
    limit: currentLimit,
    page: currentPage,
    locale: 'id',
  })

  return (
    <BulkDeleteProvider>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Kegiatan & Perayaan</h1>
            <p className="text-sm text-slate-500">
              Kelola jadwal ritual keagamaan, sembahyang leluhur, hari kebesaran dewa, dan perayaan budaya klenteng.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <BulkDeleteButton action={deleteManyActivityAction} />
            <Link
              href="/admin/kegiatan/tambah"
              className="inline-flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-md hover:bg-slate-800 text-sm font-medium shrink-0"
            >
              <Plus className="w-4 h-4" /> Tambah Kegiatan
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600 min-w-[1100px] table-fixed">
              <colgroup>
                <col className="w-12" />
                <col className="w-[23%]" />
                <col className="w-[16%]" />
                <col className="w-[24%]" />
                <col className="w-[25%]" />
                <col className="w-[12%]" />
                <col className="w-20" />
              </colgroup>
              <thead className="bg-slate-50 text-slate-900 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-4 font-medium w-12 text-center">
                    <BulkDeleteSelectAll allIds={data.docs.map((d: any) => d.id)} />
                  </th>
                  <th className="px-4 py-4 font-medium">Judul Kegiatan</th>
                  <th className="px-4 py-4 font-medium">Kategori</th>
                  <th className="px-4 py-4 font-medium">Jadwal Pelaksanaan</th>
                  <th className="px-4 py-4 font-medium">Status Jadwal</th>
                  <th className="px-4 py-4 font-medium text-center">Publikasi</th>
                  <th className="px-4 py-4 font-medium text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data.docs.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center text-slate-500">
                      Belum ada kegiatan yang terdaftar.
                    </td>
                  </tr>
                ) : (
                  data.docs.map((item: any) => {
                    const gregorianDate = formatGregorianDateRange(item.date, item.endDate, 'id')
                    const lunarDate = formatLunarDate(item, 'id')
                    const scheduleStatusObj = getActivityScheduleStatus(item.scheduleStatus, 'id')
                    const categoryLabel = getActivityCategoryLabel(item.category, 'id')

                    return (
                      <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-4 py-4 text-center">
                          <BulkDeleteCheckbox id={item.id} />
                        </td>
                        <td className="px-4 py-4">
                          <div className="font-medium text-slate-900 break-words line-clamp-2" title={item.title || 'Tanpa Judul'}>
                            {item.title || 'Tanpa Judul'}
                          </div>
                          {item.relatedDeity && (
                            <div className="text-xs text-slate-500 mt-0.5 truncate" title={`Dewa: ${item.relatedDeity}`}>
                              Dewa: {item.relatedDeity}
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-4">
                          <span className="inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-md bg-stone-100 text-stone-700 border border-stone-200 whitespace-nowrap">
                            {categoryLabel}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <div className="space-y-1">
                            {gregorianDate ? (
                              <div className="flex items-center gap-1.5 text-xs text-slate-700">
                                <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                <span className="truncate" title={gregorianDate}>{gregorianDate}</span>
                              </div>
                            ) : null}
                            {lunarDate ? (
                              <div className="flex items-start gap-1.5 text-xs text-amber-700">
                                <Moon className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                                <span className="line-clamp-2 leading-relaxed" title={lunarDate}>
                                  {lunarDate}
                                </span>
                              </div>
                            ) : null}
                            {!gregorianDate && !lunarDate ? (
                              <span className="text-xs text-slate-400 italic">Belum ditentukan</span>
                            ) : null}
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <span
                            className={`inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-full border whitespace-nowrap ${scheduleStatusObj.badgeClass}`}
                          >
                            {scheduleStatusObj.label.id}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-center">
                          <span
                            className={`inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-full whitespace-nowrap ${
                              item.status === 'published'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-slate-100 text-slate-800'
                            }`}
                          >
                            {item.status === 'published' ? 'Publik' : 'Draft'}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-right whitespace-nowrap space-x-1">
                          <Link
                            href={`/admin/kegiatan/${item.id}`}
                            className="inline-flex items-center justify-center p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </Link>
                          <DeleteActionClient id={item.id} action={deleteActivityAction} />
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>

          <AdminPagination
            page={data.page as number}
            totalPages={data.totalPages}
            totalDocs={data.totalDocs}
            itemName="kegiatan"
            hasPrevPage={data.hasPrevPage}
            hasNextPage={data.hasNextPage}
            prevPage={data.prevPage}
            nextPage={data.nextPage}
            baseUrl="/admin/kegiatan"
            limit={currentLimit}
          />
        </div>
      </div>
    </BulkDeleteProvider>
  )
}
