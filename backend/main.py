from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import auth_router, users_router, students_router

app = FastAPI(title="Student Rating API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:8000",
        "http://localhost:3000",
        "http://localhost:63343",
        "null",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router.router)
app.include_router(users_router.router)
app.include_router(students_router.router)