import { useState } from 'react'
import type { User } from '@smartdoor/shared'
import useFetch from '../../hooks/useFetch'
import apiClient, { ApiError } from '../../services/api/apiClient'

interface PaginatedUsers {
    items: User[]
    pagination: {
        page: number
        pageSize: number
        totalItems: number
        totalPages: number
    }
}

/**
 * UsersPage manages user accounts.
 */
const UsersPage = () => {
    const { data, loading, error, refetch } = useFetch<PaginatedUsers>('/api/users')
    const [showForm, setShowForm] = useState(false)
    const [formData, setFormData] = useState({ fullName: '', email: '', role: 'STAFF' })
    const [formError, setFormError] = useState('')
    const [success, setSuccess] = useState('')

    const handleAddUser = async (e: React.FormEvent) => {
        e.preventDefault()
        setFormError('')
        setSuccess('')

        try {
            await apiClient.post('/api/users', formData)
            setSuccess('User created successfully')
            setFormData({ fullName: '', email: '', role: 'STAFF' })
            setShowForm(false)
            refetch()
        } catch (err) {
            if (err instanceof ApiError) {
                setFormError(err.message)
            } else {
                setFormError('Failed to create user')
            }
        }
    }

    const handleDisableUser = async (userId: string) => {
        if (!confirm('Are you sure you want to disable this user?')) return
        try {
            await apiClient.delete(`/api/users/${userId}`)
            setSuccess('User disabled successfully')
            refetch()
        } catch (err) {
            setFormError('Failed to disable user')
        }
    }

    return (
        <>
            <h1>Users</h1>

            {formError && <p style={{ color: '#ef4444', marginBottom: '1rem' }}>{formError}</p>}
            {success && <p style={{ color: '#10b981', marginBottom: '1rem' }}>{success}</p>}

            <button
                onClick={() => setShowForm(!showForm)}
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
                {showForm ? 'Cancel' : '+ Add User'}
            </button>

            {showForm && (
                <form
                    onSubmit={handleAddUser}
                    style={{
                        marginBottom: '1.5rem',
                        padding: '1rem',
                        border: '1px solid #e5e7eb',
                        borderRadius: '0.5rem',
                    }}
                >
                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.25rem' }}>Full Name</label>
                        <input
                            type="text"
                            value={formData.fullName}
                            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                            required
                            style={{ width: '100%', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '0.375rem' }}
                        />
                    </div>
                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.25rem' }}>Email</label>
                        <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            style={{ width: '100%', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '0.375rem' }}
                        />
                    </div>
                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.25rem' }}>Role</label>
                        <select
                            value={formData.role}
                            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                            style={{ width: '100%', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '0.375rem' }}
                        >
                            <option value="STAFF">Staff</option>
                            <option value="GUEST">Guest</option>
                            <option value="ADMIN">Admin</option>
                        </select>
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
                        Create User
                    </button>
                </form>
            )}

            {loading && <p>Loading users...</p>}
            {error && <p style={{ color: '#ef4444' }}>Failed to load users</p>}

            {data?.items && data.items.length > 0 && (
                <div className="table-scroll">
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
                                <th style={{ textAlign: 'left', padding: '0.75rem' }}>Name</th>
                                <th style={{ textAlign: 'left', padding: '0.75rem' }}>Role</th>
                                <th style={{ textAlign: 'left', padding: '0.75rem' }}>Email</th>
                                <th style={{ textAlign: 'left', padding: '0.75rem' }}>Status</th>
                                <th style={{ textAlign: 'left', padding: '0.75rem' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.items.map((user) => (
                                <tr key={user.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                                    <td style={{ padding: '0.75rem' }}>{user.fullName}</td>
                                    <td style={{ padding: '0.75rem' }}>{user.role}</td>
                                    <td style={{ padding: '0.75rem' }}>{user.email || '-'}</td>
                                    <td style={{ padding: '0.75rem' }}>
                                        <span
                                            style={{
                                                padding: '0.25rem 0.75rem',
                                                backgroundColor: user.status === 'ACTIVE' ? '#d1fae5' : '#fee2e2',
                                                color: user.status === 'ACTIVE' ? '#065f46' : '#991b1b',
                                                borderRadius: '0.25rem',
                                                fontSize: '0.875rem',
                                            }}
                                        >
                                            {user.status === 'ACTIVE' ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td style={{ padding: '0.75rem' }}>
                                        <button
                                            onClick={() => handleDisableUser(user.id)}
                                            style={{
                                                padding: '0.25rem 0.75rem',
                                                backgroundColor: '#fbbf24',
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

export default UsersPage
