import type { ReactNode } from 'react'

interface AuthLayoutProps {
    children: ReactNode
}

/**
 * AuthLayout wraps authentication pages with dedicated styles.
 */
const AuthLayout = ({ children }: AuthLayoutProps) => {
    return <div style={{ maxWidth: '420px', margin: '3rem auto', padding: '1.5rem' }}>{children}</div>
}

export default AuthLayout
