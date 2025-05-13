import {Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField} from "@mui/material";
import React, {useState} from "react";
import {apiAdminCreateCity} from "../api.js";
import {useAppStore} from "../state.js";
import {useSnackbar} from "notistack";

function CityCreateDialog({dialogOpen, setDialogOpen, onSensorResult}) {
    const token = useAppStore(state => state.authToken);

    const [name, setName] = useState("");
    const [latitude, setLatitude] = useState(0);
    const [longitude, setLongitude] = useState(0);

    const [loading, setLoading] = useState(false);
    const { enqueueSnackbar } = useSnackbar();

    const handleCreate = async () => {
        if (!name || !latitude || !longitude) return enqueueSnackbar("You need to fill all fields!", {variant: "warning"});

        setLoading(true);

        const newSensor = await apiAdminCreateCity(token, name, latitude, longitude, enqueueSnackbar);
        if(!newSensor) return;
        onSensorResult(newSensor);

        setDialogOpen(false);
        setLoading(false);
    };

    return (
        <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} fullWidth>
            <DialogTitle>Create Sensor</DialogTitle>
            <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
                <TextField label="Name" value={name} disabled={loading} onChange={(e) => setName(e.target.value)}/>
                <TextField label="Latitude" value={latitude} disabled={loading} type="number" onChange={(e) => setLatitude(e.target.value)}/>
                <TextField label="Longitude" value={longitude} disabled={loading} type="number" onChange={(e) => setLongitude(e.target.value)}/>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleCreate} variant="contained" disabled={loading}>
                    Create
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default CityCreateDialog;