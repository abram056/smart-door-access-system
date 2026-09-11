interface ButtonProps {
    label: string
    type?: 'button' | 'submit' | 'reset'
    onClick?: () => void
}

/**
 * Button is a reusable UI primitive.
 */
const Button = ({ label, type = 'button', onClick }: ButtonProps) => {
    return (
        <button type={type} onClick={onClick}>
            {label}
        </button>
    )
}

export default Button
