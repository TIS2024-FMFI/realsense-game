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
	/*void SendBits(uint64_t bits) const;
	void SendByteData(double x, double y, double speed, double a, double b, double c, double avgX);*/
	std::string EncodeData(double x, double y, double speed, double a, double b, double c, double avgX);
    void SendData(double x, double y, double speed, double a, double b, double c, double avgX);
	void SaveDataToFile(double x, double y, double speed, double a, double b, double c, double avgX) const;
	void SendData2(double x, double y, double speed, const std::vector<double>& directionVector);
private:
	int m_resX;
	int m_resY;
	int m_stepX;
	int m_stepY;

	int NormalizeCoordinateX(int coordX) const;
	int NormalizeCoordinateY(int coordY) const;
};

#endif // KEYBOARDINPUTHANDLER_H