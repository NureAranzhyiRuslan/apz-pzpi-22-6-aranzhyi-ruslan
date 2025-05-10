from pydantic import BaseModel

from idk.schemas.sensors import SensorInfoFull


class AddMeasurementRequest(BaseModel):
    temperature: float
    pressure: float


class MeasurementInfo(BaseModel):
    temperature: float
    pressure: float
    timestamp: int


class MeasurementInfoFull(MeasurementInfo):
    id: int
    sensor: SensorInfoFull
