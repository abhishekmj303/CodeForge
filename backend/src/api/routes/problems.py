from fastapi import APIRouter, Response
from pydantic import BaseModel

from api.models import Problems
from api.routes import Error

router = APIRouter(prefix="/problems")


class ProblemPost(BaseModel):
    title: str
    difficulty: str
    problem_statement: str
    constraints: str
    testcases: list[dict[str, str]]
    owner: str


class ProblemInfo(BaseModel):
    code: str
    title: str
    difficulty: str
    is_solved: bool


@router.post("/")
def add_problem(problem: ProblemPost, response: Response) -> Problems | Error:
    new_problem = Problems(
        title=problem.title,
        difficulty=problem.difficulty,
        problem_statement=problem.problem_statement,
        constraints=problem.constraints,
        owner=problem.owner,
    )
    if not new_problem.add():
        response.status_code = 400
        return Error(
            "Cannot add problem",
            "Invalid title: Only use alphanumeric characters and spaces, or try a different title.",
        )
    try:
        new_problem.add_testcases(problem.testcases)
    except KeyError:
        response.status_code = 400
        return Error(
            "Cannot add testcases to problem",
            "Invalid testcases: Each testcase must have 'input' and 'output' keys.",
        )

    return new_problem


@router.get("/")
def get_all_problems(username: str) -> list[ProblemInfo]:
    problems = Problems.get_all(username)
    problems_info = []
    for problem in problems:
        problems_info.append(
            ProblemInfo(
                code=problem.code,
                title=problem.title,
                difficulty=problem.difficulty,
                is_solved=problem.is_solved,
            )
        )
    return problems_info


@router.get("/{problem_code}")
def get_problem(problem_code: str, response: Response) -> Problems | Error:
    problem = Problems.get(problem_code)
    if not problem:
        response.status_code = 404
        return Error("Problem not found", "Invalid problem code.")
    return problem