from fastapi import APIRouter, HTTPException, status
from database import get_connection
from models import RegisterRequest, LoginRequest
from auth import hash_password, verify_password, create_token

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register", status_code=status.HTTP_201_CREATED)
def register(body: RegisterRequest):
    with get_connection() as conn:
        with conn.cursor() as cur:
            cur.execute("SELECT id FROM users WHERE username = %s", (body.username,))
            if cur.fetchone():
                raise HTTPException(status_code=400, detail="Username already taken")

            hashed = hash_password(body.password)
            cur.execute(
                "INSERT INTO users (username, password_hash, role) VALUES (%s, %s, %s) RETURNING id, username, role",
                (body.username, hashed, body.role),
            )
            user = cur.fetchone()
            conn.commit()

    return {"id": user["id"], "username": user["username"], "role": user["role"]}


@router.post("/login")
def login(body: LoginRequest):
    with get_connection() as conn:
        with conn.cursor() as cur:
            cur.execute("SELECT * FROM users WHERE username = %s", (body.username,))
            user = cur.fetchone()

    if not user or not verify_password(body.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_token({"sub": str(user["id"]), "username": user["username"], "role": user["role"]})
    return {"access_token": token, "token_type": "bearer"}