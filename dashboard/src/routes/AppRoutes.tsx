import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { useAuthContext } from '../contexts/AuthContext'
import DashboardLayout from '../layouts/DashboardLayout'
import AuthLayout from '../layouts/AuthLayout'
import LoginPage from '../pages/Login/LoginPage'
import DashboardPage from '../pages/Dashboard/DashboardPage'
import UsersPage from '../pages/Users/UsersPage'
import CardsPage from '../pages/Cards/CardsPage'
import DevicesPage from '../pages/Devices/DevicesPage'
import LogsPage from '../pages/Logs/LogsPage'
import SettingsPage from '../pages/Settings/SettingsPage'

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const { isAuthenticated } = useAuthContext()

    return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />
}

/**
 * AppRoutes defines the application routing.
 */
const AppRoutes = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route
                    path="/login"
                    element={
                        <AuthLayout>
                            <LoginPage />
                        </AuthLayout>
                    }
                />
                <Route
                    path="/"
                    element={
                        <ProtectedRoute>
                            <DashboardLayout>
                                <DashboardPage />
                            </DashboardLayout>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/users"
                    element={
                        <ProtectedRoute>
                            <DashboardLayout>
                                <UsersPage />
                            </DashboardLayout>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/cards"
                    element={
                        <ProtectedRoute>
                            <DashboardLayout>
                                <CardsPage />
                            </DashboardLayout>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/devices"
                    element={
                        <ProtectedRoute>
                            <DashboardLayout>
                                <DevicesPage />
                            </DashboardLayout>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/logs"
                    element={
                        <ProtectedRoute>
                            <DashboardLayout>
                                <LogsPage />
                            </DashboardLayout>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/settings"
                    element={
                        <ProtectedRoute>
                            <DashboardLayout>
                                <SettingsPage />
                            </DashboardLayout>
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </BrowserRouter>
    )
}

export default AppRoutes
