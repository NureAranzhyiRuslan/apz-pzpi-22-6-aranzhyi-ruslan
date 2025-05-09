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
import CitiesTableItem from "../../components/admin/CitiesTableItem.jsx";
import CenteredTableRow from "../../components/CenteredTableRow.jsx";
import Navigation from "../../components/Navigation.jsx";

function AdminCitiesPage() {
    const [cities, setCities] = useState([]);
    const [citiesCount, setCitiesCount] = useState(0);

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [loading, setLoading] = useState(false);

    const fetchCities = async () => {
        // TODO: fetch via api
        setLoading(true);
        const fakeCities = Array.from({ length: rowsPerPage }, (_, i) => ({
            id: rowsPerPage * page + i,
            name: `City ${rowsPerPage * page + i}`,
            latitude: (Math.random() * 180).toFixed(6),
            longitude: (Math.random() * 180).toFixed(6),
        }));

        await new Promise(resolve => setTimeout(resolve, 1500));

        setCities(fakeCities);
        setCitiesCount(125);
        setLoading(false);
    }

    useEffect(() => {
        fetchCities();
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
            <Navigation title="Cities"/>

            <Box p={3}>
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
            </Box>
        </>
    );
}

export default AdminCitiesPage;
