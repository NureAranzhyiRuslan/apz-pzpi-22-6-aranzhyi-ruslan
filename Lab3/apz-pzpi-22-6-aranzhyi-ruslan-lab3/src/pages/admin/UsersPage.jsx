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
import UsersTableItem from "../../components/admin/UsersTableItem.jsx";
import CenteredTableRow from "../../components/CenteredTableRow.jsx";
import Navigation from "../../components/Navigation.jsx";
import {apiAdminGetUsers} from "../../api.js";
import {useAppStore} from "../../state.js";
import {useSnackbar} from "notistack";


function AdminUsersPage() {
    const token = useAppStore(state => state.authToken);

    const [users, setUsers] = useState([]);
    const [usersCount, setUsersCount] = useState(0);

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [loading, setLoading] = useState(false);

    const { enqueueSnackbar } = useSnackbar();

    const fetchUsers = async () => {
        setLoading(true);

        const usersResp = await apiAdminGetUsers(token, page + 1, rowsPerPage, enqueueSnackbar);
        if(!usersResp) return setLoading(false);

        setUsers(usersResp.result);
        setUsersCount(usersResp.count);
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
        <>
            <Navigation title="Users"/>

            <Box p={3}>
                <Paper>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>ID</TableCell>
                                <TableCell>First Name</TableCell>
                                <TableCell>Last Name</TableCell>
                                <TableCell>Email</TableCell>
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
                                    : users.map(user => <UsersTableItem user={user}/>)
                            }

                            {!loading && users.length === 0 && (
                                <CenteredTableRow>
                                    No users found.
                                </CenteredTableRow>
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
        </>
    );
}

export default AdminUsersPage;
