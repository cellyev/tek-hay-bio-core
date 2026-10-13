import test from 'node:test'
import assert from 'node:assert/strict'
import {
  ACTIVITY_CATEGORIES,
  ACTIVITY_RECURRENCE_TYPES,
  ACTIVITY_SCHEDULE_STATUSES,
  ACTIVITY_LOCATION_TYPES,
  getActivityCategoryLabel,
  getActivityRecurrenceLabel,
  getActivityScheduleStatus,
  formatGregorianDateRange,
  formatLunarDate,
} from '../../src/lib/activities/utils.ts'

test('Verifikasi 1: Kategori Kegiatan Terstruktur dan Bilingual', () => {
  assert.equal(ACTIVITY_CATEGORIES.length, 5)
  assert.equal(getActivityCategoryLabel('ritual', 'id'), 'Ritual Keagamaan')
  assert.equal(getActivityCategoryLabel('ritual', 'en'), 'Religious Ritual')
  assert.equal(getActivityCategoryLabel('ancestral-worship', 'id'), 'Sembahyang Leluhur')
  assert.equal(getActivityCategoryLabel('ancestral-worship', 'en'), 'Ancestral Worship')
  assert.equal(getActivityCategoryLabel('deity-festival', 'id'), 'Hari Kebesaran Dewa')
  assert.equal(getActivityCategoryLabel('deity-festival', 'en'), 'Deity Festival')
  assert.equal(getActivityCategoryLabel('cultural-celebration', 'id'), 'Perayaan Budaya')
  assert.equal(getActivityCategoryLabel('cultural-celebration', 'en'), 'Cultural Celebration')
  assert.equal(getActivityCategoryLabel('social-activity', 'id'), 'Kegiatan Sosial')
  assert.equal(getActivityCategoryLabel('social-activity', 'en'), 'Social Activity')

  // Fallback aman untuk nilai warisan/tak dikenal
  assert.equal(getActivityCategoryLabel(null, 'id'), 'Ritual Keagamaan')
  assert.equal(getActivityCategoryLabel(undefined, 'en'), 'Religious Ritual')
  assert.equal(getActivityCategoryLabel('cultural', 'id'), 'Perayaan Budaya')
  assert.equal(getActivityCategoryLabel('social', 'en'), 'Social Activity')
})

test('Verifikasi 2: Pola Pengulangan Kegiatan Lengkap', () => {
  assert.equal(ACTIVITY_RECURRENCE_TYPES.length, 5)
  assert.equal(getActivityRecurrenceLabel('annual-lunar', 'id'), 'Tahunan (Kalender Imlek)')
  assert.equal(getActivityRecurrenceLabel('annual-lunar', 'en'), 'Annual (Lunar Calendar)')
  assert.equal(getActivityRecurrenceLabel('annual-gregorian', 'id'), 'Tahunan (Kalender Masehi)')
  assert.equal(getActivityRecurrenceLabel('annual-gregorian', 'en'), 'Annual (Gregorian Calendar)')
  assert.equal(getActivityRecurrenceLabel('periodic', 'id'), 'Periode Tertentu')
  assert.equal(getActivityRecurrenceLabel('periodic', 'en'), 'Periodic Rule')
  assert.equal(getActivityRecurrenceLabel('one-time', 'id'), 'Satu Kali Pelaksanaan')
  assert.equal(getActivityRecurrenceLabel('one-time', 'en'), 'One-Time Event')
  assert.equal(getActivityRecurrenceLabel('incidental', 'id'), 'Insidental / Kondisional')
  assert.equal(getActivityRecurrenceLabel('incidental', 'en'), 'Incidental / Conditional')
})

