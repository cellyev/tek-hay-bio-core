import test from 'node:test'
import assert from 'node:assert/strict'
import {
  resolveLunarToSolarDatesInYear,
  resolveActivityOccurrences,
  groupOccurrencesByMonth,
  generateMonthGrid,
  formatToYmd,
  parseYmd,
  addDaysToYmd,
} from '../../src/lib/activities/calendarUtils.ts'

test('Verifikasi Kalender 1: Konversi Astronomis Lunar ke Solar pada Tahun Target', () => {
  // Tahun Baru Imlek 2026 (Tgl 1 Bulan 1 Imlek) -> 17 Februari 2026
  const cny2026 = resolveLunarToSolarDatesInYear(1, 1, false, 2026)
  assert.equal(cny2026.length, 1)
  assert.equal(cny2026[0], '2026-02-17')

  // Cap Go Meh 2026 (Tgl 15 Bulan 1 Imlek) -> 3 Maret 2026
  const capGoMeh2026 = resolveLunarToSolarDatesInYear(1, 15, false, 2026)
  assert.equal(capGoMeh2026.length, 1)
  assert.equal(capGoMeh2026[0], '2026-03-03')

  // Tong Jiu Pia / Mid-Autumn 2026 (Tgl 15 Bulan 8 Imlek) -> 25 September 2026
  const midAutumn2026 = resolveLunarToSolarDatesInYear(8, 15, false, 2026)
  assert.equal(midAutumn2026.length, 1)
  assert.equal(midAutumn2026[0], '2026-09-25')

  // Hari Sang An / Naik Toapekong (Tgl 24 Bulan 12 Imlek 2576) -> Jatuh di 11 Februari 2026 Masehi
  const sangAn2026 = resolveLunarToSolarDatesInYear(12, 24, false, 2026)
  assert.equal(sangAn2026.length, 1)
  assert.equal(sangAn2026[0], '2026-02-11')

  // Penanganan tanggal 30 pada bulan dengan 29 hari tidak melempar error
  const eve2026 = resolveLunarToSolarDatesInYear(12, 30, false, 2026)
  assert.ok(eve2026.length >= 0)
})

test('Verifikasi Kalender 2: Prioritas Tanggal Resmi Pengurus Klenteng (Confirmed Date)', () => {
  const activities = [
    {
      id: 'act-1',
      title: { id: 'Perayaan Cap Go Meh 2026', en: 'Cap Go Meh Celebration 2026' },
      slug: 'cap-go-meh-2026',
      category: 'cultural-celebration',
      recurrenceType: 'annual-lunar',
      scheduleStatus: 'scheduled',
      status: 'published',
      lunarMonth: 1,
      lunarDay: 15,
      // Pengurus menetapkan tanggal khusus (misal dimajukan/diundur ke akhir pekan: 4 Maret 2026)
      date: '2026-03-04T00:00:00.000Z',
    },
  ]

  const { scheduled, unscheduled } = resolveActivityOccurrences(activities, 2026, 'id')
  assert.equal(scheduled.length, 1)
  assert.equal(unscheduled.length, 0)

  const occ = scheduled[0]
  assert.equal(occ.startDateStr, '2026-03-04')
  assert.equal(occ.hasConfirmedDate, true)
  assert.equal(occ.isEstimated, false)
  assert.equal(occ.month, 3)
  assert.equal(occ.day, 4)
})

test('Verifikasi Kalender 3: Estimasi Tanggal Masehi Otomatis untuk Kegiatan Imlek Tahunan Tanpa Tanggal DB', () => {
  const activities = [
    {
      id: 'act-cny',
      title: { id: 'Tahun Baru Imlek 2577', en: 'Chinese New Year 2577' },
      slug: 'imlek-2577',
      category: 'cultural-celebration',
      recurrenceType: 'annual-lunar',
      scheduleStatus: 'scheduled',
      status: 'published',
      lunarMonth: 1,
      lunarDay: 1,
      date: null, // Belum diinput manual oleh pengurus untuk 2026
    },
  ]

  const { scheduled } = resolveActivityOccurrences(activities, 2026, 'id')
  assert.equal(scheduled.length, 1)
  const occ = scheduled[0]
  assert.equal(occ.startDateStr, '2026-02-17')
  assert.equal(occ.isEstimated, true)
  assert.equal(occ.hasConfirmedDate, false)
})

