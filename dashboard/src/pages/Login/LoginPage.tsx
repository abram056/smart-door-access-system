import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthContext } from '../../contexts/AuthContext'
import Button from '../../components/ui/Button'

/**
 * LoginPage allows the user to authenticate.
 */
const LoginPage = () => {
    const navigate = useNavigate()
    const { login } = useAuthContext()
    const [username, setUsername] = useState('admin')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setError('')

        try {
            await login(username, password)
            navigate('/')
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message)
            } else {
                setError('Unable to sign in.')
            }
        }
    }

    return (
        <main>
            <h1>Login</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="username">Username</label>
                    <input id="username" value={username} onChange={(event) => setUsername(event.target.value)} />
                </div>
                <div>
                    <label htmlFor="password">Password</label>
                    <input id="password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
                </div>
                {error ? <p role="alert">{error}</p> : null}
                <Button label="Sign In" />
            </form>
        </main>
    )
}

export default LoginPage
