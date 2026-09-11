import { useState, useMemo } from 'react'
import type { AccessLog } from '@smartdoor/shared'
import { AccessResult } from '@smartdoor/shared'
import useFetch from '../../hooks/useFetch'

interface PaginatedLogs {
    items: AccessLog[]
    pagination: {
        page: number
        pageSize: number
        totalItems: number
        totalPages: number
    }
}

const PAGE_SIZE = 25

const buildLogsEndpoint = (filters: {
    page: number
    search: string
    filterDoor: string
    filterUser: string
    filterResult: string
    filterDate: string
}) => {
    const params = new URLSearchParams()
    params.set('page', String(filters.page))
    params.set('pageSize', String(PAGE_SIZE))
    if (filters.search) params.set('search', filters.search)
    if (filters.filterDoor) params.set('doorId', filters.filterDoor)
    if (filters.filterUser) params.set('userId', filters.filterUser)
    if (filters.filterResult) params.set('result', filters.filterResult)
    if (filters.filterDate) {
        const start = new Date(filters.filterDate)
        start.setHours(0, 0, 0, 0)
        const end = new Date(filters.filterDate)
        end.setHours(23, 59, 59, 999)
        params.set('dateFrom', start.toISOString())
        params.set('dateTo', end.toISOString())
    }
    return `/api/logs?${params.toString()}`
}

/**
 * LogsPage shows searchable access logs with server-side filtering.
 */
