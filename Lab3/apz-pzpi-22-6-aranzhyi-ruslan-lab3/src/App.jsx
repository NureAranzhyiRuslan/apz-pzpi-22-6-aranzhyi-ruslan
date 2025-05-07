import {SnackbarProvider} from "notistack";
import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import AuthPage from "./pages/AuthPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";

function SnackbarWrapper({children}) {
    return (
        <SnackbarProvider maxSnack={10} anchorOrigin={{vertical: "bottom", horizontal: "right"}} autoHideDuration={3000}>
            {children}
        </SnackbarProvider>
    )
}

function App() {
    const def = <Navigate to="/login" replace/>;

    return (
        <BrowserRouter>
            <Routes>
                <Route index path="/" element={def}/>
                <Route path="/login" element={<AuthPage/>}/>
                <Route path="/register" element={<RegisterPage/>}/>

                <Route path="*" element={def}/>
            </Routes>
        </BrowserRouter>
    )
}

export default App
