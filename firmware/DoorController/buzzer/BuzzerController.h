#pragma once

class BuzzerController
{
public:
    bool begin();

    void successTone();

    void errorTone();

    void startupTone();
};