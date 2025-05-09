import {Box, IconButton, Menu, MenuItem, Paper, Typography} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import React, {useState} from "react";
import {useNavigate} from "react-router-dom";
import SensorCreateUpdateDialog from "./SensorCreateUpdateDialog.jsx";
import {useSnackbar} from "notistack";
import {apiDeleteSensor} from "../api.js";
import {useAppStore} from "../state.js";

function SensorComponent({sensor, onDelete}) {
    const token = useAppStore(state => state.authToken);

    const [dialogOpen, setDialogOpen] = useState(false);
    const [sensorInfo, setSensorInfo] = useState(sensor);

    const [anchorEl, setAnchorEl] = useState(null);

    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();

    const handleEdit = () => {
        setDialogOpen(true);
        handleMenuClose();
    };

    const handleDelete = async () => {
        await apiDeleteSensor(token, sensor.id, enqueueSnackbar);
        if(onDelete) onDelete();
        handleMenuClose();
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    return (
        <>
            <Paper
                key={sensorInfo.id}
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    p: 2,
                    mb: 1,
                    cursor: "pointer",
                }}
                onClick={() => navigate(`/sensors/${sensorInfo.id}`)}
            >

                <Box flex="1" px={2}>
                    <Typography variant="body1">{sensorInfo.name}</Typography>
                    <Typography variant="body2" color="textSecondary">
                        {sensorInfo.city.name}
                    </Typography>
                </Box>

                <Typography variant="body1" fontWeight="bold">
                    {sensorInfo.recentMeasurements}
                </Typography>

                <IconButton
                    onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        setAnchorEl(e.currentTarget);
                    }}
                >
                    <MoreVertIcon />
                </IconButton>

                <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                >
                    <MenuItem onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        handleEdit();
                    }}>Edit</MenuItem>
                    <MenuItem onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        handleDelete();
                    }}>Delete</MenuItem>
                </Menu>
            </Paper>
            <SensorCreateUpdateDialog
                isCreate={false}
                dialogOpen={dialogOpen}
                setDialogOpen={setDialogOpen}
                onSensorResult={newSensor => {
                    enqueueSnackbar("Sensor updated!", {variant: "info"});
                    setSensorInfo((prev) => ({...prev, name: newSensor.name, city: newSensor.city}));
                }}
                sensor={sensorInfo}
            />
        </>
    );
}

export default SensorComponent;