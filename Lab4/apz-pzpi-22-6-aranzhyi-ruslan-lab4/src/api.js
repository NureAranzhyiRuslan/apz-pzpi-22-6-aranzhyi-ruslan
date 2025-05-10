import {API_BASE} from "./constants.js";

async function parseResp(enqueueSnackbar, resp, ...successFields) {
    if(resp.status >= 500) {
        enqueueSnackbar("Server error! Please try again later!", {variant: "error"});
        return;
    }

    if(resp.status === 204) return true;

    const json = await resp.json();
    if (resp.status >= 400) {
        if ("errors" in json)
            enqueueSnackbar(json.errors[0], {variant: "error"});
        else
            enqueueSnackbar("Unknown server response!", {variant: "error"});
        return;
    }

    for(let field of successFields) {
        if(!(field in json)) {
            enqueueSnackbar("Unknown server response!", {variant: "error"});
            return;
        }
    }

    return json;
}

export async function apiLogin(email, password, enqueueSnackbar){
    const resp = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            "email": email,
            "password": password,
        }),
    });

    return await parseResp(enqueueSnackbar, resp, "token");
}

export async function apiRegister(email, password, first_name, last_name, enqueueSnackbar){
    const resp = await fetch(`${API_BASE}/auth/register`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            "email": email,
            "password": password,
            "first_name": first_name,
            "last_name": last_name,
        }),
    });

    return await parseResp(enqueueSnackbar, resp, "token");
}

export async function apiGetUser(token, enqueueSnackbar) {
    const resp = await fetch(`${API_BASE}/user/info`, {
        headers: {"Authorization": token},
    });

    return await parseResp(enqueueSnackbar, resp, "id", "role", "first_name");
}

export async function apiSearchCities(name, enqueueSnackbar) {
    const resp = await fetch(`${API_BASE}/cities/search`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            "name": name,
        }),
    });

    return await parseResp(enqueueSnackbar, resp);
}

export async function apiGetSensors(token, page, pageSize, enqueueSnackbar) {
    const resp = await fetch(`${API_BASE}/sensors?page=${page}&page_size=${pageSize}`, {
        headers: {"Authorization": token},
    });

    return await parseResp(enqueueSnackbar, resp, "count", "result");
}

export async function apiCreateSensor(token, name, cityId, enqueueSnackbar) {
    const resp = await fetch(`${API_BASE}/sensors`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": token,
        },
        body: JSON.stringify({
            "name": name,
            "city": cityId,
        }),
    });

    return await parseResp(enqueueSnackbar, resp, "id", "name", "city");
}

export async function apiGetSensor(token, sensorId, enqueueSnackbar) {
    const resp = await fetch(`${API_BASE}/sensors/${sensorId}`, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": token,
        },
    });

    return await parseResp(enqueueSnackbar, resp, "id", "name", "city");
}

export async function apiUpdateSensor(token, sensorId, name, cityId, enqueueSnackbar) {
    const resp = await fetch(`${API_BASE}/sensors/${sensorId}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            "Authorization": token,
        },
        body: JSON.stringify({
            "name": name,
            "city": cityId,
        }),
    });

    return await parseResp(enqueueSnackbar, resp, "id", "name", "city");
}

export async function apiDeleteSensor(token, sensorId, enqueueSnackbar) {
    const resp = await fetch(`${API_BASE}/sensors/${sensorId}`, {
        method: "DELETE",
        headers: {
            "Authorization": token,
        },
    });

    return await parseResp(enqueueSnackbar, resp);
}

export async function apiGetSensorMeasurements(token, sensorId, enqueueSnackbar) {
    const resp = await fetch(`${API_BASE}/measurements/${sensorId}`, {
        headers: {
            "Authorization": token,
        },
    });

    return await parseResp(enqueueSnackbar, resp);
}

export async function apiGetCityForecast(cityId, enqueueSnackbar) {
    const resp = await fetch(`${API_BASE}/forecast/city?city=${cityId}`);

    return await parseResp(enqueueSnackbar, resp, "info_text", "temperature");
}

export async function apiAdminGetUsers(token, page, pageSize, enqueueSnackbar) {
    const resp = await fetch(`${API_BASE}/admin/users?page=${page}&page_size=${pageSize}`, {
        headers: {
            "Authorization": token,
        },
    });

    return await parseResp(enqueueSnackbar, resp, "count", "result");
}

export async function apiAdminGetUser(token, userId, enqueueSnackbar) {
    const resp = await fetch(`${API_BASE}/admin/users/${userId}`, {
        headers: {
            "Authorization": token,
        },
    });

    return await parseResp(enqueueSnackbar, resp, "id", "email", "first_name", "last_name");
}

export async function apiAdminUpdateUser(token, userId, firstName, lastName, email, role, enqueueSnackbar) {
    const resp = await fetch(`${API_BASE}/admin/users/${userId}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            "Authorization": token,
        },
        body: JSON.stringify({
            "first_name": firstName,
            "last_name": lastName,
            "email": email,
            "role": role,
        }),
    });

    return await parseResp(enqueueSnackbar, resp, "id", "email", "first_name", "last_name");
}

