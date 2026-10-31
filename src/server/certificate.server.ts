import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { HttpError, requireUser, sb } from "./mm.server";

const roleLabel: Record<string, string> = {
  athlete: "Athlete",
  sports: "Sports professional / organisation",
  lawyer: "Lawyer",
};

const detailFields: Record<string, [string, string][]> = {
  athlete: [["sport", "Sport"], ["discipline", "Discipline"], ["level", "Level"]],
  sports: [["org_name", "Organisation"], ["title", "Title"], ["subtype", "Category"], ["sports", "Sports"]],
  lawyer: [["bar_enrollment", "Bar enrolment"], ["jurisdiction", "Jurisdiction"], ["expertise", "Expertise"]],
};

/** Builds the certificate PDF. Signed-in users get their own; admins may pass ?user=<id>. */
export async function certificatePdf(request: Request) {
  const { token, user } = await requireUser(request);
  const target = new URL(request.url).searchParams.get("user") || user.id;
  if (!/^[0-9a-f-]{36}$/i.test(target)) throw new HttpError(400, "Invalid member.");
  // RLS: only the holder or an admin can read the certificate row.
  const rows = await sb(
    `/rest/v1/verification_certificates?select=*&user_id=eq.${target}&revoked_at=is.null&order=issued_at.desc&limit=1`,
    { token },
  );
  const cert = rows?.[0];
  if (!cert) throw new HttpError(404, "No active verification certificate. The profile must be approved first.");
  return renderPdf(cert);
}

export async function renderPdf(cert: {
  certificate_no: string; holder_name: string; role: string; issued_at: string; details?: Record<string, unknown>;
}) {
  const pdf = await PDFDocument.create();
  pdf.setTitle(`Verification certificate ${cert.certificate_no}`);
  pdf.setAuthor("Mehfooz Maidan");
  const page = pdf.addPage([842, 595]); // A4 landscape
  const serif = await pdf.embedFont(StandardFonts.TimesRoman);
  const serifBold = await pdf.embedFont(StandardFonts.TimesRomanBold);
  const sans = await pdf.embedFont(StandardFonts.Helvetica);
  const green = rgb(0.09, 0.25, 0.2);
  const gold = rgb(0.72, 0.58, 0.27);
  const ink = rgb(0.15, 0.15, 0.15);
  const { width, height } = page.getSize();

  page.drawRectangle({ x: 20, y: 20, width: width - 40, height: height - 40, borderColor: green, borderWidth: 3 });
  page.drawRectangle({ x: 30, y: 30, width: width - 60, height: height - 60, borderColor: gold, borderWidth: 1 });

  const center = (text: string, y: number, font = serif, size = 14, color = ink) => {
    const w = font.widthOfTextAtSize(text, size);
    page.drawText(text, { x: (width - w) / 2, y, size, font, color });
  };

  center("MEHFOOZ MAIDAN", height - 90, sans, 13, green);
  center("Certificate of Verification", height - 140, serifBold, 34, green);
  center("This is to certify that", height - 195, serif, 15);
  center(cert.holder_name.slice(0, 80), height - 240, serifBold, 30, ink);
  page.drawLine({ start: { x: 220, y: height - 252 }, end: { x: width - 220, y: height - 252 }, thickness: 1, color: gold });
  center(`has been verified on the Mehfooz Maidan platform as: ${roleLabel[cert.role] || cert.role}`, height - 285, serif, 15);

  const d = cert.details || {};
  const lines = (detailFields[cert.role] || [])
    .map(([k, label]) => (d[k] ? `${label}: ${String(d[k]).slice(0, 80)}` : ""))
    .filter(Boolean);
  lines.forEach((line, i) => center(line, height - 320 - i * 20, sans, 11));

  const issued = new Date(cert.issued_at).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
  page.drawText(`Certificate no.: ${cert.certificate_no}`, { x: 70, y: 110, size: 11, font: sans, color: ink });
  page.drawText(`Date issued: ${issued}`, { x: 70, y: 92, size: 11, font: sans, color: ink });
  page.drawText("Platform Administration", { x: width - 260, y: 110, size: 12, font: serifBold, color: green });
  page.drawLine({ start: { x: width - 260, y: 125 }, end: { x: width - 80, y: 125 }, thickness: 0.8, color: ink });

  const note =
    "Verification means an administrator reviewed the details submitted. It does not guarantee conduct, selection or outcomes.";
  center(note, 60, sans, 8.5, rgb(0.4, 0.4, 0.4));
  center("Check this certificate at /verify using the certificate number.", 47, sans, 8.5, rgb(0.4, 0.4, 0.4));

  const bytes = await pdf.save();
  return new Response(bytes as BodyInit, {
    headers: {
      "content-type": "application/pdf",
      "content-disposition": `attachment; filename="verification-${cert.certificate_no}.pdf"`,
      "cache-control": "no-store",
    },
  });
}
