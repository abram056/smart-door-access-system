import './App.css'
import { AuthProvider } from './contexts/AuthContext'
import AppRoutes from './routes/AppRoutes'

/**
 * App is the root component for the dashboard.
 */
const App = () => {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  )
}

export default App
