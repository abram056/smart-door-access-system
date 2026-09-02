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
        <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', minHeight: '100vh' }}>
            <Sidebar />
            <div>
                <Header />
                <main style={{ padding: '1rem' }}>{children}</main>
            </div>
        </div>
    )
}

export default DashboardLayout
