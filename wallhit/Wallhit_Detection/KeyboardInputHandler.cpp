#include "KeyboardInputHandler.h"
#include <Windows.h>
#include <sstream>
#include <iostream>
#include <thread>

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

std::string CKeyboardInputHandler::EncodeData(int speed, int vectorX, int vectorY) const {
    std::ostringstream ss;
    ss << "#" << "S" << speed << "V" << vectorX << "," << vectorY << "*";
    return ss.str();
}

void CKeyboardInputHandler::SendSpeedAndVector(int speed, int vectorX, int vectorY) const {
    std::string message = EncodeData(speed, vectorX, vectorY);
    for (char c : message) {
        SendKeystroke(c);
        std::this_thread::sleep_for(std::chrono::milliseconds(10));
    }
}
