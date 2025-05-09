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
            "Content-Type": "application/json",
            "Authorization": token,
        },
    });

    return await parseResp(enqueueSnackbar, resp);
}

export async function apiGetSensorMeasurements(token, sensorId, enqueueSnackbar) {
    const resp = await fetch(`${API_BASE}/measurements/${sensorId}`, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": token,
        },
    });

    return await parseResp(enqueueSnackbar, resp);
}
