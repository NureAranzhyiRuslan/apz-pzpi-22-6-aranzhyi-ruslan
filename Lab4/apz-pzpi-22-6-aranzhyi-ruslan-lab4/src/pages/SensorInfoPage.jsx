import React, {useEffect, useState} from "react";
import {Box, List, Paper} from "@mui/material";
import {useParams} from "react-router-dom";
import {LineChart} from "@mui/x-charts";
import Measurement from "../components/Measurement.jsx";
import Navigation from "../components/Navigation.jsx";

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
        <>
            <Navigation title={`Sensor [sensor name] (ID: ${sensorId})`}/>

            <Box p={3}>
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
        </>
    );
}

export default SensorInfoPage;
