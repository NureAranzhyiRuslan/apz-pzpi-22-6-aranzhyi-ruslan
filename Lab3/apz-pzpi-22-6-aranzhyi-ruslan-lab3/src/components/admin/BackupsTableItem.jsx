import {Button, TableCell, TableRow} from "@mui/material";
import React from "react";
import {useAppStore} from "../../state.js";
import {apiAdminDeleteBackup, apiAdminDownloadBackup} from "../../api.js";
import {useSnackbar} from "notistack";

function UsersTableItem({backup, needRefetch}) {
    const token = useAppStore(state => state.authToken);
    const { enqueueSnackbar } = useSnackbar();

    return (
        <TableRow key={backup.name}>
            <TableCell>{backup.name}</TableCell>
            <TableCell>{new Date(backup.date * 1000).toLocaleString()}</TableCell>
            <TableCell>{backup.size} bytes</TableCell>
            <TableCell align="right">
                <Button
                    variant="outlined"
                    size="small"
                    onClick={async () => (await apiAdminDownloadBackup(token, backup.name, enqueueSnackbar)) && needRefetch()}
                >
                    Download
                </Button>
                <Button
                    variant="outlined"
                    size="small"
                    onClick={async () => (await apiAdminDeleteBackup(token, backup.name, enqueueSnackbar)) && needRefetch()}
                >
                    Delete
                </Button>
            </TableCell>
        </TableRow>
    );
}

export default UsersTableItem;
