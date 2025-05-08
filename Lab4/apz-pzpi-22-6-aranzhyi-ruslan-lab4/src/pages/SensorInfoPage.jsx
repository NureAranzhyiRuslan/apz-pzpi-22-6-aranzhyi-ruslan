import React, {useEffect, useState} from "react";
import {Box, List, Paper, Typography,} from "@mui/material";
import {useParams} from "react-router-dom";
import {LineChart} from "@mui/x-charts";
import Measurement from "../components/Measurement.jsx";

function SensorInfoPage() {
    const { sensorId } = useParams();
    const [measurements, setMeasurements] = useState([]);

    useEffect(() => {
        const fakeData = Array.from({ length: 100 }, (_, i) => ({
            id: `m-${i}`,
            temperature: +(20 + Math.random() * 10).toFixed(1),
            pressure: +(1000 + Math.random() * 30).toFixed(1),
            date: Math.floor(Date.now()/1000) - i * 3600,
        }));
        setMeasurements(fakeData);
    }, [sensorId]);

    return (
        <Box p={3}>
            <Typography variant="h5" mb={2}>
                Sensor [sensor name] (ID: {sensorId})
            </Typography>

            <LineChart
                xAxis={[{
                    data: measurements.map(measurement => measurement.date),
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
    );
}

export default SensorInfoPage;
