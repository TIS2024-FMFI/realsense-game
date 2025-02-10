#ifndef WINVER				// Allow use of features specific to Windows XP or later.
#define WINVER 0x0501		// Change this to the appropriate value to target other versions of Windows.
#endif

#include "Geometry.h"

#include <cmath>
#include <iostream>

using namespace Geometry;

float CPoint::Length() const
{
	return sqrt(m_x * m_x + m_y * m_y + m_z * m_z);
}

void CPoint::Normalize()
{
	float length = Length();

	m_x /= length;
	m_y /= length;
	m_z /= length;
}

CPoint CPoint::Normalized() const
{
	CPoint newPoint = *this;
	float length = Length();

	newPoint.m_x /= length;
	newPoint.m_y /= length;
	newPoint.m_z /= length;

	return newPoint;
}

float CPoint::Dot(const CPoint &point) const
{
	return m_x * point.m_x + m_y * point.m_y + m_z * point.m_z;
}

float CPoint::Dot(const cv::Point3f &point) const
{
	return m_x * point.x + m_y * point.y + m_z * point.z;
}

float CPoint::Dot(const cv::Vec3f &point) const
{
	return m_x * point[0] + m_y * point[1] + m_z * point[2];
}

CPoint CPoint::Cross(const CPoint &point) const
{
	return CPoint(m_y * point.m_z - m_z * point.m_y,
		m_z * point.m_x - m_x * point.m_z,
		m_x * point.m_y - m_y * point.m_x);
}

bool CPoint::operator==(const CPoint &point) const
{
	return m_x == point.m_x &&
		m_y == point.m_y &&
		m_z == point.m_z;
}

CPoint& CPoint::operator=(const float point[3])
{
	m_x = point[0];
	m_y = point[1];
	m_z = point[2];

	return *this;
}

CPoint& CPoint::operator+=(const float point[3])
{
	m_x += point[0];
	m_y += point[1];
	m_z += point[2];

	return *this;
}

CPoint CPoint::operator+(const CPoint &point) const
{
	CPoint newPoint = *this;

	newPoint.m_x += point.m_x;
	newPoint.m_y += point.m_y;
	newPoint.m_z += point.m_z;

	return newPoint;
}
CPoint CPoint::operator-(const CPoint &point) const
{
	CPoint newPoint = *this;

	newPoint.m_x -= point.m_x;
	newPoint.m_y -= point.m_y;
	newPoint.m_z -= point.m_z;

	return newPoint;
}

cv::Vec3f CPoint::operator-(const cv::Vec3f &point) const
{
	cv::Vec3f newPoint = cv::Vec3f(m_x, m_y, m_z);

	newPoint[0] -= point[0];
	newPoint[1] -= point[1];
	newPoint[2] -= point[2];

	return newPoint;
}

CPoint CPoint::operator/(float value) const
{
	CPoint newPoint = *this;

	newPoint.m_x /= value;
	newPoint.m_y /= value;
	newPoint.m_z /= value;

	return newPoint;
}

CPoint CPoint::operator*(float value) const
{
	CPoint newPoint = *this;

	newPoint.m_x *= value;
	newPoint.m_y *= value;
	newPoint.m_z *= value;

	return newPoint;
}

CTriangle::CTriangle(const CPoint &p1, const CPoint &p2, const CPoint &p3)
{
	CVector v1 = (p1 - p2);
	CVector v2 = (p3 - p2);
	
	m_normal = v2.Cross(v1);
}

CWall::CWall(const CPoint &TL, const CPoint &TR, const CPoint &BL, const CPoint &BR, float ballDiameter)
{
	m_ballDiameter = ballDiameter;
	m_ballRadius = ballDiameter / 2.f;

	m_originalPoints[0] = TL;
	m_originalPoints[1] = TR;
	m_originalPoints[2] = BL;
	m_originalPoints[3] = BR;

	CTriangle t1(TL, BL, BR);
	CTriangle t2(BL, BR, TR);
	CTriangle t3(BR, TR, TL);
	CTriangle t4(TR, TL, BL);

	m_originalTL = TL;

	m_normal = (t1.GetNormal() + t2.GetNormal() + t3.GetNormal() + t4.GetNormal()) / 4.f;
	m_normal.Normalize();

	m_position = (TL + TR + BL + BR) / 4.f;

	m_dParam = -m_normal.Dot(m_position);

	m_wallRelativeTL = CPoint(0.f, 0.f, 0.f);
	m_wallRelativeTR = TR - TL;
	m_wallRelativeBL = BL - TL;
	m_wallRelativeBR = BR - TL;

	m_wallXBasis = m_wallRelativeTR.Normalized();
	m_wallYBasis = m_wallRelativeBL.Normalized();

	//std::cout << "Normal: " << m_normal.X() << " " << m_normal.Y() << " " << m_normal.Z() << std::endl;
	//std::cout << "Wallpos: " << m_position.X() << " " << m_position.Y() << " " << m_position.Z() << std::endl;
}

