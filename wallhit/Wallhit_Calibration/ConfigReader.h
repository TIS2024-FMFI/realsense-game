#pragma once

#include <nlohmann/json.hpp>

using njson = nlohmann::json;

class CConfigReader
{
public:
	bool ReadConfigFile();
	int GetTransitionTime() const { return m_transitionTimeSeconds; }
	int GetPointCalibrationTime() const { return m_pointCalibrationTimeSeconds; }
	int GetResultCheckTime() const { return m_resultsCheckSeconds; }
	double GetMinDepth() const { return m_minDepth; }
	double GetMaxDepth() const { return m_maxDepth; }
	double GetMaxContourArea() const { return m_contourAreaThresholdMax; }
	double GetMinContourArea() const { return m_contourAreaThresholdMin; }
	int GetContourMaxWidth() const { return m_contourBBoxMaxWidth; }
	int GetContourMaxHeight() const { return m_contourBBoxMaxHeight; }
	int GetRangeHighThreshold() const { return m_rangeThresholdHigh; }
	int GetRangeLowThreshold() const { return m_rangeThresholdLow; }
	double GetAccelTolerance() const { return m_accelTolerance; }
	double GetExposure() const { return m_exposure; }

private:
	double m_minDepth;
	double m_maxDepth;
	int m_transitionTimeSeconds;
	int m_pointCalibrationTimeSeconds;
	int m_resultsCheckSeconds;
	double m_contourAreaThresholdMax;
	double m_contourAreaThresholdMin;
	int m_contourBBoxMaxWidth;
	int m_contourBBoxMaxHeight;
	int m_rangeThresholdHigh;
	int m_rangeThresholdLow;
	double m_accelTolerance;
	double m_exposure;

	bool HasElementProperty(const njson &element, const char* prop) const;
	bool HasConfigFileAllRequiredValues(const njson &doc) const;
};

