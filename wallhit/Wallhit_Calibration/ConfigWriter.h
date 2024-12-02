#pragma once

#include <afxwin.h>     
#include <vector>

struct SConfigData
{
	int ResolutionX;
	int ResolutionY;
	std::vector<float> TL;
	std::vector<float> TR;
	std::vector<float> BL;
	std::vector<float> BR;
	double MinimalDepth;
	double MaximalDepth;
	double ContourAreaThresholdMax;
	double ContourAreaThresholdMin;
	bool ShowDebugWindows;
	int RangeThresholdLow;
	int RangeThresholdHigh;
	bool SendMouseClicks;
	double AccelTolerance;
	int ContourBoundingBoxWidthMax;
	int ContourBoundingBoxHeightMax;
	float BallDiameter;
	int NewObjectDistanceThreshold;
	int DisappearedFrameCount;
	int NumberOfTrajectoryPointsToFitFrom;
	int TopBar;
	int BotBar;
	int LeftBar;
	int RightBar;
	bool bShowFps;
	double exposure;
};

class CConfigWriter
{
public:

	bool WriteWallhitConfigFile(const TCHAR *path, const SConfigData &configData) const;
	bool WriteCalibConfigFile(const TCHAR *path) const;
};