export async function apiAdminDeleteUser(token, userId, enqueueSnackbar) {
    const resp = await fetch(`${API_BASE}/admin/users/${userId}`, {
        method: "DELETE",
        headers: {
            "Authorization": token,
        },
    });

    return await parseResp(enqueueSnackbar, resp);
}

export async function apiAdminGetSensors(token, page, pageSize, enqueueSnackbar) {
    const resp = await fetch(`${API_BASE}/admin/sensors?page=${page}&page_size=${pageSize}`, {
        headers: {
            "Authorization": token,
        },
    });

    return await parseResp(enqueueSnackbar, resp, "count", "result");
}

export async function apiAdminGetSensor(token, sensorId, enqueueSnackbar) {
    const resp = await fetch(`${API_BASE}/admin/sensors/${sensorId}`, {
        headers: {
            "Authorization": token,
        },
    });

    return await parseResp(enqueueSnackbar, resp, "id", "name", "city", "owner");
}

export async function apiAdminUpdateSensor(token, sensorId, name, cityId, email, enqueueSnackbar) {
    const resp = await fetch(`${API_BASE}/admin/sensors/${sensorId}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            "Authorization": token,
        },
        body: JSON.stringify({
            "name": name,
            "city": cityId,
        }),
    });

    return await parseResp(enqueueSnackbar, resp, "id", "name", "city", "owner");
}

export async function apiAdminDeleteSensor(token, sensorId, enqueueSnackbar) {
    const resp = await fetch(`${API_BASE}/admin/sensors/${sensorId}`, {
        method: "DELETE",
        headers: {
            "Authorization": token,
        },
    });

    return await parseResp(enqueueSnackbar, resp);
}

export async function apiAdminGetCities(token, page, pageSize, enqueueSnackbar) {
    const resp = await fetch(`${API_BASE}/admin/cities?page=${page}&page_size=${pageSize}`, {
        headers: {
            "Authorization": token,
        },
    });

    return await parseResp(enqueueSnackbar, resp, "count", "result");
}

export async function apiAdminGetCity(token, cityId, enqueueSnackbar) {
    const resp = await fetch(`${API_BASE}/admin/cities/${cityId}`, {
        headers: {
            "Authorization": token,
        },
    });

    return await parseResp(enqueueSnackbar, resp, "id", "name", "latitude", "longitude");
}

export async function apiAdminUpdateCity(token, cityId, name, latitude, longitude, enqueueSnackbar) {
    const resp = await fetch(`${API_BASE}/admin/cities/${cityId}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            "Authorization": token,
        },
        body: JSON.stringify({
            "name": name,
            "latitude": latitude,
            "longitude": longitude,
        }),
    });

    return await parseResp(enqueueSnackbar, resp, "id", "name", "latitude", "longitude");
}

export async function apiAdminDeleteCity(token, sensorId, enqueueSnackbar) {
    const resp = await fetch(`${API_BASE}/admin/cities/${sensorId}`, {
        method: "DELETE",
        headers: {
            "Authorization": token,
        },
    });

    return await parseResp(enqueueSnackbar, resp);
}

export async function apiAdminCreateCity(token, name, latitude, longitude, enqueueSnackbar) {
    const resp = await fetch(`${API_BASE}/admin/cities`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": token,
        },
        body: JSON.stringify({
            "name": name,
            "latitude": latitude,
            "longitude": longitude,
        }),
    });

    return await parseResp(enqueueSnackbar, resp, "id", "name", "latitude", "longitude");
}
