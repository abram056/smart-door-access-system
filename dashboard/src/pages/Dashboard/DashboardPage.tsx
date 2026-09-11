import { useMemo } from 'react'
import type { AccessLog, Device } from '@smartdoor/shared'
import useFetch from '../../hooks/useFetch'
import SystemSummary from '../../components/common/SystemSummary'
import DeviceStatusWidget from '../../components/common/DeviceStatusWidget'
import RecentActivity from '../../components/common/RecentActivity'
import QuickActions from '../../components/common/QuickActions'

interface PaginatedResult<T> {
    items: T[]
    pagination: {
        page: number
        pageSize: number
        totalItems: number
        totalPages: number
    }
}

/**
 * DashboardPage is the main analytics and navigation screen.
 */
const DashboardPage = () => {
    const usersRes = useFetch<PaginatedResult<{ id: string }>>('/api/users?pageSize=1')
    const cardsRes = useFetch<PaginatedResult<{ id: string }>>('/api/cards?pageSize=1')
    const devicesRes = useFetch<PaginatedResult<Device>>('/api/devices')
    const logsRes = useFetch<PaginatedResult<AccessLog>>('/api/logs?pageSize=10')

    const todayAccessCount = useMemo(() => {
        if (!logsRes.data?.items) return 0
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        return logsRes.data.items.filter((log) => {
            const logDate = new Date(log.timestamp)
            logDate.setHours(0, 0, 0, 0)
            return logDate.getTime() === today.getTime()
        }).length
    }, [logsRes.data])

    const recentLogs = useMemo(() => {
        if (!logsRes.data?.items) return []
        return logsRes.data.items.slice(0, 10)
    }, [logsRes.data])

    const isLoading =
        usersRes.loading ||
        cardsRes.loading ||
        devicesRes.loading ||
        logsRes.loading

    return (
        <>
            <h1>Dashboard</h1>

            <SystemSummary
                usersCount={usersRes.data?.pagination.totalItems ?? 0}
                cardsCount={cardsRes.data?.pagination.totalItems ?? 0}
                devicesCount={devicesRes.data?.items?.length ?? 0}
                todayAccessCount={todayAccessCount}
                loading={isLoading}
            />

            <div className="widgets-grid">
                <DeviceStatusWidget
                    devices={devicesRes.data?.items ?? []}
                    loading={devicesRes.loading}
                    error={devicesRes.error}
                />
                <RecentActivity
                    logs={recentLogs}
                    loading={logsRes.loading}
                    error={logsRes.error}
                />
            </div>

            <QuickActions />
        </>
    )
}

export default DashboardPage
