#ifndef WINVER				// Allow use of features specific to Windows XP or later.
#define WINVER 0x0501		// Change this to the appropriate value to target other versions of Windows.
#endif

#include "ConfigWriter.h"

#include <nlohmann/json.hpp>
#include <fstream>

using njson = nlohmann::json;

bool CConfigWriter::WriteWallhitConfigFile(const TCHAR *path, const SConfigData &configData) const
{
	std::ofstream configFile(path);

	if (!configFile.is_open()) return false;

	njson doc = {
	{"ResolutionX", configData.ResolutionX},
	{"ResolutionY", configData.ResolutionY},
	{"TL", configData.TL},
	{"TR", configData.TR},
	{"BL", configData.BL},
	{"BR", configData.BR},	
	{"MinimalDepth", configData.MinimalDepth},
	{"MaximalDepth", configData.MaximalDepth},
	{"ContourAreaThresholdMax", configData.ContourAreaThresholdMax},
	{"ContourAreaThresholdMin", configData.ContourAreaThresholdMin},
	{"ShowDebugWindows", configData.ShowDebugWindows},
	{"RangeThresholdLow", configData.RangeThresholdLow},
	{"RangeThresholdHigh", configData.RangeThresholdHigh},
	{"SendMouseClicks", configData.SendMouseClicks},
	{"AccelTolerance", configData.AccelTolerance},
	{"ContourBoundingBoxWidthMax", configData.ContourBoundingBoxWidthMax},
	{"ContourBoundingBoxHeightMax", configData.ContourBoundingBoxHeightMax},
	{"BallDiameter", configData.BallDiameter},
	{"NewObjectDistanceThreshold", configData.NewObjectDistanceThreshold},
	{"DisappearedFrameCount", configData.DisappearedFrameCount},
	{"NumberOfTrajectoryPointsToFitFrom", configData.NumberOfTrajectoryPointsToFitFrom},
	{"TOP_BAR", configData.TopBar},
	{"BOT_BAR", configData.BotBar},
	{"LEFT_BAR", configData.LeftBar},
	{"RIGHT_BAR", configData.RightBar},
	{"ShowFPS", configData.bShowFps},
	{"Exposure", configData.exposure}
	};

	configFile << doc.dump(4);

	configFile.close();

	return true;
}

bool CConfigWriter::WriteCalibConfigFile(const TCHAR *path) const
{
	std::ofstream configFile(path);

	if (!configFile.is_open()) return false;

	njson doc = {
	{"MinimalDepth", 0.},
	{"MaximalDepth", 3.},
	{"ContourBoundingBoxWidthMax", 200},
	{"ContourBoundingBoxHeightMax", 200},
	{"ContourAreaThresholdMax", 2000.},
	{"ContourAreaThresholdMin", 400.},
	{"TransitionTimeSeconds", 4},
	{"PointCalibrationTimeSeconds", 20},
	{"RangeThresholdLow", 18},
	{"RangeThresholdHigh", 255},
	{"AccelTolerance", 0.2},
	{"ResultsCheckSeconds", 5},
	{"Exposure", 10000.}
	};

	configFile << doc.dump(4);

	configFile.close();

	return true;
}