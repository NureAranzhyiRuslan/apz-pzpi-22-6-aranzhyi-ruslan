import {Button, TableCell, TableRow} from "@mui/material";
import React from "react";
import {useSnackbar} from "notistack";
import {useAppStore} from "../../state.js";
import {apiAdminDeleteMeasurement} from "../../api.js";

function MeasurementsTableItem({measurement}) {
    const token = useAppStore(state => state.authToken);
    const { enqueueSnackbar } = useSnackbar();

    return (
        <TableRow key={measurement.id}>
            <TableCell>{measurement.id}</TableCell>
            <TableCell>{measurement.sensor.name}</TableCell>
            <TableCell>{measurement.sensor.city.name}</TableCell>
            <TableCell>{measurement.sensor.owner ? measurement.sensor.owner.email : "-"}</TableCell>
            <TableCell>{measurement.temperature}</TableCell>
            <TableCell>{measurement.pressure}</TableCell>
            <TableCell>{new Date(measurement.timestamp * 1000).toLocaleString()}</TableCell>
            <TableCell align="right">
                <Button
                    variant="outlined"
                    size="small"
                    onClick={async () => {
                        if(await apiAdminDeleteMeasurement(token, measurement.id, enqueueSnackbar)) {
                            location.reload();
                        }
                    }}
                >
                    Delete
                </Button>
            </TableCell>
        </TableRow>
    );
}

export default MeasurementsTableItem;
