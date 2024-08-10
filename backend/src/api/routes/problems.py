from fastapi import APIRouter, Response

from api.models import Problems, TestCases
from api.routes import Error, ProblemDetails, ProblemList
from api.routes.run import RunRequest, RunResponse, run_command

router = APIRouter(prefix="/problems")


@router.post("/")
def add_problem(problem: ProblemDetails, response: Response) -> Problems | Error:
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
def get_all_problems(username: str) -> list[ProblemList]:
    problems = Problems.get_all(username)
    problems_info = []
    for problem, is_solved in problems:
        if is_solved is None:
            is_solved = False
        problems_info.append(
            ProblemList(
                code=problem.code,
                title=problem.title,
                difficulty=problem.difficulty,
                is_solved=is_solved,
            )
        )
    return problems_info


@router.get("/{problem_code}")
def get_problem(problem_code: str, response: Response) -> ProblemDetails | Error:
    problem = Problems.get(problem_code)
    if not problem:
        response.status_code = 404
        return Error("Problem not found", "Invalid problem code.")
    testcases = TestCases.get(problem.id)
    return ProblemDetails(
        title=problem.title,
        difficulty=problem.difficulty,
        problem_statement=problem.problem_statement,
        constraints=problem.constraints,
        testcases=[{"input": t.input, "output": t.output} for t in testcases],
        owner=problem.owner,
    )


@router.post("/{problem_code}/submit")
def submit_problem(run_req: RunRequest, response: Response) -> RunResponse:
    if run_req.username is None:
        response.status_code = 403
        return Error(
            "Forbidden",
            "You can't submit the solution, please login.",
        )
