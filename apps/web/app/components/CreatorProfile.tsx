'use client';

import React, { useState } from 'react';

const CreatorProfile: React.FC = () => {
  const [isFollowing, setIsFollowing] = useState(false);

  const recentAPIs = [
    { name: 'Crypto Price Tracker', requests: '15.2K', revenue: '$284' },
    { name: 'Weather Intelligence', requests: '8.7K', revenue: '$156' },
    { name: 'Stock Predictor', requests: '6.3K', revenue: '$189' }
  ];

  const skills = ['Machine Learning', 'Python', 'API Development', 'Data Science', 'Blockchain'];

  return (
    <div className="space-y-6">
      {/* Main Profile Card */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {/* Cover Photo */}
        <div className="h-20 bg-gradient-to-r from-blue-500 to-purple-600"></div>
        
        {/* Profile Info */}
        <div className="px-4 pb-4">
          <div className="flex justify-center -mt-8 mb-4">
            <img 
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face" 
              alt="Your profile" 
              className="w-16 h-16 rounded-full border-4 border-white shadow-lg"
            />
          </div>
          
          <div className="text-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900">John Developer</h2>
            <p className="text-sm text-gray-600">API Creator & Data Scientist</p>
            <p className="text-xs text-gray-500 mt-1">San Francisco, CA • 2nd degree connection</p>
            <div className="flex items-center justify-center mt-2">
              <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">
                ✓ Verified Creator
              </span>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 text-center py-4 border-t border-gray-100">
            <div>
              <p className="text-lg font-semibold text-gray-900">12</p>
              <p className="text-xs text-gray-500">APIs Created</p>
            </div>
            <div>
              <p className="text-lg font-semibold text-gray-900">2.1K</p>
              <p className="text-xs text-gray-500">Followers</p>
            </div>
            <div>
              <p className="text-lg font-semibold text-gray-900">89</p>
              <p className="text-xs text-gray-500">Following</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-4 space-y-2">
            <button 
              onClick={() => setIsFollowing(!isFollowing)}
              className={`w-full py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                isFollowing 
                  ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' 
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {isFollowing ? 'Following' : 'Follow'}
            </button>
            <button className="w-full border border-gray-300 text-gray-700 py-2 px-4 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
              Message
            </button>
          </div>
        </div>
      </div>

      {/* Recent APIs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <h3 className="font-semibold text-gray-900 mb-3">Recent APIs</h3>
        <div className="space-y-3">
          {recentAPIs.map((api, index) => (
            <div key={index} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-gray-900">{api.name}</p>
                <p className="text-xs text-gray-500">{api.requests} requests</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-green-600">{api.revenue}</p>
                <p className="text-xs text-gray-500">this month</p>
              </div>
            </div>
          ))}
        </div>
        <button className="w-full text-center text-sm text-blue-600 hover:text-blue-800 mt-3">
          View all APIs
        </button>
      </div>

      {/* Skills */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <h3 className="font-semibold text-gray-900 mb-3">Skills</h3>
        <div className="flex flex-wrap gap-2">
          {skills.map((skill, index) => (
            <span 
              key={index}
              className="px-3 py-1 bg-blue-50 text-blue-700 text-xs rounded-full hover:bg-blue-100 cursor-pointer"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Analytics Summary */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <h3 className="font-semibold text-gray-900 mb-3">This Month</h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Revenue</span>
            <span className="text-sm font-medium text-gray-900">$2,847</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Total Requests</span>
            <span className="text-sm font-medium text-gray-900">45.2K</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Success Rate</span>
            <span className="text-sm font-medium text-green-600">99.2%</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">New Followers</span>
            <span className="text-sm font-medium text-blue-600">+127</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatorProfile;
