'use client';

import React, { useState } from 'react';
import Navbar from './Navbar';
import APIPostCard from './APIPostCard';
import CreatorProfile from './CreatorProfile';
import TrendingAPIs from './TrendingAPIs';
import CreatePostModal from './CreatePostModal';

interface FeedLayoutProps {
  // Props for the feed layout
}

const FeedLayout: React.FC<FeedLayoutProps> = () => {
  const [showCreatePost, setShowCreatePost] = useState(false);

  // Mock data for the feed
  const feedPosts = [
    {
      id: '1',
      creator: {
        name: 'Sarah Chen',
        title: 'Data Scientist at TechCorp',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
        verified: true
      },
      content: {
        type: 'api_launch',
        title: 'Just launched my Bitcoin Price Prediction API! 🚀',
        description: 'After months of training on 5 years of market data, my API can predict Bitcoin prices with 87% accuracy. Perfect for trading bots and portfolio management.',
        apiDetails: {
          name: 'Bitcoin Predictor Pro',
          endpoints: 3,
          accuracy: '87%',
          requests: '1.2K',
          price: '$29.99/month'
        },
        tags: ['#Bitcoin', '#MachineLearning', '#Trading', '#API'],
        timestamp: '2 hours ago',
        likes: 47,
        comments: 12,
        shares: 8
      }
    },
    {
      id: '2',
      creator: {
        name: 'Marcus Rodriguez',
        title: 'Senior Developer at FinTech Inc',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
        verified: false
      },
      content: {
        type: 'api_update',
        title: 'Major update to my Real Estate API 📈',
        description: 'Added 15 new data sources including Zillow, Redfin, and local MLS data. Now covers 95% of US markets with real-time pricing and market trends.',
        apiDetails: {
          name: 'Real Estate Insights API',
          endpoints: 8,
          coverage: '95% US',
          requests: '5.4K',
          price: '$99.99/month'
        },
        tags: ['#RealEstate', '#Data', '#MarketAnalysis', '#API'],
        timestamp: '4 hours ago',
        likes: 23,
        comments: 7,
        shares: 3
      }
    },
    {
      id: '3',
      creator: {
        name: 'Dr. Emily Watson',
        title: 'AI Research Lead at MedTech',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
        verified: true
      },
      content: {
        type: 'api_insight',
        title: 'How I built a Medical Diagnosis API that doctors actually use 🏥',
        description: 'Sharing my journey from research paper to production API. The key was working directly with medical professionals to understand their real needs.',
        apiDetails: {
          name: 'Medical Diagnosis Assistant',
          endpoints: 12,
          accuracy: '94%',
          requests: '2.1K',
          price: 'Enterprise'
        },
        tags: ['#Healthcare', '#AI', '#Medical', '#Research', '#API'],
        timestamp: '6 hours ago',
        likes: 89,
        comments: 24,
        shares: 15
      }
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Sidebar - Creator Profile & Navigation */}
          <div className="lg:col-span-3 space-y-6">
            <CreatorProfile />
            
            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="font-semibold text-gray-900 mb-3">Quick Actions</h3>
              <div className="space-y-2">
                <button 
                  onClick={() => setShowCreatePost(true)}
                  className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md flex items-center gap-2"
                >
                  <span className="text-lg">📝</span>
                  Create API Post
                </button>
                <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md flex items-center gap-2">
                  <span className="text-lg">📊</span>
                  View Analytics
                </button>
                <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md flex items-center gap-2">
                  <span className="text-lg">💰</span>
                  Earnings Dashboard
                </button>
              </div>
            </div>
          </div>

          {/* Main Feed */}
          <div className="lg:col-span-6 space-y-6">
            {/* Create Post Card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center space-x-3">
                <img 
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face" 
                  alt="Your profile" 
                  className="w-10 h-10 rounded-full ring-2 ring-gray-100"
                />
                <button 
                  onClick={() => setShowCreatePost(true)}
                  className="flex-1 text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-full text-gray-500 text-sm border border-gray-200 hover:border-gray-300 transition-all"
                >
                  Share an API update or insight...
                </button>
              </div>
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                <button className="flex items-center gap-2 text-gray-500 hover:text-blue-600 text-sm px-3 py-2 rounded-lg hover:bg-blue-50 transition-all">
                  <span className="text-lg">📊</span>
                  <span className="hidden sm:inline">API Analytics</span>
                </button>
                <button className="flex items-center gap-2 text-gray-500 hover:text-green-600 text-sm px-3 py-2 rounded-lg hover:bg-green-50 transition-all">
                  <span className="text-lg">📈</span>
                  <span className="hidden sm:inline">Market Data</span>
                </button>
                <button className="flex items-center gap-2 text-gray-500 hover:text-purple-600 text-sm px-3 py-2 rounded-lg hover:bg-purple-50 transition-all">
                  <span className="text-lg">💡</span>
                  <span className="hidden sm:inline">Insights</span>
                </button>
                <button className="flex items-center gap-2 text-gray-500 hover:text-orange-600 text-sm px-3 py-2 rounded-lg hover:bg-orange-50 transition-all">
                  <span className="text-lg">🎯</span>
                  <span className="hidden sm:inline">Case Study</span>
                </button>
              </div>
            </div>

            {/* Feed Posts */}
            {feedPosts.map((post) => (
              <APIPostCard key={post.id} post={post} />
            ))}
          </div>

          {/* Right Sidebar - Trending APIs & Suggestions */}
          <div className="lg:col-span-3 space-y-6">
            <TrendingAPIs />
            
            {/* Suggested Creators */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="font-semibold text-gray-900 mb-3">Suggested Creators</h3>
              <div className="space-y-3">
                {[
                  { name: 'Alex Kim', title: 'Blockchain Developer', followers: '2.1K', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face' },
                  { name: 'Lisa Park', title: 'Data Engineer', followers: '1.8K', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=40&h=40&fit=crop&crop=face' },
                  { name: 'David Chen', title: 'AI Researcher', followers: '3.2K', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&crop=face' }
                ].map((creator, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <img src={creator.avatar} alt={creator.name} className="w-8 h-8 rounded-full" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{creator.name}</p>
                        <p className="text-xs text-gray-500">{creator.title}</p>
                        <p className="text-xs text-gray-400">{creator.followers} followers</p>
                      </div>
                    </div>
                    <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                      Follow
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Create Post Modal */}
      {showCreatePost && (
        <CreatePostModal onClose={() => setShowCreatePost(false)} />
      )}
    </div>
  );
};

export default FeedLayout;
