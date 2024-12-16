#ifndef WINVER				// Allow use of features specific to Windows XP or later.
#define WINVER 0x0501		// Change this to the appropriate value to target other versions of Windows.
#endif

#include "Utilities.h"

#include <iostream>

bool Utilities::CreateConfigFilePath()
{
	CString appDataPath = GeneralUtils::GetAppDataPath(_T("VisionSystems"), _T(""), _T(""));
	CString pathToConfigFile = GeneralUtils::GetAppDataPath(_T("VisionSystems"), _T("WallhitCalibration"), _T(""));

	if (!PathFileExists(appDataPath))
	{
		if (!GeneralUtils::CreateDir(appDataPath) || !GeneralUtils::CreateDir(pathToConfigFile))
		{
			std::cout << "Failed to create app data dir structure!" << std::endl;
			return 1;
		}
	}

	if (!PathFileExists(pathToConfigFile))
	{
		if (!GeneralUtils::CreateDir(pathToConfigFile))
		{
			std::cout << "Failed to create app data dir structure!" << std::endl;
			return 1;
		}
	}

	return true;
}

CString Utilities::GetWallhitConfigFilePath()
{
	CString pathToConfigFile = GeneralUtils::GetAppDataPath(_T("VisionSystems"), _T("WallhitCalibration"), _T(""));

	pathToConfigFile += _T("\\wallhitConfig.json");

	return pathToConfigFile;
}

CString Utilities::GetCalibConfigFilePath()
{
	CString pathToConfigFile = GeneralUtils::GetAppDataPath(_T("VisionSystems"), _T("WallhitCalibration"), _T(""));

	pathToConfigFile += _T("\\calibConfig.json");

	return pathToConfigFile;
}