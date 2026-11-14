import os
import jwt
from datetime import datetime, timedelta, timezone
from passlib.context import CryptContext
from fastapi import HTTPException, Header
from typing import Optional

SECRET_KEY = os.getenv("JWT_SECRET", "audit_trail_2_super_secret_key")
ALGORITHM = "HS256"
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Support both canonical Title Case and uppercase codes from frontend
ROLE_MAP = {
    "ADMIN": "Admin",
    "SUPPLIER": "Supplier",
    "TRANSPORTER": "Transporter",
    "RECEIVER": "Receiver",
    "AUDITOR": "Auditor",
    "LOGISTICS_MANAGER": "Logistics Manager",
    "LOGISTICS MANAGER": "Logistics Manager",
    "ADMINISTRATOR": "Admin",
}

VALID_ROLES = [
    "Admin", "Supplier", "Transporter", "Receiver", "Auditor", "Logistics Manager"
]

def normalize_role(role_input: str) -> str:
    """Normalize any role string (e.g. 'ADMIN', 'LOGISTICS_MANAGER', 'Supplier') to canonical title."""
    if not role_input:
        return "Logistics Manager"
    cleaned = role_input.strip()
    upper = cleaned.upper().replace("-", "_")
    if upper in ROLE_MAP:
        return ROLE_MAP[upper]
    for valid in VALID_ROLES:
        if cleaned.lower() == valid.lower():
            return valid
    return cleaned

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain: str, hashed: str) -> bool:
    return pwd_context.verify(plain, hashed)

def create_access_token(data: dict) -> str:
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(hours=24)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def decode_token(authorization: Optional[str] = Header(None)) -> dict:
    if not authorization:
        return {"email": "demo@audittrail.io", "role": "Logistics Manager"}
    try:
        token = authorization.replace("Bearer ", "")
        return jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid or expired JWT token")
