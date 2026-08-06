import DeviceCard from '../../components/devices/DeviceCard'
import { DeviceStatus } from '@smartdoor/shared'
import type { Device } from '@smartdoor/shared'

/**
 * DevicesPage displays registered devices.
 */
const sampleDevice: Device = {
    id: 'device-1',
    name: 'Starter Device',
    token: 'dev-token-1',
    doorId: 'door-1',
    status: DeviceStatus.OFFLINE,
    lastSeen: new Date(),
}

const DevicesPage = () => {
    return (
        <main>
            <h1>Devices</h1>
            <DeviceCard device={sampleDevice} />
        </main>
    )
}

export default DevicesPage
