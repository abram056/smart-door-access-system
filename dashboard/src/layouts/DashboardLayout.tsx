import type { ReactNode } from 'react'

interface DashboardLayoutProps {
    children: ReactNode
}

/**
 * DashboardLayout wraps the main dashboard content.
 */
const DashboardLayout = ({ children }: DashboardLayoutProps) => {
    return <div className="dashboard-layout">{children}</div>
}

export default DashboardLayout
