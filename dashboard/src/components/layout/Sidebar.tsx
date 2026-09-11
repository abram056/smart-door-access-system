import { useState } from 'react'
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
    const [mobileOpen, setMobileOpen] = useState(false)

    return (
        <>
            <button className="mobile-menu-toggle" onClick={() => setMobileOpen(!mobileOpen)}>
                ☰
            </button>
            <aside className={`sidebar ${mobileOpen ? 'sidebar--open' : ''}`}>
                <h2 className="sidebar-title">Smart Door</h2>
                <nav>
                    <ul className="sidebar-nav">
                        {navigationItems.map((item) => {
                            const isActive = location.pathname === item.to
                            return (
                                <li key={item.to} className="sidebar-nav-item">
                                    <Link
                                        to={item.to}
                                        className={`sidebar-link ${isActive ? 'sidebar-link--active' : ''}`}
                                        onClick={() => setMobileOpen(false)}
                                    >
                                        {item.label}
                                    </Link>
                                </li>
                            )
                        })}
                    </ul>
                </nav>
            </aside>
            {mobileOpen && <div className="sidebar-overlay" onClick={() => setMobileOpen(false)} />}
        </>
    )
}

export default Sidebar
