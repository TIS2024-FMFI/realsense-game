#include "KeyboardInputHandler.h"
#include "BallHit.h"
#include <Windows.h>
#include <sstream>
#include <iostream>
#include <thread>
#include <iomanip>
#include <fstream>
#include <vector>

constexpr int MAX_NORMALIZED_VALUE = 65535;
constexpr char START_CHAR = '#';
constexpr char END_CHAR = '*';

CKeyboardInputHandler::CKeyboardInputHandler(int resolutionX, int resolutionY) : m_resX(resolutionX), m_resY(resolutionY)
{
    m_stepX = MAX_NORMALIZED_VALUE / m_resX;
    m_stepY = MAX_NORMALIZED_VALUE / m_resY;
}

void CKeyboardInputHandler::SendKeystroke(char c) const {
    INPUT input;
    input.type = INPUT_KEYBOARD;
    input.ki.wVk = 0;
    input.ki.wScan = c;
    input.ki.dwFlags = KEYEVENTF_UNICODE;
    SendInput(1, &input, sizeof(INPUT));

    input.ki.dwFlags = KEYEVENTF_UNICODE | KEYEVENTF_KEYUP;
    SendInput(1, &input, sizeof(INPUT));
}

std::string CKeyboardInputHandler::EncodeData(const BallHit& ball) const {
    std::ostringstream oss;
    oss << std::fixed << std::setprecision(6);

    if (ball.a == 0.0 && ball.speed == 0.0) {
        oss << START_CHAR;
        oss << ball.x << "," << ball.y;
        oss << END_CHAR;
    }
    else if (ball.a == 0.0) {
        oss << START_CHAR;
        oss << ball.x << "," << ball.y << "," << ball.speed;
        oss << END_CHAR;
    }
    else {
        oss << START_CHAR;
        oss << ball.x << "," << ball.y << "," << ball.speed << ","
            << ball.a << "," << ball.b << ","
            << ball.c << "," << ball.changeX;
        oss << END_CHAR;
    }

    return oss.str();
}

void CKeyboardInputHandler::SendData(const BallHit& ball) {
    std::string message = EncodeData(ball);

    for (size_t i = 0; i < message.size(); i += 10) {
        std::string chunk = message.substr(i, 10);
        for (char c : chunk) {
            SendKeystroke(c);
        }
        std::this_thread::sleep_for(std::chrono::milliseconds(5));
    }

    std::cout << "Data sent: " << message << std::endl; //NOTE: control printout
}

int CKeyboardInputHandler::NormalizeCoordinateX(int coordX) const
{
    return coordX * m_stepX;
}

int CKeyboardInputHandler::NormalizeCoordinateY(int coordY) const
{
    return coordY * m_stepY;
}
