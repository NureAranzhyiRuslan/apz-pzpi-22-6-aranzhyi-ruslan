import React, {useEffect, useState} from "react";
import {Box, Button, Typography,} from "@mui/material";
import InfiniteScroll from "react-infinite-scroll-component";
import SensorCreateUpdateDialog from "../components/SensorCreateUpdateDialog.jsx";
import SensorComponent from "../components/SensorComponent.jsx";
import Navigation from "../components/Navigation.jsx";
import {useSnackbar} from "notistack";
import {apiGetSensors} from "../api.js";
import {useAppStore} from "../state.js";

const PAGE_SIZE = 10;

export default function SensorsPage() {
    const token = useAppStore(state => state.authToken);

    const [sensors, setSensors] = useState([]);
    const [hasMore, setHasMore] = useState(true);
    const [page, setPage] = useState(1);

    const [dialogOpen, setDialogOpen] = useState(false);

    const { enqueueSnackbar } = useSnackbar();

    const loadMore = async () => {
        const newSensors = await apiGetSensors(token, page, PAGE_SIZE, enqueueSnackbar);
        if(!newSensors) return;

        setSensors([...sensors, ...newSensors.result]);
        setPage(page + 1);
        if ((sensors.length + newSensors.result.length) >= newSensors.count) setHasMore(false);
    };

    useEffect(() => {
        loadMore().then(() => {});
    }, []);

    return (
        <>
            <Navigation title="Your weather sensors"/>

            <Box p={2}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    <Button variant="contained" onClick={() => setDialogOpen(true)}>
                        Add Sensor
                    </Button>
                </Box>

                <InfiniteScroll
                    dataLength={sensors.length}
                    next={loadMore}
                    hasMore={hasMore}
                    loader={<Typography textAlign="center" variant="h5">Loading more sensors...</Typography>}
                    endMessage={<Typography textAlign="center" variant="h5">No more sensors are available...</Typography>}
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
                        setSensors((prev) => [newSensor, ...prev]);
                        enqueueSnackbar("Sensor created!", {variant: "success"});
                    }}
                />
            </Box>
        </>
    );
}
