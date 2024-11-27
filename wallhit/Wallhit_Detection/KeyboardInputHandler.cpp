#include "KeyboardInputHandler.h"
#include <Windows.h>
#include <sstream>
#include <iostream>
#include <thread>
#include <iomanip>
//
#include <fstream>

constexpr int MAX_NORMALIZED_VALUE = 65535;
constexpr char START_BYTE = 0x02;  // Zaèiatoèný znak prenosu byte
constexpr char END_BYTE = 0x03;    // Závereèný znak prenosu byte
constexpr char START_CHAR = '#';  // Zaèiatoèný znak prenosu
constexpr char END_CHAR = '*';    // Závereèný znak prenosu

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

//binary format
//void CKeyboardInputHandler::SendBits(uint64_t bits) const {
//    for (int i = 0; i < 64; i += 8) {
//        char byte = (bits >> i) & 0xFF;
//        SendKeystroke(byte);
//    }
//}
//
//void CKeyboardInputHandler::SendByteData(double x, double y, double speed, double a, double b, double c, double avgX) {
//    int normalizedX = NormalizeCoordinateX(x);
//    int normalizedY = NormalizeCoordinateY(y);
//
//    uint64_t xBits = *reinterpret_cast<uint64_t*>(&normalizedX);
//    uint64_t yBits = *reinterpret_cast<uint64_t*>(&normalizedY);
//    uint64_t speedBits = *reinterpret_cast<uint64_t*>(&speed);
//    uint64_t aBits = *reinterpret_cast<uint64_t*>(&a);
//    uint64_t bBits = *reinterpret_cast<uint64_t*>(&b);
//    uint64_t cBits = *reinterpret_cast<uint64_t*>(&c);
//    uint64_t avgXBits = *reinterpret_cast<uint64_t*>(&avgX);
//
//    SendKeystroke(START_BYTE);
//
//    SendBits(xBits);
//    SendBits(yBits);
//    SendBits(speedBits);
//    SendBits(aBits);
//    SendBits(bBits);
//    SendBits(cBits);
//    SendBits(avgXBits);
//
//    SendKeystroke(END_BYTE);
//
//    std::cout << "Data sent in binary format with start/end markers." << std::endl;//NOTE: Printout
//}

//non-binary format
std::string CKeyboardInputHandler::EncodeData(double x, double y, double speed, double a, double b, double c, double avgX) {
    std::ostringstream oss;
    oss << std::fixed << std::setprecision(6);
    // no speed no parabola
    if (a == 0.0 &&
        speed == 0.0) 
    {
        oss << START_CHAR;
        oss << x << "," << y;
        oss << END_CHAR;
    }
    // speed but no parabola
    else if (a == 0.0) 
    {
        oss << START_CHAR;
        oss << x << "," << y << "," << speed;
		oss << END_CHAR;
	}
    // we got it all bro!
	else
	{
		oss << START_CHAR;
		oss << x << "," << y << "," << speed << "," << a << "," << b << "," << c << "," << avgX;
		oss << END_CHAR;
    }

    return oss.str();
}

void CKeyboardInputHandler::SendData(double x, double y, double speed, double a, double b, double c, double avgX) {
	speed *= 100; // To use number before decimal point
	if (a > 0) a = -a; // fix because a should be always negative, fixing camera bugs
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

int CKeyboardInputHandler::NormalizeCoordinateX(int coordX) const
{
    return coordX * m_stepX;
}

int CKeyboardInputHandler::NormalizeCoordinateY(int coordY) const
{
    return coordY * m_stepY;
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
