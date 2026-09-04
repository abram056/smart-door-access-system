import { useMemo } from 'react'
import { AccessLog, Device } from '@smartdoor/shared'
import useFetch from '../../hooks/useFetch'
import SystemSummary from '../../components/common/SystemSummary'
import DeviceStatusWidget from '../../components/common/DeviceStatusWidget'
import RecentActivity from '../../components/common/RecentActivity'
import QuickActions from '../../components/common/QuickActions'

interface LogsResponse {
    data: AccessLog[]
}

interface DevicesResponse {
    data: Device[]
}

interface CountResponse {
    count: number
}

/**
 * DashboardPage is the main analytics and navigation screen.
 */
const DashboardPage = () => {
    const usersCountRes = useFetch<CountResponse>('/api/users/count')
    const cardsCountRes = useFetch<CountResponse>('/api/cards/count')
    const devicesRes = useFetch<DevicesResponse>('/api/devices')
    const logsRes = useFetch<LogsResponse>('/api/logs?limit=10')

    const todayAccessCount = useMemo(() => {
        if (!logsRes.data?.data) return 0
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        return logsRes.data.data.filter((log) => {
            const logDate = new Date(log.timestamp)
            logDate.setHours(0, 0, 0, 0)
            return logDate.getTime() === today.getTime()
        }).length
    }, [logsRes.data])

    const recentLogs = useMemo(() => {
        if (!logsRes.data?.data) return []
        return logsRes.data.data.slice(0, 10)
    }, [logsRes.data])

    const isLoading =
        usersCountRes.loading ||
        cardsCountRes.loading ||
        devicesRes.loading ||
        logsRes.loading

    return (
        <>
            <h1>Dashboard</h1>

            <SystemSummary
                usersCount={usersCountRes.data?.count ?? 0}
                cardsCount={cardsCountRes.data?.count ?? 0}
                devicesCount={devicesRes.data?.data?.length ?? 0}
                todayAccessCount={todayAccessCount}
                loading={isLoading}
            />

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
                <DeviceStatusWidget
                    devices={devicesRes.data?.data ?? []}
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
