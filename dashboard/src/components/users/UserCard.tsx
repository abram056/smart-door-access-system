import type { User } from '@smartdoor/shared'

interface UserCardProps {
    user: User
}

/**
 * UserCard displays a summary for a single user.
 */
const UserCard = ({ user }: UserCardProps) => {
    return (
        <article>
            <h2>{user.fullName}</h2>
            <p>{user.email}</p>
        </article>
    )
}

export default UserCard
