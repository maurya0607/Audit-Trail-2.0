import os
import time
import json
import base64
import hmac
import hashlib
from datetime import datetime, timezone
from typing import Optional
from fastapi import HTTPException, Header

# Fix passlib compatibility with bcrypt >= 4.0
try:
    import bcrypt
    if not hasattr(bcrypt, "__about__"):
        class _BcryptAbout:
            __version__ = getattr(bcrypt, "__version__", "4.0.0")
        bcrypt.__about__ = _BcryptAbout()
except Exception:
    pass

# Try loading PyJWT and passlib if installed, otherwise use robust built-in fallbacks
try:
    import jwt as pyjwt
    HAS_PYJWT = True
except ImportError:
    HAS_PYJWT = False

try:
    from passlib.context import CryptContext
    pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
    HAS_PASSLIB = True
except (ImportError, Exception):
    HAS_PASSLIB = False

SECRET_KEY = os.getenv("JWT_SECRET", "audit_trail_2_super_secret_enterprise_jwt_key_2026_sha256")
ALGORITHM = "HS256"


# Case-insensitive mapping for frontend roles
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
    """Normalize roles from frontend uppercase / variations to canonical title."""
    if not role_input:
        return "Logistics Manager"
    cleaned = str(role_input).strip()
    upper = cleaned.upper().replace("-", "_")
    if upper in ROLE_MAP:
        return ROLE_MAP[upper]
    for valid in VALID_ROLES:
        if cleaned.lower() == valid.lower():
            return valid
    return cleaned

# --- Password Hashing with Fallback ---
def hash_password(password: str) -> str:
    if HAS_PASSLIB:
        try:
            return pwd_context.hash(password)
        except Exception:
            pass
    # Built-in secure PBKDF2 fallback (zero external dependencies required)
    salt = os.urandom(16).hex()
    hashed = hashlib.pbkdf2_hmac("sha256", password.encode("utf-8"), salt.encode("utf-8"), 100000).hex()
    return f"pbkdf2:{salt}:{hashed}"

def verify_password(plain: str, hashed: str) -> bool:
    if not hashed:
        return False
    if HAS_PASSLIB and not hashed.startswith("pbkdf2:"):
        try:
            return pwd_context.verify(plain, hashed)
        except Exception:
            pass
    if hashed.startswith("pbkdf2:"):
        try:
            _, salt, key = hashed.split(":")
            recalc = hashlib.pbkdf2_hmac("sha256", plain.encode("utf-8"), salt.encode("utf-8"), 100000).hex()
            return hmac.compare_digest(key, recalc)
        except Exception:
            return False
    return False

# --- Base64URL helper for built-in JWT fallback ---
def _b64encode(data: bytes) -> str:
    return base64.urlsafe_b64encode(data).decode("utf-8").rstrip("=")

def _b64decode(s: str) -> bytes:
    padding = "=" * ((4 - len(s) % 4) % 4)
    return base64.urlsafe_b64decode(s + padding)

# --- JWT Token Creation & Decoding ---
def create_access_token(data: dict) -> str:
    payload = data.copy()
    exp_ts = int(time.time()) + (24 * 3600)
    payload["exp"] = exp_ts

    if HAS_PYJWT:
        try:
            return pyjwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)
        except Exception:
            pass

    # Standard-library HS256 JWT implementation
    header_json = json.dumps({"alg": "HS256", "typ": "JWT"}).encode("utf-8")
    payload_json = json.dumps(payload).encode("utf-8")
    unsigned_token = f"{_b64encode(header_json)}.{_b64encode(payload_json)}"
    signature = hmac.new(SECRET_KEY.encode("utf-8"), unsigned_token.encode("utf-8"), hashlib.sha256).digest()
    return f"{unsigned_token}.{_b64encode(signature)}"

def decode_token(authorization: Optional[str] = Header(None)) -> dict:
    if not authorization:
        return {"email": "demo@audittrail.io", "role": "Logistics Manager"}

    token = authorization.replace("Bearer ", "").strip()

    if HAS_PYJWT:
        try:
            return pyjwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        except Exception:
            pass

    try:
        parts = token.split(".")
        if len(parts) != 3:
            raise ValueError("Malformed token")
        unsigned_token = f"{parts[0]}.{parts[1]}"
        signature = _b64decode(parts[2])
        expected_sig = hmac.new(SECRET_KEY.encode("utf-8"), unsigned_token.encode("utf-8"), hashlib.sha256).digest()
        if not hmac.compare_digest(signature, expected_sig):
            raise ValueError("Signature mismatch")
        payload = json.loads(_b64decode(parts[1]).decode("utf-8"))
        if "exp" in payload and int(payload["exp"]) < int(time.time()):
            raise ValueError("Token expired")
        return payload
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid or expired JWT token")
