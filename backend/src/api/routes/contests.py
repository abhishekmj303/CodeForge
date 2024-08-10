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


@router.get("/{contest_code}/leaderboard")
def get_contest_leaderboard(contest_code: str, response: Response) -> list[dict] | Error:
    contest = Contests.get(contest_code)
    if not contest:
        response.status_code = 404
        return Error("Contest not found", "Invalid contest code.")
    
    leaderboard = Contests.get_leaderboard(contest.id)
    if not leaderboard:
        response.status_code = 404
        return Error("Leaderboard not found", "No submissions found for this contest.")

    return [
        {
            "username": entry.username,
            "solved_problems": entry.solved_problems,
            "total_time": entry.total_time
        }
        for entry in leaderboard
    ]