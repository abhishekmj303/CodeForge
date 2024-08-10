from fastapi import APIRouter, Response

from api.models import Problems
from api.routes import Error

router = APIRouter(prefix="/problems")


@router.post("/")
def add_problem(problem: Problems, response: Response) -> Problems | Error:
    if not problem.add():
        response.status_code = 400
        return Error(
            "Cannot add problem",
            "Invalid title: Only use alphanumeric characters and spaces, or try a different title.",
        )
    return problem


@router.get("/")
def get_all_problems() -> list[Problems]:
    return Problems.get_all()


@router.get("/{problem_code}")
def get_problem(problem_code: str, response: Response) -> Problems | Error:
    problem = Problems.get(problem_code)
    if not problem:
        response.status_code = 404
        return Error("Problem not found", "Invalid problem code.")
    return problem