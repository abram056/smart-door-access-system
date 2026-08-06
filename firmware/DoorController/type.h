#pragma once

enum class AccessDecision
{
    Granted,
    Denied,
    OfflineGranted,
    OfflineDenied
};

enum class DoorState
{
    Locked,
    Unlocked
};

enum class ConnectionState
{
    Connected,
    Disconnected,
    Connecting
};

enum class EnrollmentState
{
    Idle,
    WaitingForCard,
    Complete,
    Failed
};