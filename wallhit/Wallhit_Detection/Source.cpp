#ifndef WINVER				// Allow use of features specific to Windows XP or later.
#define WINVER 0x0501		// Change this to the appropriate value to target other versions of Windows.
#endif


#include <librealsense2/rs.hpp>
#include <librealsense2/rsutil.h>
//#include <opencv_all.h>
#include <opencv.hpp>
#include <iostream>
#include <vector>
#include "ConfigReader.h"
#include "InputHandler.h"
#include "KeyboardInputHandler.h"
#include "BallHit.h"
#include "Geometry.h"
#include "..\Wallhit_Calibration\Operations.h"
#include <chrono>
#include <thread>
#include "CentroidTracker.h"
#include <sstream>
#include <string>

constexpr int WIDTH = 640;
constexpr int HEIGHT = 480;
double MIN_DEPTH = 1.;
double MAX_DEPTH = 2.9;

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

float GetDistance(int x, int y, const short int* depthData)		//kernel based
{
	const int kernelRadius = 1;
	float accum = 0.f;
	int validCounter = 0;

	for (int i = y - kernelRadius; i <= y + kernelRadius ; ++i)
	{
		if (i < 0 || i >= HEIGHT - 1) continue;

		for (int j = x - kernelRadius; j <= x + kernelRadius; ++j)
		{
			if (j < 0 || j >= WIDTH) continue;

			float value = static_cast<float>(depthData[i * WIDTH + j] * 0.001);			

			if (value != 0.f)
			{
				++validCounter;
				accum += value;
			}
		}
	}

	return accum / validCounter;
}

