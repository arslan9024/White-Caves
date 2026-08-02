from __future__ import annotations

from pathlib import Path
from datetime import date

from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas
from reportlab.lib.units import cm

ROOT = Path(r"c:\Users\Murad Ali\White-Caves")
PARSED_DIR = ROOT / "company_documents" / "parsed_text"
PDF_DIR = ROOT / "company_documents" / "pdf"
PDF_DIR.mkdir(parents=True, exist_ok=True)

MAPPING = [
    ("ejari_tenancy_contract_registration_certificate.txt", "ejari_tenancy_contract_registration_certificate.pdf", "Ejari Tenancy Contract Registration Certificate"),
    ("det_commercial_license_package.txt", "det_commercial_license_package.pdf", "DET Commercial License Package"),
    ("gdrfa_establishment_card.txt", "gdrfa_establishment_card.pdf", "GDRFA eEstablishment Card"),
    ("rera_office_registration_certificate.txt", "rera_office_registration_certificate.pdf", "RERA Office Registration Certificate"),
]


def draw_text_to_pdf(source_txt: Path, target_pdf: Path, title: str) -> None:
    lines = source_txt.read_text(encoding="utf-8", errors="replace").splitlines()

    c = canvas.Canvas(str(target_pdf), pagesize=A4)
    width, height = A4

    left = 2.0 * cm
    right = width - 2.0 * cm
    top = height - 2.0 * cm
    bottom = 2.0 * cm
    line_height = 13

    def draw_header(page_num: int) -> float:
        y = top
        c.setFont("Helvetica-Bold", 12)
        c.drawString(left, y, title)
        c.setFont("Helvetica", 9)
        c.drawRightString(right, y, f"Generated: {date.today().isoformat()} | Page {page_num}")
        y -= 18
        c.line(left, y, right, y)
        return y - 14

    page_num = 1
    y = draw_header(page_num)

    c.setFont("Helvetica", 10)
    for raw in lines:
        text = raw.replace("\t", "    ")

        # rough wrapping for long lines
        wrapped = []
        max_chars = 105
        while len(text) > max_chars:
            split_at = text.rfind(" ", 0, max_chars)
            if split_at <= 0:
                split_at = max_chars
            wrapped.append(text[:split_at])
            text = text[split_at:].lstrip()
        wrapped.append(text)

        for part in wrapped:
            if y < bottom:
                c.showPage()
                page_num += 1
                y = draw_header(page_num)
                c.setFont("Helvetica", 10)
            c.drawString(left, y, part)
            y -= line_height

    c.save()


if __name__ == "__main__":
    generated = []
    for txt_name, pdf_name, title in MAPPING:
        source = PARSED_DIR / txt_name
        target = PDF_DIR / pdf_name
        if not source.exists():
            print(f"SKIP_MISSING_SOURCE: {source}")
            continue
        draw_text_to_pdf(source, target, title)
        generated.append(target)
        print(f"GENERATED: {target}")

    print(f"GENERATED_COUNT={len(generated)}")
