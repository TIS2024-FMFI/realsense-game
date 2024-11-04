#ifndef KEYBOARDINPUTHANDLER_H
#define KEYBOARDINPUTHANDLER_H

#include <string>

class CKeyboardInputHandler {
public:
    void SendKeystroke(char c) const;
    std::string EncodeData(int speed, int vectorX, int vectorY) const;
    void SendSpeedAndVector(int speed, int vectorX, int vectorY) const;
};

#endif // KEYBOARDINPUTHANDLER_H