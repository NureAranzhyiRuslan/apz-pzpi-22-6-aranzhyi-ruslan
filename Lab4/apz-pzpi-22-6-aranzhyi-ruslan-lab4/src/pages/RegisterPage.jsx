import React from "react";
import {
    Box,
    Button,
    Paper,
    TextField,
    Typography,
    CircularProgress, Link,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { useSnackbar } from "notistack";
import {useNavigate} from "react-router-dom";
import {useAppStore} from "../state.js";

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

    const onSubmit = async (data) => {
        console.log("Register data:", data);
        await new Promise((resolve) => setTimeout(resolve, 5000));

        // TODO: register

        enqueueSnackbar("Registered successfully!", {variant: "success"});
        setToken("[TODO: actual token]");
        setUserId(123);
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
