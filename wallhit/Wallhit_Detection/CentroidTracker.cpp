#include "CentroidTracker.h"

#include <cmath>
#include <limits>
#include <numeric>
#include <algorithm>

CCentroidTracker::CCentroidTracker(size_t maxDisappeared, std::set<size_t> &clickHistory, int newObjectDistanceThreshold) : m_clickHistory(clickHistory)
{
	m_nextID = 0;
	m_maxDisappeared = maxDisappeared;
	m_newObjectDistanceThreshold = newObjectDistanceThreshold;
}

void CCentroidTracker::Update(const std::vector<cv::Vec2i> &detections)
{
	if (detections.empty())
	{
		for (std::map<size_t, STrackedObject>::iterator it = m_objects.begin(); it != m_objects.end();)
		{
			it->second.Disappeared++;

			if (it->second.Disappeared >= m_maxDisappeared) RemoveTrackedObject(it++);
			else ++it;
		}				

		return;
	}

	if (m_objects.empty())
	{
		for (size_t i = 0; i < detections.size(); ++i)
			AddNewTrackedObject(detections[i]);

		return;
	}

	for (std::map<size_t, STrackedObject>::iterator it = m_objects.begin(); it != m_objects.end(); ++it)
	{
		it->second.assignedNewPosition = false;
		it->second.Distances.resize(detections.size());

		for (size_t i = 0; i < detections.size(); ++i)
		{
			it->second.Distances[i] = GetDistance(detections[i], it->second.Position);
		}
	}


	size_t minDistanceIndex = 0;
	bool bFoundNewPosition = false;
	std::set<size_t> alreadyAssignedObjectIDs;
	std::set<size_t> alreadyAssignedDetections;
	std::set<size_t> assignableValues;
	std::vector<size_t> assignedValuesComplement(detections.size());

	for (size_t i = 0; i < detections.size(); ++i)
	{
		assignableValues.insert(assignableValues.end(), i);
	}

	for (size_t i = 0; i < detections.size(); ++i)
	{
		float minDistance = std::numeric_limits<float>::max();

		for (std::map<size_t, STrackedObject>::iterator it = m_objects.begin(); it != m_objects.end(); ++it)
		{
			if (it->second.Distances[i] < minDistance &&
				alreadyAssignedObjectIDs.find(it->first) == alreadyAssignedObjectIDs.end())
			{
				minDistance = it->second.Distances[i];
				minDistanceIndex = it->first;
				bFoundNewPosition = true;
			}
		}

		if (minDistance > m_newObjectDistanceThreshold) bFoundNewPosition = false;

		if (bFoundNewPosition)
		{
			bFoundNewPosition = false;
			STrackedObject &tempRef = m_objects.find(minDistanceIndex)->second;
			tempRef.Position = detections[i];
			tempRef.assignedNewPosition = true;
			tempRef.Disappeared = 0;
			alreadyAssignedObjectIDs.insert(minDistanceIndex);
			alreadyAssignedDetections.insert(i);
		}
	}

	std::vector<size_t>::iterator complementIt = std::set_difference(assignableValues.begin(),
		assignableValues.end(),
		alreadyAssignedDetections.begin(),
		alreadyAssignedDetections.end(),
		assignedValuesComplement.begin());

	assignedValuesComplement.resize(complementIt - assignedValuesComplement.begin());

	for (std::vector<size_t>::iterator it = assignedValuesComplement.begin(); it != assignedValuesComplement.end(); ++it)
	{
		AddNewTrackedObject(detections[*it]);
	}

	for (std::map<size_t, STrackedObject>::iterator it = m_objects.begin(); it != m_objects.end();)
	{
		if (!it->second.assignedNewPosition)
		{
			it->second.Disappeared++;

			if (it->second.Disappeared >= m_maxDisappeared)
			{
				RemoveTrackedObject(it++);
				continue;
			}			
		}

		++it;		
	}
}

void CCentroidTracker::SetTrackingBounds(int x, int y, int width, int height)
{
	m_trackingBounds = cv::Rect(x, y, width, height);
}

size_t CCentroidTracker::AddNewTrackedObject(const cv::Vec2i &position)
{
	m_objects.emplace(std::piecewise_construct, std::forward_as_tuple(m_nextID), std::forward_as_tuple(position));
	return m_nextID++;	
}

void CCentroidTracker::RemoveTrackedObject(size_t id)
{
	m_clickHistory.erase(id);
	m_objects.erase(id);	
}

void CCentroidTracker::RemoveTrackedObject(const std::map<size_t, STrackedObject>::iterator &it)
{
	m_clickHistory.erase(it->first);
	m_objects.erase(it);	
}

void CCentroidTracker::RemoveTrackedObject(const std::map<size_t, STrackedObject>::const_iterator &it)
{
	m_clickHistory.erase(it->first);
	m_objects.erase(it);	
}


float CCentroidTracker::GetDistance(const cv::Vec2i &pos1, const cv::Vec2i &pos2) const
{
	const cv::Vec2i buff(pos1 - pos2);

	return sqrtf(static_cast<float>(buff.dot(buff)));
}