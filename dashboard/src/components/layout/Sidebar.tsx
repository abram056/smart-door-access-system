import { Link, useLocation } from 'react-router-dom'
import { ROUTES } from '../../constants/appConstants'

const navigationItems = [
    { label: 'Overview', to: ROUTES.DASHBOARD },
    { label: 'Users', to: ROUTES.USERS },
    { label: 'Cards', to: ROUTES.CARDS },
    { label: 'Doors & Devices', to: ROUTES.DEVICES },
    { label: 'Logs', to: ROUTES.LOGS },
    { label: 'Settings', to: ROUTES.SETTINGS },
]

const Sidebar = () => {
    const location = useLocation()

    return (
        <aside>
            <h2>Smart Door</h2>
            <nav>
                <ul>
                    {navigationItems.map((item) => {
                        const isActive = location.pathname === item.to

                        return (
                            <li key={item.to}>
                                <Link to={item.to} style={{ fontWeight: isActive ? '700' : '400' }}>
                                    {item.label}
                                </Link>
                            </li>
                        )
                    })}
                </ul>
            </nav>
        </aside>
    )
}

export default Sidebar
