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
    Typography,
} from "@mui/material";
import UsersTableItem from "../../components/admin/UsersTableItem.jsx";

function CenteredRow({children}) {
    return (
        <TableRow>
            <TableCell colSpan={4} align="center">
                {children}
            </TableCell>
        </TableRow>
    )
}

function AdminUsersPage() {
    const [users, setUsers] = useState([]);
    const [usersCount, setUsersCount] = useState(0);

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [loading, setLoading] = useState(false);

    const fetchUsers = async () => {
        // TODO: fetch via api
        setLoading(true);
        const fakeUsers = Array.from({ length: rowsPerPage }, (_, i) => ({
            id: rowsPerPage * page + i,
            name: `User ${rowsPerPage * page + i}`,
            email: `user${rowsPerPage * page + i}@example.com`,
        }));

        await new Promise(resolve => setTimeout(resolve, 1500));

        setUsers(fakeUsers);
        setUsersCount(125);
        setLoading(false);
    }

    useEffect(() => {
        fetchUsers();
    }, [page, rowsPerPage]);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    return (
        <Box p={3}>
            <Typography variant="h5" mb={2}>
                Users
            </Typography>

            <Paper>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            loading
                                ? (
                                    <CenteredRow>
                                        <CircularProgress/>
                                    </CenteredRow>
                                )
                                : users.map(user => <UsersTableItem user={user}/>)
                        }

                        {!loading && users.length === 0 && (
                            <CenteredRow>
                                No users found.
                            </CenteredRow>
                        )}
                    </TableBody>
                </Table>

                <TablePagination
                    component="div"
                    count={usersCount}
                    page={page}
                    onPageChange={handleChangePage}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    rowsPerPageOptions={[5, 10, 25, 50]}
                    disabled={loading}
                />
            </Paper>
        </Box>
    );
}

export default AdminUsersPage;
