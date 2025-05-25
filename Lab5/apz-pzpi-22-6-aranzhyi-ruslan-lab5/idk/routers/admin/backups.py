import os
from pathlib import Path

from aiodocker import Docker, DockerError
from fastapi import APIRouter
from fastapi.responses import Response
from starlette.responses import FileResponse

from idk.config import BACKUPS_DIR, DOCKER_SOCKET, BACKUP_CONTAINER_NAME
from idk.dependencies import JwtAuthAdminDepN
from idk.schemas.backups import BackupInfo
from idk.utils.custom_exception import CustomMessageException

router = APIRouter(prefix="/backups")


@router.get("", dependencies=[JwtAuthAdminDepN], response_model=list[BackupInfo])
async def get_backups():
    backups_dir = Path(BACKUPS_DIR)
    if not backups_dir.exists():
        return []

    result = []
    for backup_name in os.listdir(backups_dir):
        stat = os.stat(backups_dir / backup_name)
        result.append({
            "name": backup_name,
            "date": int(stat.st_ctime),
            "size": int(stat.st_size),
        })

    result.sort(key=lambda el: el["date"], reverse=True)

    return result


@router.get("/{backup_name}", dependencies=[JwtAuthAdminDepN])
async def download_backup(backup_name: str):
    backups_dir = Path(BACKUPS_DIR)
    if not backups_dir.exists() or "/" in backup_name:
        return Response(content=b"", status_code=404)

    backup_file = backups_dir / backup_name
    return FileResponse(backup_file)


@router.post("", dependencies=[JwtAuthAdminDepN], status_code=204)
async def create_backup():
    docker = Docker(url=f"unix://{DOCKER_SOCKET}")

    try:
        container = await docker.containers.get(BACKUP_CONTAINER_NAME)
        command = await container.exec(["/mysql-backup", "dump", "--once"])
        stream = command.start()
        while await stream.read_out() is not None:
            ...
    except DockerError as e:
        raise CustomMessageException(f"Failed to create backup: {e.message}")


@router.delete("/{backup_name}", dependencies=[JwtAuthAdminDepN], status_code=204)
async def delete_backup(backup_name: str):
    backups_dir = Path(BACKUPS_DIR)
    if not backups_dir.exists() or "/" in backup_name:
        return Response(content=b"", status_code=404)

    backup_file = backups_dir / backup_name
    backup_file.unlink(missing_ok=True)
