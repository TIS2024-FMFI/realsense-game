#ifndef WINVER				// Allow use of features specific to Windows XP or later.
#define WINVER 0x0501		// Change this to the appropriate value to target other versions of Windows.
#endif

#include "ConfigWriter.h"
#include <iostream>
#include <librealsense2/rs.hpp> // Include RealSense Cross Platform API
#include <librealsense2/rsutil.h>
#include <opencv.hpp>
#include "Utilities.h"
#include <chrono>
#include "Operations.h"
#include "../Wallhit_Detection/Geometry.h"
#include "ConfigReader.h"


constexpr int NUM_OF_TIME_STATES = 10;

int TIMER_SECONDS[NUM_OF_TIME_STATES] = { 5, 4, 20, 4, 20, 4, 20, 4, 20, 5 };
int TIMER_SECONDS_ACCUM[NUM_OF_TIME_STATES];

enum TIMER_TYPE
{
	WARMING_UP = 0,
	TOP_LEFT_TRANSITION,
	TOP_LEFT,
	BOT_LEFT_TRANSITION,
	BOT_LEFT,
	TOP_RIGHT_TRANSITION,
	TOP_RIGHT,	
	BOT_RIGHT_TRANSITION,
	BOT_RIGHT,
	RESULT_CHECK,
	OVERTIME
};

void InitializeTimerSecondsAccum()
{
	int accum = 0;

	for (int i = 0; i < NUM_OF_TIME_STATES; ++i)
	{
		accum += TIMER_SECONDS[i];
		TIMER_SECONDS_ACCUM[i] = accum;
	}
}

TIMER_TYPE GetTimerType(long long secondsPassed)
{
	if (secondsPassed <= TIMER_SECONDS_ACCUM[0]) return WARMING_UP;

	if (secondsPassed > TIMER_SECONDS_ACCUM[0] && secondsPassed <= TIMER_SECONDS_ACCUM[1]) return TOP_LEFT_TRANSITION;
	if (secondsPassed > TIMER_SECONDS_ACCUM[1] && secondsPassed <= TIMER_SECONDS_ACCUM[2]) return TOP_LEFT;

	if (secondsPassed > TIMER_SECONDS_ACCUM[2] && secondsPassed <= TIMER_SECONDS_ACCUM[3]) return BOT_LEFT_TRANSITION ;
	if (secondsPassed > TIMER_SECONDS_ACCUM[3] && secondsPassed <= TIMER_SECONDS_ACCUM[4]) return BOT_LEFT;

	if (secondsPassed > TIMER_SECONDS_ACCUM[4] && secondsPassed <= TIMER_SECONDS_ACCUM[5]) return TOP_RIGHT_TRANSITION;
	if (secondsPassed > TIMER_SECONDS_ACCUM[5] && secondsPassed <= TIMER_SECONDS_ACCUM[6]) return TOP_RIGHT;

	if (secondsPassed > TIMER_SECONDS_ACCUM[6] && secondsPassed <= TIMER_SECONDS_ACCUM[7]) return BOT_RIGHT_TRANSITION;
	if (secondsPassed > TIMER_SECONDS_ACCUM[7] && secondsPassed <= TIMER_SECONDS_ACCUM[8]) return BOT_RIGHT;

	if (secondsPassed > TIMER_SECONDS_ACCUM[8] && secondsPassed <= TIMER_SECONDS_ACCUM[9]) return RESULT_CHECK;

	if (secondsPassed > TIMER_SECONDS_ACCUM[9]) return OVERTIME;

	return OVERTIME;
}

bool mouseClicked = false;

void OnMouseClick(int event, int x, int y, int flags, void* userdata)
{
	if (event == cv::EVENT_LBUTTONDOWN)
	{
		CalibPosition *calibPos = reinterpret_cast<CalibPosition*>(userdata);

		calibPos->x = x;
		calibPos->y = y;
		mouseClicked = true;
	}
}

