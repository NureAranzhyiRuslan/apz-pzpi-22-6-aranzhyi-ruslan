from fastapi import Query, APIRouter

from idk.dependencies import JwtAuthAdminDepN
from idk.models import Sensor, Measurement, City
from idk.schemas.common import PaginationResponse, PaginationQuery
from idk.schemas.measurements import MeasurementInfo
from idk.schemas.sensors import SensorInfo, EditSensorRequest, SensorInfoFull
from idk.utils.custom_exception import CustomMessageException

router = APIRouter(prefix="/sensors")


@router.get("", dependencies=[JwtAuthAdminDepN], response_model=PaginationResponse[SensorInfoFull])
async def get_sensors(query: PaginationQuery = Query()):
    db_query = Sensor.all().order_by("id")
    count = await db_query.count()
    sensors = await db_query.limit(query.page_size).offset(query.page_size * (query.page - 1))

    return {
        "count": count,
        "result": [
            await sensor.to_json(full=True)
            for sensor in sensors
        ]
    }


@router.get("/{sensor_id}", dependencies=[JwtAuthAdminDepN], response_model=SensorInfoFull)
async def get_sensor(sensor_id: int):
    if (sensor := await Sensor.get_or_none(id=sensor_id)) is None:
        raise CustomMessageException("Unknown sensor.", 404)

    return await sensor.to_json(full=True)


@router.patch("/{sensor_id}", dependencies=[JwtAuthAdminDepN], response_model=SensorInfoFull)
async def update_sensor(sensor_id: int, data: EditSensorRequest):
    if (sensor := await Sensor.get_or_none(id=sensor_id)) is None:
        raise CustomMessageException("Unknown sensor.", 404)

    data = data.model_dump(exclude_defaults=True)
    if "city" in data:
        query_key = "name" if isinstance(data["city"], str) else "id"
        if (city := await City.get_or_none(**{query_key: data["city"]})) is None:
            raise CustomMessageException("Unknown city.", 404)

        data["city"] = city

    if update_fields := data:
        await sensor.update_from_dict(update_fields).save()

    return await sensor.to_json(full=True)


@router.delete("/{sensor_id}", dependencies=[JwtAuthAdminDepN], status_code=204)
async def delete_sensor(sensor_id: int):
    await Sensor.filter(id=sensor_id).delete()


@router.get("/{sensor_id}/measurements", dependencies=[JwtAuthAdminDepN], response_model=PaginationResponse[MeasurementInfo])
async def get_sensor_measurements(sensor_id: int, query: PaginationQuery = Query()):
    if (sensor := await Sensor.get_or_none(id=sensor_id)) is None:
        raise CustomMessageException("Unknown sensor.", 404)

    db_query = Measurement.filter(sensor=sensor).order_by("id")
    count = await db_query.count()
    measurements = await db_query.limit(query.page_size).offset(query.page_size * (query.page - 1))

    return {
        "count": count,
        "result": [
            await measurement.to_json()
            for measurement in measurements
        ]
    }
