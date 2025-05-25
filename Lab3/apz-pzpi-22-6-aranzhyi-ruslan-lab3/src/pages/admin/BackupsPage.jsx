import React, {useEffect, useState} from "react";
import {Box, Button, CircularProgress, Paper, Table, TableBody, TableCell, TableHead, TableRow,} from "@mui/material";
import BackupsTableItem from "../../components/admin/BackupsTableItem.jsx";
import CenteredTableRow from "../../components/CenteredTableRow.jsx";
import Navigation from "../../components/Navigation.jsx";
import {apiAdminGetBackups, apiAdminCreateBackup} from "../../api.js";
import {useAppStore} from "../../state.js";
import {useSnackbar} from "notistack";


function AdminBackupsPage() {
    const token = useAppStore(state => state.authToken);
    const { enqueueSnackbar } = useSnackbar();

    const [backups, setBackups] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchBackups = async () => {
        setLoading(true);

        const backupsResp = await apiAdminGetBackups(token, enqueueSnackbar);
        if(!backupsResp) return setLoading(false);

        setBackups(backupsResp);
        setLoading(false);
    }

    useEffect(() => {
        fetchBackups();
    }, []);

    return (
        <>
            <Navigation title="Backups"/>

            <Box p={3}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    <Button variant="contained" onClick={async () => {
                        await apiAdminCreateBackup(token, enqueueSnackbar);
                        await fetchBackups();
                    }}>
                        Create backup
                    </Button>
                </Box>

                <Paper>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Backup name</TableCell>
                                <TableCell>Date</TableCell>
                                <TableCell>Size</TableCell>
                                <TableCell align="right">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                loading
                                    ? (
                                        <CenteredTableRow>
                                            <CircularProgress/>
                                        </CenteredTableRow>
                                    )
                                    : backups.map(backup => <BackupsTableItem backup={backup} needRefetch={fetchBackups}/>)
                            }

                            {!loading && backups.length === 0 && (
                                <CenteredTableRow>
                                    No backups found.
                                </CenteredTableRow>
                            )}
                        </TableBody>
                    </Table>
                </Paper>
            </Box>
        </>
    );
}

export default AdminBackupsPage;
