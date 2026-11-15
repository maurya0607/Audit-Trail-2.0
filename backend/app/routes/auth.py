from datetime import datetime, timezone
from fastapi import APIRouter, HTTPException
from app.database import db
from app.schemas.all_schemas import UserRegister, UserLogin
from app.middleware.auth_middleware import hash_password, verify_password, create_access_token, normalize_role, VALID_ROLES

router = APIRouter(prefix="/api/auth", tags=["Authentication & RBAC"])

# Seed/Default users for instant testing & hackday evaluation
DEFAULT_USERS = {
    "admin@audittrail.io": {
        "name": "Vishal Maurya",
        "email": "admin@audittrail.io",
        "password": "password123",
        "role": "Admin",
    },
    "robert.h@globalfreight.org": {
        "name": "Robert Hastings",
        "email": "robert.h@globalfreight.org",
        "password": "password123",
        "role": "Logistics Manager",
    },
    "arthur.p@novartis.com": {
        "name": "Arthur Pendelton",
        "email": "arthur.p@novartis.com",
        "password": "password123",
        "role": "Supplier",
    },
    "marcus.v@aerocold.com": {
        "name": "Marcus Vance",
        "email": "marcus.v@aerocold.com",
        "password": "password123",
        "role": "Transporter",
    },
    "tariq.m@dubaihealth.ae": {
        "name": "Dr. Tariq Al-Mansoor",
        "email": "tariq.m@dubaihealth.ae",
        "password": "password123",
        "role": "Receiver",
    },
    "sarah.chen@globalaudit.org": {
        "name": "Dr. Sarah Chen",
        "email": "sarah.chen@globalaudit.org",
        "password": "password123",
        "role": "Auditor",
    },
}

@router.post("/register")
async def register_user(req: UserRegister):
    canonical_role = normalize_role(req.role)
    if canonical_role not in VALID_ROLES:
        raise HTTPException(status_code=400, detail=f"Invalid role '{req.role}'. Must be one of {VALID_ROLES}")
    
    # Check if already in MongoDB
    try:
        existing = await db.users.find_one({"email": req.email})
        if existing:
            raise HTTPException(status_code=400, detail="Email already registered")
    except HTTPException:
        raise
    except Exception as e:
        print(f"MongoDB read warning in register: {e}")

    user_doc = {
        "name": req.name,
        "email": req.email,
        "password_hash": hash_password(req.password),
        "role": canonical_role,
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    
    try:
        await db.users.insert_one(user_doc)
        print(f"✅ User registered in MongoDB: {req.email}")
    except Exception as e:
        print(f"⚠️ MongoDB write warning in register: {e}")

    token = create_access_token({"email": req.email, "role": canonical_role, "name": req.name})
    return {"access_token": token, "user": {"name": req.name, "email": req.email, "role": canonical_role}}


@router.post("/login")
async def login_user(req: UserLogin):
    user = None
    email_clean = req.email.strip().lower()

    # 1. First, search MongoDB
    try:
        user = await db.users.find_one({"email": {"$regex": f"^{email_clean}$", "$options": "i"}})
    except Exception as e:
        print(f"⚠️ MongoDB read error in login: {e}")

    # 2. If found in MongoDB, verify hash
    if user and "password_hash" in user:
        if verify_password(req.password, user["password_hash"]):
            token = create_access_token({"email": user["email"], "role": user["role"], "name": user.get("name", "User")})
            return {"access_token": token, "user": {"name": user.get("name", "User"), "email": user["email"], "role": user["role"]}}
        else:
            raise HTTPException(status_code=401, detail="Invalid password")

    # 3. Fallback to default/demo users (so demo accounts always work instantly)
    for def_email, def_data in DEFAULT_USERS.items():
        if def_email.lower() == email_clean and req.password == def_data["password"]:
            # Auto-save to MongoDB if not yet present
            try:
                await db.users.update_one(
                    {"email": def_data["email"]},
                    {"$setOnInsert": {
                        "name": def_data["name"],
                        "email": def_data["email"],
                        "password_hash": hash_password(def_data["password"]),
                        "role": def_data["role"],
                        "created_at": datetime.now(timezone.utc).isoformat()
                    }},
                    upsert=True
                )
            except Exception:
                pass

            token = create_access_token({"email": def_data["email"], "role": def_data["role"], "name": def_data["name"]})
            return {"access_token": token, "user": {"name": def_data["name"], "email": def_data["email"], "role": def_data["role"]}}

    raise HTTPException(status_code=401, detail="Invalid email or password. If you are a new user, please Sign Up first.")
