import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiSearch, 
  FiGrid, 
  FiList, 
  FiDownload, 
  FiHeart, 
  FiFilter,
  FiLayers,
  FiTrendingUp,
  FiMessageSquare,
  FiEye,
  FiCode,
  FiZap
} from 'react-icons/fi';
import { FaRobot, FaBrain, FaChartLine, FaCommentDots } from 'react-icons/fa';

const TemplatesPage = () => {
  const [view, setView] = useState('grid');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Enhanced template data with AI focus
  const templates = [
    {
      id: 'ai-dashboard',
      title: 'AI Analytics Dashboard',
      category: 'AI/ML',
      description: 'Comprehensive dashboard for monitoring AI model performance and metrics',
      preview: 'https://via.placeholder.com/800x600/1E3A8A/FFFFFF?text=AI+Dashboard',
      likes: 328,
      downloads: 1250,
      isFree: false,
      isAIEnhanced: true,
      tech: ['React', 'TensorFlow.js', 'D3.js'],
      features: [
        'Real-time model metrics',
        'Interactive visualizations',
        'Custom widgets',
        'Dark/Light mode'
      ],
      icon: <FaChartLine className="text-blue-600" />
    },
    {
      id: 'chat-interface',
      title: 'AI Chat Interface',
      category: 'Conversational AI',
      description: 'Modern chat interface for AI assistants and customer support bots',
      preview: 'https://via.placeholder.com/800x600/065F46/FFFFFF?text=Chat+Interface',
      likes: 412,
      downloads: 1980,
      isFree: true,
      isAIEnhanced: true,
      tech: ['React', 'Node.js', 'WebSockets'],
      features: [
        'Markdown support',
        'Typing indicators',
        'File attachments',
        'Code highlighting'
      ],
      icon: <FaCommentDots className="text-green-600" />
    },
    {
      id: 'data-viz',
      title: 'Data Visualization Suite',
      category: 'Data Science',
      description: 'Advanced visualization components for data exploration',
      preview: 'https://via.placeholder.com/800x600/7C3AED/FFFFFF?text=Data+Viz',
      likes: 276,
      downloads: 890,
      isFree: false,
      isAIEnhanced: true,
      tech: ['React', 'D3.js', 'Plotly'],
      features: [
        'Interactive charts',
        'Large dataset support',
        'Export options',
        'Custom themes'
      ],
      icon: <FiTrendingUp className="text-purple-600" />
    },
    {
      id: 'ml-model-ui',
      title: 'ML Model Interface',
      category: 'AI/ML',
      description: 'Clean interface for interacting with machine learning models',
      preview: 'https://via.placeholder.com/800x600/DC2626/FFFFFF?text=ML+Model',
      likes: 198,
      downloads: 720,
      isFree: true,
      isAIEnhanced: true,
      tech: ['React', 'TensorFlow.js', 'FastAPI'],
      features: [
        'Model input forms',
        'Prediction visualization',
        'Model comparison',
        'Responsive design'
      ],
      icon: <FaBrain className="text-red-600" />
    },
    {
      id: 'nlp-demo',
      title: 'NLP Playground',
      category: 'Natural Language',
      description: 'Interactive playground for natural language processing demos',
      preview: 'https://via.placeholder.com/800x600/EA580C/FFFFFF?text=NLP+Playground',
      likes: 312,
      downloads: 1100,
      isFree: false,
      isAIEnhanced: true,
      tech: ['React', 'Hugging Face', 'spaCy'],
      features: [
        'Text analysis',
        'Sentiment analysis',
        'Entity recognition',
        'Language detection'
      ],
      icon: <FiMessageSquare className="text-orange-500" />
    },
    {
      id: 'cv-demo',
      title: 'Computer Vision Demo',
      category: 'Computer Vision',
      description: 'Real-time computer vision interface for object detection',
      preview: 'https://via.placeholder.com/800x600/2563EB/FFFFFF?text=CV+Demonstration',
      likes: 289,
      downloads: 950,
      isFree: false,
      isAIEnhanced: true,
      tech: ['React', 'TensorFlow.js', 'OpenCV.js'],
      features: [
        'Webcam integration',
        'Object detection',
        'Image classification',
        'Real-time processing'
      ],
      icon: <FiEye className="text-blue-500" />
    }
  ];

  const categories = [
    { id: 'all', name: 'All', icon: <FiLayers className="mr-2" /> },
    { id: 'ai-ml', name: 'AI/ML', icon: <FaRobot className="mr-2" /> },
    { id: 'conversational', name: 'Conversational AI', icon: <FiMessageSquare className="mr-2" /> },
    { id: 'data-science', name: 'Data Science', icon: <FiTrendingUp className="mr-2" /> },
    { id: 'nlp', name: 'Natural Language', icon: <FiCode className="mr-2" /> },
    { id: 'cv', name: 'Computer Vision', icon: <FiEye className="mr-2" /> }
  ];
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedTech, setSelectedTech] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Get unique technologies from templates
  const allTech = Array.from(new Set(templates.flatMap(t => t.tech || [])));
  
  // Filter templates based on selected filters
  const filteredTemplates = templates.filter(template => {
    const matchesCategory = selectedCategory === 'all' || 
      template.category.toLowerCase().includes(selectedCategory.split('-')[0]);
    
    const matchesTech = selectedTech.length === 0 || 
      (template.tech && selectedTech.some(tech => template.tech.includes(tech)));
      
    const matchesSearch = searchQuery === '' || 
      template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (template.tech && template.tech.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())));
      
    return matchesCategory && matchesTech && matchesSearch;
  });

  // Search handler
  const handleSearch = (e) => {
    e.preventDefault();
    setSearchQuery(searchTerm);
  };

  // Toggle technology filter
  const toggleTech = (tech) => {
    setSelectedTech(prev => 
      prev.includes(tech) 
        ? prev.filter(t => t !== tech)
        : [...prev, tech]
    );
  };

  // Reset all filters
  const resetFilters = () => {
    setSelectedCategory('all');
    setSelectedTech([]);
    setSearchTerm('');
    setSearchQuery('');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
            Beautiful Templates
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-xl text-gray-500">
            Choose from our collection of professionally designed templates to get started quickly
          </p>
        </motion.div>

        {/* Search and Filter */}
        <div className="mb-8">
          <form onSubmit={handleSearch} className="mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiSearch className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Search templates by name, description, or technology..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
              >
                Search
              </button>
              <button
                type="button"
                onClick={() => setShowFilters(!showFilters)}
                className="px-4 py-2 flex items-center gap-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
              >
                <FiFilter className="h-5 w-5" />
                <span className="hidden sm:inline">Filters</span>
                {selectedTech.length > 0 && (
                  <span className="inline-flex items-center justify-center px-2 py-0.5 text-xs font-medium bg-indigo-100 text-indigo-800 rounded-full">
                    {selectedTech.length}
                  </span>
                )}
              </button>
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  className={`p-2 rounded-lg ${view === 'grid' ? 'bg-indigo-100 text-indigo-600' : 'text-gray-500 hover:bg-gray-100'}`}
                  onClick={() => setView('grid')}
                  title="Grid view"
                >
                  <FiGrid className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  className={`p-2 rounded-lg ${view === 'list' ? 'bg-indigo-100 text-indigo-600' : 'text-gray-500 hover:bg-gray-100'}`}
                  onClick={() => setView('list')}
                  title="List view"
                >
                  <FiList className="h-5 w-5" />
                </button>
              </div>
            </div>
          </form>

          {/* Category Filters */}
          <div className="mb-6">
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center ${
                    selectedCategory === category.id
                      ? 'bg-indigo-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  {category.icon}
                  {category.name}
                </button>
              ))}
            </div>
          </div>

          {/* Advanced Filters */}
          <AnimatePresence>
            {showFilters && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden bg-gray-50 rounded-lg p-4 mb-6 border border-gray-200"
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Advanced Filters</h3>
                  <div className="flex space-x-2">
                    <button 
                      onClick={resetFilters}
                      className="text-sm text-indigo-600 hover:text-indigo-800"
                    >
                      Reset all
                    </button>
                    <button 
                      onClick={() => setShowFilters(false)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <span className="sr-only">Close filters</span>
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Technologies</h4>
                  <div className="flex flex-wrap gap-2">
                    {allTech.map((tech) => (
                      <button
                        key={tech}
                        type="button"
                        onClick={() => toggleTech(tech)}
                        className={`px-3 py-1 text-sm rounded-full border ${
                          selectedTech.includes(tech)
                            ? 'bg-indigo-100 border-indigo-300 text-indigo-800'
                            : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {tech}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Templates Grid */}
        {view === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTemplates.map((template, index) => (
              <motion.div
                key={template.id}
                className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 flex flex-col h-full"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                whileHover={{ y: -5 }}
              >
                <div className="relative">
                  <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center overflow-hidden">
                    <img 
                      src={template.preview} 
                      alt={template.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="absolute top-3 right-3 flex space-x-2">
                    {template.isFree && (
                      <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full flex items-center">
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1.5"></span>
                        Free
                      </span>
                    )}
                    {template.isAIEnhanced && (
                      <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full flex items-center">
                        <FiZap className="w-3 h-3 mr-1" />
                        AI-Powered
                      </span>
                    )}
                  </div>
                </div>
                <div className="p-5 flex-1 flex flex-col">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center">
                      <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600 mr-3">
                        {template.icon}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">{template.title}</h3>
                        <p className="text-sm text-gray-500">{template.category}</p>
                      </div>
                    </div>
                    <button 
                      className="text-gray-400 hover:text-red-500 p-1 -mt-1 -mr-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        // Handle like action
                      }}
                    >
                      <FiHeart className="h-5 w-5" />
                    </button>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{template.description}</p>
                  
                  <div className="mt-auto">
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {template.tech && template.tech.slice(0, 3).map((tech) => (
                        <span key={tech} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {tech}
                        </span>
                      ))}
                      {template.tech && template.tech.length > 3 && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          +{template.tech.length - 3}
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="flex items-center space-x-4">
                        <span className="flex items-center text-sm text-gray-500">
                          <FiHeart className="h-4 w-4 mr-1 text-red-500" />
                          {template.likes.toLocaleString()}
                        </span>
                        <span className="flex items-center text-sm text-gray-500">
                          <FiDownload className="h-4 w-4 mr-1 text-indigo-500" />
                          {template.downloads.toLocaleString()}
                        </span>
                      </div>
                      <button 
                        className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                          template.isFree 
                            ? 'bg-indigo-600 text-white hover:bg-indigo-700' 
                            : 'bg-white text-indigo-600 border border-indigo-600 hover:bg-indigo-50'
                        }`}
                      >
                        {template.isFree ? 'Download' : 'View Details'}
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredTemplates.map((template, index) => (
              <motion.div
                key={template.id}
                className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <div className="flex flex-col md:flex-row">
                  <div className="md:w-1/3 lg:w-1/4 h-56 md:h-auto relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200">
                      <img 
                        src={template.preview} 
                        alt={template.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="absolute top-3 right-3 flex flex-col space-y-2">
                      {template.isFree && (
                        <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-1 rounded-full flex items-center">
                          <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1.5"></span>
                          Free
                        </span>
                      )}
                      {template.isAIEnhanced && (
                        <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-1 rounded-full flex items-center">
                          <FiZap className="w-3 h-3 mr-1" />
                          AI-Powered
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex justify-between items-start">
                      <div className="flex items-start">
                        <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600 mr-4 mt-1">
                          {template.icon}
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900">{template.title}</h3>
                          <p className="text-sm text-gray-500 mt-1">{template.category}</p>
                          <p className="mt-3 text-gray-600">{template.description}</p>
                          
                          <div className="mt-4 flex flex-wrap gap-2">
                            {template.tech && template.tech.map((tech) => (
                              <span key={tech} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                {tech}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                      <button 
                        className="text-gray-400 hover:text-red-500 p-1 -mt-1 -mr-1"
                        onClick={(e) => {
                          e.stopPropagation();
                          // Handle like action
                        }}
                      >
                        <FiHeart className="h-5 w-5" />
                      </button>
                    </div>
                    
                    <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
                      <div className="flex items-center space-x-6">
                        <span className="flex items-center text-sm text-gray-500">
                          <FiHeart className="h-4 w-4 mr-1.5 text-red-500" />
                          {template.likes.toLocaleString()} Likes
                        </span>
                        <span className="flex items-center text-sm text-gray-500">
                          <FiDownload className="h-4 w-4 mr-1.5 text-indigo-500" />
                          {template.downloads.toLocaleString()} Downloads
                        </span>
                      </div>
                      <div className="flex space-x-3">
                        <button 
                          className="px-4 py-2 text-sm font-medium text-indigo-600 border border-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors"
                        >
                          Preview
                        </button>
                        <button 
                          className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                            template.isFree 
                              ? 'bg-indigo-600 text-white hover:bg-indigo-700' 
                              : 'bg-white text-indigo-600 border border-indigo-600 hover:bg-indigo-50'
                          }`}
                        >
                          {template.isFree ? 'Download Now' : 'View Details'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* No results */}
        {filteredTemplates.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900">No templates found</h3>
            <p className="mt-2 text-gray-500">Try adjusting your search or filter to find what you're looking for.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TemplatesPage;
