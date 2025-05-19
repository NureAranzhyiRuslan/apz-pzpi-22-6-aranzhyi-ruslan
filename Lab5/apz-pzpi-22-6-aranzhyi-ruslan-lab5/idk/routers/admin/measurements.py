from fastapi import Query, APIRouter

from idk.dependencies import JwtAuthAdminDepN
from idk.models import Measurement
from idk.schemas.common import PaginationResponse, PaginationQuery
from idk.schemas.measurements import MeasurementInfoFull
from idk.utils.custom_exception import CustomMessageException

router = APIRouter(prefix="/measurements")


@router.get("", dependencies=[JwtAuthAdminDepN], response_model=PaginationResponse[MeasurementInfoFull])
async def get_measurements(query: PaginationQuery = Query()):
    db_query = Measurement.all().order_by("id").select_related("sensor")
    count = await db_query.count()
    measurements = await db_query.limit(query.page_size).offset(query.page_size * (query.page - 1))

    return {
        "count": count,
        "result": [
            await measurement.to_json(full=True)
            for measurement in measurements
        ]
    }


@router.get("/{measurement_id}", dependencies=[JwtAuthAdminDepN], response_model=MeasurementInfoFull)
async def get_measurement(measurement_id: int):
    if (measurement := await Measurement.get_or_none(id=measurement_id).select_related("sensor")) is None:
        raise CustomMessageException("Unknown measurement.", 404)

    return await measurement.to_json(full=True)


@router.delete("/{measurement_id}", dependencies=[JwtAuthAdminDepN], status_code=204)
async def delete_measurement(measurement_id: int):
    await Measurement.filter(id=measurement_id).delete()
