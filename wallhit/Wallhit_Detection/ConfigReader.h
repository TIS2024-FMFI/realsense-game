#pragma once


//#include <opencv_all.h>
#include <opencv.hpp>
#include <nlohmann/json.hpp>
#include <vector>
#include "Geometry.h"

using njson = nlohmann::json;

class CConfigReader
{
public:
	bool ReadConfigFile();
	int GetResolutionX() const { return m_resX; }
	int GetResolutionY() const { return m_resY; }
	Geometry::CPoint GetTL() const;
	Geometry::CPoint GetTR() const;
	Geometry::CPoint GetBL() const;
	Geometry::CPoint GetBR() const;
	double GetMinimalDepth() const { return m_minimalDepth; }
	double GetMaximalDepth() const { return m_maximalDepth; }
	double GetContourAreaThresholdMin() const { return m_contourAreaThresholdMin; }
	double GetContourAreaThresholdMax() const { return m_contourAreaThresholdMax; }
	int GetRangeThresholdLow() const { return m_rangeThresholdLow; }
	int GetRangeThresholdHigh() const { return m_rangeThresholdHigh; }
	bool DebugWindowsVisible() const { return m_bShowDebugWindows; }
	bool SendMouseClicks() const { return m_bSendMouseClicks; }
	double GetAccelTolerance() const { return m_accelTolerance; }
	int GetContourBBoxWidthMax() const { return m_contourBBoxWidthMax; }
	int GetContourBBoxHeightMax() const { return m_contourBBoxHeightMax; }
	float GetBallDiameter() const { return m_ballDiameter; }
	int GetNewObjectDistanceThreshold() const { return m_newObjectDistanceThreshold; }
	int GetDisappearedFrameCount() const { return m_disappearedFrameCount; }
	int GetNumberOfTrajectoryPointsToFitFrom() const { return m_numberOfTrajectoryPointsToFitFrom; }
	int GetTopBar() const { return m_topBar; }
	int GetBotBar() const { return m_botBar; }
	int GetLeftBar() const { return m_leftBar; }
	int GetRightBar() const { return m_rightBar; }
	bool GetShowFPS() const { return m_bShowFps; }
	double GetExposure() const { return m_exposure; }

private:
	int m_resX;
	int m_resY;
	int m_rangeThresholdLow;
	int m_rangeThresholdHigh;
	std::vector<float> m_TL;
	std::vector<float> m_TR;
	std::vector<float> m_BL;
	std::vector<float> m_BR;
	double m_accelTolerance;
	double m_minimalDepth;
	double m_maximalDepth;
	double m_contourAreaThresholdMin;
	double m_contourAreaThresholdMax;
	bool m_bShowDebugWindows;
	bool m_bSendMouseClicks;
	int m_contourBBoxHeightMax;
	int m_contourBBoxWidthMax;
	float m_ballDiameter;
	int m_newObjectDistanceThreshold;
	int m_disappearedFrameCount;
	int m_numberOfTrajectoryPointsToFitFrom;
	int m_topBar;
	int m_botBar;
	int m_leftBar;
	int m_rightBar;
	bool m_bShowFps;
	double m_exposure;

	bool HasElementProperty(const njson &element, const char* prop) const;
	bool HasConfigFileAllRequiredValues(const njson &doc) const;
};

