import React, {useEffect, useState} from "react";
import {Autocomplete, Box, Button, List, Paper, Stack, TextField} from "@mui/material";
import {useNavigate, useParams} from "react-router-dom";
import {LineChart} from "@mui/x-charts";
import Measurement from "../components/Measurement.jsx";
import Navigation from "../components/Navigation.jsx";
import {useAppStore} from "../state.js";
import {useSnackbar} from "notistack";
import {apiDeleteSensor, apiGetSensor, apiGetSensorMeasurements, apiSearchCities, apiUpdateSensor} from "../api.js";

function SensorInfoPage() {
    const token = useAppStore(state => state.authToken);

    const { sensorId } = useParams();
    const [sensor, setSensor] = useState(null);
    const [sensorName, setSensorName] = useState(null);
    const [sensorCity, setSensorCity] = useState(null);
    const [loading, setLoading] = useState(false);
    const [measurements, setMeasurements] = useState([]);

    const [cityOptions, setCityOptions] = useState([]);

    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();

    const handleCitySearch = async (query) => {
        const cities = await apiSearchCities(query.toLowerCase());
        if(!cities) return;
        setCityOptions(cities);
    };

    const saveSensor = async () => {
        const updSensor = await apiUpdateSensor(token, sensor.id, sensorName, sensorCity.id, enqueueSnackbar);
        if(!updSensor) return;
        setSensor(updSensor);
        enqueueSnackbar("Sensor updated!", {variant: "info"});
    };

    const deleteSensor = async () => {
        if(await apiDeleteSensor(token, sensor.id, enqueueSnackbar)) {
            enqueueSnackbar("Sensor deleted!", {variant: "success"});
            navigate("/sensors");
        }
    };

    useEffect(() => {
        (async () => {
            setLoading(true);
            const sensorInfo = await apiGetSensor(token, sensorId, enqueueSnackbar);
            if(!sensorInfo) return;
            setSensor(sensorInfo);
            setSensorName(sensorInfo.name);
            setSensorCity(sensorInfo.city);

            const sensorMeasurements = await apiGetSensorMeasurements(token, sensorId, enqueueSnackbar);
            if(!sensorMeasurements) return;
            setMeasurements(sensorMeasurements);

            setLoading(false)
        })();
    }, [sensorId]);

    return (
        <>
            <Navigation title={`Sensor ${sensor?.name || "..."} (ID: ${sensorId})`}/>

            <Box p={3}>
                <Stack direction="column" spacing={2}>
                    <TextField label="Api Key" value={sensor ? sensor.secret_key : ""} disabled />
                    <TextField label="Name" value={sensorName ? sensorName : ""} disabled={loading} onChange={(e) => setSensorName(e.target.value)}/>
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

                <LineChart
                    xAxis={[{
                        data: measurements.map(measurement => measurement.timestamp),
                        valueFormatter: value => new Date(value * 1000).toLocaleString(),
                    }]}
                    series={[{
                        data: measurements.map(measurement => measurement.temperature),
                        valueFormatter: value => `${value}°C`,
                    }]}
                    height={300}
                />

                <Paper elevation={2}>
                    <List>
                        {measurements.map(m => <Measurement measurement={m}/>)}
                    </List>
                </Paper>
            </Box>
        </>
    );
}

export default SensorInfoPage;
