import {TableCell, TableRow} from "@mui/material";
import React from "react";

function CenteredTableRow({children}) {
    return (
        <TableRow>
            <TableCell colSpan={4} align="center">
                {children}
            </TableCell>
        </TableRow>
    )
}

export default CenteredTableRow;
