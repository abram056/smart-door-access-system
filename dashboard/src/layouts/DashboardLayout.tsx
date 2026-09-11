import type { ReactNode } from 'react'
import Header from '../components/layout/Header'
import Sidebar from '../components/layout/Sidebar'

interface DashboardLayoutProps {
    children: ReactNode
}

/**
 * DashboardLayout wraps the main dashboard content.
 */
const DashboardLayout = ({ children }: DashboardLayoutProps) => {
    return (
        <div className="dashboard-layout">
            <Sidebar />
            <div className="dashboard-main">
                <Header />
                <main className="dashboard-content">{children}</main>
            </div>
        </div>
    )
}

export default DashboardLayout
