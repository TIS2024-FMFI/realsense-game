#pragma once
class CInputHandler
{
public:
	CInputHandler(int resolutionX, int resolutionY);
	bool SendClickAt(int x, int y) const;

private:
	int m_resX;
	int m_resY;
	int m_stepX;
	int m_stepY;

	int NormalizeCoordinateX(int coordX) const;
	int NormalizeCoordinateY(int coordY) const;
};

