import React, {useState} from "react";
import {Autocomplete, Box, Button, Stack, TextField,} from "@mui/material";
import {useNavigate, useParams} from "react-router-dom";
import {useSnackbar} from "notistack";
import Navigation from "../../components/Navigation.jsx";

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
        <>
            <Navigation title={`Sensor ${sensorId}`}/>

            <Box p={3}>
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
        </>
    );
}

export default AdminSensorInfoPage;
