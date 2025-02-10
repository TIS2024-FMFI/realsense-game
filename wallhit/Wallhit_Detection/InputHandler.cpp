#ifndef WINVER				// Allow use of features specific to Windows XP or later.
#define WINVER 0x0501		// Change this to the appropriate value to target other versions of Windows.
#endif

#include "InputHandler.h"

#include <Windows.h>
#include <WinUser.h>
#include <iostream>

constexpr int MAX_NORMALIZED_VALUE = 65535;

CInputHandler::CInputHandler(int resolutionX, int resolutionY) : m_resX(resolutionX), m_resY(resolutionY)
{
	m_stepX = MAX_NORMALIZED_VALUE / m_resX;
	m_stepY = MAX_NORMALIZED_VALUE / m_resY;
}

bool CInputHandler::SendClickAt(int x, int y) const
{
	INPUT inputs[4];
	ZeroMemory(inputs, sizeof(inputs));

	inputs[0].type = INPUT_MOUSE;
	inputs[0].mi.dwFlags = MOUSEEVENTF_LEFTUP;

	inputs[1].type = INPUT_MOUSE;
	inputs[1].mi.dwFlags = MOUSEEVENTF_ABSOLUTE | MOUSEEVENTF_MOVE;
	inputs[1].mi.dx = NormalizeCoordinateX(x);
	inputs[1].mi.dy = NormalizeCoordinateY(y);

	inputs[2].type = INPUT_MOUSE;
	inputs[2].mi.dwFlags = MOUSEEVENTF_LEFTDOWN;

	inputs[3].type = INPUT_MOUSE;
	inputs[3].mi.dwFlags = MOUSEEVENTF_LEFTUP;

	UINT uSent = SendInput(ARRAYSIZE(inputs), inputs, sizeof(INPUT));

	//NOTE: control printout
	std::cout << "Click sent at " << x << " " << y << std::endl;

	return uSent == ARRAYSIZE(inputs);
}

int CInputHandler::NormalizeCoordinateX(int coordX) const
{
	return coordX * m_stepX;
}

int CInputHandler::NormalizeCoordinateY(int coordY) const
{
	return coordY * m_stepY;
}