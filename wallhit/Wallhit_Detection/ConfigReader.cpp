#ifndef WINVER				// Allow use of features specific to Windows XP or later.
#define WINVER 0x0501		// Change this to the appropriate value to target other versions of Windows.
#endif

#include "ConfigReader.h"

#include <fstream>
#include <iostream>

#include "..\Wallhit_Calibration\GeneralUtils.h"

bool CConfigReader::ReadConfigFile()
{
	CString appDataPath = GeneralUtils::GetAppDataPath(_T("VisionSystems"), _T(""), _T(""));
	CString pathToConfigFile = GeneralUtils::GetAppDataPath(_T("VisionSystems"), _T("WallhitCalibration"), _T(""));

	if (!PathFileExists(appDataPath) || !PathFileExists(pathToConfigFile))
	{
		std::cout << "App data dir structure does not exist!" << std::endl;
		return false;
	}

	pathToConfigFile += _T("\\wallhitConfig.json");

	if (!PathFileExists(pathToConfigFile))
	{
		std::cout << "Config file does not exist!" << std::endl;
		return false;
	}

	std::ifstream configFile(pathToConfigFile.GetString());
	njson doc;

	try
	{
		doc = njson::parse(configFile);
	}
	catch (njson::parse_error &err)
	{
		std::cout << err.what();

		return false;
	}

	if (!HasConfigFileAllRequiredValues(doc)) return false;

	m_resX = doc.at("ResolutionX").get<int>();
	m_resY = doc.at("ResolutionY").get<int>();
	m_TL = doc.at("TL").get<std::vector<float>>();
	m_TR = doc.at("TR").get<std::vector<float>>();
	m_BL = doc.at("BL").get<std::vector<float>>();
	m_BR = doc.at("BR").get<std::vector<float>>();
	m_minimalDepth = doc.at("MinimalDepth").get<double>();
	m_maximalDepth = doc.at("MaximalDepth").get<double>();
	m_contourAreaThresholdMax = doc.at("ContourAreaThresholdMax").get<double>();
	m_contourAreaThresholdMin = doc.at("ContourAreaThresholdMin").get<double>();
	m_bShowDebugWindows = doc.at("ShowDebugWindows").get<bool>();	
	m_rangeThresholdLow = doc.at("RangeThresholdLow").get<int>();
	m_rangeThresholdHigh = doc.at("RangeThresholdHigh").get<int>();
	m_bSendMouseClicks = doc.at("SendMouseClicks").get<bool>();
	m_accelTolerance = doc.at("AccelTolerance").get<double>();
	m_contourBBoxHeightMax = doc.at("ContourBoundingBoxHeightMax").get<int>();
	m_contourBBoxWidthMax = doc.at("ContourBoundingBoxWidthMax").get<int>();
	m_ballDiameter = doc.at("BallDiameter").get<float>();
	m_newObjectDistanceThreshold = doc.at("NewObjectDistanceThreshold").get<int>();
	m_disappearedFrameCount = doc.at("DisappearedFrameCount").get<int>();
	m_numberOfTrajectoryPointsToFitFrom = doc.at("NumberOfTrajectoryPointsToFitFrom").get<int>();
	m_topBar = doc.at("TOP_BAR").get<int>();
	m_botBar = doc.at("BOT_BAR").get<int>();
	m_leftBar= doc.at("LEFT_BAR").get<int>();
	m_rightBar = doc.at("RIGHT_BAR").get<int>();
	m_bShowFps = doc.at("ShowFPS").get<bool>();
	m_exposure = doc.at("Exposure").get<double>();

	return true;
}

Geometry::CPoint CConfigReader::GetTL() const
{
	return Geometry::CPoint(m_TL[0], m_TL[1], m_TL[2]);
}

Geometry::CPoint CConfigReader::GetTR() const
{
	return Geometry::CPoint(m_TR[0], m_TR[1], m_TR[2]);
}

Geometry::CPoint CConfigReader::GetBL() const
{
	return Geometry::CPoint(m_BL[0], m_BL[1], m_BL[2]);
}

Geometry::CPoint CConfigReader::GetBR() const 
{
	return Geometry::CPoint(m_BR[0], m_BR[1], m_BR[2]);
}

bool CConfigReader::HasElementProperty(const njson &element, const char* prop) const
{
	if (element.find(prop) != element.end())
	{
		return true;
	}

	return false;
}

bool CConfigReader::HasConfigFileAllRequiredValues(const njson &doc) const
{
	return HasElementProperty(doc, "ResolutionX") &&
		HasElementProperty(doc, "ResolutionY") &&
		HasElementProperty(doc, "MinimalDepth") &&
		HasElementProperty(doc, "MaximalDepth") &&
		HasElementProperty(doc, "TL") &&
		HasElementProperty(doc, "TR") &&
		HasElementProperty(doc, "BL") &&
		HasElementProperty(doc, "BR") &&
		HasElementProperty(doc, "ContourAreaThresholdMax") &&
		HasElementProperty(doc, "ContourAreaThresholdMin") &&
		HasElementProperty(doc, "ShowDebugWindows") &&
		HasElementProperty(doc, "RangeThresholdLow") &&
		HasElementProperty(doc, "RangeThresholdHigh") &&
		HasElementProperty(doc, "AccelTolerance") &&
		HasElementProperty(doc, "ContourBoundingBoxWidthMax") &&
		HasElementProperty(doc, "ContourBoundingBoxHeightMax") &&
		HasElementProperty(doc, "BallDiameter") &&
		HasElementProperty(doc, "NewObjectDistanceThreshold") &&
		HasElementProperty(doc, "DisappearedFrameCount") &&
		HasElementProperty(doc, "NumberOfTrajectoryPointsToFitFrom") &&
		HasElementProperty(doc, "SendMouseClicks") &&
		HasElementProperty(doc, "TOP_BAR") &&
		HasElementProperty(doc, "BOT_BAR") &&
		HasElementProperty(doc, "LEFT_BAR") &&
		HasElementProperty(doc, "RIGHT_BAR") &&
		HasElementProperty(doc, "ShowFPS") &&
		HasElementProperty(doc, "Exposure");
}