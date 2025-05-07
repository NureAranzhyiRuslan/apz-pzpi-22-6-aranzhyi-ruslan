import React, {useEffect, useState} from "react";
import {Box, Button, Typography,} from "@mui/material";
import InfiniteScroll from "react-infinite-scroll-component";
import SensorCreateUpdateDialog from "../components/SensorCreateUpdateDialog.jsx";
import SensorComponent from "../components/SensorComponent.jsx";
import {useSnackbar} from "notistack";

const PAGE_SIZE = 10;

export default function SensorsPage() {
    const [sensors, setSensors] = useState([]);
    const [hasMore, setHasMore] = useState(true);
    const [page, setPage] = useState(1);

    const [dialogOpen, setDialogOpen] = useState(false);

    const { enqueueSnackbar } = useSnackbar();

    const fetchSensors = async (page) => {
        const fakeData = Array.from({ length: PAGE_SIZE }, (_, i) => ({
            id: `sensor-${page}-${i}`,
            name: `Sensor ${page}-${i}`,
            city: { id: 1, name: "some city" },
            recentMeasurements: Math.floor(Math.random() * 100),
        }));
        return fakeData;
    };

    const loadMore = async () => {
        const newSensors = await fetchSensors(page);
        //setSensors((prev) => [...prev, ...newSensors]);
        //setPage((p) => p + 1);
        setSensors([...sensors, ...newSensors]);
        setPage(page + 1);
        if (newSensors.length < PAGE_SIZE) setHasMore(false);
    };

    useEffect(() => {
        loadMore().then(() => {});
    }, []);

    return (
        <Box p={2}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h5">Weather Sensors</Typography>
                <Button variant="contained" onClick={() => setDialogOpen(true)}>
                    Add Sensor
                </Button>
            </Box>

            <InfiniteScroll
                dataLength={sensors.length}
                next={loadMore}
                hasMore={hasMore}
                loader={<Typography>Loading more sensors...</Typography>}
            >
                {sensors.map((sensor) => (
                    <SensorComponent
                        key={sensor.id}
                        sensor={sensor}
                        onDelete={() => setSensors((prev) => prev.filter((s) => s.id !== sensor.id))}
                    />
                ))}
            </InfiniteScroll>

            {hasMore && <Box display="flex" justifyContent="center" mb={2}>
                <Button variant="contained" onClick={loadMore}>
                    Load more
                </Button>
            </Box>}

            <SensorCreateUpdateDialog
                isCreate={true}
                dialogOpen={dialogOpen}
                setDialogOpen={setDialogOpen}
                onSensorResult={newSensor => {
                    console.log("new sensor", newSensor);
                    setSensors((prev) => [newSensor, ...prev]);
                    enqueueSnackbar("Sensor created!", {variant: "success"});
                }}
            />
        </Box>
    );
}
