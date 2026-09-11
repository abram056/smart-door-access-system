import { useState } from 'react'
import type { Device } from '@smartdoor/shared'
import { DeviceStatus as DeviceStatusEnum } from '@smartdoor/shared'
import useFetch from '../../hooks/useFetch'
import apiClient, { ApiError } from '../../services/api/apiClient'

interface PaginatedDevices {
    items: Device[]
    pagination: {
        page: number
        pageSize: number
        totalItems: number
        totalPages: number
    }
}

interface RegisterResponse {
    device_id: string
    device_token: string
}

/**
 * DevicesPage displays and manages registered devices.
 */
const DevicesPage = () => {
    const { data, loading, error, refetch } = useFetch<PaginatedDevices>('/api/devices')
    const [showRegister, setShowRegister] = useState(false)
    const [registrationData, setRegistrationData] = useState({ device_name: '', door_name: '' })
    const [registeredDevice, setRegisteredDevice] = useState<RegisterResponse | null>(null)
    const [formError, setFormError] = useState('')
    const [success, setSuccess] = useState('')

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

    const handleRegisterDevice = async (e: React.FormEvent) => {
        e.preventDefault()
        setFormError('')
        setSuccess('')

        try {
            const response = await apiClient.post<RegisterResponse>('/api/devices', registrationData)
            setRegisteredDevice(response)
            setSuccess('Device registered successfully')
            setRegistrationData({ device_name: '', door_name: '' })
            setTimeout(() => {
                setShowRegister(false)
                refetch()
            }, 2000)
        } catch (err) {
            if (err instanceof ApiError) {
                setFormError(err.message)
            } else {
                setFormError('Failed to register device')
            }
        }
    }

    const handleDisableDevice = async (deviceId: string) => {
        if (!confirm('Are you sure you want to disable this device?')) return
        try {
            await apiClient.delete(`/api/devices/${deviceId}`)
            setSuccess('Device disabled successfully')
            refetch()
        } catch (err) {
            setFormError('Failed to disable device')
        }
    }

    const handleRenameDevice = async (deviceId: string) => {
        const newName = prompt('Enter new device name:')
        if (!newName) return
        try {
            await apiClient.put(`/api/devices/${deviceId}`, { name: newName })
            setSuccess('Device renamed successfully')
            refetch()
        } catch (err) {
            setFormError('Failed to rename device')
        }
    }

    const formatLastSeen = (date: string | Date) => {
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

    return (
        <>
            <h1>Doors & Devices</h1>

            {formError && <p style={{ color: '#ef4444', marginBottom: '1rem' }}>{formError}</p>}
            {success && <p style={{ color: '#10b981', marginBottom: '1rem' }}>{success}</p>}

            <button
                onClick={() => setShowRegister(!showRegister)}
                style={{
                    marginBottom: '1rem',
                    padding: '0.5rem 1rem',
                    backgroundColor: '#3b82f6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '0.375rem',
                    cursor: 'pointer',
                }}
            >
                {showRegister ? 'Cancel' : '+ Register Device'}
            </button>

            {showRegister && (
                <form
                    onSubmit={handleRegisterDevice}
                    style={{
                        marginBottom: '1.5rem',
                        padding: '1rem',
                        border: '1px solid #e5e7eb',
                        borderRadius: '0.5rem',
                    }}
                >
                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.25rem' }}>Device Name</label>
                        <input
                            type="text"
                            value={registrationData.device_name}
                            onChange={(e) => setRegistrationData({ ...registrationData, device_name: e.target.value })}
                            required
                            style={{ width: '100%', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '0.375rem' }}
                        />
                    </div>
                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.25rem' }}>Door Name</label>
                        <input
                            type="text"
                            value={registrationData.door_name}
                            onChange={(e) => setRegistrationData({ ...registrationData, door_name: e.target.value })}
                            required
                            style={{ width: '100%', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '0.375rem' }}
                        />
                    </div>
                    <button
                        type="submit"
                        style={{
                            padding: '0.5rem 1rem',
                            backgroundColor: '#10b981',
                            color: 'white',
                            border: 'none',
                            borderRadius: '0.375rem',
                            cursor: 'pointer',
                        }}
                    >
                        Register
                    </button>
                </form>
            )}

            {registeredDevice && (
                <div
                    style={{
                        marginBottom: '1.5rem',
                        padding: '1rem',
                        backgroundColor: '#d1fae5',
                        borderRadius: '0.5rem',
                    }}
                >
                    <h3>Device Registered Successfully</h3>
                    <p>
                        <strong>Device ID:</strong> {registeredDevice.device_id}
                    </p>
                    <p>
                        <strong>Device Token:</strong> <code>{registeredDevice.device_token}</code>
                    </p>
                    <p style={{ fontSize: '0.875rem', color: '#065f46' }}>Save these credentials and use them to configure your device.</p>
                </div>
            )}

            {loading && <p>Loading devices...</p>}
            {error && <p style={{ color: '#ef4444' }}>Failed to load devices</p>}

            {data?.items && data.items.length > 0 && (
                <div className="table-scroll">
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
                                <th style={{ textAlign: 'left', padding: '0.75rem' }}>Door</th>
                                <th style={{ textAlign: 'left', padding: '0.75rem' }}>Device</th>
                                <th style={{ textAlign: 'left', padding: '0.75rem' }}>Status</th>
                                <th style={{ textAlign: 'left', padding: '0.75rem' }}>Last Seen</th>
                                <th style={{ textAlign: 'left', padding: '0.75rem' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.items.map((device) => (
                                <tr key={device.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                                    <td style={{ padding: '0.75rem' }}>{device.doorId}</td>
                                    <td style={{ padding: '0.75rem' }}>{device.name}</td>
                                    <td style={{ padding: '0.75rem' }}>
                                        <span
                                            style={{
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                gap: '0.5rem',
                                                padding: '0.25rem 0.75rem',
                                                backgroundColor:
                                                    device.status === DeviceStatusEnum.ONLINE
                                                        ? '#d1fae5'
                                                        : device.status === DeviceStatusEnum.OFFLINE
                                                          ? '#fee2e2'
                                                          : '#f3f4f6',
                                                color:
                                                    device.status === DeviceStatusEnum.ONLINE
                                                        ? '#065f46'
                                                        : device.status === DeviceStatusEnum.OFFLINE
                                                          ? '#991b1b'
                                                          : '#374151',
                                                borderRadius: '0.25rem',
                                                fontSize: '0.875rem',
                                            }}
                                        >
                                            <span
                                                style={{
                                                    width: '8px',
                                                    height: '8px',
                                                    borderRadius: '50%',
                                                    backgroundColor: getStatusColor(device.status),
                                                }}
                                            />
                                            {device.status}
                                        </span>
                                    </td>
                                    <td style={{ padding: '0.75rem', color: '#6b7280' }}>{formatLastSeen(device.lastSeen ?? new Date())}</td>
                                    <td style={{ padding: '0.75rem' }}>
                                        <button
                                            onClick={() => handleRenameDevice(device.id)}
                                            style={{
                                                marginRight: '0.5rem',
                                                padding: '0.25rem 0.75rem',
                                                backgroundColor: '#8b5cf6',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '0.25rem',
                                                cursor: 'pointer',
                                                fontSize: '0.875rem',
                                            }}
                                        >
                                            Rename
                                        </button>
                                        <button
                                            onClick={() => handleDisableDevice(device.id)}
                                            style={{
                                                padding: '0.25rem 0.75rem',
                                                backgroundColor: '#ef4444',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '0.25rem',
                                                cursor: 'pointer',
                                                fontSize: '0.875rem',
                                            }}
                                        >
                                            Disable
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </>
    )
}

export default DevicesPage
