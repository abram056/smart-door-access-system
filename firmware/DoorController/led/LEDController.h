#pragma once

class LEDController
{
public:
    bool begin();

    void success();

    void error();

    void waiting();

    void connected();

    void disconnected();
};