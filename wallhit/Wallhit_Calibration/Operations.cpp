#include "Operations.h"

#include <librealsense2/rsutil.h>
#include <sstream>

Operations::CImageAveraging::CImageAveraging(int width, int height)
{
	m_averageImage = cv::Mat::zeros(height, width, CV_32FC1);
	m_numOfMeasurements = 0;
}

void Operations::CImageAveraging::Do(const cv::Mat &depthFrame)
{
	++m_numOfMeasurements;
	cv::accumulate(depthFrame, m_averageImage);
}

void Operations::CImageAveraging::Finalize()
{
	m_averageImage /= static_cast<double>(m_numOfMeasurements);
	m_averageImage.convertTo(m_averageImage, CV_8UC1);
	//cv::imwrite("../Wallhit_Detection/average.png", m_averageImage);
}

void Operations::CImageAveraging::Reset(int width, int height)
{
	m_averageImage.convertTo(m_averageImage, CV_32FC1);
	m_averageImage = cv::Mat::zeros(height, width, CV_32FC1);
	m_numOfMeasurements = 0;
}

Operations::CPointAveraging::CPointAveraging(int width, int height, const rs2_intrinsics &intrinsics, const std::string &desc, const std::string &shortDesc) : 
	m_intrinsics(intrinsics), m_description(desc), m_shortDesc(shortDesc)
{
	m_buff = cv::Mat::zeros(height, width, CV_8UC1);
	m_numOfMeasurements = 0;
	m_width = width;
	m_height = height;
	m_imageAveragePoint = cv::Point(0, 0);
}

void Operations::CPointAveraging::Do(cv::Mat &colorFrame, const CalibPosition &calibPos, bool mouseClicked)
{	
	if (mouseClicked)
	{
		cv::circle(colorFrame, cv::Point2i(calibPos.x, calibPos.y), 10, cv::Scalar(0, 0, 255), cv::FILLED);

		cv::putText(colorFrame,
			m_shortDesc,
			cv::Point2i(calibPos.x, calibPos.y),
			cv::FONT_HERSHEY_SIMPLEX,
			1,
			cv::Scalar(0, 255, 255));
	}

	cv::putText(colorFrame,
		m_description,
		cv::Point(colorFrame.cols / 2 - 50, colorFrame.rows / 2),
		cv::FONT_HERSHEY_SIMPLEX,
		1.2,
		cv::Scalar(0, 0, 255),
		3);
}

void Operations::CPointAveraging::Finalize(const CalibPosition &calPos, const rs2::depth_frame &depth)
{
	//m_averagePoint = m_averagePoint / m_numOfMeasurements;
	m_imageAveragePoint.x = static_cast<float>(calPos.x);//= m_numOfMeasurements;
	m_imageAveragePoint.y = static_cast<float>(calPos.y);//= m_numOfMeasurements;
	float pos[3];
	float xy[2] = { m_imageAveragePoint.x, m_imageAveragePoint.y };
	rs2_deproject_pixel_to_point(pos, &m_intrinsics, xy, depth.get_distance((int)m_imageAveragePoint.x, (int)m_imageAveragePoint.y));

	m_averagePoint = Geometry::CPoint(pos[0], pos[1], pos[2]);
	std::cout << "Mouse: " << calPos.x << " " << calPos.y << std::endl;
	std::cout << pos[0] << " " << pos[1] << " " << pos[2] << std::endl;
}

std::vector<float> Operations::CPointAveraging::GetAverageVectorPoint() const
{
	std::vector<float> buff(3);

	buff[0] = m_averagePoint.X();
	buff[1] = m_averagePoint.Y();
	buff[2] = m_averagePoint.Z();

	return buff;
}

Operations::CTransition::CTransition(const char *description) : m_description(description)
{
}

void Operations::CTransition::Do(cv::Mat &colorFrame, int timeLeft)
{
	std::stringstream ss;

	ss << m_description << ": " << timeLeft;

	cv::putText(colorFrame,
		ss.str(),
		cv::Point(colorFrame.cols / 4 - 50, colorFrame.rows / 2),
		cv::FONT_HERSHEY_SIMPLEX,
		1.2,
		cv::Scalar(0, 0, 255),
		3);
}

Operations::CResultCheck::CResultCheck(int circleRadius)
{
	m_circleRadius = circleRadius;
}

void Operations::CResultCheck::Do(cv::Mat &colorFrame,
	const cv::Point2d &TL,
	const cv::Point2d &TR,
	const cv::Point2d &BL,
	const cv::Point2d &BR)
{
	cv::circle(colorFrame, TL, m_circleRadius, cv::Scalar(0, 0, 255), cv::FILLED);
	cv::putText(colorFrame,
		"TL",
		TL,
		cv::FONT_HERSHEY_SIMPLEX,
		1,
		cv::Scalar(0, 255, 255));

	cv::circle(colorFrame, TR, m_circleRadius, cv::Scalar(0, 0, 255), cv::FILLED);
	cv::putText(colorFrame,
		"TR",
		TR,
		cv::FONT_HERSHEY_SIMPLEX,
		1,
		cv::Scalar(0, 255, 255));

	cv::circle(colorFrame, BL, m_circleRadius, cv::Scalar(0, 0, 255), cv::FILLED);
	cv::putText(colorFrame,
		"BL",
		BL,
		cv::FONT_HERSHEY_SIMPLEX,
		1,
		cv::Scalar(0, 255, 255));

	cv::circle(colorFrame, BR, m_circleRadius, cv::Scalar(0, 0, 255), cv::FILLED);
	cv::putText(colorFrame,
		"BR",
		BR,
		cv::FONT_HERSHEY_SIMPLEX,
		1,
		cv::Scalar(0, 255, 255));
}