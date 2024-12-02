#pragma once

#include <afxwin.h>      
#include <shlobj_core.h>
#include <vector>

namespace GeneralUtils
{
	inline CString FormatStringV(const CString& format, va_list args)
	{
		CString result;
		try
		{
			result.FormatV(format, args);
		}
		catch (...) {
			//not enough parameters?
			ASSERT(FALSE);
			result.Empty();
		}
		return result;
	}

	inline CString GetAppDataPath(const CString& companyName, const CString& appName, CString fileName, ...)
	{
		HRESULT hr;
		TCHAR szBuff[MAX_PATH];
		hr = SHGetSpecialFolderPath(NULL, szBuff, CSIDL_COMMON_APPDATA, FALSE);
		CString appDataPath(szBuff);
		appDataPath += _T("\\");

		va_list args;
		va_start(args, fileName);
		CString fileNameComplete = FormatStringV(fileName, args);
		va_end(args);

		if (!companyName.IsEmpty()) appDataPath += companyName + _T("\\");
		if (!appName.IsEmpty()) appDataPath += appName + _T("\\");
		if (!fileNameComplete.IsEmpty()) appDataPath += fileNameComplete;
		return appDataPath;
	}

	inline bool CreateDir(const CString &path)
	{
		CreateDirectory(path, NULL);
		DWORD attributes = GetFileAttributes(path);
		return attributes != INVALID_FILE_ATTRIBUTES;
	}
};

