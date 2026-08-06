import type { RFIDCard } from '@smartdoor/shared'

interface CardSummaryProps {
    card: RFIDCard
}

/**
 * CardSummary displays the brief view for a single card.
 */
const CardSummary = ({ card }: CardSummaryProps) => {
    return (
        <article>
            <h2>{card.uid}</h2>
            <p>Status: {card.enabled ? 'Active' : 'Disabled'}</p>
        </article>
    )
}

export default CardSummary
