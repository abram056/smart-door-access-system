import { useState, useEffect } from 'react'
import type { RFIDCard, User } from '@smartdoor/shared'
import { AccessEvents } from '@smartdoor/shared'
import useFetch from '../../hooks/useFetch'
import apiClient, { ApiError } from '../../services/api/apiClient'
import socketService from '../../services/websocket/socketService'

interface PaginatedCards {
    items: RFIDCard[]
    pagination: {
        page: number
        pageSize: number
        totalItems: number
        totalPages: number
    }
}

interface PaginatedUsers {
    items: User[]
    pagination: {
        page: number
        pageSize: number
        totalItems: number
        totalPages: number
    }
}

type EnrollmentStep = 'idle' | 'select-user' | 'waiting' | 'success' | 'error'

const ENROLLMENT_TIMEOUT_MS = 35000

/**
 * CardsPage manages RFID card enrollment and operations.
 */
const CardsPage = () => {
    const { data: cardsData, loading: cardsLoading, error: cardsError, refetch: refetchCards } = useFetch<PaginatedCards>('/api/cards')
    const { data: usersData } = useFetch<PaginatedUsers>('/api/users')

    const [enrollmentStep, setEnrollmentStep] = useState<EnrollmentStep>('idle')
    const [selectedUserId, setSelectedUserId] = useState('')
    const [enrollmentError, setEnrollmentError] = useState('')
    const [enrollmentSuccess, setEnrollmentSuccess] = useState('')

    useEffect(() => {
        const socket = socketService.connect()

        const handleEnrollmentCompleted = (data: { status: string; user?: string }) => {
            if (data.status === 'REGISTERED') {
                setEnrollmentStep('success')
                setEnrollmentSuccess(`Card enrolled successfully for ${data.user || 'user'}!`)
                setSelectedUserId('')
                setTimeout(() => {
                    setEnrollmentStep('idle')
                    refetchCards()
                }, 2000)
            } else {
                setEnrollmentStep('error')
                setEnrollmentError('Enrollment failed. Please try again.')
            }
        }

        socket.on(AccessEvents.ENROLLMENT_COMPLETED, handleEnrollmentCompleted)

        return () => {
            socket.off(AccessEvents.ENROLLMENT_COMPLETED, handleEnrollmentCompleted)
            socketService.disconnect()
        }
    }, [refetchCards])

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
            await apiClient.post('/api/cards/enroll', {
                userId: selectedUserId,
            })
            setEnrollmentSuccess('Enrollment session started. Waiting for card...')

            setTimeout(() => {
                setEnrollmentStep((current) => {
                    if (current === 'waiting') {
                        setEnrollmentError('Timed out waiting for card. Please try again.')
                        return 'error'
                    }
                    return current
                })
            }, ENROLLMENT_TIMEOUT_MS)
        } catch (err) {
            setEnrollmentStep('error')
            if (err instanceof ApiError) {
                setEnrollmentError(err.message)
            } else {
                setEnrollmentError('Failed to start enrollment session')
            }
        }
    }

    const handleDisableCard = async (cardId: string) => {
        if (!confirm('Are you sure you want to disable this card?')) return
        try {
            await apiClient.delete(`/api/cards/${cardId}`)
            refetchCards()
        } catch (err) {
            setEnrollmentError('Failed to disable card')
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
                                {usersData?.items?.map((user) => (
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
                            Waiting for RFID card... Please scan a card now. (35s timeout)
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
                        {enrollmentSuccess}
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
                            {enrollmentError}
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
            {cardsLoading && <p>Loading cards...</p>}
            {cardsError && <p style={{ color: '#ef4444' }}>Failed to load cards</p>}

            {cardsData?.items && cardsData.items.length > 0 && (
                <div className="table-scroll">
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
                            {cardsData.items.map((card) => (
                                <tr key={card.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                                    <td style={{ padding: '0.75rem', fontFamily: 'monospace' }}>{uidToHex(card.uid)}</td>
                                    <td style={{ padding: '0.75rem' }}>{card.userId}</td>
                                    <td style={{ padding: '0.75rem' }}>
                                        <span
                                            style={{
                                                padding: '0.25rem 0.75rem',
                                                backgroundColor: card.status === 'ACTIVE' ? '#d1fae5' : '#fee2e2',
                                                color: card.status === 'ACTIVE' ? '#065f46' : '#991b1b',
                                                borderRadius: '0.25rem',
                                                fontSize: '0.875rem',
                                            }}
                                        >
                                            {card.status === 'ACTIVE' ? 'Active' : 'Disabled'}
                                        </span>
                                    </td>
                                    <td style={{ padding: '0.75rem' }}>
                                        <button
                                            onClick={() => handleDisableCard(card.id)}
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

export default CardsPage
