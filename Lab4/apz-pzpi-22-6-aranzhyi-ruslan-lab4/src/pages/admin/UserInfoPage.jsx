import React from "react";
import {
    Box,
    Typography,
    TextField,
    Button,
    Stack,
} from "@mui/material";
import { useParams } from "react-router-dom";

function AdminUserInfoPage() {
    const { userId } = useParams();

    // TODO: fetch user info via api

    const saveUser = () => {
        // TODO: save user
    }

    const deleteUser = () => {
        // TODO: delete user
    }

    return (
        <Box p={3}>
            <Typography variant="h5" mb={2}>
                User {userId}
            </Typography>

            <Stack spacing={2} maxWidth={400}>
                <TextField label="Name" defaultValue="User name" />
                <TextField label="Email" defaultValue="user@example.com" />

                <Stack direction="row" spacing={2}>
                    <Button variant="contained" color="primary" onClick={saveUser}>
                        Save
                    </Button>
                    <Button variant="outlined" color="error" onClick={deleteUser}>
                        Delete User
                    </Button>
                </Stack>
            </Stack>
        </Box>
    );
}

export default AdminUserInfoPage;
