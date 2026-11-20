// Genera aew.ics (suscripción para la app Calendario) con los mismos datos que usa index.html.
// Uso: node tools/build-ics.mjs
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import vm from "node:vm";

const root = fileURLToPath(new URL("..", import.meta.url));
const html = readFileSync(root + "index.html", "utf8");
const a = html.indexOf("/* ================= DATA ================= */");
const b = html.indexOf("/* ================= STATE ================= */");
if (a < 0 || b < 0) throw new Error("No encontré el bloque de datos en index.html");
const { BASE, SHOWS } = vm.runInNewContext(html.slice(a, b) + "\n;({BASE, SHOWS})");

const year = new Date().getFullYear();
const pick = BASE.filter(e =>
  e.show === "ppv" || e.show === "esp" ||
  ((e.show === "dyn" || e.show === "col") && e.date >= `${year}-01-01`));

const esc = s => String(s).replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\r?\n/g, "\\n");
const fold = line => {
  const out = []; let cur = "", bytes = 0;
  for (const ch of line) {
    const n = Buffer.byteLength(ch);
    if (bytes + n > (out.length ? 74 : 75)) { out.push(cur); cur = ""; bytes = 0; }
    cur += ch; bytes += n;
  }
  out.push(cur);
  return out.join("\r\n ");
};
const ymd = d => d.replaceAll("-", "");
const nextDay = d => { const t = new Date(d + "T00:00:00Z"); t.setUTCDate(t.getUTCDate() + 1); return t.toISOString().slice(0, 10); };
const stamp = new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d+Z$/, "Z");
const dowOf = d => new Date(d + "T00:00:00Z").getUTCDay();

const lines = [
  "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Bitacora AEW//ES", "CALSCALE:GREGORIAN", "METHOD:PUBLISH",
  "X-WR-CALNAME:AEW · Bitácora",
  "X-WR-CALDESC:Dynamite\\, Collision\\, especiales y pay-per-views de AEW.",
  "X-WR-TIMEZONE:America/New_York", "REFRESH-INTERVAL;VALUE=DURATION:P1D", "X-PUBLISHED-TTL:P1D",
  "BEGIN:VTIMEZONE", "TZID:America/New_York",
  "BEGIN:DAYLIGHT", "TZOFFSETFROM:-0500", "TZOFFSETTO:-0400", "TZNAME:EDT", "DTSTART:19700308T020000", "RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=2SU", "END:DAYLIGHT",
  "BEGIN:STANDARD", "TZOFFSETFROM:-0400", "TZOFFSETTO:-0500", "TZNAME:EST", "DTSTART:19701101T020000", "RRULE:FREQ=YEARLY;BYMONTH=11;BYDAY=1SU", "END:STANDARD",
  "END:VTIMEZONE"
];
for (const e of pick) {
  const name = SHOWS[e.show].name;
  let summary;
  if (e.show === "ppv") summary = `AEW ${e.title} (PPV)`;
  else if (e.show === "esp") summary = `AEW ${e.title}`;
  else summary = e.title && !e.title.includes(name) ? `AEW ${name}: ${e.title}` : `AEW ${name}`;
  const desc = [e.note, e.verified ? "" : "Fecha según el horario regular del programa; puede variar."].filter(Boolean).join(" ");
  lines.push("BEGIN:VEVENT", `UID:${e.id}@bitacora-aew`, `DTSTAMP:${stamp}`);
  if (e.show === "ppv" || e.show === "esp") {
    lines.push(`DTSTART;VALUE=DATE:${ymd(e.date)}`, `DTEND;VALUE=DATE:${ymd(nextDay(e.date))}`, "TRANSP:TRANSPARENT");
  } else {
    // Collision movido a miércoles va después de Dynamite, a las 10 PM ET
    const hour = e.show === "col" && dowOf(e.date) === 3 ? "22" : "20";
    lines.push(`DTSTART;TZID=America/New_York:${ymd(e.date)}T${hour}0000`, "DURATION:PT2H");
  }
  lines.push(fold(`SUMMARY:${esc(summary)}`));
  const loc = [e.venue, e.city].filter(Boolean).join(", ");
  if (loc) lines.push(fold(`LOCATION:${esc(loc)}`));
  if (desc) lines.push(fold(`DESCRIPTION:${esc(desc)}`));
  lines.push("END:VEVENT");
}
lines.push("END:VCALENDAR");
writeFileSync(root + "aew.ics", lines.join("\r\n") + "\r\n");
console.log(`aew.ics: ${pick.length} eventos`);
