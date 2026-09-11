import { useNavigate } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'

/**
 * Header component provides the main dashboard top bar.
 */
const Header = () => {
    const navigate = useNavigate()
    const { logout } = useAuth()

    const handleLogout = async () => {
        await logout()
        navigate('/login')
    }

    return (
        <header className="header">
            <h2 className="header-title">Smart Door Dashboard</h2>
            <button
                onClick={handleLogout}
                style={{
                    padding: '0.5rem 1rem',
                    backgroundColor: '#ef4444',
                    color: 'white',
                    border: 'none',
                    borderRadius: '0.375rem',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                }}
            >
                Logout
            </button>
        </header>
    )
}

export default Header