constexpr int WIDTH = 640;
constexpr int HEIGHT = 480;
double MIN_DEPTH = 0.;
double MAX_DEPTH = 3.;

void ColorMapper(const short int* depthData, cv::Mat &image)
{
	for (int i = 0; i < HEIGHT; ++i)
	{
		unsigned char *imageData = image.ptr(i);

		for (int j = 0; j < WIDTH; ++j)
		{
			int value = static_cast<int>(((depthData[i * WIDTH + j] * 0.001 - MIN_DEPTH) / (MAX_DEPTH - MIN_DEPTH)) * 255.);
			if (value > 255 || value < 0) value = 0;

			imageData[j] = static_cast<unsigned char>(value);
		}
	}
}

void OnMaxDepth(int value, void *)
{
	MAX_DEPTH = value / 1000.;
}

void OnMinDepth(int value, void *)
{
	MIN_DEPTH = value / 1000.;
}

float GetVectorLength(const rs2_vector &vec)
{
	return sqrt(vec.x * vec.x + vec.y * vec.y + vec.z * vec.z);
}

int main(int argc, char * argv[]) try
{
	if (!Utilities::CreateConfigFilePath()) return 1;

	CConfigReader configReader;	
	if (!configReader.ReadConfigFile()) return 1;

	TIMER_SECONDS[1] = TIMER_SECONDS[3] = TIMER_SECONDS[5] = TIMER_SECONDS[7] = configReader.GetTransitionTime();
	TIMER_SECONDS[2] = TIMER_SECONDS[4] = TIMER_SECONDS[6] = TIMER_SECONDS[8] = configReader.GetPointCalibrationTime();
	TIMER_SECONDS[9] = configReader.GetResultCheckTime();

	InitializeTimerSecondsAccum();	

	MIN_DEPTH = configReader.GetMinDepth();
	MAX_DEPTH = configReader.GetMaxDepth();
	int trackMinDepth = static_cast<int>(MIN_DEPTH * 1000);
	int trackMaxDepth = static_cast<int>(MAX_DEPTH * 1000);
	int lowThreshold = configReader.GetRangeLowThreshold();
	int highThreshold = configReader.GetRangeHighThreshold();
	double contourAreaMin = configReader.GetMinContourArea();
	double contourAreaMax = configReader.GetMaxContourArea();
	int contourWidthMax = configReader.GetContourMaxWidth();
	int contourHeightMax = configReader.GetContourMaxHeight();
	double accelTolerance = configReader.GetAccelTolerance();
	double exposure = configReader.GetExposure();

	rs2::context ctx;
	rs2::pipeline pipe;
	rs2::config configuration;
	rs2::frameset currentFrameSet;

	configuration.disable_all_streams();	
	configuration.enable_stream(RS2_STREAM_DEPTH, WIDTH, HEIGHT, RS2_FORMAT_Z16, 30);
	configuration.enable_stream(RS2_STREAM_COLOR, WIDTH, HEIGHT, RS2_FORMAT_RGB8, 30);
	configuration.enable_stream(RS2_STREAM_ACCEL, RS2_FORMAT_MOTION_XYZ32F);

	std::vector<rs2::sensor> sensors = ctx.query_all_sensors();

	for (auto it = sensors.begin(); it != sensors.end(); ++it)
	{
		if (it->supports(RS2_OPTION_ENABLE_AUTO_EXPOSURE))
		{
			it->set_option(RS2_OPTION_ENABLE_AUTO_EXPOSURE, 0);
		}

		if (it->supports(RS2_OPTION_EXPOSURE))
		{
			it->set_option(RS2_OPTION_EXPOSURE, exposure);
		}
	}

	pipe.start(configuration);
	rs2_intrinsics intrinsics = pipe.get_active_profile().get_stream(RS2_STREAM_DEPTH).as<rs2::video_stream_profile>().get_intrinsics();
	
	
	const auto window_name = "Display Image";
	const auto window_name2 = "Thresholded image";

	cv::namedWindow(window_name, cv::WINDOW_AUTOSIZE);
	cv::namedWindow(window_name2, cv::WINDOW_AUTOSIZE);

	cv::createTrackbar("MIN_DEPTH", window_name, &trackMinDepth, 6000, OnMinDepth);
	cv::createTrackbar("MAX_DEPTH", window_name, &trackMaxDepth, 6000, OnMaxDepth);

	OnMinDepth(trackMinDepth, nullptr);
	OnMaxDepth(trackMaxDepth, nullptr);

	cv::createTrackbar("LOW_THRESH", window_name2, &lowThreshold, 255, nullptr);
	cv::createTrackbar("HIGH_THRESH", window_name2, &highThreshold, 255, nullptr);

	std::chrono::steady_clock::time_point lastFrameTime = std::chrono::steady_clock::now();
	float averageAccelLength = 0.f;
	size_t numberOfAccelMeasurements = 0;
	int recalibrationTimeLeftMS = 5000;

	Operations::CImageAveraging averager(WIDTH, HEIGHT);

	cv::Mat mask = cv::Mat::ones(HEIGHT, WIDTH, CV_8UC1);

	for (int i = 0; i < HEIGHT; ++i)
	{
		unsigned char *imageData = mask.ptr(i);

		for (int j = 0; j < 10; ++j)
		{
			imageData[j] = 0;
		}
	}

	for (int i = 0; i < 10; ++i)
	{
		unsigned char *imageData = mask.ptr(i);

		for (int j = 0; j < WIDTH; ++j)
		{
			imageData[j] = 0;
		}
	}

	for (int i = 0; i < HEIGHT; ++i)
	{
		unsigned char *imageData = mask.ptr(i);

		for (int j = WIDTH - 10; j < WIDTH; ++j)
		{
			imageData[j] = 0;
		}
	}

	cv::Mat depthFrame = cv::Mat::zeros(cv::Size(WIDTH, HEIGHT), CV_8UC1);
	cv::Mat avgDepthFrame = cv::Mat::zeros(HEIGHT, WIDTH, CV_8UC1);
	cv::Mat temp = cv::Mat::zeros(HEIGHT, WIDTH, CV_8UC1);
	cv::Mat contourDetection = cv::Mat::zeros(HEIGHT, WIDTH, CV_8UC3);
	cv::Mat gray = cv::Mat::zeros(cv::Size(WIDTH, HEIGHT), CV_8UC1);

	std::vector<cv::Vec2i> currentObjectDetections;
	std::vector<size_t> areaThresholdIndexes;
	areaThresholdIndexes.reserve(20);

	int startTimeOffset = 3000;

	while (cv::waitKey(1) != 13 && cv::getWindowProperty(window_name, cv::WND_PROP_AUTOSIZE) >= 0)
	{
		currentFrameSet = pipe.wait_for_frames();

		std::chrono::steady_clock::time_point now = std::chrono::steady_clock::now();

		rs2::depth_frame depth = currentFrameSet.get_depth_frame();
		ColorMapper(reinterpret_cast<const short int*>(depth.get_data()), depthFrame);
		rs2::motion_frame motionFrame = currentFrameSet.first_or_default(RS2_STREAM_ACCEL, RS2_FORMAT_MOTION_XYZ32F).as<rs2::motion_frame>();

		int msPassed = static_cast<int>(std::chrono::duration_cast<std::chrono::milliseconds>(now - lastFrameTime).count());
		lastFrameTime = now;

		if (startTimeOffset > 0)
		{
			startTimeOffset -= msPassed;
			continue;
		}
		else if (recalibrationTimeLeftMS > 0)
		{
			recalibrationTimeLeftMS -= msPassed;

			if (recalibrationTimeLeftMS == 0) recalibrationTimeLeftMS -= 1;	//zero is special state

			++numberOfAccelMeasurements;
			rs2_vector accelData = motionFrame.get_motion_data();
			averageAccelLength += GetVectorLength(accelData);

			averager.Do(depthFrame);
			continue;
		}
		else if (recalibrationTimeLeftMS < 0)
		{
			averager.Finalize();
			recalibrationTimeLeftMS = 0;
			averageAccelLength /= numberOfAccelMeasurements;
			numberOfAccelMeasurements = 0;
			avgDepthFrame = averager.GetAverageImage();
		}

		float currentAccelLength = GetVectorLength(motionFrame.get_motion_data());

		if (currentAccelLength < averageAccelLength - accelTolerance ||
			currentAccelLength > averageAccelLength + accelTolerance)
		{
			averager.Reset(WIDTH, HEIGHT);
			recalibrationTimeLeftMS = 5000;
			averageAccelLength = 0.f;
			continue;
		}

		cv::imshow(window_name, depthFrame);

		cv::absdiff(depthFrame, avgDepthFrame, temp);
		cv::inRange(temp, lowThreshold, highThreshold, gray);
		cv::multiply(gray, mask, gray);
		cv::cvtColor(gray, contourDetection, cv::COLOR_GRAY2BGR);

		std::vector<std::vector<cv::Point>> contours;

		cv::findContours(gray, contours, cv::RETR_EXTERNAL, cv::CHAIN_APPROX_NONE);	//bottleneck

		areaThresholdIndexes.clear();
		areaThresholdIndexes.reserve(contours.size());

		for (size_t i = 0; i < contours.size(); ++i)
		{
			double area = cv::contourArea(contours[i]);

			if (area > contourAreaMin && area < contourAreaMax)
			{
				const cv::Rect bbox = cv::boundingRect(contours[i]);

				if (bbox.width <= contourWidthMax && bbox.height <= contourHeightMax)
					areaThresholdIndexes.push_back(i);
			}
		}

		currentObjectDetections.clear();
		currentObjectDetections.reserve(areaThresholdIndexes.size());

		for (size_t i = 0; i < areaThresholdIndexes.size(); ++i)
		{
			cv::Moments moments = cv::moments(contours[areaThresholdIndexes[i]]);

			int cx = static_cast<int>(moments.m10 / moments.m00);
			int cy = static_cast<int>(moments.m01 / moments.m00);

			currentObjectDetections.emplace_back(cx, cy);

			cv::circle(contourDetection, cv::Point(cx, cy), 10, cv::Scalar(0, 0, 255), 3);
		}

		cv::imshow(window_name2, contourDetection);
	}

	cv::destroyWindow(window_name2);

	CalibPosition calibPos;
	cv::setMouseCallback(window_name, OnMouseClick, &calibPos);

	TIMER_TYPE lastType = OVERTIME;

	Operations::CTransition warmingUp("Prepare for calibration");
	Operations::CImageAveraging imageAveraging(WIDTH, HEIGHT);

	Operations::CTransition topLeftTrans("Prepare for TOP LEFT");
	Operations::CPointAveraging topLeft(WIDTH, HEIGHT, intrinsics, "Top left", "TL");

	Operations::CTransition topRightTrans("Prepare for TOP RIGHT");
	Operations::CPointAveraging topRight(WIDTH, HEIGHT, intrinsics, "Top right", "TR");

	Operations::CTransition botLeftTrans("Prepare for BOT LEFT");
	Operations::CPointAveraging botLeft(WIDTH, HEIGHT, intrinsics, "Bot left", "BL");

	Operations::CTransition botRightTrans("Prepare for BOT RIGHT");
	Operations::CPointAveraging botRight(WIDTH, HEIGHT, intrinsics, "Bot right", "BR");

	Operations::CResultCheck resultCheck(10);

	rs2::align align_to_depth(RS2_STREAM_DEPTH);
	cv::Mat colorImage(cv::Size(WIDTH, HEIGHT), CV_8UC3);
	std::chrono::steady_clock::time_point start = std::chrono::steady_clock::now();

	averager.Reset(WIDTH, HEIGHT);
	startTimeOffset = 3000;

	for (auto it = sensors.begin(); it != sensors.end(); ++it)
	{
		if (it->supports(RS2_OPTION_ENABLE_AUTO_EXPOSURE))
		{
			it->set_option(RS2_OPTION_ENABLE_AUTO_EXPOSURE, 1);
		}
	}

	bool bStayInLoop = true;
	while(cv::waitKey(1) != 13 && cv::getWindowProperty(window_name, cv::WND_PROP_AUTOSIZE) >= 0 && bStayInLoop)
	{		
		currentFrameSet = pipe.wait_for_frames();

		std::chrono::steady_clock::time_point now = std::chrono::steady_clock::now();
		currentFrameSet = align_to_depth.process(currentFrameSet);

		rs2::depth_frame depth = currentFrameSet.get_depth_frame();
		rs2::frame colorFrame = currentFrameSet.get_color_frame();

		rs2::motion_frame motionFrame = currentFrameSet.first_or_default(RS2_STREAM_ACCEL, RS2_FORMAT_MOTION_XYZ32F).as<rs2::motion_frame>();

		int msPassed = static_cast<int>(1000. / std::chrono::duration_cast<std::chrono::milliseconds>(now - lastFrameTime).count());
		lastFrameTime = now;

		if (startTimeOffset > 0)
		{
			startTimeOffset -= msPassed;
			continue;
		}
		else if (recalibrationTimeLeftMS > 0)
		{
			recalibrationTimeLeftMS -= msPassed;

			if (recalibrationTimeLeftMS == 0) recalibrationTimeLeftMS -= 1;	//zero is special state

			++numberOfAccelMeasurements;
			rs2_vector accelData = motionFrame.get_motion_data();
			averageAccelLength += GetVectorLength(accelData);

			averager.Do(depthFrame);
			continue;
		}
		else if (recalibrationTimeLeftMS < 0)
		{
			averager.Finalize();
			recalibrationTimeLeftMS = 0;
			averageAccelLength /= numberOfAccelMeasurements;
			numberOfAccelMeasurements = 0;
			avgDepthFrame = averager.GetAverageImage();
			start = std::chrono::steady_clock::now();
		}

		float currentAccelLength = GetVectorLength(motionFrame.get_motion_data());

		if (currentAccelLength < averageAccelLength - accelTolerance ||
			currentAccelLength > averageAccelLength + accelTolerance)
		{
			averager = Operations::CImageAveraging(WIDTH, HEIGHT);
			recalibrationTimeLeftMS = 5000;
			averageAccelLength = 0.f;
			start = std::chrono::steady_clock::now();			
			continue;
		}
		
		ColorMapper(reinterpret_cast<const short int*>(depth.get_data()), depthFrame);

		colorImage = cv::Mat(cv::Size(WIDTH, HEIGHT), CV_8UC3, (void*)colorFrame.get_data(), cv::Mat::AUTO_STEP);

		int secondsPassed = static_cast<int>(std::chrono::duration_cast<std::chrono::seconds>(std::chrono::steady_clock::now() - start).count());

		switch (GetTimerType(secondsPassed))
		{
		case WARMING_UP:
		{
			warmingUp.Do(colorImage, TIMER_SECONDS_ACCUM[WARMING_UP] - secondsPassed);
			if (lastType != WARMING_UP) std::cout << "WARMING UP" << std::endl;
			lastType = WARMING_UP;
			break;
		}
		case TOP_LEFT_TRANSITION:
		{
			topLeftTrans.Do(colorImage, TIMER_SECONDS_ACCUM[TOP_LEFT_TRANSITION] - secondsPassed);

			if (lastType != TOP_LEFT_TRANSITION)
			{
				imageAveraging.Finalize();
				std::cout << "TOP LEFT TRANSITION" << std::endl;
			}

			lastType = TOP_LEFT_TRANSITION;
			break;
		}
		case TOP_LEFT:
		{
			topLeft.Do(colorImage, calibPos, mouseClicked);
			if (lastType != TOP_LEFT) std::cout << "TOP LEFT AVERAGING" << std::endl;
			lastType = TOP_LEFT;
			break;
		}
		case TOP_RIGHT_TRANSITION:
		{
			topRightTrans.Do(colorImage, TIMER_SECONDS_ACCUM[TOP_RIGHT_TRANSITION] - secondsPassed);

			if (lastType != TOP_RIGHT_TRANSITION && mouseClicked)
			{
				botLeft.Finalize(calibPos, depth);
				std::cout << "TOP RIGHT TRANSITION" << std::endl;
				lastType = TOP_RIGHT_TRANSITION;
				mouseClicked = false;
			}

			break;
		}
		case TOP_RIGHT:
		{
			topRight.Do(colorImage, calibPos, mouseClicked);
			if (lastType != TOP_RIGHT) std::cout << "TOP RIGHT AVERAGING" << std::endl;
			lastType = TOP_RIGHT;
			break;
		}
		case BOT_LEFT_TRANSITION:
		{
			botLeftTrans.Do(colorImage, TIMER_SECONDS_ACCUM[BOT_LEFT_TRANSITION] - secondsPassed);

			if (lastType != BOT_LEFT_TRANSITION && mouseClicked)
			{
				topLeft.Finalize(calibPos, depth);
				std::cout << "BOT LEFT TRANSITION" << std::endl;
				lastType = BOT_LEFT_TRANSITION;
				mouseClicked = false;
			}

			break;
		}
		case BOT_LEFT:
		{
			botLeft.Do(colorImage, calibPos, mouseClicked);
			if (lastType != BOT_LEFT) std::cout << "BOT LEFT AVERAGING" << std::endl;
			lastType = BOT_LEFT;
			break;
		}
		case BOT_RIGHT_TRANSITION:
		{
			botRightTrans.Do(colorImage, TIMER_SECONDS_ACCUM[BOT_RIGHT_TRANSITION] - secondsPassed);

			if (lastType != BOT_RIGHT_TRANSITION && mouseClicked)
			{
				topRight.Finalize(calibPos, depth);
				std::cout << "BOT RIGHT TRANSITION" << std::endl;
				lastType = BOT_RIGHT_TRANSITION;
				mouseClicked = false;
			}

			break;
		}
		case BOT_RIGHT:
		{
			botRight.Do(colorImage, calibPos, mouseClicked);
			if (lastType != BOT_RIGHT) std::cout << "BOT RIGHT AVERAGING" << std::endl;
			lastType = BOT_RIGHT;
			break;
		}
		case RESULT_CHECK:
		{
			resultCheck.Do(colorImage,
				topLeft.GetPoint(),
				topRight.GetPoint(),
				botLeft.GetPoint(),
				botRight.GetPoint());

			if (lastType != RESULT_CHECK && mouseClicked)
			{
				botRight.Finalize(calibPos, depth);
				std::cout << "RESULT CHECK" << std::endl;
				lastType = RESULT_CHECK;
				mouseClicked = false;
			}

			break;
		}
		case OVERTIME:
		{
			if (lastType != OVERTIME) std::cout << "OVERTIME" << std::endl;
			bStayInLoop = false;
			break;
		}
		}

		cv::imshow(window_name, colorImage);
	}

	CConfigWriter configWriter;
	SConfigData configData;

	configData.TL = topLeft.GetAverageVectorPoint();
	configData.TR = topRight.GetAverageVectorPoint();
	configData.BL = botLeft.GetAverageVectorPoint();
	configData.BR = botRight.GetAverageVectorPoint();
	configData.ResolutionX = 1920;
	configData.ResolutionY = 1280;
	configData.ContourAreaThresholdMax = contourAreaMax;
	configData.ContourAreaThresholdMin = contourAreaMin;
	configData.ShowDebugWindows = false;
	configData.RangeThresholdLow = lowThreshold;
	configData.RangeThresholdHigh = highThreshold;
	configData.SendMouseClicks = true;
	configData.AccelTolerance = accelTolerance;
	configData.MaximalDepth = MAX_DEPTH;
	configData.MinimalDepth = MIN_DEPTH;
	configData.ContourBoundingBoxHeightMax = contourWidthMax;
	configData.ContourBoundingBoxWidthMax = contourHeightMax;
	configData.BallDiameter = 0.18f;
	configData.NewObjectDistanceThreshold = 100;
	configData.DisappearedFrameCount = 10;
	configData.NumberOfTrajectoryPointsToFitFrom = 3;
	configData.TopBar = 10;
	configData.BotBar = 10;
	configData.LeftBar = 10;
	configData.RightBar = 10;
	configData.bShowFps = false;
	configData.exposure = 10000.;

	configWriter.WriteWallhitConfigFile(Utilities::GetWallhitConfigFilePath().GetString(), configData);
	std::cout << "Configuration file written" << std::endl;
	return EXIT_SUCCESS;
}
catch (const rs2::error & e)
{
	std::cerr << "RealSense error calling " << e.get_failed_function() << "(" << e.get_failed_args() << "):\n    " << e.what() << std::endl;
	return EXIT_FAILURE;
}
catch (const std::exception& e)
{
	std::cerr << e.what() << std::endl;
	return EXIT_FAILURE;
}


