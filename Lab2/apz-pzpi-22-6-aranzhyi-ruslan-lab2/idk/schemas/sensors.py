from pydantic import BaseModel

from idk.schemas.cities import CityInfoResponse
from idk.schemas.user import UserInfoResponse


class AddSensorRequest(BaseModel):
    city: int | str
    name: str


class SensorInfo(BaseModel):
    id: int
    secret_key: str
    city: CityInfoResponse
    name: str


class EditSensorRequest(AddSensorRequest):
    city: str | int | None = None
    name: str | None = None


class SensorInfoFull(SensorInfo):
    owner: UserInfoResponse | None
