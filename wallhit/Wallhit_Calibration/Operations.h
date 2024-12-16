#pragma once

//#include <opencv_all.h>
#include <opencv.hpp>
#include <librealsense2/rs.hpp>
#include <string>
#include "..\Wallhit_Detection\Geometry.h"

struct CalibPosition
{
	int x;
	int y;
};

namespace Operations
{
	class CImageAveraging
	{
	public:
		CImageAveraging(int width, int height);
		void Do(const cv::Mat &depthFrame);
		void Finalize();
		void Reset(int width, int height);
		const cv::Mat &GetAverageImageRef() const { return m_averageImage; }
		cv::Mat GetAverageImage() const { return m_averageImage; }
	private:
		cv::Mat m_averageImage;
		size_t m_numOfMeasurements;
	};

	class CPointAveraging
	{
	public:
		CPointAveraging(int width, int height, const rs2_intrinsics &intrinsics, const std::string &description, const std::string &shortDesc);
		void Do(cv::Mat &colorFrame, const CalibPosition &calibPos, bool mouseClicked);
		void Finalize(const CalibPosition &pos, const rs2::depth_frame &depth);
		std::vector<float> GetAverageVectorPoint() const;
		const Geometry::CPoint &GetAveragePoint() const { return m_averagePoint; }
		cv::Point2d GetPoint() const { return m_imageAveragePoint; }

	private:
		std::string m_shortDesc;
		std::string m_description;
		int m_width, m_height;
		cv::Mat m_buff;
		const rs2_intrinsics &m_intrinsics;
		Geometry::CPoint m_averagePoint;
		cv::Point2f m_imageAveragePoint;
		size_t m_numOfMeasurements;
	};

	class CTransition
	{
	public:
		CTransition(const char *description);
		void Do(cv::Mat &colorFrame, int timeLeft);
	private:
		const char *m_description;
	};

	class CResultCheck
	{
	public:		
		CResultCheck(int circleRadius);
		void Do(cv::Mat &colorFrame,
			const cv::Point2d &TL,
			const cv::Point2d &TR,
			const cv::Point2d &BL,
			const cv::Point2d &BR);
	private:		
		int m_circleRadius;
	};
};