float GetDistance(int x, int y, const cv::Mat &depthImage)
{
	unsigned char value = depthImage.at<unsigned char>(y, x);
	return static_cast<float>((value / 255.) * (MAX_DEPTH - MIN_DEPTH) + MIN_DEPTH);
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

cv::Mat GetPerspectiveTransform(const Geometry::CWall &wall, int resX, int resY, const rs2_intrinsics &intrinsics)
{
	cv::Point2f dst[4] = { cv::Point2f(0.f, 0.f),
		cv::Point2f(static_cast<float>(resX), 0.f),
		cv::Point2f(0.f, static_cast<float>(resY)),
		cv::Point2f(static_cast<float>(resX), static_cast<float>(resY)) };

	cv::Point2f src[4];
	
	for (int i = 0; i < 4; ++i)
	{
		float original[3];
		float imageXY[2];

		wall.GetOriginal(i).Get(original);
		rs2_project_point_to_pixel(imageXY, &intrinsics, original);
		src[i] = cv::Point2f(imageXY[0], imageXY[1]);
	}

	return cv::getPerspectiveTransform(src, dst);
}

cv::Rect GetROI(const Geometry::CWall &wall, const rs2_intrinsics &intrinsics, int trackingBoundTolerance)
{
	cv::Point2f corners[4];

	for (int i = 0; i < 4; ++i)
	{
		float original[3];
		float imageXY[2];

		wall.GetOriginal(i).Get(original);
		rs2_project_point_to_pixel(imageXY, &intrinsics, original);
		corners[i] = cv::Point2f(imageXY[0], imageXY[1]);
	}

	float x = corners[0].x < corners[2].x ? corners[0].x : corners[2].x;
	float y = corners[0].y < corners[1].y ? corners[0].y : corners[1].y;
	float width = corners[1].x > corners[3].x ? corners[1].x - x : corners[3].x - x;
	float height = corners[2].y > corners[3].y ? corners[2].y - y : corners[3].y - y;

	return cv::Rect(static_cast<int>(x - trackingBoundTolerance),
		static_cast<int>(y - trackingBoundTolerance),
		static_cast<int>(width + trackingBoundTolerance),
		static_cast<int>(height + trackingBoundTolerance));
}

void GetLastNPointsOfTrajectory(const std::vector<cv::Point3f> &original, std::vector<cv::Point3f> &lastNPoints, size_t nPoints)
{
	if (nPoints == 0) return;

	if (original.size() < nPoints)
	{
		lastNPoints = original;
		return;
	}

	lastNPoints.clear();
	lastNPoints.reserve(nPoints);

	for (size_t i = original.size() - nPoints; i < original.size(); ++i)
	{
		lastNPoints.push_back(original[i]);
	}
}

int main(int argc, char * argv[]) try
{
	CConfigReader configReader;

	if (!configReader.ReadConfigFile()) return 1;

	CInputHandler inputHandler(configReader.GetResolutionX(), configReader.GetResolutionY());
	CKeyboardInputHandler keyboardInputHandler(configReader.GetResolutionX(), configReader.GetResolutionY());

	MIN_DEPTH = configReader.GetMinimalDepth();
	MAX_DEPTH = configReader.GetMaximalDepth();
	double accelTolerance = configReader.GetAccelTolerance();
	double contourAreaMax = configReader.GetContourAreaThresholdMax();
	double contourAreaMin = configReader.GetContourAreaThresholdMin();
	bool bShowDebugWindows = configReader.DebugWindowsVisible();
	int lowThreshold = configReader.GetRangeThresholdLow();
	int highThreshold = configReader.GetRangeThresholdHigh();
	bool bSendMouseClicks = configReader.SendMouseClicks();
	int numberOfTrajectoryPointsToFit = configReader.GetNumberOfTrajectoryPointsToFitFrom();
	int TOP_BAR = configReader.GetTopBar();
	int BOT_BAR = configReader.GetBotBar();
	int LEFT_BAR = configReader.GetLeftBar();
	int RIGHT_BAR = configReader.GetRightBar();
	double Exposure = configReader.GetExposure();
	bool bShowFPS = configReader.GetShowFPS();


	const auto window_name = "Display Image";
	const auto window_name2 = "Thresholded image";
	const auto window_name3 = "Tracker";

	if (bShowDebugWindows)
	{
		cv::namedWindow(window_name, cv::WINDOW_AUTOSIZE);
		cv::namedWindow(window_name2, cv::WINDOW_AUTOSIZE);
		cv::namedWindow(window_name3, cv::WINDOW_AUTOSIZE);
	}

	int trackMinDepth = static_cast<int>(MIN_DEPTH * 1000);
	int trackMaxDepth = static_cast<int>(MAX_DEPTH * 1000);

	if (bShowDebugWindows)
	{
		cv::createTrackbar("MIN_DEPTH", window_name, &trackMinDepth, 6000, OnMinDepth);
		cv::createTrackbar("MAX_DEPTH", window_name, &trackMaxDepth, 6000, OnMaxDepth);

		OnMinDepth(trackMinDepth, nullptr);
		OnMaxDepth(trackMaxDepth, nullptr);

		cv::createTrackbar("LOW_THRESH", window_name2, &lowThreshold, 255, nullptr);
		cv::createTrackbar("HIGH_THRESH", window_name2, &highThreshold, 255, nullptr);
	}

	rs2::context ctx;
	rs2::pipeline pipe;
	rs2::config configuration;

	configuration.disable_all_streams();
	configuration.enable_stream(RS2_STREAM_DEPTH, WIDTH, HEIGHT, RS2_FORMAT_Z16, 90);
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
			it->set_option(RS2_OPTION_EXPOSURE, Exposure);
		}		
	}

	pipe.start(configuration);
	rs2_intrinsics intrinsics = pipe.get_active_profile().get_stream(RS2_STREAM_DEPTH).as<rs2::video_stream_profile>().get_intrinsics();

	Geometry::CWall wall(configReader.GetTL(),
		configReader.GetTR(),
		configReader.GetBL(),
		configReader.GetBR(),
		configReader.GetBallDiameter());

	cv::Mat perspectiveMat = GetPerspectiveTransform(wall, configReader.GetResolutionX(), configReader.GetResolutionY(), intrinsics);

	Operations::CImageAveraging averager(WIDTH, HEIGHT);

	std::vector<size_t> areaThresholdIndexes;
	std::map<size_t, STrackedObject> currentDetections;
	std::map<size_t, STrackedObject> previousDetections;
	std::set<size_t> clickHistory;
	std::vector<cv::Vec2i> currentObjectDetections;

	areaThresholdIndexes.reserve(20);

	cv::Mat mask = cv::Mat::ones(HEIGHT, WIDTH, CV_8UC1);

	for (int i = 0; i < HEIGHT; ++i)
	{
		unsigned char *imageData = mask.ptr(i);

		for (int j = 0; j < LEFT_BAR; ++j)
		{
			imageData[j] = 0;
		}
	}

	for (int i = 0; i < TOP_BAR; ++i)
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

		for (int j = WIDTH - RIGHT_BAR; j < WIDTH; ++j)
		{
			imageData[j] = 0;
		}
	}

	for (int i = HEIGHT - BOT_BAR; i < HEIGHT; ++i)
	{
		unsigned char *imageData = mask.ptr(i);

		for (int j = 0; j < WIDTH; ++j)
		{
			imageData[j] = 0;
		}
	}

	cv::Mat avgDepthFrame = cv::Mat::zeros(HEIGHT, WIDTH, CV_8UC1);
	cv::Mat depthFrame = cv::Mat::zeros(cv::Size(WIDTH, HEIGHT), CV_8UC1);
	cv::Mat buff;
	cv::Mat gray;
	cv::Mat trackingImage;

	if (bShowDebugWindows)
	{
		buff = cv::Mat::zeros(HEIGHT, WIDTH, CV_8UC1);
		gray = cv::Mat::zeros(cv::Size(WIDTH, HEIGHT), CV_8UC1);
		trackingImage = cv::Mat::zeros(cv::Size(WIDTH, HEIGHT), CV_8UC3);
	}

	float averageAccelLength = 0.f;
	size_t numberOfAccelMeasurements = 0;
	int recalibrationTimeLeftMS = 5000;
	int startTimeOffset = 3000;

	std::chrono::steady_clock::time_point lastFrameTime = std::chrono::steady_clock::now();

	CCentroidTracker tracker(configReader.GetDisappearedFrameCount(), clickHistory, configReader.GetNewObjectDistanceThreshold());

	int resX = configReader.GetResolutionX();
	int resY = configReader.GetResolutionY();

	int contourWidthMax = configReader.GetContourBBoxWidthMax();
	int contourHeightMax = configReader.GetContourBBoxHeightMax();

	while (cv::waitKey(1) < 0 && bShowDebugWindows ? cv::getWindowProperty(window_name, cv::WND_PROP_AUTOSIZE) >= 0 : 1)
	{
		/*rs2::frameset currentFrameSet;
		pipe.poll_for_frames(&currentFrameSet);

		if (!currentFrameSet) continue;		*/

		rs2::frameset currentFrameSet = pipe.wait_for_frames();

		if (bShowDebugWindows) trackingImage = cv::Scalar(255, 255, 255);

		std::chrono::steady_clock::time_point now = std::chrono::steady_clock::now();
		//NOTE: control printout
		//std::cout << 1000. / std::chrono::duration_cast<std::chrono::milliseconds>(now - lastFrameTime).count() << "\r";

		rs2::depth_frame depth = currentFrameSet.get_depth_frame();		
		ColorMapper(reinterpret_cast<const short int*>(depth.get_data()), depthFrame);
		rs2::motion_frame motionFrame = currentFrameSet.first_or_default(RS2_STREAM_ACCEL, RS2_FORMAT_MOTION_XYZ32F).as<rs2::motion_frame>();

		int msPassed = static_cast<int>(std::chrono::duration_cast<std::chrono::milliseconds>(now - lastFrameTime).count());
		lastFrameTime = now;

		if (bShowFPS)
		{
			std::cout << "FPS: " << 1000.f / msPassed << "\r";
		}

		if (startTimeOffset > 0)	//time to adjust to exposure? not sure, but when we average image right away it's bad
		{
			startTimeOffset -= msPassed;
			continue;
		}

		if (recalibrationTimeLeftMS > 0)
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

		if (bShowDebugWindows) cv::imshow(window_name, depthFrame);

		cv::absdiff(depthFrame, avgDepthFrame, buff);
		cv::inRange(buff, lowThreshold, highThreshold, gray);
		cv::multiply(gray, mask, gray);

		if (bShowDebugWindows) cv::imshow(window_name2, gray);

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

			if (bShowDebugWindows) cv::circle(trackingImage, cv::Point(cx, cy), 10, cv::Scalar(0, 0, 0), 2);	
		}

		tracker.Update(currentObjectDetections);
		
		std::map<size_t, STrackedObject> &trackedObjects = tracker.GetObjects();

		for (auto it = trackedObjects.begin(); it != trackedObjects.end(); ++it)
		{			
			//if (clickHistory.find(it->first) != clickHistory.end()) continue;

			float pos[3];
			float xy[2] = { static_cast<float>(it->second.Position[0]), static_cast<float>(it->second.Position[1]) };
			rs2_deproject_pixel_to_point(pos,
				&intrinsics,
				xy,
				GetDistance(it->second.Position[0], it->second.Position[1], reinterpret_cast<const short int*>(depth.get_data()))); // depth.get_distance(it->second.Position[0], it->second.Position[1]));

			cv::Point3f deprojected(pos[0], pos[1], pos[2]);

			if (pos[0] != 0.f && pos[1] != 0.f && pos[2] != 0.f
				)//&& wall.GetNormalDistanceFromWall(Geometry::CPoint(deprojected)) < 1.5f)
			{
				it->second.trajectory.push_back(deprojected);
			}
		}

		currentDetections = tracker.GetObjects();

		for (auto it = currentDetections.begin(); it != currentDetections.end(); ++it)
		{
			if (bShowDebugWindows && it->second.trajectory.size() > 0)
			{
				std::stringstream ss;

				ss << it->first;
				cv::putText(trackingImage,
					ss.str(),
					it->second.Position + cv::Vec2i(10, 10),
					cv::FONT_HERSHEY_SIMPLEX,
					1,
					cv::Scalar(0, 0, 0));

				//cv::circle(trackingImage, it->second.Position, 10, cv::Scalar(0, 0, 0), 5);
			}

			auto previousIt = previousDetections.find(it->first);

			if (previousIt != previousDetections.end())
			{			
				if (previousIt->second.Position == it->second.Position &&
					it->second.Disappeared == 1 &&
					clickHistory.find(it->first) == clickHistory.end())
				{
					cv::Vec6f fittedLine;
					std::vector<cv::Point3f>& trajectory = trackedObjects.find(it->first)->second.trajectory;
					std::vector<cv::Point3f> lastNPointsOfTrajectory;

					if (trajectory.size() <= 2) continue;

					trajectory.pop_back();	//tracking position did not change, last trajectory point is on the wall not on the ball

					if (!wall.HeadingTowardsTheWall(trajectory)) continue;

					GetLastNPointsOfTrajectory(trajectory, lastNPointsOfTrajectory, numberOfTrajectoryPointsToFit);

					cv::fitLine(lastNPointsOfTrajectory, fittedLine, cv::DIST_L2, 0, 0.01, 0.01);
					cv::Vec3f wallPoint = wall.GetRayIntersection(cv::Vec3f(fittedLine[3], fittedLine[4], fittedLine[5]),
					cv::Vec3f(fittedLine[0], fittedLine[1], fittedLine[2]));

					float imageXY[2];
					float wallPointArr[3] = { wallPoint[0], wallPoint[1], wallPoint[2] };
					rs2_project_point_to_pixel(imageXY, &intrinsics, wallPointArr);

					std::vector<cv::Point2f> screenXY = { cv::Point2f(imageXY[0], imageXY[1]) };			
					cv::perspectiveTransform(screenXY, screenXY, perspectiveMat);	

					//std::cout << std::endl << "ID: " << it->first << " Traj points: " << it->second.trajectory.size() << " Click at: " << screenXY[0].x << " " << screenXY[0].y << std::endl;

					if (screenXY[0].x == 0 && screenXY[0].y == 0)	//something went wrong during line fitting, so lets use less accurate normal projection of last trajectory point
					{
						wall.ProjectBallOnWall(Geometry::CPoint(lastNPointsOfTrajectory.back()), wallPointArr);
						rs2_project_point_to_pixel(imageXY, &intrinsics, wallPointArr);

						screenXY[0] = cv::Point2f(imageXY[0], imageXY[1]);
						cv::perspectiveTransform(screenXY, screenXY, perspectiveMat);						
					}

					if (screenXY[0].x >= 0 && screenXY[0].y >= 0 && screenXY[0].x <= resX && screenXY[0].y <= resY)
					{						
						clickHistory.insert(it->first);
						//Previous version sending only mouse click trough inputHandler
						//if (bSendMouseClicks) inputHandler.SendClickAt(static_cast<int>(screenXY[0].x), static_cast<int>(screenXY[0].y));
						
						//Update 2024 adding speed and parabola calculation sending trough keyboardInputHandler
						//START
						if (bSendMouseClicks) {
							keyboardInputHandler.SendData(BallHit(static_cast<int>(screenXY[0].x),
								static_cast<int>(screenXY[0].y), lastNPointsOfTrajectory));
						}
						//END
					}
					/*else
					{
						std::cout << "Click not sent, out of bounds" << std::endl;
						std::cout << "POINTS: " << std::endl;
						for (size_t i = 0; i < it->second.trajectory.size(); ++i)
						{
							std::cout << it->second.trajectory[i].x << " " << it->second.trajectory[i].y << " " << it->second.trajectory[i].z << std::endl;
						}						
					}*/
				}
			}
		}		

		std::swap(currentDetections, previousDetections);
	
		if (bShowDebugWindows) cv::imshow(window_name3, trackingImage);
	}

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