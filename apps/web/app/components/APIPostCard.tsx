'use client';

import React, { useState } from 'react';

interface APIPostCardProps {
  post: {
    id: string;
    creator: {
      name: string;
      title: string;
      avatar: string;
      verified: boolean;
    };
    content: {
      type: 'api_launch' | 'api_update' | 'api_insight';
      title: string;
      description: string;
      apiDetails: {
        name: string;
        endpoints: number;
        accuracy?: string;
        coverage?: string;
        requests: string;
        price: string;
      };
      tags: string[];
      timestamp: string;
      likes: number;
      comments: number;
      shares: number;
    };
  };
}

const APIPostCard: React.FC<APIPostCardProps> = ({ post }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isShared, setIsShared] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [showReactions, setShowReactions] = useState(false);
  const [likeCount, setLikeCount] = useState(post.content.likes);
  const [commentCount, setCommentCount] = useState(post.content.comments);
  const [shareCount, setShareCount] = useState(post.content.shares);
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState([
    {
      id: '1',
      author: 'Alex Kim',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face',
      text: 'This looks amazing! What\'s the latency like?',
      timestamp: '2h',
      likes: 3,
      isLiked: false
    },
    {
      id: '2',
      author: 'Sarah Chen',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=32&h=32&fit=crop&crop=face',
      text: 'Great work! I\'ve been looking for something like this.',
      timestamp: '1h',
      likes: 1,
      isLiked: true
    }
  ]);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
  };

  const handleShare = () => {
    setIsShared(!isShared);
    setShareCount(prev => isShared ? prev - 1 : prev + 1);
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
  };

  const handleAddComment = () => {
    if (newComment.trim()) {
      const comment = {
        id: Date.now().toString(),
        author: 'You',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face',
        text: newComment,
        timestamp: 'now',
        likes: 0,
        isLiked: false
      };
      setComments(prev => [...prev, comment]);
      setCommentCount(prev => prev + 1);
      setNewComment('');
    }
  };

  const handleCommentLike = (commentId: string) => {
    setComments(prev => prev.map(comment => 
      comment.id === commentId 
        ? { 
            ...comment, 
            isLiked: !comment.isLiked,
            likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1
          }
        : comment
    ));
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'api_launch': return '🚀';
      case 'api_update': return '📈';
      case 'api_insight': return '💡';
      default: return '📊';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'api_launch': return 'bg-green-100 text-green-800';
      case 'api_update': return 'bg-blue-100 text-blue-800';
      case 'api_insight': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <img 
              src={post.creator.avatar} 
              alt={post.creator.name}
              className="w-12 h-12 rounded-full"
            />
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-semibold text-gray-900">{post.creator.name}</h3>
                {post.creator.verified && (
                  <span className="text-blue-500 text-sm">✓</span>
                )}
              </div>
              <p className="text-sm text-gray-600">{post.creator.title}</p>
              <p className="text-xs text-gray-500">{post.content.timestamp}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(post.content.type)}`}>
              {getTypeIcon(post.content.type)} {post.content.type.replace('_', ' ').toUpperCase()}
            </span>
            <button className="text-gray-400 hover:text-gray-600">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">
          {post.content.title}
        </h2>
        <p className="text-gray-700 mb-4 leading-relaxed">
          {post.content.description}
        </p>

        {/* API Details Card */}
        <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg p-4 mb-4 border border-gray-200 hover:border-blue-200 transition-colors">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-semibold text-gray-900">{post.content.apiDetails.name}</h4>
            <span className="text-lg font-bold text-green-600 bg-green-100 px-3 py-1 rounded-full">{post.content.apiDetails.price}</span>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center">
              <span className="text-gray-500 mr-2">Endpoints:</span>
              <span className="font-medium text-gray-900 bg-white px-2 py-1 rounded">{post.content.apiDetails.endpoints}</span>
            </div>
            <div className="flex items-center">
              <span className="text-gray-500 mr-2">Requests:</span>
              <span className="font-medium text-gray-900 bg-white px-2 py-1 rounded">{post.content.apiDetails.requests}</span>
            </div>
            {post.content.apiDetails.accuracy && (
              <div className="flex items-center">
                <span className="text-gray-500 mr-2">Accuracy:</span>
                <span className="font-medium text-green-600 bg-green-100 px-2 py-1 rounded">{post.content.apiDetails.accuracy}</span>
              </div>
            )}
            {post.content.apiDetails.coverage && (
              <div className="flex items-center">
                <span className="text-gray-500 mr-2">Coverage:</span>
                <span className="font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded">{post.content.apiDetails.coverage}</span>
              </div>
            )}
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {post.content.tags.map((tag, index) => (
            <span 
              key={index}
              className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full hover:bg-blue-100 cursor-pointer"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Engagement Stats */}
        <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
          <div className="flex items-center space-x-4">
            <span>{likeCount} likes</span>
            <span>{commentCount} comments</span>
            <span>{shareCount} shares</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          {/* Like Button with Reactions */}
          <div className="relative">
            <button 
              onClick={handleLike}
              onMouseEnter={() => setShowReactions(true)}
              onMouseLeave={() => setShowReactions(false)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                isLiked 
                  ? 'text-blue-600 bg-blue-50' 
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <svg className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
              </svg>
              <span>Like</span>
            </button>
            
            {/* Reaction Picker */}
            {showReactions && (
              <div className="absolute bottom-full left-0 mb-2 bg-white border border-gray-200 rounded-lg shadow-lg p-2 flex space-x-1">
                {['👍', '❤️', '😂', '😮', '😢', '😡'].map((emoji, index) => (
                  <button
                    key={index}
                    className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-full text-lg"
                    onClick={() => {
                      handleLike();
                      setShowReactions(false);
                    }}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            )}
          </div>
          
          <button 
            onClick={() => setShowComments(!showComments)}
            className="flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <span>Comment</span>
          </button>
          
          <button 
            onClick={handleShare}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              isShared 
                ? 'text-green-600 bg-green-50' 
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
            </svg>
            <span>Share</span>
          </button>
          
          <button 
            onClick={handleBookmark}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              isBookmarked 
                ? 'text-yellow-600 bg-yellow-50' 
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <svg className={`w-5 h-5 ${isBookmarked ? 'fill-current' : ''}`} viewBox="0 0 20 20">
              <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
            </svg>
            <span>Save</span>
          </button>
        </div>

        {/* Comments Section */}
        {showComments && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="space-y-3">
              {comments.map((comment) => (
                <div key={comment.id} className="flex space-x-3">
                  <img 
                    src={comment.avatar} 
                    alt={comment.author} 
                    className="w-8 h-8 rounded-full"
                  />
                  <div className="flex-1">
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-900">{comment.author}</p>
                        <span className="text-xs text-gray-500">{comment.timestamp}</span>
                      </div>
                      <p className="text-sm text-gray-700 mt-1">{comment.text}</p>
                    </div>
                    <div className="flex items-center space-x-4 mt-1 text-xs text-gray-500">
                      <button 
                        onClick={() => handleCommentLike(comment.id)}
                        className={`hover:text-gray-700 flex items-center space-x-1 ${
                          comment.isLiked ? 'text-blue-600' : ''
                        }`}
                      >
                        <svg className={`w-3 h-3 ${comment.isLiked ? 'fill-current' : ''}`} viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                        </svg>
                        <span>{comment.likes > 0 && comment.likes}</span>
                      </button>
                      <button className="hover:text-gray-700">Reply</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Comment Input */}
            <div className="flex space-x-3 mt-4">
              <img 
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face" 
                alt="Your profile" 
                className="w-8 h-8 rounded-full"
              />
              <div className="flex-1 flex space-x-2">
                <input 
                  type="text" 
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Write a comment..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
                />
                <button
                  onClick={handleAddComment}
                  disabled={!newComment.trim()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Post
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default APIPostCard;
