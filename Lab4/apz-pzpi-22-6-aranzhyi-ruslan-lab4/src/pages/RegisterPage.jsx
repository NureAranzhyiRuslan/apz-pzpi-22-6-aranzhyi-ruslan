import React from "react";
import {Box, Button, CircularProgress, Link, Paper, TextField, Typography,} from "@mui/material";
import {useForm} from "react-hook-form";
import {useSnackbar} from "notistack";
import {useNavigate} from "react-router-dom";
import {useAppStore} from "../state.js";
import {apiGetUser, apiRegister} from "../api.js";

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
        if(data.password !== data.password_repeat) {
            enqueueSnackbar("Passwords do not match!", {variant: "warning"});
            return;
        }

        const registerJson = await apiRegister(data.email, data.password, data.first_name, data.last_name, enqueueSnackbar);
        if(!registerJson)
            return;

        const userInfoJson = await apiGetUser(registerJson.token);
        if(!userInfoJson)
            return;

        setToken(registerJson.token);
        setUserId(userInfoJson.id);
        setRole(userInfoJson.role);
        setUserName(userInfoJson.first_name);

        enqueueSnackbar("Registered successfully!", {variant: "success"});
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
                    Sign Up
                </Typography>

                <form onSubmit={handleSubmit(onSubmit)} noValidate>
                    <TextField
                        fullWidth
                        label="First name"
                        type="text"
                        margin="normal"
                        {...register("first_name", { required: "First name is required" })}
                        error={!!errors.first_name}
                        helperText={errors.first_name?.message}
                    />
                    <TextField
                        fullWidth
                        label="Last name"
                        type="text"
                        margin="normal"
                        {...register("last_name", { required: "Last name is required" })}
                        error={!!errors.last_name}
                        helperText={errors.last_name?.message}
                    />

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
                    <TextField
                        fullWidth
                        label="Repeat password"
                        type="password"
                        margin="normal"
                        {...register("password_repeat", { required: "Password is required" })}
                        error={!!errors.password_repeat}
                        helperText={errors.password_repeat?.message}
                    />

                    <Button
                        fullWidth
                        variant="contained"
                        color="primary"
                        type="submit"
                        disabled={isSubmitting}
                        sx={{ mt: 2 }}
                    >
                        {isSubmitting ? <CircularProgress size={24} /> : "Sign Up"}
                    </Button>
                </form>
                <Typography textAlign="left">
                    <Link href="#" onClick={() => navigate("/login")}>Login instead</Link>
                </Typography>
            </Paper>
        </Box>
    );
};

export default AuthPage;