test('Verifikasi Kalender 4: Rentang Multi-Hari (Multi-Day Spans)', () => {
  const activities = [
    {
      id: 'act-festival',
      title: { id: 'Festival Budaya Tek Hay Bio', en: 'Tek Hay Bio Cultural Festival' },
      slug: 'festival-budaya',
      category: 'cultural-celebration',
      recurrenceType: 'annual-lunar',
      scheduleStatus: 'scheduled',
      status: 'published',
      lunarMonth: 1,
      lunarDay: 15,
      // Multi hari 3 hari
      date: '2025-02-12T00:00:00.000Z',
      endDate: '2025-02-15T00:00:00.000Z', // 3 hari durasi
    },
  ]

  // Diproyeksikan ke 2026 (Cap Go Meh 2026 = 2026-03-03 + 3 hari = 2026-03-06)
  const { scheduled } = resolveActivityOccurrences(activities, 2026, 'id')
  assert.equal(scheduled.length, 1)
  const occ = scheduled[0]
  assert.equal(occ.startDateStr, '2026-03-03')
  assert.equal(occ.endDateStr, '2026-03-06')
  assert.equal(occ.isMultiDay, true)
})

test('Verifikasi Kalender 5: Pemisahan Bersih Agenda Tanpa Tanggal Pasti (No Fake Dates)', () => {
  const activities = [
    {
      id: 'act-sembahyang-arwah',
      title: { id: 'Sembahyang Rebutan / Ulambana', en: 'Ulambana / Ghost Festival' },
      slug: 'ulambana',
      category: 'ancestral-worship',
      recurrenceType: 'annual-lunar',
      lunarRuleType: 'first_half', // Paruh pertama bulan 7
      lunarMonth: 7,
      scheduleStatus: 'tentative',
      status: 'published',
      date: null,
    },
    {
      id: 'act-baksos',
      title: { id: 'Bakti Sosial Pengobatan Gratis', en: 'Free Medical Checkup Social Service' },
      slug: 'bakti-sosial',
      category: 'social-activity',
      recurrenceType: 'incidental',
      scheduleStatus: 'unscheduled',
      status: 'published',
      date: null,
    },
  ]

  const { scheduled, unscheduled } = resolveActivityOccurrences(activities, 2026, 'id')
  assert.equal(scheduled.length, 0, 'Kegiatan tanpa tanggal pasti TIDAK boleh masuk ke agenda terjadwal')
  assert.equal(unscheduled.length, 2, 'Harus masuk ke kelompok agenda belum ditentukan / menunggu pengurus')

  assert.equal(unscheduled[0].startDateStr, null)
  assert.equal(unscheduled[0].gregorianDateLabel, 'Tanggal Belum Ditentukan')
  assert.equal(unscheduled[1].startDateStr, null)
})

test('Verifikasi Kalender 6: Pengelompokan 12 Bulan (groupOccurrencesByMonth)', () => {
  const sampleOccurrences = [
    { month: 2, title: 'Imlek' },
    { month: 3, title: 'Cap Go Meh' },
    { month: 9, title: 'Tong Jiu Pia' },
  ]
  const grouped = groupOccurrencesByMonth(sampleOccurrences)
  assert.equal(grouped[1].length, 0)
  assert.equal(grouped[2].length, 1)
  assert.equal(grouped[3].length, 1)
  assert.equal(grouped[9].length, 1)
  assert.equal(grouped[12].length, 0)
})

test('Verifikasi Kalender 7: Grid Bulanan (generateMonthGrid)', () => {
  const occurrences = [
    {
      startDateStr: '2026-02-17',
      endDateStr: null,
      title: 'Tahun Baru Imlek',
    },
  ]

  const { cells, monthNameId, monthNameEn } = generateMonthGrid(2026, 2, occurrences)
  assert.equal(monthNameId, 'Februari')
  assert.equal(monthNameEn, 'February')
  assert.ok(cells.length === 28 || cells.length === 35, 'Grid harus berkelipatan 7 hari')

  // Cari tanggal 17 Februari 2026
  const feb17Cell = cells.find((c) => c.dateStr === '2026-02-17')
  assert.ok(feb17Cell, 'Cell 17 Feb 2026 harus ada')
  assert.equal(feb17Cell.isCurrentMonth, true)
  assert.equal(feb17Cell.day, 17)
  assert.equal(feb17Cell.occurrences.length, 1)
  assert.equal(feb17Cell.occurrences[0].title, 'Tahun Baru Imlek')
  // Cell harus memiliki info penanggalan lunar (Tgl 1 Imlek = "初一")
  assert.equal(feb17Cell.lunarText, '初一')
})

test('Verifikasi Kalender 8: Utilitas YMD Date Helper', () => {
  const date = parseYmd('2026-05-15')
  assert.equal(formatToYmd(date), '2026-05-15')
  assert.equal(addDaysToYmd('2026-05-15', 5), '2026-05-20')
  assert.equal(addDaysToYmd('2026-01-31', 1), '2026-02-01')
})