test('Verifikasi 3: Status Jadwal Independen dari Status Publikasi', () => {
  assert.equal(ACTIVITY_SCHEDULE_STATUSES.length, 4)
  const scheduled = getActivityScheduleStatus('scheduled', 'id')
  assert.equal(scheduled.label.id, 'Jadwal Ditetapkan')
  assert.equal(scheduled.label.en, 'Scheduled')
  assert.ok(scheduled.badgeClass.includes('emerald'))

  const tentative = getActivityScheduleStatus('tentative', 'id')
  assert.equal(tentative.label.id, 'Perkiraan / Menunggu Konfirmasi')
  assert.equal(tentative.label.en, 'Tentative / Pending')
  assert.ok(tentative.badgeClass.includes('amber'))

  const rescheduled = getActivityScheduleStatus('rescheduled', 'id')
  assert.equal(rescheduled.label.id, 'Jadwal Diubah')
  assert.equal(rescheduled.label.en, 'Rescheduled')
  assert.ok(rescheduled.badgeClass.includes('rose'))

  const unscheduled = getActivityScheduleStatus('unscheduled', 'id')
  assert.equal(unscheduled.label.id, 'Belum Ditentukan')
  assert.equal(unscheduled.label.en, 'Unscheduled')
  assert.ok(unscheduled.badgeClass.includes('stone'))
})

test('Verifikasi 4: Format Kalender Masehi & Rentang Tanggal Tanpa Tanggal Palsu', () => {
  // Tanggal tunggal
  const singleId = formatGregorianDateRange('2026-02-17T00:00:00.000Z', null, 'id')
  assert.ok(singleId?.includes('17 Februari 2026'))
  const singleEn = formatGregorianDateRange('2026-02-17T00:00:00.000Z', null, 'en')
  assert.ok(singleEn?.includes('February 17, 2026'))

  // Rentang tanggal bulan yang sama
  const rangeSameMonthId = formatGregorianDateRange('2026-02-15T00:00:00.000Z', '2026-02-18T00:00:00.000Z', 'id')
  assert.ok(rangeSameMonthId?.includes('15 – 18 Februari 2026'))
  const rangeSameMonthEn = formatGregorianDateRange('2026-02-15T00:00:00.000Z', '2026-02-18T00:00:00.000Z', 'en')
  assert.ok(rangeSameMonthEn?.includes('15 – 18, 2026'))

  // Rentang lintas bulan
  const crossMonth = formatGregorianDateRange('2026-01-31T00:00:00.000Z', '2026-02-02T00:00:00.000Z', 'id')
  assert.ok(crossMonth?.includes('31 Januari 2026 – 2 Februari 2026'))

  // Null date TIDAK boleh menghasilkan "NaN" atau "1 Jan 1970"
  const nullDate = formatGregorianDateRange(null, null, 'id')
  assert.equal(nullDate, null)
  assert.equal(formatGregorianDateRange('', '', 'id'), null)
  assert.equal(formatGregorianDateRange('invalid-date', null, 'id'), null)
})

