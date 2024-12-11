#ifndef BALL_HIT_H
#define BALL_HIT_H

#include <vector>
#include <opencv2/opencv.hpp>

class BallHit {
public:
    int x = 0;
    int y = 0;
    double speed = 0.0;
    double a = 0.0;
    double b = 0.0;
    double c = 0.0;
    double changeX = 0.0;

    BallHit(int x, int y, const std::vector<cv::Point3f>& lastPointsOfTrajectory);

private:
    static std::vector<double> solveParabola(const std::vector<cv::Point3f>& points);
    static double calculateXChange(const std::vector<cv::Point3f>& points);
    static double calculateSpeed(const std::vector<cv::Point3f>& points);
};

#endif // BALL_HIT_H
