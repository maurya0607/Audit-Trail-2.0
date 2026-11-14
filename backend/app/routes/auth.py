from datetime import datetime, timezone
from fastapi import APIRouter, HTTPException
from app.database import db
from app.schemas.all_schemas import UserRegister, UserLogin
from app.middleware.auth_middleware import hash_password, verify_password, create_access_token, VALID_ROLES

router = APIRouter(prefix="/api/auth", tags=["Authentication & RBAC"])

@router.post("/register")
async def register_user(req: UserRegister):
    if req.role not in VALID_ROLES:
        raise HTTPException(status_code=400, detail=f"Invalid role. Must be one of {VALID_ROLES}")
    if await db.users.find_one({"email": req.email}):
        raise HTTPException(status_code=400, detail="Email already registered")

    user_doc = {
        "name": req.name,
        "email": req.email,
        "password_hash": hash_password(req.password),
        "role": req.role,
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    await db.users.insert_one(user_doc)
    token = create_access_token({"email": req.email, "role": req.role, "name": req.name})
    return {"access_token": token, "user": {"name": req.name, "email": req.email, "role": req.role}}

@router.post("/login")
async def login_user(req: UserLogin):
    user = await db.users.find_one({"email": req.email})
    if not user or not verify_password(req.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    token = create_access_token({"email": user["email"], "role": user["role"], "name": user["name"]})
    return {"access_token": token, "user": {"name": user["name"], "email": user["email"], "role": user["role"]}}