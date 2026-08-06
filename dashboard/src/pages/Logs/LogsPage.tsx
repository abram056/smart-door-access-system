import LogEntry from '../../components/logs/LogEntry'
import { AccessDecision } from '@smartdoor/shared'
import type { AccessLog } from '@smartdoor/shared'

/**
 * LogsPage shows recent audit events.
 */
const sampleLog: AccessLog = {
    id: 'log-1',
    timestamp: new Date(),
    uid: 'A4B8C291',
    username: 'Example User',
    decision: AccessDecision.GRANTED,
    doorId: 'door-1',
    deviceId: 'device-1',
}

const LogsPage = () => {
    return (
        <main>
            <h1>Logs</h1>
            <LogEntry log={sampleLog} />
        </main>
    )
}

export default LogsPage
