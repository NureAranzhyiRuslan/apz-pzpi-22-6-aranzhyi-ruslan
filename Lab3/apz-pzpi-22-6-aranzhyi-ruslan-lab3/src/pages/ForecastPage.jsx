import React, {useState} from "react";
import {Autocomplete, Box, Button, Stack, TextField, Typography,} from "@mui/material";
import Navigation from "../components/Navigation.jsx";
import {apiGetCityForecast, apiSearchCities} from "../api.js";
import {useSnackbar} from "notistack";

function ForecastPage() {
    const [loading, setLoading] = useState(false);
    const [temperature, setTemperature] = useState(null);

    const [selectedCity, setSelectedCity] = useState(null);
    const [cityOptions, setCityOptions] = useState([]);

    const { enqueueSnackbar } = useSnackbar();

    const handleCitySearch = async (query) => {
        const cities = await apiSearchCities(query.toLowerCase());
        if(!cities) return;
        setCityOptions(cities);
    };

    const fetchForecast = async () => {
        if(!selectedCity) return enqueueSnackbar("No city selected!", {variant: "warning"});
        setLoading(true);

        const forecast = await apiGetCityForecast(selectedCity.id, enqueueSnackbar);
        if(forecast) setTemperature(forecast.temperature);

        setLoading(false);
    }

    return (
        <>
            <Navigation title="Forecast for city"/>

            <Box p={3}>
                <Stack spacing={2}>
                    {temperature !== null && (
                        <Typography variant="h5" mb={3} textAlign="center">
                            Expected temperature: {temperature.toFixed(2)}
                        </Typography>
                    )}

                    <Autocomplete
                        options={cityOptions}
                        getOptionLabel={(option) => option.name}
                        value={selectedCity}
                        onInputChange={(e, value) => handleCitySearch(value)}
                        onChange={(e, value) => setSelectedCity(value)}
                        renderInput={(params) => <TextField {...params} label="City" />}
                        disabled={loading}
                    />

                    <Stack direction="row" spacing={2}>
                        <Button variant="contained" color="primary" onClick={fetchForecast} disabled={loading} fullWidth>
                            Get forecast
                        </Button>
                    </Stack>
                </Stack>
            </Box>
        </>
    );
}

export default ForecastPage;
