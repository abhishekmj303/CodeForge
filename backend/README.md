# Backend

## Setup

### Install `uv`

```bash
curl -LsSf https://astral.sh/uv/install.sh | sh
```

Relaunch terminal after installation.

### Setup virtualenv

```bash
uv sync
```

### Select python interpreter in VSCode

- `.venv` is created inside the backend folder. 

- Select the `.venv/bin/python` as the interpreter.

- Go to the bottom left corner of VSCode.

- Relaunch terminal after selecting.

## Running server

Inside backend folder, run:

```bash
fastapi dev src/api
```

## DB Schema

### problems

```
id
title
difficulty
problem_statement
constraints
owner
contest_id
```

```
id
testcases
```

```
id
username
status
```

### contensts

```
id
title
description
owner
```