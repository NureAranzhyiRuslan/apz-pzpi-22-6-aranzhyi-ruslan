from __future__ import annotations

from os import urandom

from tortoise import fields, Model

from idk import models


class Sensor(Model):
    id: int = fields.BigIntField(pk=True)
    owner: models.User = fields.ForeignKeyField("models.User", null=True)
    secret_key: str = fields.CharField(max_length=32, default=lambda: urandom(16).hex())
    city: models.City = fields.ForeignKeyField("models.City")
    name: str = fields.CharField(max_length=64)

    owner_id: int

    async def to_json(self, full: bool = False) -> dict:
        to_fetch = []
        if not isinstance(self.city, models.City):
            to_fetch.append("city")
        if self.owner is not None and full:
            to_fetch.append("owner")

        if to_fetch:
            await self.fetch_related(*to_fetch)

        data = {
            "id": self.id,
            "secret_key": f"{self.owner_id or 0}:{self.id}:{self.secret_key}",
            "city": self.city.to_json(),
            "name": self.name,
        }

        if full:
            data["owner"] = self.owner.to_json() if self.owner is not None else None

        return data
