import { Device, DeviceStatus as DeviceStatusEnum } from '@smartdoor/shared'

interface DeviceStatusWidgetProps {
    devices: Device[]
    loading: boolean
    error: Error | null
}

const getStatusColor = (status: string) => {
    switch (status) {
        case DeviceStatusEnum.ONLINE:
            return '#10b981'
        case DeviceStatusEnum.OFFLINE:
            return '#ef4444'
        case DeviceStatusEnum.DISABLED:
            return '#6b7280'
        default:
            return '#6b7280'
    }
}

const formatLastSeen = (date: Date) => {
    const lastSeen = new Date(date)
    const now = new Date()
    const diff = now.getTime() - lastSeen.getTime()
    const seconds = Math.floor(diff / 1000)
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)

    if (seconds < 60) return 'just now'
    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    return `${days}d ago`
}

const DeviceStatusWidget = ({ devices, loading, error }: DeviceStatusWidgetProps) => {
    if (error) {
        return (
            <section style={{ marginBottom: '2rem' }}>
                <h2>Device Status</h2>
                <p style={{ color: '#ef4444' }}>Failed to load devices</p>
            </section>
        )
    }

    return (
        <section style={{ marginBottom: '2rem' }}>
            <h2>Device Status</h2>
            {loading ? (
                <p>Loading...</p>
            ) : devices.length === 0 ? (
                <p style={{ color: '#6b7280' }}>No devices registered yet.</p>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {devices.map((device) => (
                        <div
                            key={device.id}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                padding: '1rem',
                                border: '1px solid #e5e7eb',
                                borderRadius: '0.5rem',
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <div
                                    style={{
                                        width: '12px',
                                        height: '12px',
                                        borderRadius: '50%',
                                        backgroundColor: getStatusColor(device.status),
                                    }}
                                />
                                <div>
                                    <p style={{ margin: 0, fontWeight: '600' }}>{device.name}</p>
                                    <p style={{ margin: '0.25rem 0 0 0', color: '#6b7280', fontSize: '0.875rem' }}>
                                        {device.status}
                                    </p>
                                </div>
                            </div>
                            <p style={{ margin: 0, color: '#6b7280', fontSize: '0.875rem' }}>
                                Last seen: {formatLastSeen(device.lastSeen)}
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </section>
    )
}

export default DeviceStatusWidget
