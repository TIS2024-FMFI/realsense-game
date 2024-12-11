#include "BallHit.h"
#include <iostream>
#include <vector>
#include <opencv2/opencv.hpp>

BallHit::BallHit(int x1, int y1, const std::vector<cv::Point3f>& lastPointsOfTrajectory)
    : x(x1), y(y1), a(0.0), b(0.0), c(0.0), speed(0.0), changeX(0.0) {
    size_t numPoints = lastPointsOfTrajectory.size();
    
    if (numPoints >= 3) {
        std::vector<double> coefficients = BallHit::solveParabola(lastPointsOfTrajectory);
        a = coefficients[0];
        b = coefficients[1];
        c = coefficients[2];
    }

    if (numPoints >= 2) {
        speed = calculateSpeed(lastPointsOfTrajectory);
        changeX = calculateXChange(lastPointsOfTrajectory);
    }
    
}

std::vector<double> BallHit::solveParabola(const std::vector<cv::Point3f>& points) {

    std::vector<cv::Point3f> selectedPoints = { points.front(), points[points.size() / 2], points.back() };

    double A[3][3], B[3];
    for (int i = 0; i < 3; ++i) {
        double z = selectedPoints[i].z;
        A[i][0] = z * z;
        A[i][1] = z;
        A[i][2] = 1.0;
        B[i] = selectedPoints[i].y;
    }

    for (int i = 0; i < 3; ++i) {
        for (int k = i + 1; k < 3; ++k) {
            double t = A[k][i] / A[i][i];
            for (int j = 0; j < 3; ++j) {
                A[k][j] -= t * A[i][j];
            }
            B[k] -= t * B[i];
        }
    }

    std::vector<double> coefficients(3, 0.0);
    for (int i = 2; i >= 0; --i) {
        coefficients[i] = B[i];
        for (int j = i + 1; j < 3; ++j) {
            coefficients[i] -= A[i][j] * coefficients[j];
        }
        coefficients[i] /= A[i][i];
    }

    return coefficients;
}



double BallHit::calculateXChange(const std::vector<cv::Point3f>& points) {
    return points.back().x - points.front().x;
}

double BallHit::calculateSpeed(const std::vector<cv::Point3f>& points) {
    cv::Point3f lastPoint = points.back();
    cv::Point3f preLastPoint = points[points.size() - 2];

    return std::sqrt(std::pow(lastPoint.x - preLastPoint.x, 2) +
        std::pow(lastPoint.y - preLastPoint.y, 2) +
        std::pow(lastPoint.z - preLastPoint.z, 2));
}
