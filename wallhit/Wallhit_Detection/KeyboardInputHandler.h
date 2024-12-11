#ifndef KEYBOARDINPUTHANDLER_H
#define KEYBOARDINPUTHANDLER_H

#include <string>
#include <Windows.h>
#include <sstream>
#include <iostream>
#include <thread>
#include <iomanip>
#include <fstream>
#include <vector>

class CKeyboardInputHandler {
public:
	CKeyboardInputHandler(int resolutionX, int resolutionY);
    void SendKeystroke(char c) const;
	std::string EncodeData(double x, double y, double speed, double a, double b, double c, double avgX);
    void SendData(double x, double y, double speed, double a, double b, double c, double avgX);
	void SaveDataToFile(double x, double y, double speed, double a, double b, double c, double avgX) const;
private:
	int m_resX;
	int m_resY;
	int m_stepX;
	int m_stepY;
};

#endif