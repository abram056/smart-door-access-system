import { BrowserRouter, Route, Routes } from 'react-router-dom'
import LoginPage from '../pages/Login/LoginPage'
import DashboardPage from '../pages/Dashboard/DashboardPage'
import UsersPage from '../pages/Users/UsersPage'
import CardsPage from '../pages/Cards/CardsPage'
import DevicesPage from '../pages/Devices/DevicesPage'
import LogsPage from '../pages/Logs/LogsPage'
import SettingsPage from '../pages/Settings/SettingsPage'

/**
 * AppRoutes defines the application routing.
 */
const AppRoutes = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<DashboardPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/users" element={<UsersPage />} />
                <Route path="/cards" element={<CardsPage />} />
                <Route path="/devices" element={<DevicesPage />} />
                <Route path="/logs" element={<LogsPage />} />
                <Route path="/settings" element={<SettingsPage />} />
            </Routes>
        </BrowserRouter>
    )
}

export default AppRoutes
