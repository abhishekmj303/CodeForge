import datetime

from sqlmodel import Field, Session, SQLModel, create_engine, func, select


class Users(SQLModel, table=True):
    username: str = Field(primary_key=True)

    def create(self):
        with Session(engine) as session:
            if session.get(Users, self.username):
                return
            session.add(self)
            session.commit()
            session.refresh(self)


class Contests(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    code: str | None = Field(default=None, unique=True, nullable=False, index=True)
    title: str
    details: str
    date: datetime.date | None = Field(default=None, nullable=False)
    owner: str = Field(foreign_key="users.username")

    def add(self):
        with Session(engine) as session:
            self.code = generate_code(self.title, Contests)
            if not self.code:
                return
            self.date = datetime.date.today()
            session.add(self)
            session.commit()
            session.refresh(self)
            return self

    def get_all():
        with Session(engine) as session:
            contests = session.exec(select(Contests)).all()
            return contests

    def get(code: str):
        with Session(engine) as session:
            contest = session.exec(
                select(Contests).where(Contests.code == code)
            ).first()
            return contest

    def get_problems(code: str):
        with Session(engine) as session:
            problems = session.exec(
                select(Problems).where(Problems.contest_id == code)
            ).all()
            return problems
        
    def get_leaderboard(id: int):
        with Session(engine) as session:
            statement = (
                select(
                    Submissions.username,
                    func.count(Submissions.is_solved).label("solved_problems"),
                    func.sum(Submissions.elapsed_time).label("total_time")
                )
                .where(Submissions.contest_id == id, Submissions.is_solved == True)
                .group_by(Submissions.username)
                .order_by(
                    func.count(Submissions.is_solved).desc(),
                    func.sum(Submissions.elapsed_time)
                )
            )
            leaderboard = session.exec(statement).all()
            return leaderboard


class Problems(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    code: str | None = Field(default=None, unique=True, nullable=False, index=True)
    title: str
    difficulty: str
    problem_statement: str
    constraints: str
    owner: str = Field(foreign_key="users.username")
    contest_id: int | None = Field(foreign_key="contests.id")

    def __repr__(self):
        return f"{self.code}: {self.title} - {self.difficulty} by {self.owner}"

    def add(self):
        with Session(engine) as session:
            self.code = generate_code(self.title, Problems)
            if not self.code:
                return
            session.add(self)
            session.commit()
            session.refresh(self)
            return self

    def get_all(username: str):
        with Session(engine) as session:
            problems = session.exec(
                select(Problems, Submissions.is_solved)
                .join(Submissions, isouter=True)
                .where(Problems.contest_id.is_(None))
            ).all()
            return problems

    def get(code: str):
        with Session(engine) as session:
            problem = session.exec(
                select(Problems).where(Problems.code == code)
            ).first()
            return problem

    def add_testcases(self, testcases: list[dict[str, str]]):
        for testcase in testcases:
            TestCases(
                input=testcase["input"],
                output=testcase["output"],
                problem_id=self.id,
            ).add()


class TestCases(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    input: str
    output: str
    problem_id: int = Field(foreign_key="problems.id")

    def add(self):
        with Session(engine) as session:
            session.add(self)
            session.commit()
            session.refresh(self)

    def get(problem_id: int):
        with Session(engine) as session:
            testcases = session.exec(
                select(TestCases.input, TestCases.output).where(
                    TestCases.problem_id == problem_id
                )
            ).all()
            return testcases


class Submissions(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    problem_id: int = Field(foreign_key="problems.id")
    contest_id: int | None = Field(foreign_key="contests.id")
    username: str = Field(foreign_key="users.username")
    is_solved: bool = False
    elapsed_time: float
    memory_used: float


def generate_code(string: str, table: SQLModel) -> str | None:
    if not string.replace(" -", "").isalnum():
        return None
    string = string.lower().replace(" ", "-")
    if len(string) > 25:
        string = string[:25]

    statement = select(table.code)
    with Session(engine) as session:
        codes = session.exec(statement).all()

    if string not in codes:
        return string
    else:
        for i in range(1, 100):
            if f"{string}-{i}" not in codes:
                return f"{string}-{i}"


def init_db():
    global engine
    sqlite_file_name = "codeforge.db"
    sqlite_url = f"sqlite:///{sqlite_file_name}"

    engine = create_engine(sqlite_url, echo=True)

    SQLModel.metadata.create_all(engine)