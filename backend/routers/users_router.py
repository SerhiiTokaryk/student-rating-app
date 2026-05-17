from fastapi import APIRouter, HTTPException, Depends, status
from database import get_connection
from models import UserUpdateRequest
from auth import get_current_user, require_admin, hash_password

router = APIRouter(prefix="/users", tags=["users"])


@router.get("/")
def list_users(current_user: dict = Depends(get_current_user)):
    with get_connection() as conn:
        with conn.cursor() as cur:
            cur.execute("SELECT id, username, role FROM users ORDER BY id")
            users = cur.fetchall()
    return [dict(u) for u in users]


@router.get("/{user_id}")
def get_user(user_id: int, current_user: dict = Depends(get_current_user)):
    with get_connection() as conn:
        with conn.cursor() as cur:
            cur.execute("SELECT id, username, role FROM users WHERE id = %s", (user_id,))
            user = cur.fetchone()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return dict(user)


@router.put("/{user_id}")
def update_user(user_id: int, body: UserUpdateRequest, _: dict = Depends(require_admin)):
    fields = []
    values = []

    if body.username is not None:
        fields.append("username = %s")
        values.append(body.username)
    if body.password is not None:
        fields.append("password_hash = %s")
        values.append(hash_password(body.password))
    if body.role is not None:
        fields.append("role = %s")
        values.append(body.role)

    if not fields:
        raise HTTPException(status_code=400, detail="No fields to update")

    values.append(user_id)
    query = f"UPDATE users SET {', '.join(fields)} WHERE id = %s RETURNING id, username, role"

    with get_connection() as conn:
        with conn.cursor() as cur:
            cur.execute(query, values)
            user = cur.fetchone()
            conn.commit()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return dict(user)


@router.delete("/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_user(user_id: int, _: dict = Depends(require_admin)):
    with get_connection() as conn:
        with conn.cursor() as cur:
            cur.execute("DELETE FROM users WHERE id = %s RETURNING id", (user_id,))
            deleted = cur.fetchone()
            conn.commit()

    if not deleted:
        raise HTTPException(status_code=404, detail="User not found")