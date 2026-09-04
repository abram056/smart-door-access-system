import { useState } from 'react'
import apiClient, { ApiError } from '../../services/api/apiClient'

interface SystemSettings {
    heartbeat_interval: number
    unlock_duration: number
    emergency_cards: string[]
}

/**
 * SettingsPage provides system configuration.
 */
const SettingsPage = () => {
    const [settings, setSettings] = useState<SystemSettings>({
        heartbeat_interval: 60,
        unlock_duration: 5,
        emergency_cards: [],
    })
    const [currentPassword, setCurrentPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const [emergencyCardUid, setEmergencyCardUid] = useState('')

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setSuccess('')

        if (newPassword !== confirmPassword) {
            setError('Passwords do not match')
            return
        }

        try {
            await apiClient.post('/api/settings/password', {
                currentPassword,
                newPassword,
            })
            setSuccess('Password changed successfully')
            setCurrentPassword('')
            setNewPassword('')
            setConfirmPassword('')
        } catch (err) {
            if (err instanceof ApiError) {
                setError(err.message)
            } else {
                setError('Failed to change password')
            }
        }
    }

    const handleUpdateSettings = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setSuccess('')

        try {
            await apiClient.post('/api/settings', settings)
            setSuccess('Settings updated successfully')
        } catch (err) {
            if (err instanceof ApiError) {
                setError(err.message)
            } else {
                setError('Failed to update settings')
            }
        }
    }

    const handleAddEmergencyCard = async () => {
        if (!emergencyCardUid.trim()) {
            setError('Please enter a card UID')
            return
        }

        try {
            await apiClient.post('/api/settings/emergency-cards/add', { uid: emergencyCardUid })
            setSettings({
                ...settings,
                emergency_cards: [...settings.emergency_cards, emergencyCardUid],
            })
            setEmergencyCardUid('')
            setSuccess('Emergency card added')
        } catch (err) {
            if (err instanceof ApiError) {
                setError(err.message)
            } else {
                setError('Failed to add emergency card')
            }
        }
    }

    const handleRemoveEmergencyCard = async (uid: string) => {
        try {
            await apiClient.post('/api/settings/emergency-cards/remove', { uid })
            setSettings({
                ...settings,
                emergency_cards: settings.emergency_cards.filter((card) => card !== uid),
            })
            setSuccess('Emergency card removed')
        } catch (err) {
            setError('Failed to remove emergency card')
        }
    }

    return (
        <>
            <h1>Settings</h1>

            {error && <p style={{ color: '#ef4444', marginBottom: '1rem' }}>{error}</p>}
            {success && <p style={{ color: '#10b981', marginBottom: '1rem' }}>{success}</p>}

            <div style={{ marginBottom: '2rem', padding: '1rem', border: '1px solid #e5e7eb', borderRadius: '0.5rem' }}>
                <h2>System Configuration</h2>
                <form onSubmit={handleUpdateSettings}>
                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: '500' }}>Heartbeat Interval (seconds)</label>
                        <input
                            type="number"
                            min="10"
                            max="3600"
                            value={settings.heartbeat_interval}
                            onChange={(e) => setSettings({ ...settings, heartbeat_interval: parseInt(e.target.value) })}
                            style={{ width: '100%', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '0.375rem' }}
                        />
                        <p style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.25rem' }}>How often devices report their status</p>
                    </div>
                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: '500' }}>Unlock Duration (seconds)</label>
                        <input
                            type="number"
                            min="1"
                            max="30"
                            value={settings.unlock_duration}
                            onChange={(e) => setSettings({ ...settings, unlock_duration: parseInt(e.target.value) })}
                            style={{ width: '100%', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '0.375rem' }}
                        />
                        <p style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.25rem' }}>How long the lock stays open after authorization</p>
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
                        Update Settings
                    </button>
                </form>
            </div>

            <div style={{ marginBottom: '2rem', padding: '1rem', border: '1px solid #e5e7eb', borderRadius: '0.5rem' }}>
                <h2>Change Admin Password</h2>
                <form onSubmit={handleChangePassword}>
                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.25rem' }}>Current Password</label>
                        <input
                            type="password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            required
                            style={{ width: '100%', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '0.375rem' }}
                        />
                    </div>
                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.25rem' }}>New Password</label>
                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                            style={{ width: '100%', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '0.375rem' }}
                        />
                    </div>
                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.25rem' }}>Confirm Password</label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
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
                        Change Password
                    </button>
                </form>
            </div>

            <div style={{ padding: '1rem', border: '1px solid #e5e7eb', borderRadius: '0.5rem' }}>
                <h2>Emergency Cards</h2>
                <p>Emergency cards bypass normal access control.</p>
                <div style={{ marginBottom: '1rem', display: 'flex', gap: '0.5rem' }}>
                    <input
                        type="text"
                        placeholder="Enter card UID"
                        value={emergencyCardUid}
                        onChange={(e) => setEmergencyCardUid(e.target.value)}
                        style={{ flex: 1, padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '0.375rem' }}
                    />
                    <button
                        onClick={handleAddEmergencyCard}
                        style={{
                            padding: '0.5rem 1rem',
                            backgroundColor: '#3b82f6',
                            color: 'white',
                            border: 'none',
                            borderRadius: '0.375rem',
                            cursor: 'pointer',
                        }}
                    >
                        Add Card
                    </button>
                </div>

                {settings.emergency_cards.length > 0 && (
                    <div>
                        {settings.emergency_cards.map((uid) => (
                            <div
                                key={uid}
                                style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    padding: '0.75rem',
                                    backgroundColor: '#f3f4f6',
                                    borderRadius: '0.375rem',
                                    marginBottom: '0.5rem',
                                }}
                            >
                                <code style={{ fontFamily: 'monospace', fontSize: '0.875rem' }}>{uid}</code>
                                <button
                                    onClick={() => handleRemoveEmergencyCard(uid)}
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
                                    Remove
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    )
}

export default SettingsPage
