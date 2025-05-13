import React, {useEffect, useState} from "react";
import {Box, Button, Stack, TextField,} from "@mui/material";
import {useNavigate, useParams} from "react-router-dom";
import {useSnackbar} from "notistack";
import Navigation from "../../components/Navigation.jsx";
import {useAppStore} from "../../state.js";
import {apiAdminDeleteCity, apiAdminGetCity, apiAdminUpdateCity} from "../../api.js";

function AdminCityInfoPage() {
    const token = useAppStore(state => state.authToken);
    const { cityId } = useParams();

    const [city, setCity] = useState(null);
    const [cityName, setCityName] = useState(null);
    const [cityLatitude, setCityLatitude] = useState(null);
    const [cityLongitude, setCityLongitude] = useState(null);

    const [loading, setLoading] = useState(false);
    const { enqueueSnackbar } = useSnackbar();
    const navigate = useNavigate();

    useEffect(() => {
        (async () => {
            setLoading(true);
            const cityInfo = await apiAdminGetCity(token, cityId, enqueueSnackbar);
            if(!cityInfo) return;
            setCity(cityInfo);
            setCityName(cityInfo.name);
            setCityLatitude(cityInfo.latitude);
            setCityLongitude(cityInfo.longitude);

            setLoading(false)
        })();
    }, [cityId]);

    const saveCity = async () => {
        setLoading(true);

        const updCity = await apiAdminUpdateCity(token, city.id, cityName, cityLatitude, cityLongitude, enqueueSnackbar);
        if(updCity) {
            setCity(updCity);
            setCityName(updCity.name);
            setCityLatitude(updCity.latitude);
            setCityLongitude(updCity.longitude);
            enqueueSnackbar("City info updated!", {variant: "info"});
        }

        setLoading(false);
    }

    const deleteCity = async () => {
        setLoading(true);

        if(await apiAdminDeleteCity(token, city.id, enqueueSnackbar)) {
            enqueueSnackbar("City deleted!", {variant: "info"});
            navigate("/admin/cities");
        }

        setLoading(false);
    }

    return (
        <>
            <Navigation title={`City ${cityId}`}/>

            <Box p={3}>
                <Stack spacing={2} maxWidth={400}>
                    <TextField label="Name" value={cityName ? cityName : ""} disabled={loading} onChange={(e) => setCityName(e.target.value)}/>
                    <TextField label="Latitude" value={cityLatitude ? cityLatitude : ""} disabled={loading} type="number" onChange={(e) => setCityLatitude(e.target.value)}/>
                    <TextField label="Longitude" value={cityLongitude ? cityLongitude : ""} disabled={loading} type="number" onChange={(e) => setCityLongitude(e.target.value)}/>

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
