from fastapi import APIRouter, Response

from api.models import Contests
from api.routes import Error

router = APIRouter(prefix="/contests")


@router.get("/")
def get_all_contests() -> list[Contests]:
    return Contests.get_all()


@router.post("/")
def add_contest(contest: Contests, response: Response) -> Contests | Error:
    if not contest.add():
        response.status_code = 400
        return Error(
            "Cannot add contest",
            "Invalid title: Only use alphanumeric characters and spaces, or try a different title.",
        )
    return contest



@router.get("/{contest_code}")
def get_contest(contest_code: str, response: Response) -> Contests | Error:
    contest = Contests.get(contest_code)
    if not contest:
        response.status_code = 404
        return Error("Contest not found", "Invalid contest code.")
    return contest


@router.get("/{contest_code}/problems")
def get_contest_problems(
    contest_code: str, response: Response
) -> list[Contests] | Error:
    contest = Contests.get(contest_code)
    if not contest:
        response.status_code = 404
        return Error("Contest not found", "Invalid contest code.")
    return contest.problems
