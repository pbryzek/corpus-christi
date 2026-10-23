interface IcsEvent {
  id: string;
  title: string;
  description?: string | null;
  event_date: string;
  end_time?: string | null;
  location?: string | null;
  event_url?: string | null;
  recurrence?: string | null;
  time_tbd?: boolean | null;
}

const PARISH_LOCATION = 'Corpus Christi Catholic Church, 322 St. James Drive, Piedmont, CA 94611';

function toIcsDate(iso: string): string {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, '0');
  return (
    d.getUTCFullYear().toString() +
    pad(d.getUTCMonth() + 1) +
    pad(d.getUTCDate()) +
    'T' +
    pad(d.getUTCHours()) +
    pad(d.getUTCMinutes()) +
    pad(d.getUTCSeconds()) +
    'Z'
  );
}

function escapeText(value: string): string {
  return value
    .replace(/\\/g, '\\\\')
    .replace(/\r\n|\n|\r/g, '\\n')
    .replace(/,/g, '\\,')
    .replace(/;/g, '\\;');
}

function foldLine(line: string): string {
  if (line.length <= 75) return line;
  const chunks: string[] = [];
  let remaining = line;
  chunks.push(remaining.slice(0, 75));
  remaining = remaining.slice(75);
  while (remaining.length > 0) {
    chunks.push(' ' + remaining.slice(0, 74));
    remaining = remaining.slice(74);
  }
  return chunks.join('\r\n');
}

function recurrenceRule(recurrence: string): string | null {
  switch (recurrence) {
    case 'weekly-sat':
      return 'RRULE:FREQ=WEEKLY;BYDAY=SA';
    case 'weekly-sun':
      return 'RRULE:FREQ=WEEKLY;BYDAY=SU';
    case 'weekday':
      return 'RRULE:FREQ=WEEKLY;BYDAY=MO,TU,WE,TH,FR';
    default:
      return null;
  }
}

export function generateIcs(event: IcsEvent): string {
  const start = toIcsDate(event.event_date);
  const endIso = event.end_time
    ? event.end_time
    : new Date(new Date(event.event_date).getTime() + 60 * 60 * 1000).toISOString();
  const end = toIcsDate(endIso);
  const now = toIcsDate(new Date().toISOString());

  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Corpus Christi Piedmont//Parish Events//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${event.id}@corpuschristipiedmont.org`,
    `DTSTAMP:${now}`,
    `DTSTART:${start}`,
    `DTEND:${end}`,
    foldLine(`SUMMARY:${escapeText(event.title)}`),
    foldLine(`LOCATION:${escapeText(event.location || PARISH_LOCATION)}`),
  ];

  if (event.description) {
    lines.push(foldLine(`DESCRIPTION:${escapeText(event.description)}`));
  }
  if (event.event_url) {
    lines.push(foldLine(`URL:${event.event_url}`));
  }
  if (event.recurrence) {
    const rule = recurrenceRule(event.recurrence);
    if (rule) lines.push(rule);
  }

  lines.push('END:VEVENT', 'END:VCALENDAR');
  return lines.join('\r\n');
}

function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60) || 'event';
}

export function downloadEventIcs(event: IcsEvent): void {
  const ics = generateIcs(event);
  const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${slugify(event.title)}.ics`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 100);
}
