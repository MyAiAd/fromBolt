import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Target, BookOpen, Video, Users, TrendingUp, Star, Clock, CheckCircle, Play, Download, ChevronLeft, ChevronRight } from 'lucide-react';

interface Course {
  id: string;
  title: string;
  description: string;
  duration: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  rating: number;
  students: number;
  thumbnail: string;
  completed: boolean;
  progress: number;
}

interface Resource {
  id: string;
  title: string;
  type: 'pdf' | 'video' | 'template' | 'checklist';
  description: string;
  downloadUrl: string;
}

const Training: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'courses' | 'resources' | 'live'>('courses');

  const courses: Course[] = [
    {
      id: '1',
      title: 'Affiliate Marketing Fundamentals',
      description: 'Learn the basics of affiliate marketing and how to get started with your first campaigns.',
      duration: '2h 30m',
      level: 'Beginner',
      rating: 4.8,
      students: 1250,
      thumbnail: '/api/placeholder/300/200',
      completed: true,
      progress: 100
    },
    {
      id: '2',
      title: 'Advanced Social Media Strategies',
      description: 'Master social media marketing techniques to maximize your affiliate conversions.',
      duration: '3h 15m',
      level: 'Advanced',
      rating: 4.9,
      students: 890,
      thumbnail: '/api/placeholder/300/200',
      completed: false,
      progress: 65
    },
    {
      id: '3',
      title: 'Email Marketing for Affiliates',
      description: 'Build and nurture your email list to create a sustainable affiliate income stream.',
      duration: '1h 45m',
      level: 'Intermediate',
      rating: 4.7,
      students: 1100,
      thumbnail: '/api/placeholder/300/200',
      completed: false,
      progress: 0
    },
    {
      id: '4',
      title: 'Content Creation Mastery',
      description: 'Create compelling content that converts visitors into customers.',
      duration: '2h 50m',
      level: 'Intermediate',
      rating: 4.8,
      students: 950,
      thumbnail: '/api/placeholder/300/200',
      completed: false,
      progress: 30
    }
  ];

  const resources: Resource[] = [
    {
      id: '1',
      title: 'Affiliate Marketing Checklist',
      type: 'checklist',
      description: 'Complete checklist for launching your first affiliate campaign',
      downloadUrl: '#'
    },
    {
      id: '2',
      title: 'Social Media Templates',
      type: 'template',
      description: 'Ready-to-use templates for Instagram, Facebook, and Twitter posts',
      downloadUrl: '#'
    },
    {
      id: '3',
      title: 'Email Sequence Templates',
      type: 'template',
      description: 'Proven email sequences that convert prospects into customers',
      downloadUrl: '#'
    },
    {
      id: '4',
      title: 'Affiliate Marketing Guide',
      type: 'pdf',
      description: 'Comprehensive 50-page guide covering all aspects of affiliate marketing',
      downloadUrl: '#'
    }
  ];

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Beginner': return 'bg-green-900/30 text-green-400';
      case 'Intermediate': return 'bg-yellow-900/30 text-yellow-400';
      case 'Advanced': return 'bg-red-900/30 text-red-400';
      default: return 'bg-gray-900/30 text-gray-400';
    }
  };

  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'pdf': return BookOpen;
      case 'video': return Video;
      case 'template': return Target;
      case 'checklist': return CheckCircle;
      default: return BookOpen;
    }
  };

  return (
    <div className="pb-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-semibold text-white mb-2 flex items-center">
          <Target className="mr-3 h-8 w-8 text-green-400" />
          Training Center
        </h1>
        <p className="text-gray-400">Master affiliate marketing and grow your income with our comprehensive training</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card"
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-gray-400 text-sm">Courses Completed</h3>
            <CheckCircle className="h-5 w-5 text-green-400" />
          </div>
          <p className="text-3xl font-bold text-white mb-2">1</p>
          <div className="text-xs text-gray-400">out of {courses.length} courses</div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card"
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-gray-400 text-sm">Learning Hours</h3>
            <Clock className="h-5 w-5 text-blue-400" />
          </div>
          <p className="text-3xl font-bold text-white mb-2">12.5</p>
          <div className="text-xs text-gray-400">hours of content</div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card"
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-gray-400 text-sm">Skill Level</h3>
            <TrendingUp className="h-5 w-5 text-jennaz-rose" />
          </div>
          <p className="text-3xl font-bold text-white mb-2">Intermediate</p>
          <div className="text-xs text-gray-400">Keep learning!</div>
        </motion.div>
      </div>

      {/* Tabs */}
      <div className="mb-8">
        <div className="border-b border-gray-700">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('courses')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'courses'
                  ? 'border-jennaz-rose text-jennaz-rose'
                  : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'
              }`}
            >
              Courses
            </button>
            <button
              onClick={() => setActiveTab('resources')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'resources'
                  ? 'border-jennaz-rose text-jennaz-rose'
                  : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'
              }`}
            >
              Resources
            </button>
            <button
              onClick={() => setActiveTab('live')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'live'
                  ? 'border-jennaz-rose text-jennaz-rose'
                  : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'
              }`}
            >
              Live Sessions
            </button>
          </nav>
        </div>
      </div>

      {/* Courses Tab */}
      {activeTab === 'courses' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {courses.map((course) => (
            <div key={course.id} className="card hover:bg-jennaz-purple-light transition-colors">
              <div className="relative mb-4">
                <div className="w-full h-48 bg-gray-800 rounded-lg flex items-center justify-center">
                  <Video className="w-12 h-12 text-gray-600" />
                </div>
                {course.completed && (
                  <div className="absolute top-2 right-2 bg-green-500 rounded-full p-1">
                    <CheckCircle className="w-4 h-4 text-white" />
                  </div>
                )}
                {!course.completed && course.progress > 0 && (
                  <div className="absolute bottom-2 left-2 right-2">
                    <div className="bg-gray-900/80 rounded-full h-2">
                      <div 
                        className="bg-jennaz-rose h-2 rounded-full transition-all duration-300"
                        style={{ width: `${course.progress}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="mb-3">
                <div className="flex items-center justify-between mb-2">
                  <span className={`px-2 py-1 text-xs rounded-full ${getLevelColor(course.level)}`}>
                    {course.level}
                  </span>
                  <span className="text-gray-400 text-sm">{course.duration}</span>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{course.title}</h3>
                <p className="text-gray-400 text-sm mb-3">{course.description}</p>
              </div>

              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-400 mr-1" />
                    <span className="text-sm text-gray-300">{course.rating}</span>
                  </div>
                  <div className="flex items-center">
                    <Users className="w-4 h-4 text-gray-400 mr-1" />
                    <span className="text-sm text-gray-400">{course.students}</span>
                  </div>
                </div>
              </div>

              <button className="w-full btn btn-primary flex items-center justify-center space-x-2">
                <Play className="w-4 h-4" />
                <span>{course.completed ? 'Review' : course.progress > 0 ? 'Continue' : 'Start Course'}</span>
              </button>
            </div>
          ))}
        </motion.div>
      )}

      {/* Resources Tab */}
      {activeTab === 'resources' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {resources.map((resource) => {
            const Icon = getResourceIcon(resource.type);
            return (
              <div key={resource.id} className="card hover:bg-jennaz-purple-light transition-colors">
                <div className="flex items-center mb-4">
                  <div className="p-3 bg-jennaz-rose/20 rounded-lg mr-3">
                    <Icon className="w-6 h-6 text-jennaz-rose" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">{resource.title}</h3>
                    <span className="text-xs text-gray-400 uppercase">{resource.type}</span>
                  </div>
                </div>
                
                <p className="text-gray-400 text-sm mb-4">{resource.description}</p>
                
                <button className="w-full btn btn-secondary flex items-center justify-center space-x-2">
                  <Download className="w-4 h-4" />
                  <span>Download</span>
                </button>
              </div>
            );
          })}
        </motion.div>
      )}

      {/* Live Sessions Tab */}
      {activeTab === 'live' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="card">
            <div className="text-center py-12">
              <Video className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">Weekly Live Training</h3>
              <p className="text-gray-400 mb-6">Join our live training sessions every Tuesday at 7 PM EST</p>
              
              <div className="bg-jennaz-purple-light rounded-lg p-6 mb-6">
                <h4 className="text-white font-semibold mb-2">Next Session: Advanced Conversion Tactics</h4>
                <p className="text-gray-400 text-sm mb-4">Tuesday, March 19th at 7:00 PM EST</p>
                <div className="flex items-center justify-center space-x-4 text-sm text-gray-400">
                  <span>Duration: 90 minutes</span>
                  <span>•</span>
                  <span>Q&A included</span>
                </div>
              </div>
              
              <button className="btn btn-primary">Register for Next Session</button>
            </div>
          </div>

          <div className="card">
            <h3 className="text-lg font-semibold text-white mb-4">Previous Sessions</h3>
            <div className="space-y-3">
              {[
                { title: 'Email Marketing Automation', date: 'March 12, 2024', duration: '85 min' },
                { title: 'Social Media Content Strategy', date: 'March 5, 2024', duration: '92 min' },
                { title: 'Affiliate Link Optimization', date: 'February 27, 2024', duration: '78 min' }
              ].map((session, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-jennaz-purple-light rounded-lg">
                  <div>
                    <h4 className="text-white font-medium">{session.title}</h4>
                    <p className="text-gray-400 text-sm">{session.date} • {session.duration}</p>
                  </div>
                  <button className="btn btn-secondary btn-sm">Watch Replay</button>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Training; 