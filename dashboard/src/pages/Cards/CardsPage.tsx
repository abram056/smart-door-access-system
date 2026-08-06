import CardSummary from '../../components/cards/CardSummary'
import type { RFIDCard } from '@smartdoor/shared'

/**
 * CardsPage displays registered RFID cards.
 */
const sampleCard: RFIDCard = {
    id: 'card-1',
    uid: 'A4B8C291',
    userId: 'user-1',
    enabled: true,
    createdAt: new Date(),
    updatedAt: new Date(),
}

const CardsPage = () => {
    return (
        <main>
            <h1>Cards</h1>
            <CardSummary card={sampleCard} />
        </main>
    )
}

export default CardsPage
