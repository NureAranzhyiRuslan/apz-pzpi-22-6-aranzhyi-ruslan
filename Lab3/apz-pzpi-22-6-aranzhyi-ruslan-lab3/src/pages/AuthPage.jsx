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

const AuthPage = () => {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm();
    const { enqueueSnackbar } = useSnackbar();
    const navigate = useNavigate();

    const onSubmit = async (data) => {
        console.log("Login data:", data);
        await new Promise((resolve) => setTimeout(resolve, 5000));

        // TODO: login

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
