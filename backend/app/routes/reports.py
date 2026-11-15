from fastapi import APIRouter, Response
from fpdf import FPDF
from app.database import db
from app.services.hash_service import verify_event_chain

router = APIRouter(prefix="/api/reports", tags=["Digital Audit Reports"])

@router.get("/{shipment_id}")
async def generate_audit_pdf(shipment_id: str):
    events = await db.events.find({"shipment_id": shipment_id}, {"_id": 0}).sort("sequence_number", 1).to_list(500)
    verification = verify_event_chain(events)
    risks = await db.risk_alerts.find({"shipment_id": shipment_id}, {"_id": 0}).to_list(50)

    pdf = FPDF()
    pdf.add_page()
    pdf.set_font("Helvetica", "B", 16)
    pdf.cell(0, 10, "AUDIT TRAIL 2.0 - CRYPTOGRAPHIC VERIFICATION REPORT", ln=True)
    pdf.set_font("Helvetica", "", 11)
    pdf.cell(0, 8, f"Shipment ID: {shipment_id}", ln=True)
    pdf.cell(0, 8, f"Chain Status: {verification['message']}", ln=True)
    pdf.ln(5)
    for ev in events:
        pdf.cell(0, 7, f"Block #{ev['sequence_number']} [{ev['event_type']}] Hash: {ev['event_hash'][:18]}...", ln=True)
    pdf.ln(5)
    for r in risks:
        pdf.multi_cell(0, 7, f"Risk [{r['severity']} - {r['risk_score']}/100]: {r['ai_explanation']}")

    return Response(
        content=bytes(pdf.output()),
        media_type="application/pdf",
        headers={"Content-Disposition": f"attachment; filename=audit_{shipment_id}.pdf"}
    )
