from pydantic import BaseModel
from typing import Optional


class RegisterRequest(BaseModel):
    username: str
    password: str
    role: Optional[str] = "regular"


class LoginRequest(BaseModel):
    username: str
    password: str


class UserUpdateRequest(BaseModel):
    username: Optional[str] = None
    password: Optional[str] = None
    role: Optional[str] = None


class StudentCreateRequest(BaseModel):
    full_name: str
    group_name: str
    rating_score: Optional[float] = 0.0


class StudentUpdateRequest(BaseModel):
    full_name: Optional[str] = None
    group_name: Optional[str] = None
    rating_score: Optional[float] = None