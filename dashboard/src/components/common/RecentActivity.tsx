import { AccessLog, AccessDecision } from '@smartdoor/shared'

interface RecentActivityProps {
    logs: AccessLog[]
    loading: boolean
    error: Error | null
}

const getDecisionColor = (decision: string) => {
    switch (decision) {
        case AccessDecision.GRANTED:
        case AccessDecision.OFFLINE_GRANTED:
            return '#10b981'
        case AccessDecision.DENIED:
        case AccessDecision.OFFLINE_DENIED:
            return '#ef4444'
        default:
            return '#6b7280'
    }
}

const getDecisionLabel = (decision: string) => {
    switch (decision) {
        case AccessDecision.GRANTED:
            return 'Granted'
        case AccessDecision.DENIED:
            return 'Denied'
        case AccessDecision.OFFLINE_GRANTED:
            return 'Granted (Offline)'
        case AccessDecision.OFFLINE_DENIED:
            return 'Denied (Offline)'
        default:
            return decision
    }
}

const formatTime = (date: Date) => {
    const time = new Date(date)
    return time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })
}

const RecentActivity = ({ logs, loading, error }: RecentActivityProps) => {
    if (error) {
        return (
            <section style={{ marginBottom: '2rem' }}>
                <h2>Recent Activity</h2>
                <p style={{ color: '#ef4444' }}>Failed to load activity logs</p>
            </section>
        )
    }

    return (
        <section style={{ marginBottom: '2rem' }}>
            <h2>Recent Activity</h2>
            {loading ? (
                <p>Loading...</p>
            ) : logs.length === 0 ? (
                <p style={{ color: '#6b7280' }}>No access attempts recorded yet.</p>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {logs.map((log) => (
                        <div
                            key={log.id}
                            style={{
                                display: 'grid',
                                gridTemplateColumns: '1fr 1fr 1fr 1fr',
                                gap: '1rem',
                                alignItems: 'center',
                                padding: '1rem',
                                border: '1px solid #e5e7eb',
                                borderRadius: '0.5rem',
                            }}
                        >
                            <p style={{ margin: 0, fontSize: '0.875rem', color: '#6b7280' }}>
                                {formatTime(log.timestamp)}
                            </p>
                            <p style={{ margin: 0, fontWeight: '500' }}>{log.username || 'Unknown'}</p>
                            <p style={{ margin: 0, color: '#6b7280' }}>{log.doorId}</p>
                            <p
                                style={{
                                    margin: 0,
                                    fontWeight: '600',
                                    color: getDecisionColor(log.decision),
                                }}
                            >
                                {getDecisionLabel(log.decision)}
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </section>
    )
}

export default RecentActivity
