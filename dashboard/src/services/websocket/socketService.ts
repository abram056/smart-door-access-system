import { io, Socket } from 'socket.io-client'

const SOCKET_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000'

let socket: Socket | null = null

const socketService = {
    connect: () => {
        if (socket?.connected) return socket

        socket = io(SOCKET_URL, {
            transports: ['websocket', 'polling'],
        })

        socket.on('connect', () => {
            console.log('Socket connected:', socket?.id)
        })

        socket.on('disconnect', () => {
            console.log('Socket disconnected')
        })

        return socket
    },
    disconnect: () => {
        if (socket) {
            socket.disconnect()
            socket = null
        }
    },
    getSocket: () => socket,
}

export default socketService
