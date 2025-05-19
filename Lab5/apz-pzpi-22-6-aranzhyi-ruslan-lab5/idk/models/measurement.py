from __future__ import annotations

from datetime import datetime

from tortoise import fields, Model

from idk import models


class Measurement(Model):
    id: int = fields.BigIntField(pk=True)
    sensor: models.Sensor = fields.ForeignKeyField("models.Sensor")
    temperature: float = fields.FloatField()
    pressure: float = fields.FloatField()
    time: datetime = fields.DatetimeField(auto_now_add=True)

    async def to_json(self, full: bool = False) -> dict:
        data = {
            "temperature": self.temperature,
            "pressure": self.pressure,
            "timestamp": int(self.time.timestamp()),
        }

        if full:
            data["id"] = self.id
            self.sensor = await self.sensor
            data["sensor"] = await self.sensor.to_json(full=True)

        return data
