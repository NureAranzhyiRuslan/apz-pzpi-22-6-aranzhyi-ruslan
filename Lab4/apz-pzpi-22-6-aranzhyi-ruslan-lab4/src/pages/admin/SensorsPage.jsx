import React, {useEffect, useState} from "react";
import {
    Box,
    CircularProgress,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TablePagination,
    TableRow,
} from "@mui/material";
import SensorsTableItem from "../../components/admin/SensorsTableItem.jsx";
import CenteredTableRow from "../../components/CenteredTableRow.jsx";
import Navigation from "../../components/Navigation.jsx";
import {useSnackbar} from "notistack";
import {useAppStore} from "../../state.js";
import {apiAdminGetSensors} from "../../api.js";

function AdminSensorsPage() {
    const token = useAppStore(state => state.authToken);

    const [sensors, setSensors] = useState([]);
    const [sensorsCount, setSensorsCount] = useState(0);

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [loading, setLoading] = useState(false);

    const { enqueueSnackbar } = useSnackbar();

    const fetchSensors = async () => {
        setLoading(true);

        const sensorsResp = await apiAdminGetSensors(token, page, rowsPerPage, enqueueSnackbar);
        if(!sensorsResp) return setLoading(false);

        setSensors(sensorsResp.result);
        setSensorsCount(sensorsResp.count);
        setLoading(false);
    }

    useEffect(() => {
        fetchSensors();
    }, [page, rowsPerPage]);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    return (
        <>
            <Navigation title="Sensors"/>

            <Box p={3}>
                <Paper>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>ID</TableCell>
                                <TableCell>Name</TableCell>
                                <TableCell>City</TableCell>
                                <TableCell>Owner</TableCell>
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
                                    : sensors.map(sensor => <SensorsTableItem sensor={sensor}/>)
                            }

                            {!loading && sensors.length === 0 && (
                                <CenteredTableRow>
                                    No sensors found.
                                </CenteredTableRow>
                            )}
                        </TableBody>
                    </Table>

                    <TablePagination
                        component="div"
                        count={sensorsCount}
                        page={page}
                        onPageChange={handleChangePage}
                        rowsPerPage={rowsPerPage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                        rowsPerPageOptions={[5, 10, 25, 50]}
                        disabled={loading}
                    />
                </Paper>
            </Box>
        </>
    );
}

export default AdminSensorsPage;
