interface ButtonProps {
    label: string
    onClick?: () => void
}

/**
 * Button is a reusable UI primitive.
 */
const Button = ({ label, onClick }: ButtonProps) => {
    return (
        <button type="button" onClick={onClick}>
            {label}
        </button>
    )
}

export default Button
