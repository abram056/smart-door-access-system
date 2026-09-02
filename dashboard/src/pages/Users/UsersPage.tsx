import { useState } from 'react'
import { User, UserRole } from '@smartdoor/shared'
import useFetch from '../../hooks/useFetch'
import apiClient, { ApiError } from '../../services/api/apiClient'

interface UsersResponse {
    data: User[]
}

/**
 * UsersPage manages user accounts.
 */
const UsersPage = () => {
    const usersRes = useFetch<UsersResponse>('/api/users')
    const [showForm, setShowForm] = useState(false)
    const [formData, setFormData] = useState({ username: '', fullName: '', email: '', role: UserRole.STAFF })
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')

    const handleAddUser = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setSuccess('')

        try {
            await apiClient.post('/api/users', formData)
            setSuccess('User created successfully')
            setFormData({ username: '', fullName: '', email: '', role: UserRole.STAFF })
            setShowForm(false)
            // Refresh users list
            window.location.reload()
        } catch (err) {
            if (err instanceof ApiError) {
                setError(err.message)
            } else {
                setError('Failed to create user')
            }
        }
    }

    const handleDisableUser = async (userId: string) => {
        if (!confirm('Are you sure you want to disable this user?')) return
        try {
            await apiClient.post(`/api/users/${userId}/disable`, {})
            setSuccess('User disabled successfully')
            window.location.reload()
        } catch (err) {
            setError('Failed to disable user')
        }
    }

    const handleDeleteUser = async (userId: string) => {
        if (!confirm('Are you sure you want to delete this user?')) return
        try {
            await apiClient.post(`/api/users/${userId}/delete`, {})
            setSuccess('User deleted successfully')
            window.location.reload()
        } catch (err) {
            setError('Failed to delete user')
        }
    }

    return (
        <>
            <h1>Users</h1>

            {error && <p style={{ color: '#ef4444', marginBottom: '1rem' }}>{error}</p>}
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
                        <label style={{ display: 'block', marginBottom: '0.25rem' }}>Username</label>
                        <input
                            type="text"
                            value={formData.username}
                            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                            required
                            style={{ width: '100%', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '0.375rem' }}
                        />
                    </div>
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
                            onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })}
                            style={{ width: '100%', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '0.375rem' }}
                        >
                            <option value={UserRole.STAFF}>Staff</option>
                            <option value={UserRole.GUEST}>Guest</option>
                            <option value={UserRole.ADMIN}>Admin</option>
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

            {usersRes.loading && <p>Loading users...</p>}
            {usersRes.error && <p style={{ color: '#ef4444' }}>Failed to load users</p>}

            {usersRes.data?.data && usersRes.data.data.length > 0 && (
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
                        {usersRes.data.data.map((user) => (
                            <tr key={user.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                                <td style={{ padding: '0.75rem' }}>{user.fullName}</td>
                                <td style={{ padding: '0.75rem' }}>{user.role}</td>
                                <td style={{ padding: '0.75rem' }}>{user.email || '-'}</td>
                                <td style={{ padding: '0.75rem' }}>
                                    <span
                                        style={{
                                            padding: '0.25rem 0.75rem',
                                            backgroundColor: user.isActive ? '#d1fae5' : '#fee2e2',
                                            color: user.isActive ? '#065f46' : '#991b1b',
                                            borderRadius: '0.25rem',
                                            fontSize: '0.875rem',
                                        }}
                                    >
                                        {user.isActive ? 'Active' : 'Inactive'}
                                    </span>
                                </td>
                                <td style={{ padding: '0.75rem' }}>
                                    <button
                                        onClick={() => handleDisableUser(user.id)}
                                        style={{
                                            marginRight: '0.5rem',
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
                                    <button
                                        onClick={() => handleDeleteUser(user.id)}
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
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </>
    )
}

export default UsersPage
