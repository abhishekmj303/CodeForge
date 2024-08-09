import resource
import subprocess
import tempfile
import threading
import time
from enum import Enum

from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter(prefix="/run")


class Language(Enum):
    PYTHON = "py"
    C = "c"
    CPP = "cpp"
    JAVASCRIPT = "js"


COMPILED = {Language.C, Language.CPP}


class RequestData(BaseModel):
    source_code: str
    input_data: str
    language: Language


class ResponseData(BaseModel):
    stdout: str = ""
    stderr: str = ""
    return_code: int | None = None
    elapsed_time: float | None = None
    memory_usage: float | None = None
    timeout: bool = False
    message: str


@router.post("/")
def run(request_data: RequestData):
    source_code = request_data.source_code
    input_data = request_data.input_data
    language = request_data.language

    # save tmp file
    with tempfile.NamedTemporaryFile(
        mode="w", prefix="codeforge_", suffix=f".{language.value}"
    ) as f:
        f.write(source_code)
        f.flush()

        if language == Language.PYTHON:
            command = ["python3", f.name]
        elif language == Language.C:
            command = ["gcc", f.name, "-o", f"{f.name}.out", "-lm"]
        elif language == Language.CPP:
            command = ["g++", f.name, "-o", f"{f.name}.out"]
        elif language == Language.JAVASCRIPT:
            command = ["node", f.name]
        else:
            return ResponseData(message="Invalid language")

        if language in COMPILED:
            result = run_command(command, input_data, timeout=5, memory_limit=100)
            if result.message:
                return ResponseData(message=result.message)

            if result.timeout:
                result.message = "Time limit exceeded"
                return result
            if result.return_code != 0:
                result.message = "Compilation error"
                return result

            command = [f"{f.name}.out"]

        result = run_command(command, input_data, timeout=5, memory_limit=100)
        if result.message:
            return ResponseData(message=result.message)

    return result


def run_command(command, input_string, timeout=5, memory_limit=100):
    def target():
        try:
            process = subprocess.Popen(
                command,
                stdin=subprocess.PIPE,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                text=True,
                preexec_fn=lambda: resource.setrlimit(
                    resource.RLIMIT_AS, (max_memory, max_memory)
                ),
            )

            start_time = time.time()
            stdout, stderr = process.communicate(input=input_string, timeout=timeout)
            end_time = time.time()

            elapsed_time = end_time - start_time
            memory_usage = resource.getrusage(resource.RUSAGE_CHILDREN).ru_maxrss

            return_code = process.returncode

            result.stdout = stdout
            result.stderr = stderr
            result.return_code = return_code
            result.elapsed_time = round(elapsed_time, 3)
            result.memory_usage = round(memory_usage / 1024**2, 3)  # in MB
        except subprocess.TimeoutExpired:
            process.kill()
            result.timeout = True
        except Exception as e:
            result.message = str(e)

    max_memory = memory_limit * 1024 * 1024  # in MB
    result = ResponseData(message="")

    thread = threading.Thread(target=target)
    thread.start()
    thread.join(timeout)

    if thread.is_alive():
        result.timeout = True
        thread.join()  # Make sure thread finishes

    return result
