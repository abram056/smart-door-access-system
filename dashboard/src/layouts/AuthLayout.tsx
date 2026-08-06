import type { ReactNode } from 'react'

interface AuthLayoutProps {
    children: ReactNode
}

/**
 * AuthLayout wraps authentication pages with dedicated styles.
 */
const AuthLayout = ({ children }: AuthLayoutProps) => {
    return <div className="auth-layout">{children}</div>
}

export default AuthLayout
