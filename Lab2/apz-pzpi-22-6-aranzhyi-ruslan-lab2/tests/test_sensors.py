import pytest
from httpx import AsyncClient

from idk.models import City, Session, Sensor
from .conftest import create_token, create_user


@pytest.mark.asyncio
async def test_create_sensor(client: AsyncClient):
    token = await create_token()
    city = await City.create(name="test", latitude=42.24, longitude=24.42)

    response = await client.get("/sensors", headers={"authorization": token})
    assert response.status_code == 200, response.json()
    assert response.json()["count"] == 0

    response = await client.post("/sensors", headers={"authorization": token}, json={
        "city": city.id,
        "name": "test",
    })
    assert response.status_code == 200, response.json()
    assert response.json()["city"]["id"] == city.id
    assert response.json()["name"] == "test"

    response = await client.get("/sensors", headers={"authorization": token})
    assert response.status_code == 200, response.json()
    assert response.json()["count"] == 1
    assert response.json()["result"][0]["city"]["id"] == city.id
    assert response.json()["result"][0]["name"] == "test"


@pytest.mark.asyncio
async def test_get_sensor(client: AsyncClient):
    user = await create_user()
    token = (await Session.create(user=user)).to_jwt()
    city = await City.create(name="test", latitude=42.24, longitude=24.42)
    sensor = await Sensor.create(owner=user, city=city, name="test123")

    response = await client.get(f"/sensors/{sensor.id}", headers={"authorization": token})
    assert response.status_code == 200, response.json()
    assert response.json() == await sensor.to_json()


@pytest.mark.asyncio
async def test_edit_sensor(client: AsyncClient):
    user = await create_user()
    token = (await Session.create(user=user)).to_jwt()
    city = await City.create(name="test", latitude=42.24, longitude=24.42)
    city2 = await City.create(name="test2", latitude=42.24, longitude=24.42)
    sensor = await Sensor.create(owner=user, city=city, name="test123")

    response = await client.patch(f"/sensors/{sensor.id}", headers={"authorization": token}, json={
        "name": "new_name1",
    })
    assert response.status_code == 200, response.json()

    response = await client.patch(f"/sensors/{sensor.id}", headers={"authorization": token}, json={
        "name": "new_name",
        "city": "test2",
    })
    assert response.status_code == 200, response.json()
    assert response.json()["name"] == "new_name"
    assert response.json()["city"]["id"] == city2.id

    response = await client.get(f"/sensors/{sensor.id}", headers={"authorization": token})
    assert response.status_code == 200, response.json()
    assert response.json()["name"] == "new_name"


@pytest.mark.asyncio
async def test_delete_sensor(client: AsyncClient):
    user = await create_user()
    token = (await Session.create(user=user)).to_jwt()
    city = await City.create(name="test", latitude=42.24, longitude=24.42)
    sensor = await Sensor.create(owner=user, city=city, name="test123")

    response = await client.delete(f"/sensors/{sensor.id}", headers={"authorization": token})
    assert response.status_code == 204

    response = await client.get(f"/sensors/{sensor.id}", headers={"authorization": token})
    assert response.status_code == 404, response.json()


@pytest.mark.asyncio
async def test_create_sensor_unknown_city(client: AsyncClient):
    token = await create_token()

    response = await client.post("/sensors", headers={"authorization": token}, json={
        "city": "test123",
        "name": "test",
    })
    assert response.status_code == 404, response.json()


@pytest.mark.asyncio
async def test_edit_sensor_unknown_city(client: AsyncClient):
    user = await create_user()
    token = (await Session.create(user=user)).to_jwt()
    city = await City.create(name="test", latitude=42.24, longitude=24.42)
    sensor = await Sensor.create(owner=user, city=city, name="test123")

    response = await client.patch(f"/sensors/{sensor.id}", headers={"authorization": token}, json={
        "city": "unknown"
    })
    assert response.status_code == 404
