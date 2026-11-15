from pydantic import BaseModel, Field
from typing import Optional

class UserRegister(BaseModel):
    name: str = Field(..., min_length=2)
    email: str = Field(..., min_length=5)
    password: str = Field(..., min_length=6)
    role: str = "Logistics Manager"

class UserLogin(BaseModel):
    email: str = Field(..., min_length=5)
    password: str

class UserResponse(BaseModel):
    name: str
    email: str
    role: str
