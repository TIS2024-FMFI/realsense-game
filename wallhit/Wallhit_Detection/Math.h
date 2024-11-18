#ifndef MATH_H
#define MATH_H

#include <iostream>
#include <opencv.hpp>
#include <vector>

// Function to solve the coefficients of a parabola given three points
std::vector<double> solveParabola(const std::vector<cv::Point3f>& points);

// Function to calculate the average X value of a set of points
double averageX(const std::vector<cv::Point3f>& points);

#endif