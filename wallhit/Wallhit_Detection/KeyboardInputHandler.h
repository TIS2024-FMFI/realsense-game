#ifndef KEYBOARD_INPUT_HANDLER_H
#define KEYBOARD_INPUT_HANDLER_H

#include "BallHit.h"
#include <string>

class CKeyboardInputHandler {
public:
    CKeyboardInputHandler(int resolutionX, int resolutionY);

    void SendKeystroke(char c) const;
    std::string EncodeData(const BallHit& ball) const;
    void SendData(const BallHit& ball);

private:
    int NormalizeCoordinateX(int coordX) const;
    int NormalizeCoordinateY(int coordY) const;

    int m_resX;
    int m_resY;
    int m_stepX;
    int m_stepY;
};

#endif // KEYBOARD_INPUT_HANDLER_H
