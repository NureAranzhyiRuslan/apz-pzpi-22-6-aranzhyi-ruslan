import React, {useEffect, useState} from "react";
import {Box, Button, MenuItem, Select, Stack, TextField,} from "@mui/material";
import {useNavigate, useParams} from "react-router-dom";
import {useSnackbar} from "notistack";
import Navigation from "../../components/Navigation.jsx";
import {apiAdminDeleteUser, apiAdminGetUser, apiAdminUpdateUser} from "../../api.js";
import {useAppStore} from "../../state.js";

function AdminUserInfoPage() {
    const token = useAppStore(state => state.authToken);
    const { userId } = useParams();

    const [user, setUser] = useState(null);
    const [userFirst, setUserFirst] = useState(null);
    const [userLast, setUserLast] = useState(null);
    const [userEmail, setUserEmail] = useState(null);
    const [userRole, setUserRole] = useState(null);

    const [loading, setLoading] = useState(false);
    const { enqueueSnackbar } = useSnackbar();
    const navigate = useNavigate();

    useEffect(() => {
        (async () => {
            setLoading(true);
            const userInfo = await apiAdminGetUser(token, userId, enqueueSnackbar);
            if(!userInfo) return;
            setUser(userInfo);
            setUserFirst(userInfo.first_name);
            setUserLast(userInfo.last_name);
            setUserEmail(userInfo.email);
            setUserRole(userInfo.role);

            setLoading(false)
        })();
    }, [userId]);

    const saveUser = async () => {
        setLoading(true);

        const updUser = await apiAdminUpdateUser(token, user.id, userFirst, userLast, userEmail, userRole, enqueueSnackbar);
        if(updUser) {
            setUser(updUser);
            setUserFirst(updUser.first_name);
            setUserLast(updUser.last_name);
            setUserEmail(updUser.email);
            setUserRole(updUser.role);
            enqueueSnackbar("User info updated!", {variant: "info"});
        }

        setLoading(false);
    }

    const deleteUser = async () => {
        setLoading(true);

        if(await apiAdminDeleteUser(token, user.id, enqueueSnackbar)) {
            enqueueSnackbar("User deleted!", {variant: "info"});
            navigate("/admin/users");
        }

        setLoading(false);
    }

    return (
        <>
            <Navigation title={`User ${userId}`}/>

            <Box p={3}>
                <Stack spacing={2} maxWidth={400}>
                    <TextField label="First Name" value={userFirst ? userFirst : ""} disabled={loading} onChange={(e) => setUserFirst(e.target.value)} />
                    <TextField label="Last Name" value={userLast ? userLast : ""} disabled={loading} onChange={(e) => setUserLast(e.target.value)} />
                    <TextField label="Email" value={userEmail ? userEmail : ""} disabled={loading} onChange={(e) => setUserEmail(e.target.value)} />
                    <Select label="Role" value={userRole ? userRole : 0} disabled={loading} onChange={(e) => setUserRole(e.target.value)}>
                        <MenuItem value={0}>Regular user</MenuItem>
                        <MenuItem value={999}>Admin</MenuItem>
                    </Select>

                    <Stack direction="row" spacing={2}>
                        <Button variant="contained" color="primary" onClick={saveUser} disabled={loading}>
                            Save
                        </Button>
                        <Button variant="outlined" color="error" onClick={deleteUser} disabled={loading}>
                            Delete User
                        </Button>
                    </Stack>
                </Stack>
            </Box>
        </>
    );
}

export default AdminUserInfoPage;
