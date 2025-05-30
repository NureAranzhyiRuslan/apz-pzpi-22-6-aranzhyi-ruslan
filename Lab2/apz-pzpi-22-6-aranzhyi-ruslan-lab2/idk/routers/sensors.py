from fastapi import APIRouter, Query

from idk.dependencies import JwtAuthUserDep, SensorDep
from idk.models import Sensor, City
from idk.schemas.sensors import SensorInfo, AddSensorRequest, EditSensorRequest
from idk.schemas.common import PaginationResponse, PaginationQuery
from idk.utils.custom_exception import CustomMessageException

router = APIRouter(prefix="/sensors")


@router.get("", response_model=PaginationResponse[SensorInfo])
async def get_user_sensors(user: JwtAuthUserDep, query: PaginationQuery = Query()):
    return {
        "count": await Sensor.filter(owner=user).count(),
        "result": [
            await sensor.to_json()
            for sensor in await Sensor.filter(owner=user)\
                .limit(query.page_size)\
                .offset(query.page_size * (query.page - 1))
        ],
    }


@router.post("", response_model=SensorInfo)
async def add_sensor(user: JwtAuthUserDep, data: AddSensorRequest):
    data = data.model_dump()
    query_key = "name" if isinstance(data["city"], str) else "id"
    if (city := await City.get_or_none(**{query_key: data["city"]})) is None:
        raise CustomMessageException("Unknown city.", 404)

    data["city"] = city
    sensor = await Sensor.create(owner=user, **data)

    return await sensor.to_json()


@router.get("/{sensor_id}", response_model=SensorInfo)
async def get_sensor(sensor: SensorDep):
    return await sensor.to_json()


@router.patch("/{sensor_id}", response_model=SensorInfo)
async def edit_sensor(sensor: SensorDep, data: EditSensorRequest):
    data = data.model_dump(exclude_defaults=True)
    if "city" in data:
        query_key = "name" if isinstance(data["city"], str) else "id"
        if (city := await City.get_or_none(**{query_key: data["city"]})) is None:
            raise CustomMessageException("Unknown city.", 404)

        data["city"] = city

    if update_fields := data:
        sensor.update_from_dict(update_fields)
        if "city" in data:
            await sensor.save()
        else:
            await sensor.save(update_fields=list(update_fields.keys()))

    return await sensor.to_json()


@router.delete("/{sensor_id}", status_code=204)
async def delete_sensor(sensor: SensorDep):
    sensor.owner = None
    await sensor.save()
