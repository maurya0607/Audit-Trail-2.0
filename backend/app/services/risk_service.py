from app.services.gemini_service import analyze_event_risk

def calculate_risk_level(score: int) -> str:
    """
    Score severity mapping as per Module 5:
    0-25: LOW
    26-50: MEDIUM
    51-75: HIGH
    76-100: CRITICAL
    """
    if score <= 25:
        return "LOW"
    elif score <= 50:
        return "MEDIUM"
    elif score <= 75:
        return "HIGH"
    return "CRITICAL"

def evaluate_telemetry_risk(event_type: str, event_data: dict, recent_events: list = None) -> dict:
    return analyze_event_risk(event_type, event_data, recent_events or [])
