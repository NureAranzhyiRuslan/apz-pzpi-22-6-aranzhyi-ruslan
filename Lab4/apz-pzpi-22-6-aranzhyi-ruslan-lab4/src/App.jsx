import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import AuthPage from "./pages/AuthPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import SensorsPage from "./pages/SensorsPage.jsx";
import SensorInfoPage from "./pages/SensorInfoPage.jsx";
import AdminUsersPage from "./pages/admin/UsersPage.jsx";
import AdminUserInfoPage from "./pages/admin/UserInfoPage.jsx";

function App() {
    const def = <Navigate to="/login" replace/>;

    return (
        <BrowserRouter>
            <Routes>
                <Route index path="/" element={def}/>
                <Route path="/login" element={<AuthPage/>}/>
                <Route path="/register" element={<RegisterPage/>}/>
                <Route path="/sensors" element={<SensorsPage/>}/>
                <Route path="/sensors/:sensorId" element={<SensorInfoPage/>}/>

                <Route path="/admin/users" element={<AdminUsersPage/>}/>
                <Route path="/admin/users/:userId" element={<AdminUserInfoPage/>}/>

                <Route path="*" element={def}/>
            </Routes>
        </BrowserRouter>
    )
}

export default App
