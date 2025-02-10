#ifndef WINVER				// Allow use of features specific to Windows XP or later.
#define WINVER 0x0501		// Change this to the appropriate value to target other versions of Windows.
#endif

#include "ConfigReader.h"

#include "GeneralUtils.h"
#include "ConfigWriter.h"
#include "Utilities.h"

#include <fstream>
#include <iostream>

bool CConfigReader::ReadConfigFile()
{
	CString appDataPath = GeneralUtils::GetAppDataPath(_T("VisionSystems"), _T(""), _T(""));
	CString pathToConfigFile = GeneralUtils::GetAppDataPath(_T("VisionSystems"), _T("WallhitCalibration"), _T(""));

	if (!PathFileExists(appDataPath) || !PathFileExists(pathToConfigFile))
	{
		std::cout << "App data dir structure does not exist!" << std::endl;
		return false;
	}

	pathToConfigFile += _T("\\calibConfig.json");

	if (!PathFileExists(pathToConfigFile))
	{
		CConfigWriter configWriter;
		configWriter.WriteCalibConfigFile(Utilities::GetCalibConfigFilePath().GetString());
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

	m_transitionTimeSeconds = doc.at("TransitionTimeSeconds").get<int>();
	m_pointCalibrationTimeSeconds = doc.at("PointCalibrationTimeSeconds").get<int>();
	m_resultsCheckSeconds = doc.at("ResultsCheckSeconds").get<int>();
	m_maxDepth = doc.at("MaximalDepth").get<double>();
	m_minDepth = doc.at("MinimalDepth").get<double>();
	m_contourAreaThresholdMax = doc.at("ContourAreaThresholdMax").get<double>();
	m_contourAreaThresholdMin = doc.at("ContourAreaThresholdMin").get<double>();
	m_contourBBoxMaxWidth = doc.at("ContourBoundingBoxWidthMax").get<int>();
	m_contourBBoxMaxHeight = doc.at("ContourBoundingBoxHeightMax").get<int>();
	m_rangeThresholdHigh = doc.at("RangeThresholdHigh").get<int>();
	m_rangeThresholdLow = doc.at("RangeThresholdLow").get<int>();
	m_accelTolerance = doc.at("AccelTolerance").get<double>();
	m_exposure = doc.at("Exposure").get<double>();

	return true;
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
	return HasElementProperty(doc, "TransitionTimeSeconds") &&
		HasElementProperty(doc, "PointCalibrationTimeSeconds") &&
		HasElementProperty(doc, "MaximalDepth") &&
		HasElementProperty(doc, "MinimalDepth") &&
		HasElementProperty(doc, "ContourBoundingBoxWidthMax") &&
		HasElementProperty(doc, "ContourBoundingBoxHeightMax") &&
		HasElementProperty(doc, "ContourAreaThresholdMax") &&
		HasElementProperty(doc, "ContourAreaThresholdMin") &&
		HasElementProperty(doc, "RangeThresholdLow") &&
		HasElementProperty(doc, "RangeThresholdHigh") &&
		HasElementProperty(doc, "AccelTolerance") &&
		HasElementProperty(doc, "ResultsCheckSeconds") &&
		HasElementProperty(doc, "Exposure");
}
