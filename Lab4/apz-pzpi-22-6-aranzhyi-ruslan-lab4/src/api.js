import {API_BASE} from "./constants.js";

async function parseResp(enqueueSnackbar, resp, ...successFields) {
    if(resp.status >= 500) {
        enqueueSnackbar("Server error! Please try again later!", {variant: "error"});
        return;
    }
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