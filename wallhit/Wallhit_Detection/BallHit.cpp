#include "BallHit.h"
#include <iostream>
#include <vector>
#include <opencv2/opencv.hpp>

BallHit::BallHit(int x, int y, const std::vector<cv::Point3f>& lastPointsOfTrajectory) {
    this->x = x;
    this->y = y;
    
    if (lastPointsOfTrajectory.size() >= 3) {
        cv::Point3d lastPoint = lastPointsOfTrajectory.back();
        cv::Point3d middlePoint = lastPointsOfTrajectory[lastPointsOfTrajectory.size() / 2];
        cv::Point3d firstPoint = lastPointsOfTrajectory[0];

        std::vector<double> coefficients = solveParabola({ firstPoint, middlePoint, lastPoint });
        a = coefficients[0];
        b = coefficients[1];
        c = coefficients[2];
    }

    if (lastPointsOfTrajectory.size() >= 2) {
        speed = calculateSpeed(lastPointsOfTrajectory);
        changeX = calculateXChange(lastPointsOfTrajectory);
    }
    
}

std::vector<double> BallHit::solveParabola(const std::vector<cv::Point3f>& points) {
    double A[3][3] = {
        {points[0].z * points[0].z, points[0].z, 1},
        {points[1].z * points[1].z, points[1].z, 1},
        {points[2].z * points[2].z, points[2].z, 1}
    };
    double B[3] = { points[0].y, points[1].y, points[2].y };

    for (int i = 0; i < 3; ++i) {
        for (int k = i + 1; k < 3; ++k) {
            double t = A[k][i] / A[i][i];
            for (int j = 0; j < 3; ++j)
                A[k][j] -= t * A[i][j];
            B[k] -= t * B[i];
        }
    }

    std::vector<double> coefficients = { 0.0, 0.0, 0.0 };
    for (int i = 2; i >= 0; --i) {
        coefficients[i] = B[i];
        for (int j = i + 1; j < 3; ++j)
            coefficients[i] -= A[i][j] * coefficients[j];
        coefficients[i] /= A[i][i];
    }

    return coefficients;
}

double BallHit::calculateXChange(const std::vector<cv::Point3f>& points) {
    if (points.size() < 2) {
        return 0.0;
    }
    return points.back().x - points.front().x;
}

double BallHit::calculateSpeed(const std::vector<cv::Point3f>& points) {
    if (points.size() < 2) {
        return 0.0;
    }
    cv::Point3f lastPoint = points.back();
    cv::Point3f preLastPoint = points[points.size() - 2];

    return std::sqrt(std::pow(lastPoint.x - preLastPoint.x, 2) +
        std::pow(lastPoint.y - preLastPoint.y, 2) +
        std::pow(lastPoint.z - preLastPoint.z, 2));
}
