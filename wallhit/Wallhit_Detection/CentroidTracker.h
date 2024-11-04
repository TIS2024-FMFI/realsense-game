#pragma once

#include <vector>
#include <map>
#include <set>
//#include <opencv_all.h>
#include <opencv.hpp>
#include "Geometry.h"

struct STrackedObject
{
	STrackedObject(const cv::Vec2i &position) : Position(position),
		assignedNewPosition(false),
		Disappeared(0),
		outOfBounds(false),
		reappeared(false)
	{
		trajectory.reserve(10);
	};

	cv::Vec2i Position;
	size_t Disappeared;	
	std::vector<cv::Point3f> trajectory;
	std::vector<float> Distances;
	bool assignedNewPosition;
	bool outOfBounds;
	bool reappeared;
	cv::Point2f imageCoords;
	int lifeTimeMs = 0;
};

class CCentroidTracker
{
public:
	CCentroidTracker(size_t maxDisappeared, std::set<size_t> &clickHistory, int newObjectDistanceThreshold);

	void Update(const std::vector<cv::Vec2i> &detections);
	void SetTrackingBounds(int x, int y, int width, int height);
	void SetTrackingBounds(const cv::Rect &trackingBounds) { m_trackingBounds = trackingBounds; }
	const std::map<size_t, STrackedObject> &GetObjects() const { return m_objects; }
	std::map<size_t, STrackedObject> &GetObjects() { return m_objects; }

private:
	cv::Rect m_trackingBounds;
	float m_bufferDistance;
	std::set<size_t> &m_clickHistory;
	std::map<size_t, STrackedObject> m_objects;
	size_t m_nextID;
	size_t m_maxDisappeared;
	int m_newObjectDistanceThreshold;

	size_t AddNewTrackedObject(const cv::Vec2i &position);
	void RemoveTrackedObject(size_t id);
	void RemoveTrackedObject(const std::map<size_t, STrackedObject>::iterator &it);
	void RemoveTrackedObject(const std::map<size_t, STrackedObject>::const_iterator &it);
	float GetDistance(const cv::Vec2i &pos1, const cv::Vec2i &pos2) const;
};

