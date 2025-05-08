import React, {useState} from "react";
import {
    Box,
    Typography,
    TextField,
    Button,
    Stack, Autocomplete,
} from "@mui/material";
import {useNavigate, useParams} from "react-router-dom";
import {useSnackbar} from "notistack";

function AdminSensorInfoPage() {
    const { sensorId } = useParams();
    const [loading, setLoading] = useState(false);

    const [selectedCity, setSelectedCity] = useState(null);
    const [cityOptions, setCityOptions] = useState([]);

    const { enqueueSnackbar } = useSnackbar();
    const navigate = useNavigate();

    const handleCitySearch = async (query) => {
        const fakeCities = [
            { id: 1, name: "some city" },
            { id: 2, name: "another city" },
            { id: 3, name: "idk" },
        ].filter((c) => c.name.toLowerCase().includes(query.toLowerCase()));
        setCityOptions(fakeCities);
    };

    // TODO: fetch sensor info via api

    const saveSensor = async () => {
        setLoading(true);
        // TODO: delete sensor
        await new Promise(resolve => setTimeout(resolve, 1500));
        setLoading(false);
        enqueueSnackbar("Sensor info updated!", {variant: "info"});
    }

    const deleteSensor = async () => {
        setLoading(true);
        // TODO: delete sensor
        await new Promise(resolve => setTimeout(resolve, 1500));
        setLoading(false);
        enqueueSnackbar("Sensor deleted!", {variant: "info"});
        navigate("/admin/sensors");
    }

    return (
        <Box p={3}>
            <Typography variant="h5" mb={2}>
                Sensor {sensorId}
            </Typography>

            <Stack spacing={2} maxWidth={400}>
                <TextField label="Name" defaultValue="Sensor name" disabled={loading} />
                <Autocomplete
                    options={cityOptions}
                    getOptionLabel={(option) => option.name}
                    value={selectedCity}
                    onInputChange={(e, value) => handleCitySearch(value)}
                    onChange={(e, value) => setSelectedCity(value)}
                    renderInput={(params) => <TextField {...params} label="City" />}
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
    );
}

export default AdminSensorInfoPage;
