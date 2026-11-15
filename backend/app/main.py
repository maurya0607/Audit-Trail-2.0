from datetime import datetime, timezone
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware

from app.database import db, init_db_indexes
from app.websocket.manager import ws_manager
from app.routes import auth, shipments, events, ledger, risks, disputes, reports

app = FastAPI(
    title="Audit Trail 2.0 - Enterprise Logistics Ledger & AI Dispute API",
    version="2.0.0",
    description="Tamper-evident event sourcing, SHA-256 hash chaining, Gemini AI risk detection & dispute arbitration API."
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include all modular routers as defined in Section 5 Specification
app.include_router(auth.router)
app.include_router(shipments.router)
app.include_router(events.router)
app.include_router(ledger.router)
app.include_router(risks.router)
app.include_router(disputes.router)
app.include_router(reports.router)

@app.on_event("startup")
async def startup_event():
    print("==================================================")
    print("🚀 AUDIT TRAIL 2.0 BACKEND SERVICE STARTING...")
    print("==================================================")
    try:
        # Ping MongoDB database to confirm live connectivity
        await db.command("ping")
        print("✅ [DATABASE CONNECTED] Successfully connected to MongoDB Cloud Atlas!")
        print(f"📦 Active Database: '{db.name}'")
        
        # Initialize collections and indexes
        await init_db_indexes()
        print("⚡ [INDEXES INITIALIZED] Core collection indexes verified & ready.")
        print("🛰️ [SYSTEM READY] REST APIs and WebSockets online at http://127.0.0.1:8000")
        print("==================================================")
    except Exception as e:
        print(f"⚠️ [DATABASE WARNING] MongoDB connection issue: {e}")
        print("==================================================")

# --- Root & Health Check ---
@app.get("/favicon.ico", include_in_schema=False)
async def favicon():
    return Response(content=b"", media_type="image/x-icon")

@app.get("/")
async def root():
    return {
        "status": "ONLINE",
        "service": "Audit Trail 2.0 API Engine",
        "version": "2.0.0",
        "timestamp": datetime.now(timezone.utc).isoformat()
    }

# --- Dashboard KPI Stats ---
@app.get("/api/dashboard/stats")
async def get_dashboard_stats():
    try:
        total_shipments = await db.shipments.count_documents({})
        total_events = await db.events.count_documents({})
        active_risks = await db.risk_alerts.count_documents({})
        open_disputes = await db.disputes.count_documents({})
        return {
            "active_freight_monitored": total_shipments,
            "chained_blocks": total_events,
            "active_risk_interceptions": active_risks,
            "total_disputes": open_disputes,
            "integrity_status": "SHA-256 SYNCED"
        }
    except Exception as e:
        return {
            "active_freight_monitored": 0,
            "chained_blocks": 0,
            "active_risk_interceptions": 0,
            "total_disputes": 0,
            "integrity_status": "WAITING_DATA"
        }

# --- Real-Time WebSocket Endpoint ---
@app.websocket("/ws/live")
async def websocket_endpoint(websocket: WebSocket):
    await ws_manager.connect(websocket)
    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        ws_manager.disconnect(websocket)
