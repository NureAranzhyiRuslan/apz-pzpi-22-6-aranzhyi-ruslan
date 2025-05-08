import {Button, TableCell, TableRow} from "@mui/material";
import React from "react";
import {useNavigate} from "react-router-dom";

function SensorsTableItem({sensor}) {
    const navigate = useNavigate();

    return (
        <TableRow key={sensor.id}>
            <TableCell>{sensor.id}</TableCell>
            <TableCell>{sensor.name}</TableCell>
            <TableCell>{sensor.city.name}</TableCell>
            <TableCell>{sensor.owner.email}</TableCell>
            <TableCell align="right">
                <Button
                    variant="outlined"
                    size="small"
                    onClick={() => navigate(`/admin/sensors/${sensor.id}`)}
                >
                    Manage
                </Button>
            </TableCell>
        </TableRow>
    );
}

export default SensorsTableItem;
