import {Button, TableCell, TableRow} from "@mui/material";
import React from "react";
import {useNavigate} from "react-router-dom";

function CitiesTableItem({city}) {
    const navigate = useNavigate();

    return (
        <TableRow key={city.id}>
            <TableCell>{city.id}</TableCell>
            <TableCell>{city.name}</TableCell>
            <TableCell>{city.latitude}</TableCell>
            <TableCell>{city.longitude}</TableCell>
            <TableCell align="right">
                <Button
                    variant="outlined"
                    size="small"
                    onClick={() => navigate(`/admin/cities/${city.id}`)}
                >
                    Manage
                </Button>
            </TableCell>
        </TableRow>
    );
}

export default CitiesTableItem;
