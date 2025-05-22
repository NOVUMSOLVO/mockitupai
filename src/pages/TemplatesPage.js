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
import PlaceholderImage from '../components/PlaceholderImage';

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
      preview: 'ai-dashboard',
      color: '1E3A8A',
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
      preview: 'chat-interface',
      color: '065F46',
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
      preview: 'data-viz',
      color: '7C3AED',
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
      preview: 'ml-model',
      color: 'DC2626',
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
      preview: 'nlp-playground',
      color: 'EA580C',
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
      preview: 'cv-demo',
      color: '2563EB',
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
          <h1 className="text-4xl font-bold text-gray-900 mb-4">AI-Powered Templates</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Jumpstart your next AI project with our professionally designed, production-ready templates
          </p>
        </motion.div>

        {/* Search and Filter Bar */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <form onSubmit={handleSearch} className="flex-1 max-w-2xl">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiSearch className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Search templates..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </form>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setView('grid')}
                className={`p-2 rounded-lg ${view === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-500 hover:bg-gray-100'}`}
                aria-label="Grid view"
              >
                <FiGrid className="h-5 w-5" />
              </button>
              <button
                onClick={() => setView('list')}
                className={`p-2 rounded-lg ${view === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-500 hover:bg-gray-100'}`}
                aria-label="List view"
              >
                <FiList className="h-5 w-5" />
              </button>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                <FiFilter className="h-4 w-4 mr-2" />
                Filters
              </button>
            </div>
          </div>

          {/* Filters Panel */}
          <AnimatePresence>
            {showFilters && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 bg-white p-4 rounded-lg shadow-sm border border-gray-200 overflow-hidden"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Category</h3>
                    <div className="flex flex-wrap gap-2">
                      {categories.map((category) => (
                        <button
                          key={category.id}
                          onClick={() => setSelectedCategory(category.id)}
                          className={`flex items-center px-3 py-1.5 text-sm rounded-full ${
                            selectedCategory === category.id
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {category.icon}
                          {category.name}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Technologies</h3>
                    <div className="flex flex-wrap gap-2">
                      {allTech.map((tech) => (
                        <button
                          key={tech}
                          onClick={() => toggleTech(tech)}
                          className={`px-3 py-1.5 text-sm rounded-full ${
                            selectedTech.includes(tech)
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {tech}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <button
                    onClick={resetFilters}
                    className="text-sm text-blue-600 hover:text-blue-800 font-medium self-start md:self-center"
                  >
                    Reset filters
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Templates Grid */}
        {filteredTemplates.length > 0 ? (
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
                    <PlaceholderImage 
                      width={800}
                      height={600}
                      text={template.title}
                      className="w-full h-full object-cover"
                      style={{ backgroundColor: `#${template.color}20`, color: `#${template.color}` }}
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
                      <span className="bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-1 rounded-full flex items-center">
                        <FiZap className="w-3 h-3 mr-1" />
                        AI Enhanced
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="p-5 flex-1 flex flex-col">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{template.title}</h3>
                    <div className="flex items-center text-yellow-400">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <svg
                          key={star}
                          className={`h-4 w-4 ${star <= 4 ? 'text-yellow-400' : 'text-gray-300'}`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-4 flex-1">{template.description}</p>
                  
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div className="flex items-center text-sm text-gray-500 mr-4">
                          <FiDownload className="h-4 w-4 mr-1" />
                          {template.downloads.toLocaleString()}
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <FiHeart className="h-4 w-4 mr-1 text-red-500" />
                          {template.likes.toLocaleString()}
                        </div>
                      </div>
                      <button className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors">
                        View details
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="mx-auto h-24 w-24 text-gray-300 mb-4">
              <svg
                className="h-full w-full"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">No templates found</h3>
            <p className="text-gray-500">Try adjusting your search or filter to find what you're looking for.</p>
            <button
              onClick={resetFilters}
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Reset all filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TemplatesPage;
