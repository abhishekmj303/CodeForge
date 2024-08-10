import datetime

from sqlmodel import Field, Session, SQLModel, create_engine, select


class Users(SQLModel, table=True):
    username: str = Field(primary_key=True)

    def create(self):
        with Session(engine) as session:
            if session.get(Users, self.username):
                return
            session.add(self)
            session.commit()


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
            self.date = datetime.date.today()
            if not self.code:
                return
            session.add(self)
            session.commit()
            return self

    def get_all():
        with Session(engine) as session:
            contests = session.exec(select(Contests)).all()
            return contests

    def get_details(code: str):
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
            session.add(self)
            session.commit()

    def get_all(username: str):
        with Session(engine) as session:
            problems = session.exec(
                select(Problems, Submissions.is_solved)
                .join(Submissions, isouter=True)
                .where(Problems.contest_id is None)
            ).all()
            return problems

    def get(code: str):
        with Session(engine) as session:
            problem = session.exec(
                select(Problems).where(Problems.code == code)
            ).first()
            return problem


class TestCases(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    input: str
    output: str
    problem_id: int = Field(foreign_key="problems.id")

    def add(self):
        with Session(engine) as session:
            session.add(self)
            session.commit()


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
        rows = session.exec(statement).all()
        codes = [row[0] for row in rows]

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