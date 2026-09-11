import { Link } from 'react-router-dom'
import { ROUTES } from '../../constants/appConstants'

const QuickActions = () => {
    const actions = [
        { label: 'Register User', to: ROUTES.USERS },
        { label: 'Register Card', to: ROUTES.CARDS },
        { label: 'Add Device', to: ROUTES.DEVICES },
        { label: 'View Logs', to: ROUTES.LOGS },
    ]

    return (
        <section>
            <h2>Quick Actions</h2>
            <div className="quick-actions-grid">
                {actions.map((action) => (
                    <Link
                        key={action.to}
                        to={action.to}
                        style={{
                            padding: '1rem',
                            backgroundColor: '#f3f4f6',
                            border: '1px solid #e5e7eb',
                            borderRadius: '0.5rem',
                            textAlign: 'center',
                            textDecoration: 'none',
                            color: '#1f2937',
                            fontWeight: '500',
                            transition: 'background-color 0.2s',
                            cursor: 'pointer',
                        }}
                        onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) => {
                            (e.target as HTMLElement).style.backgroundColor = '#e5e7eb'
                        }}
                        onMouseLeave={(e: React.MouseEvent<HTMLAnchorElement>) => {
                            (e.target as HTMLElement).style.backgroundColor = '#f3f4f6'
                        }}
                    >
                        {action.label}
                    </Link>
                ))}
            </div>
        </section>
    )
}

export default QuickActions
