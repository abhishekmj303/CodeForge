import resource
import subprocess
import tempfile
import threading
import time
import traceback
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


class RunRequest(BaseModel):
    source_code: str
    input_data: str | None = None
    language: Language
    username: str | None = None


class RunResponse(BaseModel):
    stdout: str = ""
    stderr: str = ""
    return_code: int | None = None
    elapsed_time: float | None = None
    memory_usage: float | None = None
    timeout: bool = False
    test_passed: bool = False
    message: str


@router.post("/")
def run_code(request_data: RunRequest) -> RunResponse:
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
            command = ["/bin/python3", f.name]
        elif language == Language.C:
            command = ["/bin/gcc", f.name, "-o", f"{f.name}.out", "-lm"]
        elif language == Language.CPP:
            command = ["/bin/g++", f.name, "-o", f"{f.name}.out"]
        elif language == Language.JAVASCRIPT:
            command = ["/bin/node", f.name]
        else:
            return RunResponse(message="Invalid language")

        if language in COMPILED:
            result = run_command(command, input_data, timeout=5, memory_limit=100)
            if result.message:
                return RunResponse(message=result.message)

            if result.timeout:
                result.message = "Time limit exceeded"
                return result
            if result.return_code != 0:
                result.message = "Compilation error"
                return result

            command = [f"{f.name}.out"]

        result = run_command(command, input_data, timeout=5, memory_limit=100)
        if result.message:
            return RunResponse(message=result.message)

    if result.timeout:
        result.message = "Time limit exceeded"
    elif result.return_code != 0:
        result.message = "Runtime error"
    elif result.return_code is None:
        result.message = "Server error"
    else:
        result.message = "Success"
    return result


def run_command(command, input_string, timeout=5, memory_limit=100):
    def target():
        try:
            # if input_string and input_string[-1] != "\n":
            #     input_string += "\n"
            nsjail_cmd = f"nsjail -Mo -q --user 99999 --group 99999 --rlimit_as {memory_limit} --time_limit {timeout} -R /bin/ -R /lib -R /lib64/ -R /usr/ -R /tmp --".split()
            # nsjail_cmd.extend(["/bin/time", "-a", "-f", "'%E %M'", "--"])

            start_time = time.time()
            process = subprocess.Popen(
                nsjail_cmd + command,
                stdin=subprocess.PIPE,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                text=True,
                shell=True,
                preexec_fn=lambda: resource.setrlimit(
                    resource.RLIMIT_AS, (max_memory, max_memory)
                ),
            )

            stdout, stderr = process.communicate(input=input_string, timeout=timeout)
            end_time = time.time()
            # if len(stdout.splitlines()) > 1:
            #     stdout, time_output = stdout.rsplit("\n", 1)
            # else:
            #     stdout, time_output = "", stdout

            # Elapsed real time (in [hours:]minutes:seconds).
            # Maximum resident set size of the process during its lifetime, in Kilobytes.

            print("Stdout: ", stdout)
            # print("Time output: ", time_output)
            # elapsed_time, memory_usage = time_output.split()
            # elapsed_time = time_to_seconds(elapsed_time)
            # memory_usage = int(memory_usage)

            elapsed_time = end_time - start_time
            memory_usage = resource.getrusage(resource.RUSAGE_CHILDREN).ru_maxrss

            if process.returncode == 137:
                result.timeout = True

            result.stdout = stdout
            result.stderr = stderr
            result.return_code = process.returncode
            result.elapsed_time = round(elapsed_time, 3)
            result.memory_usage = round(memory_usage / 1024, 3)  # in MB
        except subprocess.TimeoutExpired:
            process.kill()
            result.timeout = True
        except Exception as e:
            traceback.print_exc()
            result.message = str(e)

    max_memory = memory_limit * 1024 * 1024  # in MB
    result = RunResponse(message="")

    thread = threading.Thread(target=target)
    thread.start()
    thread.join(timeout)

    if thread.is_alive():
        result.timeout = True
        thread.join()  # Make sure thread finishes

    return result


def time_to_seconds(time_str):
    parts = time_str.split(":")

    seconds = 0

    # Handle hours if present
    if len(parts) == 3:
        seconds += int(parts[0]) * 3600  # hours to seconds
        parts = parts[1:]  # remove hours part

    # Handle minutes
    seconds += int(parts[0]) * 60  # minutes to seconds

    # Handle seconds and milliseconds
    if "." in parts[1]:
        secs, msecs = parts[1].split(".")
        seconds += int(secs)
        seconds += int(msecs) / 100  # milliseconds to seconds
    else:
        seconds += int(parts[1])

    return seconds