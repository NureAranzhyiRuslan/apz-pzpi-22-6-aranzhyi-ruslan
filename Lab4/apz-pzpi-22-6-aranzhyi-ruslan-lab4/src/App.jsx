import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import AuthPage from "./pages/AuthPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import SensorsPage from "./pages/SensorsPage.jsx";

function App() {
    const def = <Navigate to="/login" replace/>;

    return (
        <BrowserRouter>
            <Routes>
                <Route index path="/" element={def}/>
                <Route path="/login" element={<AuthPage/>}/>
                <Route path="/register" element={<RegisterPage/>}/>
                <Route path="/sensors" element={<SensorsPage/>}/>

                <Route path="*" element={def}/>
            </Routes>
        </BrowserRouter>
    )
}

export default App