//rs2::context ctx;
//
//std::vector<rs2::sensor> sensors = ctx.query_all_sensors();
//rs2::sensor sensor = sensors[1];
//
//{
//	for (rs2::sensor sensor : sensors)
//	{
//		if (sensor.supports(RS2_CAMERA_INFO_NAME))
//		{
//			std::cout << sensor.get_info(RS2_CAMERA_INFO_NAME) << std::endl;
//		}
//	}
//
//	std::vector<rs2::stream_profile> stream_profiles = sensor.get_stream_profiles();
//
//	std::map<std::pair<rs2_stream, int>, int> unique_streams;
//	for (auto&& sp : stream_profiles)
//	{
//		unique_streams[std::make_pair(sp.stream_type(), sp.stream_index())]++;
//	}
//	std::cout << "Sensor consists of " << unique_streams.size() << " streams: " << std::endl;
//	for (size_t i = 0; i < unique_streams.size(); i++)
//	{
//		auto it = unique_streams.begin();
//		std::advance(it, i);
//		std::cout << "  - " << it->first.first << " #" << it->first.second << std::endl;
//	}
//
//	//Next, we go over all the stream profiles and print the details of each one
//	std::cout << "Sensor provides the following stream profiles:" << std::endl;
//	int profile_num = 0;
//	for (rs2::stream_profile stream_profile : stream_profiles)
//	{
//		rs2_stream stream_data_type = stream_profile.stream_type();
//
//		int stream_index = stream_profile.stream_index();
//
//
//		std::string stream_name = stream_profile.stream_name();
//
//		std::cout << std::setw(3) << profile_num << ": " << stream_data_type << " #" << stream_index;
//
//
//		if (stream_profile.is<rs2::video_stream_profile>()) //"Is" will test if the type tested is of the type given
//		{
//
//			rs2::video_stream_profile video_stream_profile = stream_profile.as<rs2::video_stream_profile>();
//
//
//			std::cout << " (Video Stream: " << video_stream_profile.format() << " " <<
//				video_stream_profile.width() << "x" << video_stream_profile.height() << "@ " << video_stream_profile.fps() << "Hz)";
//		}
//		std::cout << std::endl;
//		profile_num++;
//	}
//}