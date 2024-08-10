from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from api.models import Users, init_db
from api.routes import contests, run

app = FastAPI()
app.include_router(run.router)
app.include_router(contests.router)

init_db()

origins = [
    "http://localhost",
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/user")
def get_user(username: str) -> Users:
    user = Users(username=username)
    user.add()
    return user