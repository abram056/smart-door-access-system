import { User } from '@smartdoor/shared'

interface SystemSummaryProps {
    usersCount: number
    cardsCount: number
    devicesCount: number
    todayAccessCount: number
    loading: boolean
}

const SystemSummary = ({
    usersCount,
    cardsCount,
    devicesCount,
    todayAccessCount,
    loading,
}: SystemSummaryProps) => {
    const items = [
        { label: 'Registered Users', value: usersCount },
        { label: 'Registered Cards', value: cardsCount },
        { label: 'Registered Devices', value: devicesCount },
        { label: "Today's Access Attempts", value: todayAccessCount },
    ]

    return (
        <section style={{ marginBottom: '2rem' }}>
            <h2>System Summary</h2>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
                    {items.map((item) => (
                        <div
                            key={item.label}
                            style={{
                                padding: '1.5rem',
                                border: '1px solid #e5e7eb',
                                borderRadius: '0.5rem',
                                textAlign: 'center',
                            }}
                        >
                            <p style={{ margin: '0 0 0.5rem 0', color: '#6b7280', fontSize: '0.875rem' }}>
                                {item.label}
                            </p>
                            <p style={{ margin: 0, fontSize: '2rem', fontWeight: '700' }}>{item.value}</p>
                        </div>
                    ))}
                </div>
            )}
        </section>
    )
}

export default SystemSummary
