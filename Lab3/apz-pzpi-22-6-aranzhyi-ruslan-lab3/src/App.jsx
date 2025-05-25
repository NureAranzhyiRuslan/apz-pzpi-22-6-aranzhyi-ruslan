import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import AuthPage from "./pages/AuthPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import SensorsPage from "./pages/SensorsPage.jsx";
import SensorInfoPage from "./pages/SensorInfoPage.jsx";
import AdminUsersPage from "./pages/admin/UsersPage.jsx";
import AdminUserInfoPage from "./pages/admin/UserInfoPage.jsx";
import AdminSensorsPage from "./pages/admin/SensorsPage.jsx";
import AdminSensorInfoPage from "./pages/admin/SensorInfoPage.jsx";
import {useAppStore} from "./state.js";
import ForecastPage from "./pages/ForecastPage.jsx";
import AdminCitiesPage from "./pages/admin/CitiesPage.jsx";
import AdminCityInfoPage from "./pages/admin/CityInfoPage.jsx";
import AdminMeasurementsPage from "./pages/admin/MeasurementsPage.jsx";
import AdminBackupsPage from "./pages/admin/BackupsPage.jsx";

function AuthGuard({component}) {
    const token = useAppStore(state => state.authToken);
    const Component = component;

    if(token !== null)
        return <Component/>

    return <Navigate to="/login" replace/>;
}

function NoAuthGuard({component}) {
    const token = useAppStore(state => state.authToken);
    const Component = component;

    if(token === null)
        return <Component/>

    return <Navigate to="/sensors" replace/>;
}

function App() {
    const def = <Navigate to="/login" replace/>;

    return (
        <BrowserRouter>
            <Routes>
                <Route index path="/" element={def}/>
                <Route path="/login" element={<NoAuthGuard component={AuthPage}/>}/>
                <Route path="/register" element={<NoAuthGuard component={RegisterPage}/>}/>
                <Route path="/sensors" element={<AuthGuard component={SensorsPage}/>}/>
                <Route path="/sensors/:sensorId" element={<AuthGuard component={SensorInfoPage}/>}/>
                <Route path="/forecast" element={<AuthGuard component={ForecastPage}/>}/>

                <Route path="/admin/users" element={<AuthGuard component={AdminUsersPage}/>}/>
                <Route path="/admin/users/:userId" element={<AuthGuard component={AdminUserInfoPage}/>}/>
                <Route path="/admin/cities" element={<AuthGuard component={AdminCitiesPage}/>}/>
                <Route path="/admin/cities/:cityId" element={<AuthGuard component={AdminCityInfoPage}/>}/>
                <Route path="/admin/sensors" element={<AuthGuard component={AdminSensorsPage}/>}/>
                <Route path="/admin/sensors/:sensorId" element={<AuthGuard component={AdminSensorInfoPage}/>}/>
                <Route path="/admin/measurements" element={<AuthGuard component={AdminMeasurementsPage}/>}/>
                <Route path="/admin/backups" element={<AuthGuard component={AdminBackupsPage}/>}/>

                <Route path="*" element={def}/>
            </Routes>
        </BrowserRouter>
    )
}

export default App;
