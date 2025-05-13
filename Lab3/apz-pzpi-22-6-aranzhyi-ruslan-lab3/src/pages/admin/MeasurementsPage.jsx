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
import MeasurementsTableItem from "../../components/admin/MeasurementsTableItem.jsx";
import CenteredTableRow from "../../components/CenteredTableRow.jsx";
import Navigation from "../../components/Navigation.jsx";
import {useSnackbar} from "notistack";
import {useAppStore} from "../../state.js";
import {apiAdminGetMeasurements} from "../../api.js";

function AdminMeasurementsPage() {
    const token = useAppStore(state => state.authToken);

    const [measurements, setMeasurements] = useState([]);
    const [measurementsCount, setMeasurementsCount] = useState(0);

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [loading, setLoading] = useState(false);

    const { enqueueSnackbar } = useSnackbar();

    const fetchMeasurements = async () => {
        setLoading(true);

        const measurementsResp = await apiAdminGetMeasurements(token, page + 1, rowsPerPage, enqueueSnackbar);
        if(!measurementsResp) return setLoading(false);

        setMeasurements(measurementsResp.result);
        setMeasurementsCount(measurementsResp.count);
        setLoading(false);
    }

    useEffect(() => {
        fetchMeasurements();
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
            <Navigation title="Measurements"/>

            <Box p={3}>
                <Paper>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>ID</TableCell>
                                <TableCell>City</TableCell>
                                <TableCell>Sensor</TableCell>
                                <TableCell>Owner</TableCell>
                                <TableCell>Temperature</TableCell>
                                <TableCell>Pressure</TableCell>
                                <TableCell>Date</TableCell>
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
                                    : measurements.map(measurement => <MeasurementsTableItem measurement={measurement}/>)
                            }

                            {!loading && measurements.length === 0 && (
                                <CenteredTableRow>
                                    No measurements found.
                                </CenteredTableRow>
                            )}
                        </TableBody>
                    </Table>

                    <TablePagination
                        component="div"
                        count={measurementsCount}
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

export default AdminMeasurementsPage;
