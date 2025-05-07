import {Autocomplete, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField} from "@mui/material";
import React, {useState} from "react";

function SensorCreateUpdateDialog({isCreate, dialogOpen, setDialogOpen, onSensorResult, sensor}) {
    const [sensorName, setSensorName] = useState(sensor ? sensor.name : "");
    const [selectedCity, setSelectedCity] = useState(sensor ? sensor.city : null);
    const [cityOptions, setCityOptions] = useState([]);

    const handleCitySearch = async (query) => {
        const fakeCities = [
            { id: 1, name: "some city" },
            { id: 2, name: "another city" },
            { id: 3, name: "idk" },
        ].filter((c) => c.name.toLowerCase().includes(query.toLowerCase()));
        setCityOptions(fakeCities);
    };

    const handleCreateOrEdit = () => {
        if (!sensorName || !selectedCity) return;
        if (isCreate) {
            // TODO: create via fetch
            onSensorResult({
                id: `sensor-${Date.now()}`,
                name: sensorName,
                city: selectedCity,
                recentMeasurements: 0,
            });
        } else {
            // TODO: update via fetch
            onSensorResult({
                id: sensor.id,
                name: sensorName,
                city: selectedCity,
                recentMeasurements: 0,
            });
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