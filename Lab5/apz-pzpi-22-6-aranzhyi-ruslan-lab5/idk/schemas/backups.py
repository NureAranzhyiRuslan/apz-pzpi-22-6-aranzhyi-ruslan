from pydantic import BaseModel


class BackupInfo(BaseModel):
    name: str
    date: int
    size: int
