import React, {useState} from "react";
import {
    Box,
    Typography,
    TextField,
    Button,
    Stack,
} from "@mui/material";
import {useNavigate, useParams} from "react-router-dom";
import {useSnackbar} from "notistack";

function AdminUserInfoPage() {
    const { userId } = useParams();

    // TODO: fetch user info via api

    const [loading, setLoading] = useState(false);
    const { enqueueSnackbar } = useSnackbar();
    const navigate = useNavigate();

    // TODO: fetch sensor info via api

    const saveUser = async () => {
        setLoading(true);
        // TODO: delete user
        await new Promise(resolve => setTimeout(resolve, 1500));
        setLoading(false);
        enqueueSnackbar("User info updated!", {variant: "info"});
    }

    const deleteUser = async () => {
        setLoading(true);
        // TODO: delete user
        await new Promise(resolve => setTimeout(resolve, 1500));
        setLoading(false);
        enqueueSnackbar("User deleted!", {variant: "info"});
        navigate("/admin/users");
    }

    return (
        <Box p={3}>
            <Typography variant="h5" mb={2}>
                User {userId}
            </Typography>

            <Stack spacing={2} maxWidth={400}>
                <TextField label="Name" defaultValue="User name" disabled={loading} />
                <TextField label="Email" defaultValue="user@example.com" disabled={loading} />

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
    );
}

export default AdminUserInfoPage;
