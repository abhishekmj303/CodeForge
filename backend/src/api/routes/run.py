import os
import resource
import shutil
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
    tempdir = tempfile.mkdtemp(prefix="codeforge_")
    with open(os.path.join(tempdir, f"main.{language.value}"), "w") as f:
        print(source_code)
        f.write(source_code)
        file_name = f.name
        # f.flush()

    print(file_name)
    if language == Language.PYTHON:
        command = ["/bin/python3", file_name]
    elif language == Language.C:
        command = ["/bin/gcc", file_name, "-o", f"{file_name}.out", "-lm"]
    elif language == Language.CPP:
        command = [
            "/bin/g++",
            "-I/usr/include/c++/13",
            "-I/usr/include/c++/13/x86_64-suse-linux",
            file_name,
            "-o",
            f"{file_name}.out",
        ]
    elif language == Language.JAVASCRIPT:
        command = ["/bin/node", file_name]
    else:
        return RunResponse(message="Invalid language")

    if language in COMPILED:
        result = run_command(command, input_data, tempdir)
        if result.message:
            return RunResponse(message=result.message)

        if result.timeout:
            result.message = "Time limit exceeded"
            return result
        if result.return_code != 0:
            result.message = "Compilation error"
            return result

        command = [f"{file_name}.out"]

    result = run_command(command, input_data, tempdir)
    # os.remove(file_name)
    shutil.rmtree(tempdir)

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


def run_command(command, input_string, tempdir, timeout=5, memory_limit=1000):
    def target(command, input_string):
        try:
            print(tempdir)
            nsjail_cmd = f"nsjail -Mo -q --user 99999 --group 99999 --rlimit_as {memory_limit} --time_limit {timeout} -R /bin/ -R /lib/ -R /lib64/ -R /usr/ -R /etc/alternatives/ -B {tempdir} -D {tempdir} --keep_env --".split()
            time_cmd = ["/bin/time", "-a", "-f", "%E %M", "--"]
            # time_cmd = "/bin/time -a -f %E %M --"
            # command = ' '.join(command)

            command = nsjail_cmd + time_cmd + command
            # command = time_cmd + command
            print("Command: ", command)

            # start_time = time.time()
            process = subprocess.Popen(
                command,
                stdin=subprocess.PIPE,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                text=True,
                # preexec_fn=lambda: resource.setrlimit(
                #     resource.RLIMIT_AS, (max_memory, max_memory)
                # ),
            )

            stdout, stderr = process.communicate(input=input_string, timeout=timeout)
            # end_time = time.time()
            split_stderr = stderr.splitlines()
            if len(split_stderr) > 1:
                stderr, time_output = "\n".join(split_stderr[:-1]), split_stderr[-1]
            else:
                stderr, time_output = "", stderr

            # Elapsed real time (in [hours:]minutes:seconds).
            # Maximum resident set size of the process during its lifetime, in Kilobytes.

            print("Stdout: ", stdout)
            print("Stderr: ", stderr)
            print("Time output: ", time_output)
            elapsed_time, memory_usage = time_output.split()
            elapsed_time = time_to_seconds(elapsed_time)
            memory_usage = int(memory_usage)

            # elapsed_time = end_time - start_time
            # memory_usage = resource.getrusage(resource.RUSAGE_CHILDREN).ru_maxrss

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

    # max_memory = memory_limit * 1024 * 1024  # in MB
    result = RunResponse(message="")

    thread = threading.Thread(target=target, args=(command, input_string))
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