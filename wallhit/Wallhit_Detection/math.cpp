#include <iostream>
#include <opencv.hpp>
#include <vector>

std::vector<double> solveParabola(const std::vector<cv::Point3f>& points) {
    // Matrix system to solve: Az = B
    double A[3][3] = {
        {points[0].z * points[0].z, points[0].z, 1},
        {points[1].z * points[1].z, points[1].z, 1},
        {points[2].z * points[2].z, points[2].z, 1}
    };
    double B[3] = { points[0].y, points[1].y, points[2].y };

    // Gaussian elimination
    for (int i = 0; i < 3; ++i) {
        for (int k = i + 1; k < 3; ++k) {
            double t = A[k][i] / A[i][i];
            for (int j = 0; j < 3; ++j)
                A[k][j] -= t * A[i][j];
            B[k] -= t * B[i];
        }
    }

    // Back substitution
    std::vector<double> coefficients = {0.f, 0.f, 0.f};
    for (int i = 2; i >= 0; --i) {
        coefficients[i] = B[i];
        for (int j = i + 1; j < 3; ++j)
            coefficients[i] -= A[i][j] * coefficients[j];
        coefficients[i] /= A[i][i];
    }

    return coefficients;
}

double averageX(const std::vector<cv::Point3f>& points) {
    double sumX = 0.0;
    for (const auto& point : points)
    {
        sumX += point.x;
    }
    int n = points.size();
    return (n > 0) ? sumX / n : 0.0;
}

double calculateXChange(const std::vector<cv::Point3f>& points) {
    if (points.size() < 2) {
        return 0.0; // Nie je možné vypoèíta zmenu, ak je menej ako 2 body
    }

    // Predpokladáme, že body sú usporiadané v poradí, ktoré nás zaujíma
    double xChange = points.back().x - points.front().x;
    return xChange;
}
//new function from this to calculate speed double
//cv::Point3f lastPoint = lastNPointsOfTrajectory.back();
//cv::Point3f preLastPoint = lastNPointsOfTrajectory[lastNPointsOfTrajectory.size() - 2];
//speed = sqrt(pow(lastPoint.x - preLastPoint.x, 2) + pow(lastPoint.y - preLastPoint.y, 2)
//    + pow(lastPoint.z - preLastPoint.z, 2));
double calculateSpeed(const std::vector<cv::Point3f>& points) {
	if (points.size() < 2) {
		return 0.0; // Nie je možné vypoèíta rýchlos, ak je menej ako 2 body
	}
	cv::Point3f lastPoint = points.back();
	cv::Point3f preLastPoint = points[points.size() - 2];

    return sqrt(pow(lastPoint.x - preLastPoint.x, 2) + pow(lastPoint.y - preLastPoint.y, 2)
		+ pow(lastPoint.z - preLastPoint.z, 2));
}