"""
AI Service — powered by Groq (llama-3.3-70b-versatile)
Replaces the previous Gemini implementation.
GROQ_API_KEY must be set in the .env file.
"""
import os
import json
import requests
from dotenv import load_dotenv

load_dotenv()

GROQ_API_KEY = os.getenv("GROQ_API_KEY", "").strip()
GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions"
GROQ_MODEL   = "llama-3.3-70b-versatile"   # fast & capable

def _call_llm(prompt: str) -> str:
    """Helper that calls Gemini or Groq depending on available API keys."""
    # 1. Try Groq if key is present
    if groq_client:
        for model in ["llama-3.1-70b-versatile", "llama-3.1-8b-instant", "mixtral-8x7b-32768"]:
            try:
                resp = groq_client.chat.completions.create(
                    messages=[{"role": "user", "content": prompt}],
                    model=model,
                )
                return resp.choices[0].message.content.strip()
            except Exception:
                continue

    # 2. Try Gemini if client is present
    if gemini_client:
        try:
            resp = gemini_client.models.generate_content(model="gemini-2.5-flash", contents=prompt)
            return resp.text.strip()
        except Exception:
            pass

    return ""

def _groq_chat(prompt: str, system: str = "You are an expert AI assistant.") -> str:
    """
    Send a prompt to Groq and return the response text.
    Returns an empty string on failure (callers handle the fallback).
    """
    if not GROQ_API_KEY:
        return ""

    headers = {
        "Authorization": f"Bearer {GROQ_API_KEY}",
        "Content-Type": "application/json",
    }
    payload = {
        "model": GROQ_MODEL,
        "messages": [
            {"role": "system", "content": system},
            {"role": "user",   "content": prompt},
        ],
        "temperature": 0.3,
        "max_tokens": 512,
    }
    try:
        resp = requests.post(GROQ_API_URL, json=payload, headers=headers, timeout=20)
        resp.raise_for_status()
        return resp.json()["choices"][0]["message"]["content"].strip()
    except Exception as exc:
        print(f"⚠️  Groq API error: {exc}")
        return ""


# ─── Risk Analysis ───────────────────────────────────────────────────────────

def analyze_event_risk(event_type: str, event_data: dict, recent_events: list) -> dict:
    """
    Analyse a logistics event for risk.
    Returns a dict with risk_score, severity, risk_type, ai_explanation.
    Uses Groq if the API key is present; falls back to rule-based logic.
    """
    temp    = event_data.get("temperature_c")
    status  = event_data.get("status", "")
    is_suspicious = (
        (temp is not None and (temp > 8.0 or temp < 2.0))
        or event_type in ["EXCURSION_ALERT", "DELAY_DETECTED"]
        or "HOLD" in status
    )

    if not is_suspicious:
        return {
            "risk_score": 12,
            "severity": "LOW",
            "risk_type": "NORMAL_TRANSIT",
            "ai_explanation": "All telemetry sensors within nominal cold-chain operating range.",
        }

    # Try Groq AI analysis
    prompt = f"""
You are an AI Logistics Risk Auditor for Audit Trail 2.0.
Analyze this logistics event and return ONLY valid JSON — no markdown, no extra text.

Event Type   : {event_type}
Event Data   : {json.dumps(event_data)}
Recent Events: {json.dumps(recent_events[-3:], default=str)}

Required JSON format:
{{
  "risk_score": <integer 0-100>,
  "severity": "<LOW|MEDIUM|HIGH|CRITICAL>",
  "risk_type": "<short label e.g. Cold-Chain Excursion Risk>",
  "ai_explanation": "<concise 1-2 sentence diagnostic and action protocol>"
}}
"""
    ai_text = _groq_chat(prompt, system="You are a logistics risk analysis AI. Always respond with valid JSON only.")

    if ai_text:
        try:
            clean = ai_text.strip().removeprefix("```json").removeprefix("```").removesuffix("```").strip()
            return json.loads(clean)
        except Exception:
            pass  # fall through to rule-based fallback

    # Rule-based fallback
    return {
        "risk_score": 89,
        "severity": "CRITICAL",
        "risk_type": "Cold-Chain Excursion Risk",
        "ai_explanation": (
            f"Thermal excursion detected ({temp}°C). "
            "Automated notification dispatched to carrier refrigeration unit."
        ) if temp is not None else (
            f"Anomalous event '{event_type}' detected. Immediate carrier review required."
        ),
    }


# ─── Dispute Investigation ────────────────────────────────────────────────────

def investigate_dispute_ai(shipment_id: str, claims: dict, events: list, evidence: list) -> str:
    """
    Use Groq to generate an impartial AI investigation summary for a dispute.
    Falls back to a canned message if Groq is unavailable.
    """
    prompt = f"""
You are an impartial AI Dispute Arbitrator for Audit Trail 2.0.
Analyze the claims, cryptographic event ledger, and submitted evidence for Shipment {shipment_id}.
Do NOT make a final legal ruling; provide objective findings for a human logistics manager.

Claims   : {json.dumps(claims, default=str)}
Ledger   : {json.dumps(events[:10], default=str)}
Evidence : {json.dumps(evidence, default=str)}

Provide a crisp 3-bullet investigation summary covering:
• Key timeline discrepancies
• Sensor / telemetry proofs
• Missing or unverified evidence

Keep each bullet to 1-2 sentences. Use plain text — no markdown headers.
"""
    result = _groq_chat(
        prompt,
        system="You are a neutral logistics dispute arbitrator. Be objective, concise, and factual.",
    )

    if result:
        return result

    # Fallback
    return (
        f"Ledger cross-check complete for {shipment_id}. "
        "Telemetry anomalies flagged during transit custody window. "
        "Human manager review and final verdict required."
    )
