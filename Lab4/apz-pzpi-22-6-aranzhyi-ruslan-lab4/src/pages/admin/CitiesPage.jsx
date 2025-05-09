import React, {useEffect, useState} from "react";
import {
    Box,
    Button,
    CircularProgress,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TablePagination,
    TableRow,
} from "@mui/material";
import CitiesTableItem from "../../components/admin/CitiesTableItem.jsx";
import CenteredTableRow from "../../components/CenteredTableRow.jsx";
import Navigation from "../../components/Navigation.jsx";
import {useAppStore} from "../../state.js";
import {useSnackbar} from "notistack";
import {apiAdminGetCities} from "../../api.js";
import CityCreateDialog from "../../components/CityCreateDialog.jsx";

function AdminCitiesPage() {
    const token = useAppStore(state => state.authToken);

    const [cities, setCities] = useState([]);
    const [citiesCount, setCitiesCount] = useState(0);

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [_reloadTrigger, _setReloadTrigger] = useState(0);
    const [loading, setLoading] = useState(false);

    const { enqueueSnackbar } = useSnackbar();
    const [dialogOpen, setDialogOpen] = useState(false);

    const fetchUsers = async () => {
        setLoading(true);

        const citiesResp = await apiAdminGetCities(token, page + 1, rowsPerPage, enqueueSnackbar);
        if(!citiesResp) return setLoading(false);

        setCities(citiesResp.result);
        setCitiesCount(citiesResp.count);
        setLoading(false);
    }

    useEffect(() => {
        fetchUsers();
    }, [page, rowsPerPage, _reloadTrigger]);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    return (
        <>
            <Navigation title="Cities"/>

            <Box p={3}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    <Button variant="contained" onClick={() => setDialogOpen(true)}>
                        Add City
                    </Button>
                </Box>

                <Paper>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>ID</TableCell>
                                <TableCell>Name</TableCell>
                                <TableCell>Latitude</TableCell>
                                <TableCell>Longitude</TableCell>
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
                                    : cities.map(city => <CitiesTableItem city={city}/>)
                            }

                            {!loading && cities.length === 0 && (
                                <CenteredTableRow>
                                    No cities found.
                                </CenteredTableRow>
                            )}
                        </TableBody>
                    </Table>

                    <TablePagination
                        component="div"
                        count={citiesCount}
                        page={page}
                        onPageChange={handleChangePage}
                        rowsPerPage={rowsPerPage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                        rowsPerPageOptions={[5, 10, 25, 50]}
                        disabled={loading}
                    />
                </Paper>

                <CityCreateDialog
                    dialogOpen={dialogOpen}
                    setDialogOpen={setDialogOpen}
                    onSensorResult={() => _setReloadTrigger(prev => prev + 1)}
                />
            </Box>
        </>
    );
}

export default AdminCitiesPage;
