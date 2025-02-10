#pragma once

//#include <opencv_all.h>
#include <opencv.hpp>

namespace Geometry
{
	class CPoint
	{
	public:
		CPoint() : m_x(0.f), m_y(0.f), m_z(0.f) {};
		CPoint(float X, float Y, float Z) : m_x(X), m_y(Y), m_z(Z) {};
		CPoint(const float point[3]) : m_x(point[0]), m_y(point[1]), m_z(point[2]) {};
		CPoint(const cv::Point3f point) : m_x(point.x), m_y(point.y), m_z(point.z) {};

		float X() const { return m_x; }
		float Y() const { return m_y; }
		float Z() const { return m_z; }

		cv::Vec3f ToCvVec() const { return cv::Vec3f(m_x, m_y, m_z); }
		float Length() const;
		void Normalize();
		CPoint Normalized() const;
		float Dot(const CPoint &point) const;
		float Dot(const cv::Point3f &point) const;
		float Dot(const cv::Vec3f &point) const;
		CPoint Cross(const CPoint &point) const;
		void Get(float point[3]) const { point[0] = m_x; point[1] = m_y; point[2] = m_z; }

		bool operator==(const CPoint &point) const;
		CPoint& operator=(const float point[3]);
		CPoint& operator+=(const float point[3]);
		CPoint operator+(const CPoint &point) const;
		CPoint operator-(const CPoint &point) const;
		cv::Vec3f operator-(const cv::Vec3f &point) const;
		CPoint operator/(float value) const;
		CPoint operator*(float value) const;

	private:
		float m_x;
		float m_y;
		float m_z;
	};

	typedef CPoint CVector;

	class CTriangle
	{
	public:
		CTriangle(const CPoint &p1, const CPoint &p2, const CPoint &p3);
		CVector GetNormal() const { return m_normal; }

	private:
		CVector m_normal;

	};

	class CWall
	{
	public:
		CWall(const CPoint &TL, const CPoint &TR, const CPoint &BL, const CPoint &BR, float ballDiameter);

		const CVector &GetNormal() const { return m_normal; }
		cv::Vec3f GetCvVecNormal() const { return m_normal.ToCvVec(); }
		bool IsTouchingWall(const CPoint &position, float tol) const;
		float GetNormalDistanceFromWall(const CPoint &position) const;
		void ProjectBallOnWall(const CPoint &position, const CVector &velocity, float projectedPoint[3], float &normalDistance) const;
		void ProjectBallOnWall(const CPoint &position, float projectedPoint[3]) const;
		bool HeadingTowardsTheWall(const std::vector<cv::Point3f> &trajectory) const;
		bool HeadingAwayFromTheWall(const std::vector<cv::Point3f>& trajectory) const;

		cv::Vec3f GetRayIntersection(const cv::Vec3f &rayStart, const cv::Vec3f &rayOrientation) const;

		cv::Point2f GetWallTL() const;
		cv::Point2f GetWallTR() const;
		cv::Point2f GetWallBL() const;
		cv::Point2f GetWallBR() const;

		CPoint GetOriginal(int index) const { return m_originalPoints[index]; }

	private:
		CPoint m_originalTL;
		CPoint m_originalPoints[4];
		
		float m_ballDiameter;
		float m_ballRadius;
		float m_dParam;
		CVector m_normal;
		CVector m_wallXBasis;
		CVector m_wallYBasis;
		CPoint m_position;
		CPoint m_wallRelativeTL;
		CPoint m_wallRelativeTR;
		CPoint m_wallRelativeBL;
		CPoint m_wallRelativeBR;
	};
}

