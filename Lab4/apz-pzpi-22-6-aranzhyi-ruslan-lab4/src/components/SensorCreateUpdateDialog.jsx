import {Autocomplete, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField} from "@mui/material";
import React, {useState} from "react";
import {apiCreateSensor, apiSearchCities, apiUpdateSensor} from "../api.js";
import {useAppStore} from "../state.js";
import {useSnackbar} from "notistack";

function SensorCreateUpdateDialog({isCreate, dialogOpen, setDialogOpen, onSensorResult, sensor}) {
    const token = useAppStore(state => state.authToken);

    const [sensorName, setSensorName] = useState(sensor ? sensor.name : "");
    const [selectedCity, setSelectedCity] = useState(sensor ? sensor.city : null);
    const [cityOptions, setCityOptions] = useState([]);

    const { enqueueSnackbar } = useSnackbar();

    const handleCitySearch = async (query) => {
        const cities = await apiSearchCities(query.toLowerCase());
        if(!cities) return;
        setCityOptions(cities);
    };

    const handleCreateOrEdit = async () => {
        if (!sensorName || !selectedCity) return;
        if (isCreate) {
            const newSensor = await apiCreateSensor(token, sensorName, selectedCity.id, enqueueSnackbar);
            if(!newSensor) return;
            onSensorResult(newSensor);
        } else {
            const updSensor = await apiUpdateSensor(token, sensor.id, sensorName, selectedCity.id, enqueueSnackbar);
            if(!updSensor) return;
            onSensorResult(updSensor);
        }
        setDialogOpen(false);
    };

    return (
        <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} fullWidth>
            <DialogTitle>{isCreate ? "Create Sensor" : "Edit Sensor"}</DialogTitle>
            <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
                <TextField
                    label="Sensor Name"
                    value={sensorName}
                    onChange={(e) => setSensorName(e.target.value)}
                />
                <Autocomplete
                    options={cityOptions}
                    getOptionLabel={(option) => option.name}
                    value={selectedCity}
                    onInputChange={(e, value) => handleCitySearch(value)}
                    onChange={(e, value) => setSelectedCity(value)}
                    renderInput={(params) => <TextField {...params} label="City" />}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleCreateOrEdit} variant="contained">
                    {isCreate ? "Create" : "Save"}
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default SensorCreateUpdateDialog;