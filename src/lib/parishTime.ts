export const TZ = 'America/Los_Angeles';

/**
 * Combine a date input ("2026-12-14") and a time input ("19:00") into a UTC
 * instant, reading the time as Pacific.
 *
 * The offset is resolved for the given date rather than hard-coded, because
 * -08:00 and -07:00 are both correct depending on the month. Several migrations
 * in this repo exist only to repair rows stored with the wrong one.
 */
export function toIso(dateStr: string, timeStr: string): string {
  if (!dateStr) return '';
  const t = timeStr || '00:00';
  const probeUtc = new Date(`${dateStr}T${t}:00Z`);
  const tzPart = new Intl.DateTimeFormat('en-US', {
    timeZone: TZ,
    timeZoneName: 'shortOffset',
  }).formatToParts(probeUtc).find(p => p.type === 'timeZoneName')?.value ?? 'GMT-7';
  const m = tzPart.match(/GMT([+-])(\d+)/);
  const sign = m?.[1] ?? '-';
  const hrs = (m?.[2] ?? '7').padStart(2, '0');
  return new Date(`${dateStr}T${t}:00${sign}${hrs}:00`).toISOString();
}

/** YYYY-MM-DD in Pacific, for prefilling a date input. */
export function toDateStr(iso: string): string {
  if (!iso) return '';
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: TZ, year: 'numeric', month: '2-digit', day: '2-digit',
  }).format(new Date(iso));
}

/** HH:MM (24h) in Pacific, for prefilling a time input. */
export function toTimeStr(iso: string): string {
  if (!iso) return '';
  return new Date(iso).toLocaleTimeString('en-US', {
    timeZone: TZ, hour: '2-digit', minute: '2-digit', hour12: false,
  });
}

export function formatDisplayDate(iso: string): string {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString('en-US', {
    timeZone: TZ, weekday: 'short', month: 'short', day: 'numeric', year: 'numeric',
  });
}

export function formatDisplayTime(iso: string): string {
  if (!iso) return '';
  return new Date(iso).toLocaleTimeString('en-US', {
    timeZone: TZ, hour: 'numeric', minute: '2-digit', hour12: true,
  });
}

export function formatDateTime(iso: string, timeTbd = false): string {
  if (!iso) return '';
  return timeTbd
    ? `${formatDisplayDate(iso)} · time TBD`
    : `${formatDisplayDate(iso)} · ${formatDisplayTime(iso)}`;
}
