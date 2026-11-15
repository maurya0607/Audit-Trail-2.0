from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class UserModel(BaseModel):
    name: str
    email: str
    password_hash: str
    role: str
    created_at: str
