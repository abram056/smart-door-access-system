import UserCard from '../../components/users/UserCard'
import { UserRole } from '@smartdoor/shared'
import type { User } from '@smartdoor/shared'

/**
 * UsersPage lists application users.
 */
const sampleUser: User = {
    id: 'user-1',
    username: 'jdoe',
    fullName: 'Example User',
    email: 'user@example.com',
    role: UserRole.STAFF,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
}

const UsersPage = () => {
    return (
        <main>
            <h1>Users</h1>
            <UserCard user={sampleUser} />
        </main>
    )
}

export default UsersPage