const LogsPage = () => {
    const [page, setPage] = useState(1)
    const [search, setSearch] = useState('')
    const [filterDoor, setFilterDoor] = useState('')
    const [filterUser, setFilterUser] = useState('')
    const [filterResult, setFilterResult] = useState('')
    const [filterDate, setFilterDate] = useState('')

    const endpoint = useMemo(
        () => buildLogsEndpoint({ page, search, filterDoor, filterUser, filterResult, filterDate }),
        [page, search, filterDoor, filterUser, filterResult, filterDate],
    )
    const { data, loading, error } = useFetch<PaginatedLogs>(endpoint)

    const getResultColor = (result: string) => {
        switch (result) {
            case AccessResult.GRANTED:
                return '#10b981'
            case AccessResult.DENIED:
                return '#ef4444'
            default:
                return '#6b7280'
        }
    }

    const getResultLabel = (result: string) => {
        switch (result) {
            case AccessResult.GRANTED:
                return 'Granted'
            case AccessResult.DENIED:
                return 'Denied'
            default:
                return result
        }
    }

    const formatTime = (date: string) => {
        const time = new Date(date)
        return time.toLocaleString('en-US', { dateStyle: 'short', timeStyle: 'short' })
    }

    const items = data?.items ?? []
    const pagination = data?.pagination

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
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: '500' }}>Search (UID)</label>
                        <input
                            type="text"
                            placeholder="Search..."
                            value={search}
                            onChange={(e) => { setSearch(e.target.value); setPage(1) }}
                            style={{ width: '100%', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '0.375rem' }}
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: '500' }}>Date</label>
                        <input
                            type="date"
                            value={filterDate}
                            onChange={(e) => { setFilterDate(e.target.value); setPage(1) }}
                            style={{ width: '100%', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '0.375rem' }}
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: '500' }}>Door ID</label>
                        <input
                            type="text"
                            placeholder="Door UUID..."
                            value={filterDoor}
                            onChange={(e) => { setFilterDoor(e.target.value); setPage(1) }}
                            style={{ width: '100%', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '0.375rem' }}
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: '500' }}>User ID</label>
                        <input
                            type="text"
                            placeholder="User UUID..."
                            value={filterUser}
                            onChange={(e) => { setFilterUser(e.target.value); setPage(1) }}
                            style={{ width: '100%', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '0.375rem' }}
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: '500' }}>Result</label>
                        <select
                            value={filterResult}
                            onChange={(e) => { setFilterResult(e.target.value); setPage(1) }}
                            style={{ width: '100%', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '0.375rem' }}
                        >
                            <option value="">-- All Results --</option>
                            <option value={AccessResult.GRANTED}>Granted</option>
                            <option value={AccessResult.DENIED}>Denied</option>
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
                        setPage(1)
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

            {loading && <p>Loading logs...</p>}
            {error && <p style={{ color: '#ef4444' }}>Failed to load logs</p>}

            <p style={{ color: '#6b7280', marginBottom: '1rem' }}>
                {pagination ? `Page ${pagination.page} of ${pagination.totalPages} (${pagination.totalItems} total)` : 'Loading...'}
            </p>

            {items.length > 0 && (
                <div className="table-scroll">
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
                                <th style={{ textAlign: 'left', padding: '0.75rem' }}>Time</th>
                                <th style={{ textAlign: 'left', padding: '0.75rem' }}>User</th>
                                <th style={{ textAlign: 'left', padding: '0.75rem' }}>UID</th>
                                <th style={{ textAlign: 'left', padding: '0.75rem' }}>Door</th>
                                <th style={{ textAlign: 'left', padding: '0.75rem' }}>Result</th>
                                <th style={{ textAlign: 'left', padding: '0.75rem' }}>Offline</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((log) => (
                                <tr key={log.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                                    <td style={{ padding: '0.75rem', fontSize: '0.875rem' }}>{formatTime(log.timestamp)}</td>
                                    <td style={{ padding: '0.75rem' }}>{log.userFullName || log.userId || '-'}</td>
                                    <td style={{ padding: '0.75rem', fontFamily: 'monospace', fontSize: '0.875rem' }}>{log.rfidUid || '-'}</td>
                                    <td style={{ padding: '0.75rem' }}>{log.doorName || log.doorId || '-'}</td>
                                    <td style={{ padding: '0.75rem' }}>
                                        <span
                                            style={{
                                                padding: '0.25rem 0.75rem',
                                                backgroundColor: getResultColor(log.result),
                                                color: 'white',
                                                borderRadius: '0.25rem',
                                                fontSize: '0.875rem',
                                                fontWeight: '600',
                                            }}
                                        >
                                            {getResultLabel(log.result)}
                                        </span>
                                    </td>
                                    <td style={{ padding: '0.75rem' }}>
                                        {log.offline && (
                                            <span
                                                style={{
                                                    padding: '0.25rem 0.5rem',
                                                    backgroundColor: '#fbbf24',
                                                    color: '#92400e',
                                                    borderRadius: '0.25rem',
                                                    fontSize: '0.75rem',
                                                    fontWeight: '600',
                                                }}
                                            >
                                                Offline
                                            </span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {items.length === 0 && !loading && (
                <p style={{ color: '#6b7280', textAlign: 'center', paddingTop: '2rem' }}>No logs match your filters.</p>
            )}

            {pagination && pagination.totalPages > 1 && (
                <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '1.5rem' }}>
                    <button
                        disabled={page <= 1}
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        style={{
                            padding: '0.5rem 1rem',
                            backgroundColor: page <= 1 ? '#d1d5db' : '#3b82f6',
                            color: 'white',
                            border: 'none',
                            borderRadius: '0.375rem',
                            cursor: page <= 1 ? 'not-allowed' : 'pointer',
                        }}
                    >
                        Previous
                    </button>
                    <span style={{ padding: '0.5rem 1rem', color: '#374151', fontWeight: '500' }}>
                        Page {page} / {pagination.totalPages}
                    </span>
                    <button
                        disabled={page >= pagination.totalPages}
                        onClick={() => setPage((p) => Math.min(pagination!.totalPages, p + 1))}
                        style={{
                            padding: '0.5rem 1rem',
                            backgroundColor: page >= pagination.totalPages ? '#d1d5db' : '#3b82f6',
                            color: 'white',
                            border: 'none',
                            borderRadius: '0.375rem',
                            cursor: page >= pagination.totalPages ? 'not-allowed' : 'pointer',
                        }}
                    >
                        Next
                    </button>
                </div>
            )}
        </>
    )
}

export default LogsPage
