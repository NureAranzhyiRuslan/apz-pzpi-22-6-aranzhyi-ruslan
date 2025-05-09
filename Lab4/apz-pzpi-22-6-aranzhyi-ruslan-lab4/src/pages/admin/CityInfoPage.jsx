import React, {useState} from "react";
import {Autocomplete, Box, Button, Stack, TextField,} from "@mui/material";
import {useNavigate, useParams} from "react-router-dom";
import {useSnackbar} from "notistack";
import Navigation from "../../components/Navigation.jsx";

function AdminCityInfoPage() {
    const { cityId } = useParams();
    const [loading, setLoading] = useState(false);

    const [selectedCity, setSelectedCity] = useState(null);
    const [cityOptions, setCityOptions] = useState([]);

    const { enqueueSnackbar } = useSnackbar();
    const navigate = useNavigate();

    // TODO: fetch city info via api

    const saveCity = async () => {
        setLoading(true);
        // TODO: delete city
        await new Promise(resolve => setTimeout(resolve, 1500));
        setLoading(false);
        enqueueSnackbar("City info updated!", {variant: "info"});
    }

    const deleteCity = async () => {
        setLoading(true);
        // TODO: delete city
        await new Promise(resolve => setTimeout(resolve, 1500));
        setLoading(false);
        enqueueSnackbar("City deleted!", {variant: "info"});
        navigate("/admin/cities");
    }

    return (
        <>
            <Navigation title={`City ${cityId}`}/>

            <Box p={3}>
                <Stack spacing={2} maxWidth={400}>
                    <TextField label="Name" defaultValue="City name" disabled={loading} />
                    <TextField label="Latitude" defaultValue="42.24" disabled={loading} type="number" />
                    <TextField label="Longitude" defaultValue="24.42" disabled={loading} type="number" />

                    <Stack direction="row" spacing={2}>
                        <Button variant="contained" color="primary" onClick={saveCity} disabled={loading}>
                            Save
                        </Button>
                        <Button variant="outlined" color="error" onClick={deleteCity} disabled={loading}>
                            Delete City
                        </Button>
                    </Stack>
                </Stack>
            </Box>
        </>
    );
}

export default AdminCityInfoPage;
