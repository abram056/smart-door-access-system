import { useState, useMemo } from 'react'
import { AccessLog, AccessDecision } from '@smartdoor/shared'
import useFetch from '../../hooks/useFetch'

interface LogsResponse {
    data: AccessLog[]
}

/**
 * LogsPage shows searchable access logs with filters.
 */
const LogsPage = () => {
    const logsRes = useFetch<LogsResponse>('/api/logs?limit=1000')
    const [search, setSearch] = useState('')
    const [filterDoor, setFilterDoor] = useState('')
    const [filterUser, setFilterUser] = useState('')
    const [filterResult, setFilterResult] = useState('')
    const [filterDate, setFilterDate] = useState('')

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
        return time.toLocaleString('en-US', { dateStyle: 'short', timeStyle: 'short' })
    }

    const formatDate = (date: Date) => {
        const d = new Date(date)
        return d.toISOString().split('T')[0]
    }

    const filteredLogs = useMemo(() => {
        if (!logsRes.data?.data) return []

        return logsRes.data.data.filter((log) => {
            const searchLower = search.toLowerCase()
            const matchesSearch =
                !search ||
                log.username.toLowerCase().includes(searchLower) ||
                log.uid.toLowerCase().includes(searchLower) ||
                log.doorId.toLowerCase().includes(searchLower)

            const matchesDoor = !filterDoor || log.doorId === filterDoor
            const matchesUser = !filterUser || log.username === filterUser
            const matchesResult = !filterResult || log.decision === filterResult
            const matchesDate = !filterDate || formatDate(log.timestamp) === filterDate

            return matchesSearch && matchesDoor && matchesUser && matchesResult && matchesDate
        })
    }, [logsRes.data, search, filterDoor, filterUser, filterResult, filterDate])

    const uniqueDoors = useMemo(() => {
        if (!logsRes.data?.data) return []
        return [...new Set(logsRes.data.data.map((log) => log.doorId))]
    }, [logsRes.data])

    const uniqueUsers = useMemo(() => {
        if (!logsRes.data?.data) return []
        return [...new Set(logsRes.data.data.map((log) => log.username))]
    }, [logsRes.data])

    return (
        <>
            <h1>Access Logs</h1>

            <div
                style={{
                    marginBottom: '1.5rem',
                    padding: '1rem',
                    backgroundColor: '#f9fafb',
                    borderRadius: '0.5rem',
                    border: '1px solid #e5e7eb',
                }}
            >
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', marginBottom: '1rem' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: '500' }}>Search (name/UID/door)</label>
                        <input
                            type="text"
                            placeholder="Search..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            style={{ width: '100%', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '0.375rem' }}
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: '500' }}>Date</label>
                        <input
                            type="date"
                            value={filterDate}
                            onChange={(e) => setFilterDate(e.target.value)}
                            style={{ width: '100%', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '0.375rem' }}
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: '500' }}>Door</label>
                        <select
                            value={filterDoor}
                            onChange={(e) => setFilterDoor(e.target.value)}
                            style={{ width: '100%', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '0.375rem' }}
                        >
                            <option value="">-- All Doors --</option>
                            {uniqueDoors.map((door) => (
                                <option key={door} value={door}>
                                    {door}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: '500' }}>User</label>
                        <select
                            value={filterUser}
                            onChange={(e) => setFilterUser(e.target.value)}
                            style={{ width: '100%', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '0.375rem' }}
                        >
                            <option value="">-- All Users --</option>
                            {uniqueUsers.map((user) => (
                                <option key={user} value={user}>
                                    {user}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: '500' }}>Result</label>
                        <select
                            value={filterResult}
                            onChange={(e) => setFilterResult(e.target.value)}
                            style={{ width: '100%', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '0.375rem' }}
                        >
                            <option value="">-- All Results --</option>
                            <option value={AccessDecision.GRANTED}>Granted</option>
                            <option value={AccessDecision.DENIED}>Denied</option>
                            <option value={AccessDecision.OFFLINE_GRANTED}>Granted (Offline)</option>
                            <option value={AccessDecision.OFFLINE_DENIED}>Denied (Offline)</option>
                        </select>
                    </div>
                </div>
                <button
                    onClick={() => {
                        setSearch('')
                        setFilterDoor('')
                        setFilterUser('')
                        setFilterResult('')
                        setFilterDate('')
                    }}
                    style={{
                        padding: '0.5rem 1rem',
                        backgroundColor: '#6b7280',
                        color: 'white',
                        border: 'none',
                        borderRadius: '0.375rem',
                        cursor: 'pointer',
                    }}
                >
                    Clear Filters
                </button>
            </div>

            {logsRes.loading && <p>Loading logs...</p>}
            {logsRes.error && <p style={{ color: '#ef4444' }}>Failed to load logs</p>}

            <p style={{ color: '#6b7280', marginBottom: '1rem' }}>Showing {filteredLogs.length} entries</p>

            {filteredLogs.length > 0 && (
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
                            <th style={{ textAlign: 'left', padding: '0.75rem' }}>Time</th>
                            <th style={{ textAlign: 'left', padding: '0.75rem' }}>Door</th>
                            <th style={{ textAlign: 'left', padding: '0.75rem' }}>User</th>
                            <th style={{ textAlign: 'left', padding: '0.75rem' }}>UID</th>
                            <th style={{ textAlign: 'left', padding: '0.75rem' }}>Result</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredLogs.map((log) => (
                            <tr key={log.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                                <td style={{ padding: '0.75rem', fontSize: '0.875rem' }}>{formatTime(log.timestamp)}</td>
                                <td style={{ padding: '0.75rem' }}>{log.doorId}</td>
                                <td style={{ padding: '0.75rem' }}>{log.username || 'Unknown'}</td>
                                <td style={{ padding: '0.75rem', fontFamily: 'monospace', fontSize: '0.875rem' }}>{log.uid}</td>
                                <td style={{ padding: '0.75rem' }}>
                                    <span
                                        style={{
                                            padding: '0.25rem 0.75rem',
                                            backgroundColor: getDecisionColor(log.decision),
                                            color: 'white',
                                            borderRadius: '0.25rem',
                                            fontSize: '0.875rem',
                                            fontWeight: '600',
                                        }}
                                    >
                                        {getDecisionLabel(log.decision)}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {filteredLogs.length === 0 && !logsRes.loading && (
                <p style={{ color: '#6b7280', textAlign: 'center', paddingTop: '2rem' }}>No logs match your filters.</p>
            )}
        </>
    )
}

export default LogsPage