bool CWall::IsTouchingWall(const CPoint &position, float tol) const
{
	CVector relativeToWall = m_position - position;
	CVector normalToWall = m_normal * relativeToWall.Dot(m_normal);

	float normalDistanceFromWall = normalToWall.Length();
	return normalDistanceFromWall <= tol;
}

float CWall::GetNormalDistanceFromWall(const CPoint &position) const
{
	CVector relativeToWall = m_position - position;
	CVector normalToWall = m_normal * relativeToWall.Dot(m_normal);

	return normalToWall.Length();
}

void CWall::ProjectBallOnWall(const CPoint &position, const CVector &velocity, float projectedPoint[3], float &normalDistance) const
{
	normalDistance = GetNormalDistanceFromWall(position);
	CPoint projection;
	projection = position - m_normal * normalDistance;
	/*if (velocity == CVector(0.f, 0.f, 0.f))
		projection = position - m_normal * normalDistance;
	else
	{
		float alpha = -normalDistance / velocity.Dot(m_normal);
		std::cout << alpha << std::endl;

		projection = position + velocity * alpha;
	}*/

	projectedPoint[0] = projection.X();
	projectedPoint[1] = projection.Y();
	projectedPoint[2] = projection.Z();
}

void CWall::ProjectBallOnWall(const CPoint &position, float projectedPoint[3]) const
{
	float normalDistance = GetNormalDistanceFromWall(position);
	normalDistance -= m_ballDiameter;
	CPoint projection = position - m_normal * normalDistance;
	
	projectedPoint[0] = projection.X();
	projectedPoint[1] = projection.Y();
	projectedPoint[2] = projection.Z();
}

bool CWall::HeadingTowardsTheWall(const std::vector<cv::Point3f> &trajectory) const
{
	size_t trajectoryLength = trajectory.size();
	if (trajectoryLength < 2) return false;

	cv::Vec3f relativeOrientation = cv::Vec3f(trajectory[trajectoryLength - 1] - trajectory[trajectoryLength - 2]);

	return m_normal.Dot(relativeOrientation) < 0.f;
}

bool CWall::HeadingAwayFromTheWall(const std::vector<cv::Point3f>& trajectory) const
{
	size_t trajectoryLength = trajectory.size();
	if (trajectoryLength < 2) return false;

	cv::Vec3f relativeOrientation = cv::Vec3f(trajectory[trajectoryLength - 1] - trajectory[trajectoryLength - 2]);

	return m_normal.Dot(relativeOrientation) > 0.f;
}

cv::Vec3f CWall::GetRayIntersection(const cv::Vec3f &rayStart, const cv::Vec3f &rayOrientation) const
{
	cv::Vec3f correctedRayStart = rayStart + cv::normalize(rayStart) * m_ballRadius -cv::Vec3f(m_normal.X(), m_normal.Y(), m_normal.Z()) * m_ballRadius;
	float denominator = m_normal.Dot(rayOrientation);

	if (denominator == 0.f) return cv::Vec3f(0.f, 0.f, 0.f);

	float alpha = (-m_dParam - m_normal.Dot(correctedRayStart)) / denominator;

	//std::cout << "ALPHA: " << alpha << std::endl;

	cv::Vec3f intersection = correctedRayStart + alpha * rayOrientation;

	//return intersection + (m_position - intersection) * 0.01;
	return intersection;
}

cv::Point2f CWall::GetWallTL() const
{
	return cv::Point2f(m_wallRelativeTL.Dot(m_wallXBasis), m_wallRelativeTL.Dot(m_wallYBasis));
}

cv::Point2f CWall::GetWallTR() const
{
	return cv::Point2f(m_wallRelativeTR.Dot(m_wallXBasis), m_wallRelativeTR.Dot(m_wallYBasis));
}

cv::Point2f CWall::GetWallBL() const
{
	return cv::Point2f(m_wallRelativeBL.Dot(m_wallXBasis), m_wallRelativeBL.Dot(m_wallYBasis));
}

cv::Point2f CWall::GetWallBR() const
{
	return cv::Point2f(m_wallRelativeBR.Dot(m_wallXBasis), m_wallRelativeBR.Dot(m_wallYBasis));
}