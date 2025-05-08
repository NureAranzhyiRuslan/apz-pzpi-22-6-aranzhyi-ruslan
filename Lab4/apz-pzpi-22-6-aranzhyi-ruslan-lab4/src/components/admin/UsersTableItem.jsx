import {Button, TableCell, TableRow} from "@mui/material";
import React from "react";
import {useNavigate} from "react-router-dom";

function UsersTableItem({user}) {
    const navigate = useNavigate();

    return (
        <TableRow key={user.id}>
            <TableCell>{user.id}</TableCell>
            <TableCell>{user.name}</TableCell>
            <TableCell>{user.email}</TableCell>
            <TableCell align="right">
                <Button
                    variant="outlined"
                    size="small"
                    onClick={() => navigate(`/admin/users/${user.id}`)}
                >
                    Manage
                </Button>
            </TableCell>
        </TableRow>
    );
}

export default UsersTableItem;
