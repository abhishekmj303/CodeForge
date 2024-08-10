from pydantic import BaseModel


class Error(BaseModel):
    error: str
    message: str = None

    def __init__(self, error: str, message: str = None, **kwargs):
        super().__init__(error=error, message=message, **kwargs)
