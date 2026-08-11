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

// Main controller state machine (docs/04 "Complete System Lifecycle")
enum class SystemState
{
    Boot,
    Connecting,
    WaitingForCard,
    Processing,
    Unlocked,
    Offline,
    Enrollment
};