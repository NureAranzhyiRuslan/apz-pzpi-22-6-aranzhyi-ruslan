import React from "react";
import {Box, Button, CircularProgress, Link, Paper, TextField, Typography,} from "@mui/material";
import {useForm} from "react-hook-form";
import {useSnackbar} from "notistack";
import {useNavigate} from "react-router-dom";
import {useAppStore} from "../state.js";
import {apiGetUser, apiLogin} from "../api.js";

const AuthPage = () => {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm();
    const { enqueueSnackbar } = useSnackbar();
    const navigate = useNavigate();

    const setToken = useAppStore(state => state.setToken);
    const setUserId = useAppStore(state => state.setUserId);
    const setRole = useAppStore(state => state.setRole);
    const setUserName = useAppStore(state => state.setUserName);

    const onSubmit = async (data) => {
        const loginJson = await apiLogin(data.email, data.password, enqueueSnackbar);
        if(!loginJson)
            return;

        const userInfoJson = await apiGetUser(loginJson.token);
        if(!userInfoJson)
            return;

        setToken(loginJson.token);
        setUserId(userInfoJson.id);
        setRole(userInfoJson.role);
        setUserName(userInfoJson.first_name);

        enqueueSnackbar("Logged in successfully!", {variant: "success"});
        navigate("/sensors");
    };

    return (
        <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="100%"
            width="100%"
        >
            <Paper elevation={3} sx={{ padding: 4, width: "100%", maxWidth: 400 }}>
                <Typography variant="h5" fontWeight="bold" mb={3} textAlign="center">
                    Sign In
                </Typography>

                <form onSubmit={handleSubmit(onSubmit)} noValidate>
                    <TextField
                        fullWidth
                        label="Email"
                        type="email"
                        margin="normal"
                        {...register("email", { required: "Email is required" })}
                        error={!!errors.email}
                        helperText={errors.email?.message}
                    />

                    <TextField
                        fullWidth
                        label="Password"
                        type="password"
                        margin="normal"
                        {...register("password", { required: "Password is required" })}
                        error={!!errors.password}
                        helperText={errors.password?.message}
                    />

                    <Button
                        fullWidth
                        variant="contained"
                        color="primary"
                        type="submit"
                        disabled={isSubmitting}
                        sx={{ mt: 2 }}
                    >
                        {isSubmitting ? <CircularProgress size={24} /> : "Sign In"}
                    </Button>
                </form>
                <Typography textAlign="left">
                    <Link href="#" onClick={() => navigate("/register")}>Register instead</Link>
                </Typography>
            </Paper>
        </Box>
    );
};

export default AuthPage;
