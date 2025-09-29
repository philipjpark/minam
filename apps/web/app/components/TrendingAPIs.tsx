'use client';

import React from 'react';

const TrendingAPIs: React.FC = () => {
  const trendingAPIs = [
    {
      id: '1',
      name: 'Crypto Price Tracker',
      creator: 'Sarah Chen',
      requests: '15.2K',
      price: '$19.99',
      trend: 'up',
      change: '+23%',
      category: 'Finance',
      description: 'Real-time cryptocurrency prices and market data'
    },
    {
      id: '2',
      name: 'Weather Intelligence',
      creator: 'Mike Johnson',
      requests: '8.7K',
      price: '$9.99',
      trend: 'up',
      change: '+15%',
      category: 'Weather',
      description: 'Advanced weather forecasting and climate data'
    },
    {
      id: '3',
      name: 'Social Media Analytics',
      creator: 'Lisa Park',
      requests: '12.1K',
      price: '$49.99',
      trend: 'down',
      change: '-5%',
      category: 'Social',
      description: 'Comprehensive social media sentiment analysis'
    },
    {
      id: '4',
      name: 'Stock Market Predictor',
      creator: 'David Chen',
      requests: '6.3K',
      price: '$99.99',
      trend: 'up',
      change: '+31%',
      category: 'Finance',
      description: 'AI-powered stock market predictions'
    },
    {
      id: '5',
      name: 'Language Translator Pro',
      creator: 'Emma Wilson',
      requests: '4.2K',
      price: '$29.99',
      trend: 'up',
      change: '+8%',
      category: 'AI',
      description: 'Multi-language translation with context awareness'
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-4 border-b border-gray-100">
        <h3 className="font-semibold text-gray-900">Trending APIs</h3>
        <p className="text-sm text-gray-500 mt-1">Most popular this week</p>
      </div>
      
      <div className="divide-y divide-gray-100">
        {trendingAPIs.map((api, index) => (
          <div key={api.id} className="p-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <h4 className="font-medium text-gray-900 text-sm">{api.name}</h4>
                <p className="text-xs text-gray-500">by {api.creator}</p>
              </div>
              <div className="flex items-center space-x-1">
                <span className={`text-xs font-medium ${
                  api.trend === 'up' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {api.change}
                </span>
                <span className={`text-xs ${
                  api.trend === 'up' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {api.trend === 'up' ? '↗' : '↘'}
                </span>
              </div>
            </div>
            
            <p className="text-xs text-gray-600 mb-3 line-clamp-2">{api.description}</p>
            
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center space-x-3">
                <span className="text-gray-500">{api.requests} requests</span>
                <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                  {api.category}
                </span>
              </div>
              <span className="font-medium text-gray-900">{api.price}</span>
            </div>
          </div>
        ))}
      </div>
      
      <div className="p-4 border-t border-gray-100">
        <button className="w-full text-center text-sm text-blue-600 hover:text-blue-800 font-medium">
          View all trending APIs
        </button>
      </div>
    </div>
  );
};

export default TrendingAPIs;
