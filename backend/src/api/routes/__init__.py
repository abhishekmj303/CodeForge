from pydantic import BaseModel


class ProblemDetails(BaseModel):
    title: str
    difficulty: str
    problem_statement: str
    constraints: str
    testcases: list[dict[str, str]]
    owner: str


class ProblemList(BaseModel):
    code: str
    title: str
    difficulty: str
    is_solved: bool


class Error(BaseModel):
    error: str
    message: str | None = None

    def __init__(self, error: str, message: str | None = None, **kwargs):
        super().__init__(error=error, message=message, **kwargs)
