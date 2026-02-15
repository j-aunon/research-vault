import React, { useState } from 'react';
import { BookOpen, FileText, Globe, Plus, Search, Folder, Star, Calendar, Tag, TrendingUp, Clock, CheckCircle } from 'lucide-react';

export default function ResearchLibrary() {
  const [selectedProject, setSelectedProject] = useState('');
  const [selectedFolder, setSelectedFolder] = useState(''); // empty means show all in project
  const [selectedType, setSelectedType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAddFolderModal, setShowAddFolderModal] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'compact'
  const [sortBy, setSortBy] = useState('recent'); // 'recent', 'title', 'starred'
  const [showStats, setShowStats] = useState(false);

  // Mock data - folders within projects
  const folders = {
    'ml-research': [
      { id: 'transformers', name: 'Transformers', color: 'bg-blue-500' },
      { id: 'diffusion', name: 'Diffusion Models', color: 'bg-cyan-500' },
      { id: 'rl', name: 'Reinforcement Learning', color: 'bg-purple-500' },
    ],
    'web-dev': [
      { id: 'react', name: 'React & Frontend', color: 'bg-cyan-500' },
      { id: 'backend', name: 'Backend & APIs', color: 'bg-green-500' },
    ],
    'design': [
      { id: 'ux', name: 'UX Principles', color: 'bg-purple-500' },
      { id: 'visual', name: 'Visual Design', color: 'bg-pink-500' },
    ],
    'personal': [
      { id: 'learning', name: 'Currently Learning', color: 'bg-orange-500' },
    ],
  };

  // Mock data
  const projects = [
    { id: 'ml-research', name: 'ML Research', color: 'bg-blue-500' },
    { id: 'web-dev', name: 'Web Development', color: 'bg-cyan-500' },
    { id: 'design', name: 'Design Theory', color: 'bg-purple-500' },
    { id: 'personal', name: 'Personal Learning', color: 'bg-green-500' },
  ];

  const items = [
    {
      id: 1,
      title: 'Attention Is All You Need',
      type: 'paper',
      project: 'ml-research',
      folder: 'transformers',
      url: 'arxiv.org/abs/1706.03762',
      addedDate: '2024-02-10',
      starred: true,
      tags: ['transformers', 'NLP', 'architecture'],
      notes: 'Foundational paper on transformer architecture',
      readStatus: 'read', // 'unread', 'reading', 'read'
      importance: 'high', // 'low', 'medium', 'high'
      readingProgress: 100
    },
    {
      id: 2,
      title: 'Clean Code',
      type: 'book',
      project: 'web-dev',
      folder: 'backend',
      url: 'cleancoder.com',
      addedDate: '2024-02-08',
      starred: false,
      tags: ['best-practices', 'programming'],
      notes: 'Robert C. Martin - Software craftsmanship',
      readStatus: 'reading',
      importance: 'high',
      readingProgress: 60
    },
    {
      id: 3,
      title: 'CSS Tricks - Grid Guide',
      type: 'website',
      project: 'web-dev',
      folder: 'react',
      url: 'css-tricks.com/snippets/css/complete-guide-grid',
      addedDate: '2024-02-12',
      starred: true,
      tags: ['CSS', 'layout', 'reference'],
      notes: 'Comprehensive CSS Grid reference',
      readStatus: 'read',
      importance: 'medium',
      readingProgress: 100
    },
    {
      id: 4,
      title: 'The Design of Everyday Things',
      type: 'book',
      project: 'design',
      folder: 'ux',
      url: 'jnd.org',
      addedDate: '2024-02-05',
      starred: false,
      tags: ['UX', 'psychology', 'design'],
      notes: 'Don Norman classic on design principles',
      readStatus: 'unread',
      importance: 'medium',
      readingProgress: 0
    },
    {
      id: 5,
      title: 'Diffusion Models Beat GANs',
      type: 'paper',
      project: 'ml-research',
      folder: 'diffusion',
      url: 'arxiv.org/abs/2105.05233',
      addedDate: '2024-02-11',
      starred: true,
      tags: ['generative', 'diffusion', 'image-synthesis'],
      notes: 'Important work on diffusion models for image generation',
      readStatus: 'reading',
      importance: 'high',
      readingProgress: 45
    },
  ];

  const filteredItems = items.filter(item => {
    if (!selectedProject) return false; // Don't show items if no project selected
    const matchesProject = item.project === selectedProject;
    const matchesFolder = !selectedFolder || item.folder === selectedFolder;
    const matchesType = selectedType === 'all' || item.type === selectedType;
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesProject && matchesFolder && matchesType && matchesSearch;
  });

  const getTypeIcon = (type) => {
    switch(type) {
      case 'paper': return <FileText className="w-5 h-5" />;
      case 'book': return <BookOpen className="w-5 h-5" />;
      case 'website': return <Globe className="w-5 h-5" />;
      default: return <FileText className="w-5 h-5" />;
    }
  };

  const getTypeColor = (type) => {
    switch(type) {
      case 'paper': return 'bg-blue-500/20 text-blue-400 border-blue-500/50 shadow-lg shadow-blue-500/30';
      case 'book': return 'bg-cyan-500/20 text-cyan-400 border-cyan-500/50 shadow-lg shadow-cyan-500/30';
      case 'website': return 'bg-green-500/20 text-green-400 border-green-500/50 shadow-lg shadow-green-500/30';
      default: return 'bg-purple-500/20 text-purple-400 border-purple-500/50 shadow-lg shadow-purple-500/30';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
      {/* Header */}
      <header className="bg-black/80 border-b border-blue-500/30 shadow-xl shadow-blue-500/10 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-3 rounded-xl shadow-lg shadow-blue-500/50">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 bg-clip-text text-transparent">
                  Research Library
                </h1>
                <p className="text-gray-400 text-sm">Your personal knowledge vault</p>
              </div>
            </div>
            <button 
              onClick={() => setShowAddModal(true)}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white px-6 py-3 rounded-xl flex items-center gap-2 shadow-lg shadow-blue-500/50 hover:shadow-xl hover:shadow-blue-500/60 transition-all"
            >
              <Plus className="w-5 h-5" />
              Add Resource
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-12 gap-6">
          {/* Sidebar */}
          <aside className="col-span-3">
            {/* Search */}
            <div className="bg-black/60 backdrop-blur-sm rounded-xl shadow-lg shadow-purple-500/10 p-4 mb-6 border border-purple-500/30">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search resources..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-900/80 border border-purple-500/30 text-gray-100 placeholder-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Projects */}
            <div className="bg-black/60 backdrop-blur-sm rounded-xl shadow-lg shadow-cyan-500/10 p-4 mb-6 border border-cyan-500/30">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-semibold text-gray-200 flex items-center gap-2">
                  <Folder className="w-4 h-4 text-cyan-400" />
                  Projects
                </h2>
                <button 
                  className="text-cyan-400 hover:text-cyan-300 transition-colors"
                  title="Add New Project"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-2">
                {projects.map(project => (
                  <div key={project.id} className="space-y-1">
                    {/* Project Header */}
                    <button
                      onClick={() => {
                        if (selectedProject === project.id) {
                          // If clicking the same project, collapse it
                          setSelectedProject('');
                          setSelectedFolder('');
                        } else {
                          // If clicking a different project, expand it and show all resources (no folder filter)
                          setSelectedProject(project.id);
                          setSelectedFolder(''); // Empty means show all resources in project
                        }
                      }}
                      className={`w-full text-left px-3 py-2 rounded-lg flex items-center gap-2 transition-all ${
                        selectedProject === project.id
                          ? 'bg-blue-500/20 text-blue-400 font-medium border border-blue-500/50 shadow-lg shadow-blue-500/20'
                          : 'text-gray-300 hover:bg-gray-800/50 border border-transparent hover:border-purple-500/20'
                      }`}
                    >
                      {/* Expand/Collapse Arrow */}
                      <svg 
                        className={`w-3 h-3 transition-transform ${selectedProject === project.id ? 'rotate-90' : ''}`}
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                      <div className={`w-3 h-3 rounded-full ${project.color} shadow-lg`} style={{
                        boxShadow: selectedProject === project.id ? '0 0 10px currentColor' : 'none'
                      }} />
                      <span className="text-sm flex-1">{project.name}</span>
                      <span className="text-xs text-gray-500">
                        {items.filter(i => i.project === project.id).length}
                      </span>
                    </button>
                    
                    {/* Folders Tree - shown when project is selected */}
                    {selectedProject === project.id && folders[project.id] && folders[project.id].length > 0 && (
                      <div className="ml-4 pl-3 border-l-2 border-gray-700/50 space-y-1">
                        {/* Individual Folders */}
                        {folders[project.id].map(folder => (
                          <button
                            key={folder.id}
                            onClick={() => setSelectedFolder(folder.id)}
                            className={`w-full text-left px-3 py-1.5 rounded-lg flex items-center gap-2 transition-all text-sm ${
                              selectedFolder === folder.id
                                ? 'bg-purple-500/20 text-purple-400 font-medium border border-purple-500/50 shadow-lg shadow-purple-500/20'
                                : 'text-gray-400 hover:bg-gray-800/50 border border-transparent hover:border-purple-500/20'
                            }`}
                          >
                            <div className={`w-2.5 h-2.5 rounded-full ${folder.color}`} />
                            <span className="flex-1">{folder.name}</span>
                            <span className="text-xs text-gray-500">
                              {items.filter(i => i.project === project.id && i.folder === folder.id).length}
                            </span>
                          </button>
                        ))}
                        
                        {/* Add Folder Button */}
                        <button
                          onClick={() => setShowAddFolderModal(true)}
                          className="w-full text-left px-3 py-1.5 rounded-lg flex items-center gap-2 transition-all text-sm text-gray-500 hover:text-purple-400 hover:bg-gray-800/50 border border-transparent hover:border-purple-500/20"
                        >
                          <Plus className="w-3 h-3" />
                          <span>Add Folder</span>
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Type Filter */}
            <div className="bg-black/60 backdrop-blur-sm rounded-xl shadow-lg shadow-green-500/10 p-4 border border-green-500/30">
              <h2 className="text-sm font-semibold text-gray-200 mb-3 flex items-center gap-2">
                <Tag className="w-4 h-4 text-green-400" />
                Content Type
              </h2>
              <div className="space-y-1">
                <button
                  onClick={() => setSelectedType('all')}
                  className={`w-full text-left px-3 py-2 rounded-lg flex items-center gap-2 transition-all ${
                    selectedType === 'all'
                      ? 'bg-cyan-500/20 text-cyan-400 font-medium border border-cyan-500/50 shadow-lg shadow-cyan-500/20'
                      : 'text-gray-300 hover:bg-gray-800/50 border border-transparent hover:border-green-500/20'
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                  </svg>
                  <span className="text-sm">All Content</span>
                  <span className="ml-auto text-xs text-gray-500">
                    {selectedProject ? items.filter(i => i.project === selectedProject).length : items.length}
                  </span>
                </button>
                {['paper', 'book', 'website'].map(type => (
                  <button
                    key={type}
                    onClick={() => setSelectedType(type)}
                    className={`w-full text-left px-3 py-2 rounded-lg flex items-center gap-2 transition-all ${
                      selectedType === type
                        ? 'bg-cyan-500/20 text-cyan-400 font-medium border border-cyan-500/50 shadow-lg shadow-cyan-500/20'
                        : 'text-gray-300 hover:bg-gray-800/50 border border-transparent hover:border-green-500/20'
                    }`}
                  >
                    {getTypeIcon(type)}
                    <span className="text-sm capitalize">{type + 's'}</span>
                    <span className="ml-auto text-xs text-gray-500">
                      {items.filter(i => i.type === type).length}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="col-span-9">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-100">
                  {filteredItems.length} Resource{filteredItems.length !== 1 ? 's' : ''}
                </h2>
                <div className="flex gap-2 items-center">
                  {/* View Mode Toggle */}
                  <div className="flex bg-black/60 rounded-lg border border-purple-500/30 p-1">
                    <button 
                      onClick={() => setViewMode('grid')}
                      className={`px-3 py-1.5 rounded text-xs transition-all ${
                        viewMode === 'grid' ? 'bg-blue-500/30 text-blue-400 shadow-lg shadow-blue-500/30' : 'text-gray-400 hover:text-gray-300'
                      }`}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                      </svg>
                    </button>
                    <button 
                      onClick={() => setViewMode('compact')}
                      className={`px-3 py-1.5 rounded text-xs transition-all ${
                        viewMode === 'compact' ? 'bg-blue-500/30 text-blue-400 shadow-lg shadow-blue-500/30' : 'text-gray-400 hover:text-gray-300'
                      }`}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                      </svg>
                    </button>
                  </div>
                  
                  {/* Sort Dropdown */}
                  <select 
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-3 py-1.5 text-sm bg-black/60 border border-cyan-500/30 text-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="recent">Recently Added</option>
                    <option value="title">Title A-Z</option>
                    <option value="starred">Starred First</option>
                  </select>
                </div>
              </div>
              
              {/* Quick Filters */}
              <div className="flex gap-2 flex-wrap">
                <button className="px-3 py-1.5 text-xs bg-black/60 hover:bg-yellow-500/20 hover:text-yellow-400 text-gray-300 rounded-lg transition-all border border-yellow-500/30 hover:border-yellow-500/50 hover:shadow-lg hover:shadow-yellow-500/20">
                  ⭐ Starred ({items.filter(i => i.starred).length})
                </button>
                <button className="px-3 py-1.5 text-xs bg-black/60 hover:bg-pink-500/20 hover:text-pink-400 text-gray-300 rounded-lg transition-all border border-pink-500/30 hover:border-pink-500/50 hover:shadow-lg hover:shadow-pink-500/20">
                  📚 All Papers ({items.filter(i => i.type === 'paper').length})
                </button>
                <button className="px-3 py-1.5 text-xs bg-black/60 hover:bg-cyan-500/20 hover:text-cyan-400 text-gray-300 rounded-lg transition-all border border-cyan-500/30 hover:border-cyan-500/50 hover:shadow-lg hover:shadow-cyan-500/20">
                  📖 All Books ({items.filter(i => i.type === 'book').length})
                </button>
                <button className="px-3 py-1.5 text-xs bg-black/60 hover:bg-green-500/20 hover:text-green-400 text-gray-300 rounded-lg transition-all border border-green-500/30 hover:border-green-500/50 hover:shadow-lg hover:shadow-green-500/20">
                  🌐 All Websites ({items.filter(i => i.type === 'website').length})
                </button>
              </div>
            </div>

            <div className="grid gap-4">
              {filteredItems.map(item => (
                <div
                  key={item.id}
                  className="bg-black/60 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-2xl hover:shadow-blue-500/20 transition-all p-6 border border-gray-800 hover:border-blue-500/50 group"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start gap-4 flex-1">
                      <div className={`p-3 rounded-lg border ${getTypeColor(item.type)}`}>
                        {getTypeIcon(item.type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="text-lg font-semibold text-gray-100 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-purple-400 group-hover:bg-clip-text transition-all">
                            {item.title}
                          </h3>
                          <button className="text-gray-600 hover:text-yellow-400 transition-colors hover:drop-shadow-[0_0_8px_rgba(250,204,21,0.8)]">
                            <Star className={`w-5 h-5 ${item.starred ? 'fill-yellow-400 text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.8)]' : ''}`} />
                          </button>
                        </div>
                        <a 
                          href={`https://${item.url}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-cyan-400 hover:text-cyan-300 hover:underline flex items-center gap-1 mb-2 drop-shadow-[0_0_6px_rgba(34,211,238,0.4)]"
                        >
                          {item.url}
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </a>
                        <p className="text-sm text-gray-300 mb-3">{item.notes}</p>
                        
                        <div className="flex items-center gap-4 text-xs text-gray-400">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(item.addedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </span>
                          <span className="flex items-center gap-1">
                            <Folder className="w-3 h-3" />
                            {projects.find(p => p.id === item.project)?.name}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-4">
                    <Tag className="w-3 h-3 text-gray-500" />
                    {item.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 bg-gray-900/80 text-gray-300 rounded-md text-xs font-medium hover:bg-purple-500/20 hover:text-purple-400 hover:border-purple-500/50 transition-all cursor-pointer border border-gray-700 hover:shadow-lg hover:shadow-purple-500/20"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {filteredItems.length === 0 && (
              <div className="bg-black/60 backdrop-blur-sm rounded-xl shadow-lg p-12 text-center border border-gray-800">
                <div className="w-16 h-16 bg-gray-900/80 rounded-full flex items-center justify-center mx-auto mb-4">
                  {selectedProject ? (
                    <Search className="w-8 h-8 text-gray-500" />
                  ) : (
                    <Folder className="w-8 h-8 text-gray-500" />
                  )}
                </div>
                <h3 className="text-lg font-semibold text-gray-200 mb-2">
                  {selectedProject ? 'No resources found' : 'Select a project to get started'}
                </h3>
                <p className="text-gray-400">
                  {selectedProject 
                    ? 'Try adjusting your filters or add a new resource' 
                    : 'Click on a project in the sidebar to view its contents'}
                </p>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Add Modal (placeholder) */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-gray-900 border border-blue-500/50 shadow-2xl shadow-blue-500/20 rounded-2xl max-w-2xl w-full p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Add New Resource</h2>
              <button 
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-blue-400 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Title</label>
                <input type="text" className="w-full px-4 py-2 bg-black/60 border border-purple-500/30 text-gray-100 placeholder-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">URL</label>
                <input type="url" className="w-full px-4 py-2 bg-black/60 border border-purple-500/30 text-gray-100 placeholder-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Type</label>
                  <select className="w-full px-4 py-2 bg-black/60 border border-purple-500/30 text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option>Paper</option>
                    <option>Book</option>
                    <option>Website</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Project</label>
                  <select className="w-full px-4 py-2 bg-black/60 border border-purple-500/30 text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    {projects.map(p => (
                      <option key={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Folder</label>
                <select className="w-full px-4 py-2 bg-black/60 border border-purple-500/30 text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option value="">No Folder</option>
                  {folders[selectedProject]?.map(f => (
                    <option key={f.id} value={f.id}>{f.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Notes</label>
                <textarea rows={3} className="w-full px-4 py-2 bg-black/60 border border-purple-500/30 text-gray-100 placeholder-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Tags (comma separated)</label>
                <input type="text" placeholder="machine-learning, research, important" className="w-full px-4 py-2 bg-black/60 border border-purple-500/30 text-gray-100 placeholder-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              </div>
              <div className="flex gap-3 mt-6">
                <button className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white px-6 py-3 rounded-lg font-medium transition-all shadow-lg shadow-blue-500/50">
                  Add Resource
                </button>
                <button 
                  onClick={() => setShowAddModal(false)}
                  className="px-6 py-3 border border-purple-500/30 text-gray-300 rounded-lg hover:bg-gray-800/50 transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
