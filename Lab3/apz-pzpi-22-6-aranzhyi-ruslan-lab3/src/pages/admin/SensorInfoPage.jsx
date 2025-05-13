import React, {useEffect, useState} from "react";
import {Autocomplete, Box, Button, Stack, TextField,} from "@mui/material";
import {useNavigate, useParams} from "react-router-dom";
import {useSnackbar} from "notistack";
import Navigation from "../../components/Navigation.jsx";
import {apiAdminDeleteSensor, apiAdminGetSensor, apiAdminUpdateSensor, apiSearchCities} from "../../api.js";
import {useAppStore} from "../../state.js";

function AdminSensorInfoPage() {
    const token = useAppStore(state => state.authToken);
    const { sensorId } = useParams();
    const [loading, setLoading] = useState(false);

    const [sensor, setSensor] = useState(null);
    const [sensorName, setSensorName] = useState(null);
    const [sensorCity, setSensorCity] = useState(null);

    const [cityOptions, setCityOptions] = useState([]);

    const { enqueueSnackbar } = useSnackbar();
    const navigate = useNavigate();

    useEffect(() => {
        (async () => {
            setLoading(true);
            const sensorInfo = await apiAdminGetSensor(token, sensorId, enqueueSnackbar);
            if(!sensorInfo) return;
            setSensor(sensorInfo);
            setSensorName(sensorInfo.name);
            setSensorCity(sensorInfo.city);

            setLoading(false)
        })();
    }, [sensorId]);

    const handleCitySearch = async (query) => {
        const cities = await apiSearchCities(query.toLowerCase());
        if(!cities) return;
        setCityOptions(cities);
    };

    const saveSensor = async () => {
        setLoading(true);

        const updSensor = await apiAdminUpdateSensor(token, sensor.id, sensorName, sensorCity.id, enqueueSnackbar);
        if(updSensor) {
            setSensor(updSensor);
            setSensorName(updSensor.name);
            setSensorCity(updSensor.city);
            enqueueSnackbar("Sensor info updated!", {variant: "info"});
        }

        setLoading(false);
    }

    const deleteSensor = async () => {
        setLoading(true);

        if(await apiAdminDeleteSensor(token, sensor.id, enqueueSnackbar)) {
            enqueueSnackbar("Sensor deleted!", {variant: "info"});
            navigate("/admin/sensors");
        }

        setLoading(false);
    }

    return (
        <>
            <Navigation title={`Sensor ${sensorId}`}/>

            <Box p={3}>
                <Stack spacing={2} maxWidth={400}>
                    <TextField label="Api Key" value={sensor ? sensor.secret_key : ""} disabled />
                    <TextField label="Name" value={sensorName ? sensorName : ""} disabled={loading} onChange={(e) => setSensorName(e.target.value)} />
                    <Autocomplete
                        options={cityOptions}
                        getOptionLabel={(option) => option.name}
                        value={sensorCity}
                        onInputChange={(e, value) => handleCitySearch(value)}
                        onChange={(e, value) => setSensorCity(value)}
                        renderInput={(params) => <TextField {...params} label="City" />}
                        disabled={loading}
                    />

                    <Stack direction="row" spacing={2}>
                        <Button variant="contained" color="primary" onClick={saveSensor} disabled={loading}>
                            Save
                        </Button>
                        <Button variant="outlined" color="error" onClick={deleteSensor} disabled={loading}>
                            Delete Sensor
                        </Button>
                    </Stack>
                </Stack>
            </Box>
        </>
    );
}

export default AdminSensorInfoPage;
