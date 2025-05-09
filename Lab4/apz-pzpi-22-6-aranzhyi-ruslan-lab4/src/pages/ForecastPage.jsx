import React, {useState} from "react";
import {Autocomplete, Box, Button, Stack, TextField, Typography,} from "@mui/material";
import Navigation from "../components/Navigation.jsx";

function ForecastPage() {
    const [loading, setLoading] = useState(false);
    const [temperature, setTemperature] = useState(null);

    const [selectedCity, setSelectedCity] = useState(null);
    const [cityOptions, setCityOptions] = useState([]);

    const handleCitySearch = async (query) => {
        const fakeCities = [
            { id: 1, name: "some city" },
            { id: 2, name: "another city" },
            { id: 3, name: "idk" },
        ].filter((c) => c.name.toLowerCase().includes(query.toLowerCase()));
        setCityOptions(fakeCities);
    };

    const fetchForecast = async () => {
        setLoading(true);

        // TODO: fetch forecast info via api
        await new Promise(resolve => setTimeout(resolve, 1500));
        setTemperature(21);

        setLoading(false);
    }

    return (
        <>
            <Navigation title="Forecast for city"/>

            <Box p={3}>
                <Stack spacing={2}>
                    {temperature !== null && (
                        <Typography variant="h5" mb={3} textAlign="center">
                            Expected temperature: {temperature}
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