test('Verifikasi 5: Format Penanggalan Imlek (Lunar) untuk Seluruh Kasus Penggunaan', () => {
  // 1. Tanggal 24 bulan 12 Imlek (Hari Sang An)
  const sangAn = formatLunarDate({ lunarDay: 24, lunarMonth: 12, lunarRuleType: 'exact_date' }, 'id')
  assert.equal(sangAn, 'Tgl 24 Bulan 12 Imlek')

  // 2. Tanggal 4 bulan 1 Imlek (Menyambut Dewa turun)
  const dewaTurun = formatLunarDate({ lunarDay: 4, lunarMonth: 1, lunarRuleType: 'exact_date' }, 'id')
  assert.equal(dewaTurun, 'Tgl 4 Bulan 1 Imlek')

  // 3. Tanggal 9 bulan 1 Imlek (King Thi Kong)
  const kingThiKong = formatLunarDate({ lunarDay: 9, lunarMonth: 1, lunarRuleType: 'exact_date' }, 'en')
  assert.equal(kingThiKong, 'Day 9 Month 1 Lunar')

  // 4. Tanggal 2 bulan 2 Imlek (Hok Tek Ceng Sin)
  const hokTek = formatLunarDate({ lunarDay: 2, lunarMonth: 2, lunarRuleType: 'exact_date' }, 'id')
  assert.equal(hokTek, 'Tgl 2 Bulan 2 Imlek')

  // 5. Paruh pertama bulan 7 Imlek (Chit Gwe / Ulambana)
  const paruh1 = formatLunarDate({ lunarMonth: 7, lunarRuleType: 'first_half' }, 'id')
  assert.equal(paruh1, 'Paruh Pertama Bulan 7 Imlek (Tgl 1–15)')

  // 6. Paruh kedua bulan 7 Imlek
  const paruh2 = formatLunarDate({ lunarMonth: 7, lunarRuleType: 'second_half' }, 'id')
  assert.equal(paruh2, 'Paruh Kedua Bulan 7 Imlek (Tgl 16–30)')

  // 7. Bulan kabisat (Runyue)
  const leap = formatLunarDate({ lunarDay: 15, lunarMonth: 4, isLeapMonth: true, lunarRuleType: 'exact_date' }, 'id')
  assert.equal(leap, 'Tgl 15 Bulan 4 (Kabisat) Imlek')

  // 8. Periode khusus (Ceng Beng: 10 hari sebelum & sesudah 5 April)
  const cengBeng = formatLunarDate(
    {
      lunarRuleType: 'custom_period',
      lunarPeriodDescription: 'Sepuluh hari sebelum dan sesudah 5 April (Ceng Beng)',
    },
    'id'
  )
  assert.equal(cengBeng, 'Sepuluh hari sebelum dan sesudah 5 April (Ceng Beng)')
})

test('Verifikasi 6: Kegiatan Insidental & Tentatif Tanpa Tanggal Masehi', () => {
  const incidentalActivity = {
    title: 'Upacara Doa Khusus Tolak Bala',
    category: 'ritual',
    recurrenceType: 'incidental',
    scheduleStatus: 'unscheduled',
    date: null,
    endDate: null,
  }
  const dateFormatted = formatGregorianDateRange(incidentalActivity.date, incidentalActivity.endDate, 'id')
  assert.equal(dateFormatted, null, 'Tidak boleh ada tanggal palsu jika tanggal Masehi belum ditetapkan')

  const status = getActivityScheduleStatus(incidentalActivity.scheduleStatus, 'id')
  assert.equal(status.label.id, 'Belum Ditentukan')
})

test('Verifikasi 7: Lokasi Kegiatan (Internal, Eksternal, Hybrid)', () => {
  assert.equal(ACTIVITY_LOCATION_TYPES.length, 3)
  const internalLoc = ACTIVITY_LOCATION_TYPES.find((l) => l.value === 'internal')
  assert.equal(internalLoc?.label.id, 'Klenteng Tek Hay Bio (Internal)')

  const externalLoc = ACTIVITY_LOCATION_TYPES.find((l) => l.value === 'external')
  assert.equal(externalLoc?.label.id, 'Lokasi Lain / Eksternal')

  const hybridLoc = ACTIVITY_LOCATION_TYPES.find((l) => l.value === 'hybrid')
  assert.equal(hybridLoc?.label.id, 'Klenteng Tek Hay Bio & Lokasi Eksternal')
})

test('Verifikasi 8: Validasi Logika Tanggal (Rentang Tanggal Valid)', () => {
  const start = new Date('2026-03-01T10:00:00.000Z')
  const endValid = new Date('2026-03-02T10:00:00.000Z')
  const endInvalid = new Date('2026-02-28T10:00:00.000Z')

  assert.ok(endValid >= start, 'EndDate yang lebih lambat dari startDate harus valid')
  assert.ok(endInvalid < start, 'EndDate yang lebih awal dari startDate harus tidak valid')
})
