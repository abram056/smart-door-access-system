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
        <header
            style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '1rem',
                backgroundColor: '#ffffff',
                borderBottom: '1px solid #e5e7eb',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            }}
        >
            <h2 style={{ margin: 0 }}>Smart Door Dashboard</h2>
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
