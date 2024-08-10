import datetime

from sqlmodel import Field, Session, SQLModel, create_engine


class Users(SQLModel, table=True):
    username: str = Field(primary_key=True)

    def __repr__(self):
        return self.username

    def add(self):
        with Session(engine) as session:
            if session.get(Users, self.username):
                return
            session.add(self)
            session.commit()
            session.refresh(self)


class Contests(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    title: str
    details: str
    date: datetime.date
    owner: str = Field(foreign_key="users.username")


class Problems(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    title: str
    difficulty: str
    problem_statement: str
    constraints: str
    owner: str = Field(foreign_key="users.username")
    contest_id: int = Field(foreign_key="contests.id")


class TestCases(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    input: str
    output: str
    problem_id: int = Field(foreign_key="problems.id")


sqlite_file_name = "codeforge.db"
sqlite_url = f"sqlite:///{sqlite_file_name}"

engine = create_engine(sqlite_url, echo=True)

SQLModel.metadata.create_all(engine)