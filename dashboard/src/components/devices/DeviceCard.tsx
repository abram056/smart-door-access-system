import type { Device } from '@smartdoor/shared'

interface DeviceCardProps {
    device: Device
}

/**
 * DeviceCard displays a single device summary.
 */
const DeviceCard = ({ device }: DeviceCardProps) => {
    return (
        <article>
            <h2>{device.name}</h2>
            <p>Status: {device.status}</p>
        </article>
    )
}

export default DeviceCard
