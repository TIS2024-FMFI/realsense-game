#include "KeyboardInputHandler.h"
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

std::string CKeyboardInputHandler::EncodeData(double x, double y, double speed, double a, double b, double c, double avgX) {
    std::ostringstream oss;
    oss << std::fixed << std::setprecision(6);

    if (a == 0.0 &&
        speed == 0.0) 
    {
        oss << START_CHAR;
        oss << x << "," << y;
        oss << END_CHAR;
    }
    else if (a == 0.0) 
    {
        oss << START_CHAR;
        oss << x << "," << y << "," << speed;
		oss << END_CHAR;
	}
	else
	{
		oss << START_CHAR;
		oss << x << "," << y << "," << speed << "," << a << "," << b << "," << c << "," << avgX;
		oss << END_CHAR;
    }

    return oss.str();
}

void CKeyboardInputHandler::SendData(double x, double y, double speed, double a, double b, double c, double avgX) {
    std::string message = EncodeData(x, y, speed, a, b, c, avgX);
	SaveDataToFile(x, y, speed, a, b, c, avgX);//TODO: Only for tesing purposies, delete after use!!!!!!!!!

    for (size_t i = 0; i < message.size(); i += 10) {
        std::string chunk = message.substr(i, 10);
        for (char c : chunk) {
            SendKeystroke(c);
        }
        std::this_thread::sleep_for(std::chrono::milliseconds(5));
    }

    std::cout << "Data sent: " << message << std::endl;
}

//save parameters int txt file
// TODO: Only for tesing purposies, delete after use!!!!!!!!!
void CKeyboardInputHandler::SaveDataToFile(double x, double y, double speed, double a, double b, double c, double avgX) const
{
    std::ofstream file("parameters.txt", std::ios::app); // Open in append mode
    if (file.is_open()) {
        file << x << " " << y << " " << speed << " " << a << " " << b << " " << c << " " << avgX << std::endl; // Add a new line after each entry
        file.close();
    }
    else {
        std::cerr << "Unable to open file for writing." << std::endl;
    }
}
