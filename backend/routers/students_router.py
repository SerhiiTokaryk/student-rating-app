from fastapi import APIRouter, HTTPException, Depends, status
from database import get_connection
from models import StudentCreateRequest, StudentUpdateRequest
from auth import get_current_user, require_admin

router = APIRouter(prefix="/students", tags=["students"])


@router.get("/")
def list_students(current_user: dict = Depends(get_current_user)):
    with get_connection() as conn:
        with conn.cursor() as cur:
            cur.execute("SELECT * FROM students ORDER BY rating_score DESC")
            students = cur.fetchall()
    return [dict(s) for s in students]


@router.get("/top")
def top_students(limit: int = 10, current_user: dict = Depends(get_current_user)):
    with get_connection() as conn:
        with conn.cursor() as cur:
            cur.execute("SELECT * FROM students ORDER BY rating_score DESC LIMIT %s", (limit,))
            students = cur.fetchall()
    return [dict(s) for s in students]


@router.get("/{student_id}")
def get_student(student_id: int, current_user: dict = Depends(get_current_user)):
    with get_connection() as conn:
        with conn.cursor() as cur:
            cur.execute("SELECT * FROM students WHERE id = %s", (student_id,))
            student = cur.fetchone()

    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    return dict(student)


@router.post("/", status_code=status.HTTP_201_CREATED)
def create_student(body: StudentCreateRequest, _: dict = Depends(require_admin)):
    with get_connection() as conn:
        with conn.cursor() as cur:
            cur.execute(
                "INSERT INTO students (full_name, group_name, rating_score) VALUES (%s, %s, %s) RETURNING *",
                (body.full_name, body.group_name, body.rating_score),
            )
            student = cur.fetchone()
            conn.commit()
    return dict(student)


@router.put("/{student_id}")
def update_student(student_id: int, body: StudentUpdateRequest, _: dict = Depends(require_admin)):
    fields = []
    values = []

    if body.full_name is not None:
        fields.append("full_name = %s")
        values.append(body.full_name)
    if body.group_name is not None:
        fields.append("group_name = %s")
        values.append(body.group_name)
    if body.rating_score is not None:
        fields.append("rating_score = %s")
        values.append(body.rating_score)

    if not fields:
        raise HTTPException(status_code=400, detail="No fields to update")

    values.append(student_id)
    query = f"UPDATE students SET {', '.join(fields)} WHERE id = %s RETURNING *"

    with get_connection() as conn:
        with conn.cursor() as cur:
            cur.execute(query, values)
            student = cur.fetchone()
            conn.commit()

    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    return dict(student)


@router.delete("/{student_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_student(student_id: int, _: dict = Depends(require_admin)):
    with get_connection() as conn:
        with conn.cursor() as cur:
            cur.execute("DELETE FROM students WHERE id = %s RETURNING id", (student_id,))
            deleted = cur.fetchone()
            conn.commit()

    if not deleted:
        raise HTTPException(status_code=404, detail="Student not found")