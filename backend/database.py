import os
from pathlib import Path
from urllib.parse import urlparse

import pymongo


def _load_env_file() -> None:
    """Fill os.environ from a local .env file without overriding real variables."""
    if os.environ.get("MONGODB_URI"):
        return

    candidates = [
        Path.cwd() / ".env",
        Path(__file__).resolve().parent.parent / ".env",
    ]
    for path in candidates:
        if not path.is_file():
            continue
        for raw_line in path.read_text(encoding="utf-8").splitlines():
            line = raw_line.strip()
            if not line or line.startswith("#") or "=" not in line:
                continue
            key, value = line.split("=", 1)
            key = key.strip()
            value = value.strip().strip('"').strip("'")
            if key:
                os.environ.setdefault(key, value)
        return


def _database_name(uri: str) -> str:
    path = urlparse(uri).path.lstrip("/")
    name = path.split("/")[0] if path else ""
    return name or "db"


_load_env_file()

mongodb_uri = os.environ.get("MONGODB_URI")
if not mongodb_uri:
    raise RuntimeError(
        "MONGODB_URI is not set. Copy .env.example to .env and set a MongoDB connection string."
    )

db_client = pymongo.MongoClient(mongodb_uri)
database = db_client[_database_name(mongodb_uri)]
