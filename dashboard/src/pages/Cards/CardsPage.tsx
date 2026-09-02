import { useState } from 'react'
import { RFIDCard, User, UserRole } from '@smartdoor/shared'
import useFetch from '../../hooks/useFetch'
import apiClient, { ApiError } from '../../services/api/apiClient'

interface CardsResponse {
    data: RFIDCard[]
}

interface UsersResponse {
    data: User[]
}

type EnrollmentStep = 'idle' | 'select-user' | 'waiting' | 'success' | 'error'

/**
 * CardsPage manages RFID card enrollment and operations.
 */
const CardsPage = () => {
    const cardsRes = useFetch<CardsResponse>('/api/cards')
    const usersRes = useFetch<UsersResponse>('/api/users')

    const [enrollmentStep, setEnrollmentStep] = useState<EnrollmentStep>('idle')
    const [selectedUserId, setSelectedUserId] = useState('')
    const [enrollmentError, setEnrollmentError] = useState('')
    const [enrollmentSuccess, setEnrollmentSuccess] = useState('')

    const uidToHex = (uid: string) => {
        try {
            return uid
                .split('')
                .map((char) => char.charCodeAt(0).toString(16).padStart(2, '0').toUpperCase())
                .join('')
        } catch {
            return uid
        }
    }

    const handleStartEnrollment = async () => {
        if (!selectedUserId) {
            setEnrollmentError('Please select a user')
            return
        }

        setEnrollmentStep('waiting')
        setEnrollmentError('')
        setEnrollmentSuccess('')

        try {
            // Call backend to start enrollment session
            const response = await apiClient.post('/api/cards/enroll/start', {
                userId: selectedUserId,
            })

            if (!response) {
                throw new Error('Failed to start enrollment')
            }

            setEnrollmentSuccess('Enrollment session started. Waiting for card...')
            // In a real implementation, this would wait for the backend to receive the card scan
            // For now, we'll simulate the waiting state
        } catch (err) {
            setEnrollmentStep('error')
            if (err instanceof ApiError) {
                setEnrollmentError(err.message)
            } else {
                setEnrollmentError('Failed to start enrollment session')
            }
        }
    }

    const handleConfirmEnrollment = async (uid: string) => {
        try {
            await apiClient.post('/api/cards/enroll/confirm', { uid })
            setEnrollmentStep('success')
            setEnrollmentSuccess('Card enrolled successfully!')
            setSelectedUserId('')
            setTimeout(() => {
                setEnrollmentStep('idle')
                window.location.reload()
            }, 2000)
        } catch (err) {
            setEnrollmentStep('error')
            if (err instanceof ApiError) {
                setEnrollmentError(err.message)
            } else {
                setEnrollmentError('Failed to confirm enrollment')
            }
        }
    }

    const handleDisableCard = async (cardId: string) => {
        if (!confirm('Are you sure you want to disable this card?')) return
        try {
            await apiClient.post(`/api/cards/${cardId}/disable`, {})
            window.location.reload()
        } catch (err) {
            alert('Failed to disable card')
        }
    }

    const handleDeleteCard = async (cardId: string) => {
        if (!confirm('Are you sure you want to delete this card?')) return
        try {
            await apiClient.post(`/api/cards/${cardId}/delete`, {})
            window.location.reload()
        } catch (err) {
            alert('Failed to delete card')
        }
    }

    return (
        <>
            <h1>RFID Cards</h1>

            <div style={{ marginBottom: '2rem', padding: '1rem', border: '1px solid #e5e7eb', borderRadius: '0.5rem' }}>
                <h2>Enrollment Wizard</h2>

                {enrollmentStep === 'idle' && (
                    <>
                        <p>Select a user to enroll a new RFID card.</p>
                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.25rem' }}>User</label>
                            <select
                                value={selectedUserId}
                                onChange={(e) => setSelectedUserId(e.target.value)}
                                style={{ width: '100%', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '0.375rem' }}
                            >
                                <option value="">-- Select a user --</option>
                                {usersRes.data?.data?.map((user) => (
                                    <option key={user.id} value={user.id}>
                                        {user.fullName}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <button
                            onClick={handleStartEnrollment}
                            style={{
                                padding: '0.5rem 1rem',
                                backgroundColor: '#3b82f6',
                                color: 'white',
                                border: 'none',
                                borderRadius: '0.375rem',
                                cursor: 'pointer',
                            }}
                        >
                            Start Enrollment
                        </button>
                    </>
                )}

                {enrollmentStep === 'waiting' && (
                    <>
                        <p
                            style={{
                                padding: '1rem',
                                backgroundColor: '#fef3c7',
                                color: '#92400e',
                                borderRadius: '0.375rem',
                                marginBottom: '1rem',
                            }}
                        >
                            ⏳ Waiting for RFID card... Please scan a card now.
                        </p>
                        <button
                            onClick={() => setEnrollmentStep('idle')}
                            style={{
                                padding: '0.5rem 1rem',
                                backgroundColor: '#6b7280',
                                color: 'white',
                                border: 'none',
                                borderRadius: '0.375rem',
                                cursor: 'pointer',
                            }}
                        >
                            Cancel
                        </button>
                    </>
                )}

                {enrollmentStep === 'success' && (
                    <p
                        style={{
                            padding: '1rem',
                            backgroundColor: '#d1fae5',
                            color: '#065f46',
                            borderRadius: '0.375rem',
                        }}
                    >
                        ✓ {enrollmentSuccess}
                    </p>
                )}

                {enrollmentStep === 'error' && (
                    <>
                        <p
                            style={{
                                padding: '1rem',
                                backgroundColor: '#fee2e2',
                                color: '#991b1b',
                                borderRadius: '0.375rem',
                                marginBottom: '1rem',
                            }}
                        >
                            ✗ {enrollmentError}
                        </p>
                        <button
                            onClick={() => setEnrollmentStep('idle')}
                            style={{
                                padding: '0.5rem 1rem',
                                backgroundColor: '#3b82f6',
                                color: 'white',
                                border: 'none',
                                borderRadius: '0.375rem',
                                cursor: 'pointer',
                            }}
                        >
                            Try Again
                        </button>
                    </>
                )}
            </div>

            <h2>Enrolled Cards</h2>
            {cardsRes.loading && <p>Loading cards...</p>}
            {cardsRes.error && <p style={{ color: '#ef4444' }}>Failed to load cards</p>}

            {cardsRes.data?.data && cardsRes.data.data.length > 0 && (
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
                            <th style={{ textAlign: 'left', padding: '0.75rem' }}>UID</th>
                            <th style={{ textAlign: 'left', padding: '0.75rem' }}>User ID</th>
                            <th style={{ textAlign: 'left', padding: '0.75rem' }}>Status</th>
                            <th style={{ textAlign: 'left', padding: '0.75rem' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cardsRes.data.data.map((card) => (
                            <tr key={card.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                                <td style={{ padding: '0.75rem', fontFamily: 'monospace' }}>{uidToHex(card.uid)}</td>
                                <td style={{ padding: '0.75rem' }}>{card.userId}</td>
                                <td style={{ padding: '0.75rem' }}>
                                    <span
                                        style={{
                                            padding: '0.25rem 0.75rem',
                                            backgroundColor: card.enabled ? '#d1fae5' : '#fee2e2',
                                            color: card.enabled ? '#065f46' : '#991b1b',
                                            borderRadius: '0.25rem',
                                            fontSize: '0.875rem',
                                        }}
                                    >
                                        {card.enabled ? 'Active' : 'Disabled'}
                                    </span>
                                </td>
                                <td style={{ padding: '0.75rem' }}>
                                    <button
                                        onClick={() => handleDisableCard(card.id)}
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
                                        onClick={() => handleDeleteCard(card.id)}
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

export default CardsPage
