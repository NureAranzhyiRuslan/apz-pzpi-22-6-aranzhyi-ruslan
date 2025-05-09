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

function AdminSensorsPage() {
    const [sensors, setSensors] = useState([]);
    const [sensorsCount, setSensorsCount] = useState(0);

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [loading, setLoading] = useState(false);

    const fetchSensors = async () => {
        // TODO: fetch via api
        setLoading(true);
        const fakeSensors = Array.from({ length: rowsPerPage }, (_, i) => ({
            id: rowsPerPage * page + i,
            name: `Sensor ${rowsPerPage * page + i}`,
            city: {
                id: 123,
                name: "idk",
            },
            owner: {
                id: 1,
                email: "some_user@example.com",
            },
        }));

        await new Promise(resolve => setTimeout(resolve, 1500));

        setSensors(fakeSensors);
        setSensorsCount(125);
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
